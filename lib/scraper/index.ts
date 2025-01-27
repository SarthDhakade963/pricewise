import axios from "axios";
import * as cheerio from "cheerio";
import {
  extractCurrency,
  extractDescription,
  extractImage,
  extractPrice,
  extractReviewCount,
  extractStars,
  getAveragePrice,
} from "../util";
import { log } from "console";

export async function scrapeAmazonProduct(productURL: string) {
  if (!productURL) return;

  // BrightData Proxy Configuration
  const username = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_PASSWORD);
  const port = 33335;
  const session_id = (1000000 * Math.random()) | 0; // | 0 just removes the decimal part
  const options = {
    auth: {
      username: `${username}-session-${session_id}`,
      password,
    },
    host: "brd.superproxy.io",
    port,
    rejectUnauthorised: false,
  };

  try {
    // fetch the product page
    const response = await axios.get(productURL, options);
    const $ = cheerio.load(response.data);

    // Extract the Product Title
    const title = $("#productTitle").text().trim();

    const currentPrice = extractPrice(
      $(".priceToPay span.a-price-whole"),
      $("a.size.base.a-color-price"),
      $(".a-button-selected .a-color-base")
    );

    const originalPrice = extractPrice(
      $("#priceblock_ourprice"),
      $(".a-price.a-text-price span.a-offscreen"),
      $("#listPrice"),
      $("#priceblock_dealprice"),
      $(".a-size-base.a-color-price")
    );

    const outOfStock =
      $("#availabilit span").text().trim().toLowerCase() ===
      "currently unavailable";

    const image =
      $("#imgBlkFront").attr("data-a-dynamic-image") ||
      $("#landingImage").attr("data-a-dynamic-image");

    const imageURL = extractImage(image);

    const currency = extractCurrency($(".a-price-symbol"));

    const discoutRate = parseInt($(".savingsPercentage").text().replace(/[-]/g, ""));

    const description = extractDescription($);

    const stars = extractStars($(".a-icon-alt"));
    
    const reviewCount = extractReviewCount($("#acrCustomerReviewText"));

    //  construct data object with scraped information

    const data = {
      url : productURL,
      title: title,
      currentPrice: Number(currentPrice),
      originalPrice: Number(originalPrice),
      priceHistory: [],
      isOutOfStock: outOfStock,
      image: imageURL,
      currency: currency || "₹",
      discountRate: discoutRate,
      reviews : reviewCount,
      stars: stars,
      description,
      lowestPrice: Number(currentPrice) || Number(originalPrice),
      highestPrice: Number(originalPrice) || Number(currentPrice),
      averagePrice : Number(currentPrice) || Number(originalPrice),
    };
    
    return data;
    ;
  } catch (error: any) {
    throw new Error(`Failed to scrape product : ${error.message}`);
  }
}
