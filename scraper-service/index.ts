import express from "express";
import bodyParser from "body-parser";
import { scrapeAmazonProduct } from "./scraper";
import cors from "cors";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// health check
app.get("/", (_req, res) => {
  res.send("Scraper service is running ✅");
});

// scrape endpoint
app.post("/scrape", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "Missing url" });
  }

  try {
    const product = await scrapeAmazonProduct(url);

    if (!product) {
      return res.status(404).json({ error: "Could not scrape product" });
    }

    res.json(product);
  } catch (err: any) {
    console.error("Scraping failed:", err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Scraper running on port ${PORT}`);
});
