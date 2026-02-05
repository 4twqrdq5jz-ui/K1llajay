# Printify API Integration Setup Guide

## Overview
This guide walks you through setting up a custom print-on-demand storefront using Printify's API with your K1llajay website.

---

## Step 1: Set Up Printify Account

1. **Create Printify Account**
   - Go to [printify.com](https://printify.com)
   - Sign up and verify your email
   - Connect your Printify account to a print provider (Printful, Teespring, etc.)

2. **Create Products**
   - In Printify dashboard, create products you want to sell
   - Add product images, descriptions, and variants
   - Tag products with categories: `fashion`, `electronics`, `accessories`
   - Set prices and supplier details

3. **Generate API Key**
   - Go to **Account Settings → API**
   - Click "Generate API Key"
   - Copy and save this key securely

---

## Step 2: Set Up Backend

### Install Dependencies

```bash
cd backend
npm install express axios cors dotenv
```

### Create `.env` File

```bash
# backend/.env
PRINTIFY_API_KEY=your_api_key_here
PORT=3000
```

### Start Backend Server

```bash
node index.js
```

You should see: `Printify backend running on port 3000`

---

## Step 3: Update Frontend

The frontend is already updated! The `laurent-by-jae-laurent.html` file now:

✅ Fetches your actual products from Printify  
✅ Displays product images, prices, and descriptions  
✅ Has a fully functional shopping cart  
✅ Processes orders through Printify's API  
✅ Handles product categories (fashion, electronics, accessories)

---

## Step 4: Test Locally

1. **Start your backend:**
   ```bash
   cd backend
   node index.js
   ```

2. **Open the store:**
   - Open `laurent-by-jae-laurent.html` in your browser
   - Or serve it with a local server:
   ```bash
   # In the root directory
   npx http-server
   ```

3. **Test functionality:**
   - Click filter buttons to see different categories
   - Add items to cart
   - View cart and update quantities
   - Test checkout (shows order summary)

---

## Step 5: Deploy to Production

### Option A: Deploy Backend to Heroku

1. **Create Heroku Account**
   - Go to [heroku.com](https://heroku.com)
   - Sign up and install Heroku CLI

2. **Deploy Backend**
   ```bash
   cd backend
   heroku login
   heroku create your-app-name
   heroku config:set PRINTIFY_API_KEY=your_key_here
   git push heroku main
   ```

3. **Update Frontend API URL**
   - In `laurent-by-jae-laurent.html`, change:
   ```javascript
   const API = "https://your-app-name.herokuapp.com";
   ```

### Option B: Deploy Backend to Vercel

1. **Create `vercel.json`** in backend folder:
   ```json
   {
     "version": 2,
     "builds": [
       { "src": "index.js", "use": "@vercel/node" }
     ],
     "routes": [
       { "src": "/(.*)", "dest": "index.js" }
     ]
   }
   ```

2. **Deploy:**
   ```bash
   npm install -g vercel
   vercel --prod
   ```

3. **Add environment variable:**
   - In Vercel dashboard, add `PRINTIFY_API_KEY`

---

## API Endpoints

Your backend provides these endpoints:

### GET `/shops`
Returns list of your Printify shops
```javascript
const shops = await fetch('http://localhost:3000/shops').then(r => r.json());
```

### GET `/products/:shopId`
Returns all products for a shop
```javascript
const products = await fetch(`http://localhost:3000/products/${shopId}`).then(r => r.json());
```

### GET `/product/:shopId/:productId`
Returns a single product
```javascript
const product = await fetch(`http://localhost:3000/product/${shopId}/${productId}`).then(r => r.json());
```

### POST `/order/:shopId`
Creates a new order
```javascript
const order = {
  line_items: [
    { product_id: "123", variant_ids: ["456"] }
  ],
  address_to: {
    first_name: "John",
    last_name: "Doe",
    email: "john@example.com",
    country: "US",
    address1: "123 Main St",
    city: "New York",
    zip: "10001"
  }
};

const result = await fetch(`http://localhost:3000/order/${shopId}`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(order)
}).then(r => r.json());
```

---

## Customization Tips

### Add Payment Processing

For real payments, integrate Stripe or PayPal:

```javascript
// In checkout function
const stripe = await loadStripe('pk_test_...');
const { error, paymentMethod } = await stripe.createPaymentMethod({...});
```

### Add Shipping Calculation

```javascript
const shipping = await fetch(`${API}/shipping/${SHOP_ID}/${orderId}`, {
  method: "POST",
  body: JSON.stringify({ address: {...} })
}).then(r => r.json());
```

### Customize Product Categories

In `renderProducts()`, filter by custom logic:
```javascript
// Current: uses product tags
// You can also add custom category mapping
const categoryMap = {
  "tshirt": "fashion",
  "hoodie": "fashion",
  "mug": "accessories"
};
```

---

## Troubleshooting

### "Failed to load products"
- ✓ Backend running on port 3000?
- ✓ `.env` file has correct API key?
- ✓ API key is valid in Printify dashboard?

### Products show but images don't load
- ✓ Check browser console for CORS errors
- ✓ Images exist in Printify dashboard?
- ✓ Backend has CORS enabled?

### Cart checkout doesn't work
- ✓ Check browser console for errors
- ✓ Valid shop ID loaded?
- ✓ Products have variants configured?

---

## Security Tips

⚠️ **Never hardcode API keys in frontend!**

1. Always keep API key in `.env` (backend only)
2. Use environment variables
3. Don't commit `.env` to GitHub (add to `.gitignore`)
4. Rotate API keys regularly

---

## Next Steps

1. ✅ Create Printify account and products
2. ✅ Set up `.env` with API key
3. ✅ Run backend locally
4. ✅ Test store functionality
5. ✅ Deploy backend to production
6. ✅ Update frontend API URL
7. ✅ Add payment processing
8. ✅ Monitor orders in Printify dashboard

---

## Resources

- [Printify API Docs](https://developers.printify.com)
- [Printify API Reference](https://printify.readme.io)
- [Express.js Docs](https://expressjs.com)
- [Stripe Integration](https://stripe.com/docs)

---

Need help? Check the browser console (F12) for error messages!
