import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PRINTIFY_API = "https://api.printify.com/v1";
const API_KEY = process.env.PRINTIFY_API_KEY;

/* ================= GET SHOPS ================= */
app.get("/shops", async (req, res) => {
  try {
    const r = await axios.get(`${PRINTIFY_API}/shops.json`, {
      headers: { Authorization: `Bearer ${API_KEY}` }
    });
    res.json(r.data);
  } catch (e) {
    res.status(500).json({ error: e.message });
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

/* ================= CREATE ORDER ================= */
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

app.listen(3000, () =>
  console.log("Printify backend running on port 3000")
);
