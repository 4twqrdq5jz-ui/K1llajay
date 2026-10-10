import express from "express";
import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config();

/* ================= CONFIG ================= */
const {
  PRINTIFY_API_KEY,
  PODBASE_API_KEY,
  STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET,
  SITE_URL = "https://k1llajay.com",
  STORE_PATH = "/laurent-by-jae-laurent",
  PORT = 3000,
} = process.env;

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ||
  "https://k1llajay.com,https://www.k1llajay.com")
  .split(",").map((s) => s.trim()).filter(Boolean);
const SHIPPING_RATE_CENTS = Number.parseInt(process.env.SHIPPING_RATE_CENTS ?? "799", 10);
const SHIPPING_COUNTRIES = (process.env.SHIPPING_COUNTRIES || "US")
  .split(",").map((s) => s.trim().toUpperCase()).filter(Boolean);
const AUTO_SEND_TO_PRODUCTION = process.env.AUTO_SEND_TO_PRODUCTION === "true";

const PRINTIFY_API = "https://api.printify.com/v1";
// Podbase's API docs aren't public; this base URL comes from the previous backend.
// Confirm it against the docs in your Podbase dashboard.
const PODBASE_API = "https://open-api.podbase.com";

const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY) : null;

console.log("Printify key:", PRINTIFY_API_KEY ? "✓" : "✗ missing");
console.log("Podbase key: ", PODBASE_API_KEY ? "✓" : "✗ missing (Podbase products disabled)");
console.log("Stripe key:  ", STRIPE_SECRET_KEY ? "✓" : "✗ missing (checkout disabled)");
console.log("Stripe webhook secret:", STRIPE_WEBHOOK_SECRET ? "✓" : "✗ missing (paid orders won't reach Printify)");

/* ================= HELPERS ================= */
class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

async function printify(path, options = {}) {
  if (!PRINTIFY_API_KEY) throw new HttpError(503, "Store is not configured yet");
  const res = await fetch(`${PRINTIFY_API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${PRINTIFY_API_KEY}`,
      "Content-Type": "application/json",
      "User-Agent": "k1llajay-store",
      ...options.headers,
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error(`Printify ${options.method || "GET"} ${path} → ${res.status}`, body);
    throw new HttpError(res.status === 404 ? 404 : 502, "Product service error");
  }
  return body;
}

// Small in-memory cache so page views don't hit Printify's rate limits
const cache = new Map();
async function cached(key, ttlMs, load) {
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return hit.value;
  const value = await load();
  cache.set(key, { value, expires: Date.now() + ttlMs });
  return value;
}

async function getShop() {
  return cached("shop", 10 * 60_000, async () => {
    const shops = await printify("/shops.json");
    const wanted = process.env.PRINTIFY_SHOP_ID;
    const shop = wanted ? shops.find((s) => String(s.id) === String(wanted)) : shops[0];
    if (!shop) throw new HttpError(503, "No Printify shop found");
    return { id: shop.id, title: shop.title };
  });
}

async function getProducts() {
  const shop = await getShop();
  return cached("products", 60_000, async () => {
    const all = [];
    for (let page = 1; ; page++) {
      const res = await printify(`/shops/${shop.id}/products.json?limit=50&page=${page}`);
      all.push(...(res.data || []));
      if (!res.last_page || page >= res.last_page) break;
    }
    return all.filter((p) => p.visible !== false);
  });
}

async function getProduct(productId) {
  if (!/^[A-Za-z0-9_-]{1,64}$/.test(productId)) throw new HttpError(400, "Invalid product id");
  const shop = await getShop();
  return cached(`product:${productId}`, 60_000, () =>
    printify(`/shops/${shop.id}/products/${productId}.json`));
}

// Variant titles look like "M / Black"
function splitVariantTitle(title = "") {
  const parts = title.split(" / ");
  return parts.length === 2 ? { size: parts[0].trim(), color: parts[1].trim() } : null;
}

const enabledVariants = (product) =>
  (product.variants || []).filter((v) => v.is_enabled !== false && v.is_available !== false);

// Route params include the shop id; only the configured shop is served
async function checkShop(req) {
  const shop = await getShop();
  if (String(req.params.shopId) !== String(shop.id)) throw new HttpError(404, "Shop not found");
}

const route = (handler) => async (req, res) => {
  try {
    await handler(req, res);
  } catch (e) {
    if (!(e instanceof HttpError)) console.error(e);
    res.status(e.status || 500).json({ error: e instanceof HttpError ? e.message : "Server error" });
  }
};

/* ================= APP ================= */
const app = express();
app.disable("x-powered-by");

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  }
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

/* ================= STRIPE WEBHOOK =================
   Registered before express.json() because Stripe's signature check needs the raw body. */
app.post("/stripe/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  if (!stripe || !STRIPE_WEBHOOK_SECRET) return res.status(503).send("Webhook not configured");

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, req.headers["stripe-signature"], STRIPE_WEBHOOK_SECRET);
  } catch (e) {
    console.error("Webhook signature check failed:", e.message);
    return res.status(400).send("Bad signature");
  }

  try {
    if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
      await fulfillOrder(event.data.object.id);
    }
    res.json({ received: true });
  } catch (e) {
    // A non-2xx response makes Stripe retry the webhook later
    console.error("Fulfillment failed:", e);
    res.status(500).send("Fulfillment failed");
  }
});

app.use(express.json({ limit: "20kb" }));

app.get("/health", (req, res) => res.json({ ok: true }));

/* ================= PRINTIFY: READ-ONLY ================= */
app.get("/shops", route(async (req, res) => {
  res.json([await getShop()]);
}));

app.get("/products/:shopId", route(async (req, res) => {
  await checkShop(req);
  res.json({ data: await getProducts() });
}));

app.get("/product/:shopId/:productId", route(async (req, res) => {
  await checkShop(req);
  res.json(await getProduct(req.params.productId));
}));

app.get("/product/:shopId/:productId/options", route(async (req, res) => {
  await checkShop(req);
  const product = await getProduct(req.params.productId);

  const sizes = new Map();
  const colors = new Map();
  const variantsMap = {};
  const allVariants = [];

  for (const v of enabledVariants(product)) {
    const parsed = splitVariantTitle(v.title);
    if (!parsed) continue;
    const { size, color } = parsed;
    allVariants.push({ id: v.id, size, color, title: v.title, price: v.price });
    if (!sizes.has(size)) sizes.set(size, []);
    sizes.get(size).push(v.id);
    if (!colors.has(color)) colors.set(color, []);
    colors.get(color).push(v.id);
    variantsMap[`${size}|${color}`] = v.id;
  }

  res.json({
    success: true,
    productId: product.id,
    totalVariants: (product.variants || []).length,
    enabledVariants: allVariants.length,
    sizes: [...sizes].map(([name, variantIds]) => ({ name, variantIds })),
    colors: [...colors].map(([name, variantIds]) => ({ name, variantIds })),
    variants: variantsMap,
    allVariants,
  });
}));

// Printify tags each image with the variant ids it shows, so colors map to images exactly
app.get("/product/:shopId/:productId/color-images", route(async (req, res) => {
  await checkShop(req);
  const product = await getProduct(req.params.productId);
  const images = product.images || [];

  const colorOfVariant = new Map();
  for (const v of enabledVariants(product)) {
    const parsed = splitVariantTitle(v.title);
    if (parsed) colorOfVariant.set(v.id, parsed.color);
  }

  const colorImageMapping = {};
  for (const color of new Set(colorOfVariant.values())) colorImageMapping[color] = [];
  images.forEach((img, idx) => {
    const imgColors = new Set((img.variant_ids || []).map((id) => colorOfVariant.get(id)).filter(Boolean));
    for (const color of imgColors) colorImageMapping[color].push(idx);
  });

  const imageCounts = Object.fromEntries(
    Object.entries(colorImageMapping).map(([color, idxs]) => [color, idxs.length]));

  res.json({
    success: true,
    productId: product.id,
    totalImages: images.length,
    images: images.map((img) => img.src),
    colorImageMapping,
    colors: Object.keys(colorImageMapping),
    imageCounts,
  });
}));

/* ================= PODBASE: READ-ONLY =================
   Listing only for now. Podbase checkout needs their order format from the docs in your dashboard. */
app.get("/podbase/products", route(async (req, res) => {
  if (!PODBASE_API_KEY) return res.json({ data: [] });
  const data = await cached("podbase:products", 60_000, async () => {
    const r = await fetch(`${PODBASE_API}/products`, {
      headers: { Authorization: `Bearer ${PODBASE_API_KEY}`, "Content-Type": "application/json" },
    });
    const body = await r.json().catch(() => ({}));
    if (!r.ok) {
      console.error(`Podbase GET /products → ${r.status}`, body);
      throw new HttpError(502, "Podbase error");
    }
    return body;
  });
  res.json(data);
}));

/* ================= STRIPE CHECKOUT =================
   The browser sends only product/variant ids and quantities. Prices always come from Printify,
   so nobody can change what they pay by editing the page. */
const MAX_LINE_ITEMS = 10;
const MAX_QTY = 10;

app.post("/checkout", route(async (req, res) => {
  if (!stripe) throw new HttpError(503, "Checkout is not available yet");

  const items = Array.isArray(req.body?.items) ? req.body.items : [];
  if (items.length === 0) throw new HttpError(400, "Cart is empty");
  if (items.length > MAX_LINE_ITEMS) throw new HttpError(400, `Max ${MAX_LINE_ITEMS} different items per order`);

  const shop = await getShop();
  const lineItems = [];
  const encoded = [];

  for (const item of items) {
    const productId = String(item.product_id ?? "");
    const variantId = Number(item.variant_id);
    const qty = Number(item.qty);
    if (!Number.isInteger(variantId) || !Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) {
      throw new HttpError(400, "Invalid cart item");
    }
    if (productId.startsWith("podbase-")) throw new HttpError(400, "Podbase items can't be purchased yet");

    const product = await getProduct(productId);
    const variant = enabledVariants(product).find((v) => v.id === variantId);
    if (!variant) throw new HttpError(400, `${product.title}: that option is no longer available`);

    const image = (product.images || []).find((img) => (img.variant_ids || []).includes(variantId))
      || (product.images || [])[0];

    lineItems.push({
      quantity: qty,
      price_data: {
        currency: "usd",
        unit_amount: variant.price, // Printify prices are in cents
        product_data: {
          name: `${product.title} (${variant.title})`,
          ...(image?.src ? { images: [image.src] } : {}),
        },
      },
    });
    encoded.push(`${productId}:${variantId}:${qty}`);
  }

  const storeUrl = `${SITE_URL}${STORE_PATH}`;
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    shipping_address_collection: { allowed_countries: SHIPPING_COUNTRIES },
    ...(SHIPPING_RATE_CENTS > 0 && {
      shipping_options: [{
        shipping_rate_data: {
          type: "fixed_amount",
          display_name: "Standard shipping",
          fixed_amount: { amount: SHIPPING_RATE_CENTS, currency: "usd" },
        },
      }],
    }),
    phone_number_collection: { enabled: true },
    // Read back by the webhook to build the Printify order
    metadata: { shop_id: String(shop.id), items: encoded.join(",") },
    success_url: `${storeUrl}?checkout=success`,
    cancel_url: `${storeUrl}?checkout=cancelled`,
  });

  res.json({ url: session.url });
}));

/* ================= FULFILLMENT (called by the webhook) ================= */
async function fulfillOrder(sessionId) {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.payment_status !== "paid") return;
  // Stripe can deliver a webhook more than once; skip sessions already sent to Printify
  if (session.metadata?.printify_order_id) return;

  const shipping = session.collected_information?.shipping_details || session.shipping_details;
  const customer = session.customer_details || {};
  const address = shipping?.address || customer.address;
  if (!address) throw new Error(`Session ${session.id} has no shipping address`);

  const fullName = (shipping?.name || customer.name || "Customer").trim();
  const [firstName, ...rest] = fullName.split(/\s+/);

  const lineItems = (session.metadata?.items || "").split(",").filter(Boolean).map((entry) => {
    const [product_id, variant_id, quantity] = entry.split(":");
    return { product_id, variant_id: Number(variant_id), quantity: Number(quantity) };
  });
  if (lineItems.length === 0) throw new Error(`Session ${session.id} has no items`);

  const order = await printify(`/shops/${session.metadata.shop_id}/orders.json`, {
    method: "POST",
    body: JSON.stringify({
      external_id: session.id,
      label: `Stripe ${session.id.slice(-8)}`,
      line_items: lineItems,
      shipping_method: 1,
      send_shipping_notification: true,
      address_to: {
        first_name: firstName,
        last_name: rest.join(" ") || "-",
        email: customer.email || "",
        phone: customer.phone || "",
        country: address.country,
        region: address.state || "",
        address1: address.line1,
        address2: address.line2 || "",
        city: address.city,
        zip: address.postal_code,
      },
    }),
  });

  await stripe.checkout.sessions.update(session.id, {
    metadata: { ...session.metadata, printify_order_id: String(order.id) },
  });
  console.log(`Printify order ${order.id} created for Stripe session ${session.id}`);

  if (AUTO_SEND_TO_PRODUCTION) {
    await printify(`/shops/${session.metadata.shop_id}/orders/${order.id}/send_to_production.json`, { method: "POST" });
    console.log(`Printify order ${order.id} sent to production`);
  }
}

app.use((req, res) => res.status(404).json({ error: "Not found" }));

app.listen(PORT, "0.0.0.0", () => console.log(`Store backend running on port ${PORT}`));
