"use server";

import { connectToDB } from "../mongoose";
import Product from "../models/product.models";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../util";
import { revalidatePath } from "next/cache";
import { ScrapedProduct, User } from "@/types";
import { sendSMS } from "../nodemailer";

export async function scrapeAndStoreProduct(productURL: string) {
  if (!productURL) return;

  try {
    connectToDB();

    const scrapedProduct = await scrapeAmazonProduct(productURL);

    if (!scrapedProduct) throw new Error("Could not scrape product");

    let product = scrapedProduct;

    const existingProduct = await Product.findOne({ url: scrapedProduct.url });

    if (existingProduct) {
      const updatedPriceHistory: any = [
        ...existingProduct.priceHistory,
        { price: scrapedProduct.currentPrice },
      ];

      product = {
        ...scrapedProduct,
        priceHistory: updatedPriceHistory,
        lowestPrice: getLowestPrice(updatedPriceHistory),
        highestPrice: getHighestPrice(updatedPriceHistory),
        averagePrice: getAveragePrice(updatedPriceHistory),
      };
    }

    const newProduct = await Product.findOneAndUpdate(
      { url: scrapedProduct.url },
      product,
      { upsert: true, new: true }
    );

    revalidatePath(`/products/${newProduct._id}`);
  } catch (error: any) {
    throw new Error(`Failed to create/update product : ${error.message}`);
  }
}

export async function getProductById(productId: string) {
  try {
    connectToDB();

    const product = await Product.findOne({ _id: productId });

    if (!product) return null;

    return product;
  } catch (e) {
    console.log("Failed to get Product Id");
  }
}

export async function getAllProducts() {
  try {
    connectToDB();

    const products = await Product.find();

    return products;
  } catch (error) {
    console.log(error);
  }
}

export async function getSimilarProducts(productId: string) {
  try {
    connectToDB();

    const currentProduct = await Product.findById(productId);

    if (!currentProduct) return null;

    const similarProducts = await Product.find({
      _id: { $ne: productId }, // ne = not equal to
    }).limit(3);

    return similarProducts;
  } catch (error) {
    console.log(error);
  }
}

export async function addUserPhoneNumberToProduct(
  productId: string,
  userPhoneNumber: string
) {
  try {
    // send our first message to whatsapp user
    const product = await Product.findById(productId);

    if (!productId) return;

    const userExists =
      product.users?.some(
        (user: User) => user.phoneNumber === userPhoneNumber
      ) ?? false;

    if (!userExists) {
      product.users.push({ phoneNumber: userPhoneNumber });

      await product.save();

      const success = await sendSMS(product, "WELCOME", userPhoneNumber);

      return success;
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function scrapeAmazonProduct(
  productUrl: string
): Promise<ScrapedProduct | null> {
  try {
    const res = await fetch("https://pricewise-yb6b.onrender.com/scrape", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: productUrl }),
    });

    const scrapedProduct: ScrapedProduct = await res.json();

    console.log(scrapedProduct);
    
    return scrapedProduct;
  } catch (error) {
    console.error("Failed to fetch scraped product:", error);
    return null;
  }
}
