import { PriceHistoryItem, Product } from "@/types";
import { THRESHOLD_PERCENTAGE } from "./nodemailer";
import { Notification } from "./nodemailer";

export function extractPrice(...elements: any) {
  for (const element of elements) {
    const priceText = element.text().trim();
    if (priceText) return priceText.replace(/[^\d.]/g, "");
  }
  return "";
}

export function extractImage(data: any): string {
  try {
    const keys = Object.keys(JSON.parse(data)); // Get the keys from the parsed object
    return keys.length > 0 ? keys[0] : ""; // Return the first key if it exists
  } catch (error) {
    console.error("Invalid JSON string:", error);
    return ""; // Return null if JSON parsing fails
  }
}

export function extractCurrency(input: any) {
  const currencyText = input.text().trim().slice(0, 1);
  return currencyText ? currencyText : "";
}

export function extractDescription($: any) {
  const selectors = ["#feature-bullets .a-list-item", "a-expander-content p"];

  for (const selector of selectors) {
    const elements = $(selector);

    if (elements.length > 0) {
      const textContent = elements
        .map((_: any, element: any) => {
          const text = $(element).text().trim().replaceAll("✅", "");
          return text ? `✅ ${text}` : null; // skip empty
        })
        .get()
        .filter(Boolean) // remove nulls
        .join("\n");

      return textContent;
    }
  }

  return "";
}

export function getHighestPrice(priceList: PriceHistoryItem[]) {
  let highestPrice = priceList[0];

  for (let i = 0; i < priceList.length; i++) {
    if (priceList[i].price > highestPrice.price) {
      highestPrice = priceList[i];
    }
  }

  return highestPrice.price;
}

export function getLowestPrice(priceList: PriceHistoryItem[]) {
  let lowestPrice = priceList[0];

  for (let i = 0; i < priceList.length; i++) {
    if (priceList[i].price < lowestPrice.price) {
      lowestPrice = priceList[i];
    }
  }

  return lowestPrice.price;
}

export function getAveragePrice(priceList: PriceHistoryItem[]) {
  if (priceList.length === 0) return 0;
  const sumOfPrices = priceList.reduce((acc, curr) => acc + curr.price, 0);

  console.log(sumOfPrices);

  const averagePrice = (sumOfPrices / priceList.length) | 0;

  return averagePrice;
}

export function extractStars(element: any) {
  const star = element.first().text().trim();

  if (star) {
    const match = star.match(/[\d.]+/);
    if (match) {
      return match[0];
    }
  }

  return null;
}

export function extractReviewCount(element: any) {
  const reviewText = element.text().trim(); // Extract review text

  if (reviewText) {
    // Match the numeric portion of the review text
    const match = reviewText.match(/\d[\d,]*/); // Matches numbers with commas, e.g., "12,345"

    if (match) {
      // Remove commas and convert to a number
      return parseInt(match[0].replace(/,/g, ""), 10);
    }
  }

  return 0; // Return null if no review count found
}

export const formatNumber = (num: number = 0) => {
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

export const getMessageNotifType = (
  scrapedProduct: Product,
  currentProduct: Product
) => {
  const lowestPrice = getLowestPrice(currentProduct.priceHistory);

  if (scrapedProduct.currentPrice < lowestPrice) {
    return Notification.LOWEST_PRICE as keyof typeof Notification;
  }

  if (!scrapedProduct.isOutOfStock && currentProduct.isOutOfStock) {
    return Notification.CHANGE_OF_STOCK as keyof typeof Notification;
  }

  if (scrapedProduct.discountRate >= THRESHOLD_PERCENTAGE) {
    return Notification.THRESHOLD_MET as keyof typeof Notification;
  }

  return null;
};
