import * as cheerio from "cheerio";
import puppeteer from "puppeteer";
import {
  extractCurrency,
  extractDescription,
  extractImage,
  extractPrice,
  extractReviewCount,
  extractStars,
} from "./utils";

export async function scrapeAmazonProduct(productURL: string) {
  if (!productURL) return;

  // Launch browser
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  try {
    // Navigate to product page
    await page.goto(productURL, {
      waitUntil: "domcontentloaded",
      timeout: 30000, // 30 seconds
    });

    const content = await page.content();

    const $ = cheerio.load(content);

    // Extract product details
    const title = $("#productTitle").text().trim();

    const currentPrice = extractPrice(
      $(".priceToPay span.a-price-whole"),
      $("a.size.base.a-color-price"),
      $(".a-button-selected .a-color-base")
    );

    const originalPrice = extractPrice(
      $("#corePriceDisplay_desktop_feature_div .a-offscreen"),
      $(".a-price-whole"),
      $("#priceblock_ourprice"),
      $(".a-price.a-text-price span.a-offscreen"),
      $("#listPrice"),
      $("#priceblock_dealprice"),
      $(".a-size-base.a-color-price")
    );

    const outOfStock =
      $("#availability span").text().trim().toLowerCase() ===
      "currently unavailable";

    const image =
      $("#imgBlkFront").attr("data-a-dynamic-image") ||
      $("#landingImage").attr("data-a-dynamic-image");

    const imageURL = extractImage(image);
    const currency = extractCurrency($(".a-price-symbol"));
    const discountRate = parseInt(
      $(".savingsPercentage").text().replace(/[-]/g, "")
    );

    const description = extractDescription($);
    const stars = extractStars($(".a-icon-alt"));

    const reviewCount = extractReviewCount($("#acrCustomerReviewText"));

    function safeNumber(value: string | number | undefined): number {
      if (!value) return 0; // fallback if undefined or empty
      const num = Number(String(value).replace(/[^0-9.]/g, ""));
      return isNaN(num) ? 0 : num;
    }

    const currentPriceValue = safeNumber(currentPrice);
    const originalPriceValue = safeNumber(originalPrice);

    return {
      url: productURL,
      title,
      currentPrice: currentPriceValue,
      originalPrice: originalPriceValue,
      priceHistory: [],
      isOutOfStock: outOfStock,
      image: imageURL,
      currency: currency || "₹",
      discountRate,
      reviews: reviewCount,
      stars,
      description,
      lowestPrice: currentPriceValue || originalPriceValue,
      highestPrice: originalPriceValue || currentPriceValue,
      averagePrice: currentPriceValue || originalPriceValue,
    };
  } catch (error: any) {
    await browser.close(); // make sure browser always closes
    throw new Error(`Failed to scrape product: ${error.message}`);
  } finally {
    // Close browser after scraping
    await browser.close();
  }
}
