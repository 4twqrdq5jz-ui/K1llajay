# Store backend setup

This server sits between the store page (`laurent-by-jae-laurent.html`) and Printify, Podbase and Stripe. It keeps your API keys secret. A customer pays on Stripe first, and only then is the order sent to Printify.

**Never put real keys in any file that gets committed.** They go in `backend/.env` on your computer (git ignores it) and in Render's Environment tab online.

---

## Step 1: Get your API keys

### Printify (required)
1. Log in at printify.com, click your profile picture → **My account** → **Connections**.
2. Under **API tokens**, click **Generate**. Name it `k1llajay-store`.
3. Give it these scopes: `shops.read`, `products.read`, `orders.read`, `orders.write`.
4. Copy the token right away (Printify only shows it once). This is `PRINTIFY_API_KEY`.
5. If an old token is still listed there, **revoke it**. The old one is public in this repo's git history.

### Stripe (required for checkout)
1. Create an account at stripe.com (or log in).
2. Make sure **Test mode** is on (toggle at the top right) while you set things up.
3. Go to **Developers → API keys** and copy the **Secret key** (`sk_test_...`). This is `STRIPE_SECRET_KEY`.
4. You'll create the webhook secret in Step 4, after the server is online.

### Podbase (optional, display only for now)
1. In your Podbase dashboard, look for the API or developer settings and create a key. This is `PODBASE_API_KEY`.
2. If you can't find it, ask Podbase support for **Open API access and documentation**.
3. If you created an old key before, **delete it**. It is public in this repo's git history.
4. Podbase products will show on the store but can't be bought yet. Once you have Podbase's API docs, checkout for them can be added.

---

## Step 2: Run it on your computer

```bash
cd backend
cp .env.example .env     # then open .env and paste your keys
npm install
npm start
```

Open http://localhost:3000/shops. You should see your Printify shop name.

To view the store page against this local server, open `laurent-by-jae-laurent.html` with VS Code's **Live Server** extension. It runs on `http://127.0.0.1:5500`, which the backend already allows.

**Testing payments locally (optional):** install the Stripe CLI, then run

```bash
stripe login
stripe listen --forward-to localhost:3000/stripe/webhook
```

It prints a `whsec_...` secret. Put it in `.env` as `STRIPE_WEBHOOK_SECRET` and restart `npm start`. Pay with test card `4242 4242 4242 4242`, any future date, any CVC.

---

## Step 3: Put it online with Render

1. Commit and push this repo to GitHub (your keys stay out because `.env` is git-ignored).
2. Go to render.com, sign up with GitHub, and click **New → Blueprint**.
3. Pick the `K1llajay` repo. Render reads `render.yaml` and creates a service called `k1llajay-store`.
4. When it asks for the secret values, paste `PRINTIFY_API_KEY`, `STRIPE_SECRET_KEY` and (optionally) `PODBASE_API_KEY`. Leave `STRIPE_WEBHOOK_SECRET` empty for now.
5. When the deploy finishes, copy the URL at the top of the service page (something like `https://k1llajay-store.onrender.com`).
6. Visit `<your URL>/shops` to confirm it works.
7. If the URL is different from `https://k1llajay-store.onrender.com`, update `PRODUCTION_API` near the top of the script in `laurent-by-jae-laurent.html`.

The free plan sleeps after ~15 minutes of no visitors. The first page load after that takes about 30 seconds while it wakes up.

---

## Step 4: Connect Stripe to the live server

1. In Stripe, go to **Developers → Webhooks → Add endpoint**.
2. Endpoint URL: `<your Render URL>/stripe/webhook`
3. Events: select `checkout.session.completed` and `checkout.session.async_payment_succeeded`.
4. Save, then copy the **Signing secret** (`whsec_...`).
5. In Render → your service → **Environment**, set `STRIPE_WEBHOOK_SECRET` to that value and save (Render redeploys).

---

## Step 5: Test, then go live

1. In test mode, buy something on k1llajay.com with card `4242 4242 4242 4242`.
2. Check that the order appears in Printify under **Orders**. It waits there "On hold" until you approve it, because `AUTO_SEND_TO_PRODUCTION` is `false`.
3. When everything works, switch Stripe to **Live mode**. Repeat Step 1 (secret key) and Step 4 (webhook) for live mode, and update both values in Render.

---

## Settings you can change (Render → Environment)

| Setting | What it does |
| --- | --- |
| `SHIPPING_RATE_CENTS` | Flat shipping charged at checkout. `799` = $7.99, `0` = free. |
| `SHIPPING_COUNTRIES` | Countries customers can ship to, e.g. `US,CA,GB`. |
| `AUTO_SEND_TO_PRODUCTION` | `true` sends paid orders straight to Printify production. Printify charges you when it produces an order. |
| `PRINTIFY_SHOP_ID` | Only needed if your Printify account has more than one shop. |
