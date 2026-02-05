import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors()); // Allow all origins
app.use(express.json());

const PRINTIFY_API = "https://api.printify.com/v1";
const API_KEY = process.env.PRINTIFY_API_KEY;

// Log to verify API key is loaded
console.log("API_KEY loaded:", API_KEY ? "✓ Yes" : "✗ No - Check your .env file!");

/* ================= COLOR-TO-IMAGE MAPPINGS ================= */
// Customize per product - maps color names to image indices (0-based)
// Laurent sweatshirt: 84 images, 7 colors = 12 images per color
// Mapping based on user feedback about which colors show correct images
const COLOR_IMAGE_MAPPINGS = {
  "6980fdf171ecc2985a096dbe": { // Laurent sweatshirt product ID
    "Red": [72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83],        // Swapped with White
    "Light Pink": [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71], // Swapped with Black
    "Sport Grey": [24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35], // ✓ Correct
    "Royal": [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47],      // ✓ Correct
    "Purple": [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59],     // ✓ Correct
    "Black": [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],      // Swapped with Light Pink
    "White": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]                 // Swapped with Red
  }
};


/* ================= GET SHOPS ================= */
app.get("/shops", async (req, res) => {
  try {
    if (!API_KEY) {
      return res.status(400).json({ error: "API_KEY not configured in .env file" });
    }
    
    const r = await axios.get(`${PRINTIFY_API}/shops.json`, {
      headers: { Authorization: `Bearer ${API_KEY}` }
    });
    res.json(r.data);
  } catch (e) {
    console.error("Shops API Error:", e.response?.data || e.message);
    res.status(500).json({ error: e.response?.data || e.message });
  }
});

/* ================= GET PRODUCTS ================= */
app.get("/products/:shopId", async (req, res) => {
  try {
    const r = await axios.get(
      `${PRINTIFY_API}/shops/${req.params.shopId}/products.json`,
      { headers: { Authorization: `Bearer ${API_KEY}` } }
    );
    res.json(r.data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* ================= GET SINGLE PRODUCT ================= */
app.get("/product/:shopId/:productId", async (req, res) => {
  try {
    const r = await axios.get(
      `${PRINTIFY_API}/shops/${req.params.shopId}/products/${req.params.productId}.json`,
      { headers: { Authorization: `Bearer ${API_KEY}` } }
    );
    res.json(r.data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* ================= GET PRODUCT DETAILS WITH OPTIONS (FILTERED) ================= */
app.get("/product/:shopId/:productId/options", async (req, res) => {
  try {
    const productRes = await axios.get(
      `${PRINTIFY_API}/shops/${req.params.shopId}/products/${req.params.productId}.json`,
      { headers: { Authorization: `Bearer ${API_KEY}` } }
    );
    
    const product = productRes.data;
    
    // Extract only ENABLED sizes and colors
    const sizes = new Map();
    const colors = new Map();
    const variantsMap = new Map();
    const enabledVariants = [];
    
    if (product.variants && Array.isArray(product.variants)) {
      product.variants.forEach(variant => {
        // Only include enabled variants
        const isEnabled = variant.is_enabled !== false; // default to true if not specified
        if (!isEnabled) return;
        
        if (variant.title && typeof variant.title === 'string') {
          const parts = variant.title.split(" / ");
          if (parts.length === 2) {
            const sizeName = parts[0].trim();
            const colorName = parts[1].trim();
            
            enabledVariants.push({
              id: variant.id,
              size: sizeName,
              color: colorName,
              title: variant.title,
              price: variant.price,
              cost: variant.cost
            });
            
            // Track sizes
            if (!sizes.has(sizeName)) {
              sizes.set(sizeName, []);
            }
            sizes.get(sizeName).push(variant.id);
            
            // Track colors
            if (!colors.has(colorName)) {
              colors.set(colorName, []);
            }
            colors.get(colorName).push(variant.id);
            
            // Store variant mapping
            const key = `${sizeName}|${colorName}`;
            variantsMap.set(key, variant.id);
          }
        }
      });
    }
    
    console.log(`Product ${product.id}: Found ${enabledVariants.length} enabled variants (${sizes.size} sizes, ${colors.size} colors)`);
    
    // Return structured options
    res.json({
      success: true,
      productId: product.id,
      totalVariants: product.variants ? product.variants.length : 0,
      enabledVariants: enabledVariants.length,
      sizes: Array.from(sizes.entries()).map(([name, ids]) => ({
        name,
        variantIds: ids
      })),
      colors: Array.from(colors.entries()).map(([name, ids]) => ({
        name,
        variantIds: ids
      })),
      variants: Object.fromEntries(variantsMap),
      allVariants: enabledVariants
    });
  } catch (e) {
    console.error("Product options API Error:", e.message);
    res.status(500).json({ error: e.message, success: false });
  }
});

/* ================= GET PRODUCT COLOR OPTIONS (LEGACY) ================= */
app.get("/product/:shopId/:productId/colors", async (req, res) => {
  try {
    const productRes = await axios.get(
      `${PRINTIFY_API}/shops/${req.params.shopId}/products/${req.params.productId}.json`,
      { headers: { Authorization: `Bearer ${API_KEY}` } }
    );
    
    const product = productRes.data;
    const colorMap = new Map();
    
    if (product.variants && Array.isArray(product.variants)) {
      product.variants.forEach(variant => {
        if (variant.title && typeof variant.title === 'string') {
          const parts = variant.title.split(" / ");
          if (parts.length === 2) {
            const colorName = parts[1].trim();
            if (colorName && !colorMap.has(colorName)) {
              colorMap.set(colorName, {
                name: colorName,
                variantIds: []
              });
            }
            if (colorName && variant.id) {
              colorMap.get(colorName).variantIds.push(variant.id);
            }
          }
        }
      });
    }
    
    res.json(Array.from(colorMap.values()));
  } catch (e) {
    console.error("Color options API Error:", e.message);
    res.status(500).json({ error: e.message });
  }
});

/* ================= GET COLOR-TO-IMAGES MAPPING ================= */
app.get("/product/:shopId/:productId/color-images", async (req, res) => {
  try {
    const productRes = await axios.get(
      `${PRINTIFY_API}/shops/${req.params.shopId}/products/${req.params.productId}.json`,
      { headers: { Authorization: `Bearer ${API_KEY}` } }
    );
    
    const product = productRes.data;
    const productId = req.params.productId;
    const totalImages = product.images ? product.images.length : 0;
    
    // Check if we have a custom mapping for this product
    let colorImageMapping = COLOR_IMAGE_MAPPINGS[productId];
    
    if (!colorImageMapping && totalImages > 0) {
      // Analyze each image's filename to detect color patterns
      colorImageMapping = {};
      const enabledColors = new Set();
      
      if (product.variants && Array.isArray(product.variants)) {
        product.variants.forEach(variant => {
          if (variant.is_enabled !== false && variant.title) {
            const parts = variant.title.split(" / ");
            if (parts.length === 2) {
              enabledColors.add(parts[1].trim());
            }
          }
        });
      }
      
      // Initialize color mapping
      enabledColors.forEach(color => {
        colorImageMapping[color] = [];
      });
      
      // Try to map images by analyzing filenames for color keywords
      if (product.images && Array.isArray(product.images)) {
        const colorKeywords = {
          "black": ["black", "blk"],
          "white": ["white", "wht"],
          "red": ["red", "rd"],
          "light pink": ["pink", "light_pink", "lpink"],
          "purple": ["purple", "purp"],
          "royal": ["royal", "roy", "blue"],
          "sport grey": ["grey", "gray", "sport", "sg"]
        };
        
        product.images.forEach((image, idx) => {
          const url = image.src || image.url || "";
          const urlLower = url.toLowerCase();
          
          // Try to match the image URL to a color
          let matched = false;
          for (const [color, keywords] of Object.entries(colorKeywords)) {
            if (colorImageMapping.hasOwnProperty(color)) {
              if (keywords.some(keyword => urlLower.includes(keyword))) {
                colorImageMapping[color].push(idx);
                matched = true;
                break;
              }
            }
          }
          
          // If no match found via filename, log for debugging
          if (!matched) {
            console.log(`Image ${idx}: Could not auto-detect color from URL: ${url.substring(0, 100)}`);
          }
        });
      }
      
      // If auto-detection didn't work well, fall back to even distribution
      const colorsArray = Array.from(enabledColors);
      const imagesPerColor = Math.ceil(totalImages / colorsArray.length);
      
      // Check if we got any matches from filename analysis
      const hasMatches = Object.values(colorImageMapping).some(arr => arr.length > 0);
      
      if (!hasMatches) {
        // Fallback: even distribution
        colorsArray.forEach((color, idx) => {
          const startIdx = idx * imagesPerColor;
          const endIdx = Math.min((idx + 1) * imagesPerColor, totalImages);
          colorImageMapping[color] = Array.from({length: endIdx - startIdx}, (_, i) => startIdx + i);
        });
        console.log("⚠️ Using fallback even distribution - images may not align with colors");
      }
    }
    
    // Also return the actual image URLs
    const imageUrls = product.images ? product.images.map(img => img.src || img.url) : [];
    
    // Debug: show image count per color
    const imageCounts = {};
    Object.entries(colorImageMapping).forEach(([color, indices]) => {
      imageCounts[color] = indices.length;
    });
    
    console.log("Color-to-image mapping:", imageCounts);
    
    res.json({
      success: true,
      productId: product.id,
      totalImages: imageUrls.length,
      images: imageUrls,
      colorImageMapping: colorImageMapping || {},
      colors: Object.keys(colorImageMapping || {}),
      imageCounts: imageCounts
    });
  } catch (e) {
    console.error("Color images API Error:", e.message);
    res.status(500).json({ error: e.message, success: false });
  }
});

/* ================= DEBUG: GET SAMPLE IMAGES FOR EACH COLOR ================= */
app.get("/product/:shopId/:productId/color-samples", async (req, res) => {
  try {
    const productRes = await axios.get(
      `${PRINTIFY_API}/shops/${req.params.shopId}/products/${req.params.productId}.json`,
      { headers: { Authorization: `Bearer ${API_KEY}` } }
    );
    
    const product = productRes.data;
    const productId = req.params.productId;
    const imageUrls = product.images ? product.images.map(img => img.src || img.url) : [];
    
    // Use hardcoded mapping if available
    let colorImageMapping = COLOR_IMAGE_MAPPINGS[productId];
    
    if (!colorImageMapping) {
      return res.status(400).json({ error: "No color mapping found for this product" });
    }
    
    // Build samples - first 3 images per color
    const colorSamples = {};
    Object.entries(colorImageMapping).forEach(([color, indices]) => {
      colorSamples[color] = {
        imageCount: indices.length,
        firstThreeImages: indices.slice(0, 3).map(idx => ({
          index: idx,
          url: imageUrls[idx] || "N/A"
        }))
      };
    });
    
    res.json({
      success: true,
      productId: product.id,
      totalImages: imageUrls.length,
      colorSamples: colorSamples,
      note: "For each color below, check if the sample images match the color name. If not, we need to adjust the mapping."
    });
  } catch (e) {
    console.error("Color samples API Error:", e.message);
    res.status(500).json({ error: e.message });
  }
});

app.post("/order/:shopId", async (req, res) => {
  try {
    const r = await axios.post(
      `${PRINTIFY_API}/shops/${req.params.shopId}/orders.json`,
      req.body,
      { headers: { Authorization: `Bearer ${API_KEY}` } }
    );
    res.json(r.data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* ================= CALCULATE SHIPPING ================= */
app.post("/shipping/:shopId/:orderId", async (req, res) => {
  try {
    const r = await axios.post(
      `${PRINTIFY_API}/shops/${req.params.shopId}/orders/${req.params.orderId}/shipping.json`,
      req.body,
      { headers: { Authorization: `Bearer ${API_KEY}` } }
    );
    res.json(r.data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Printify backend running on port ${PORT}`)
);
