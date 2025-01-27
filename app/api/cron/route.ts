"use server"

import Product from "@/lib/models/product.models";
import { connectToDB } from "@/lib/mongoose";
import { generateEmailBody, sendEmail } from "@/lib/nodemailer";
import { scrapeAmazonProduct } from "@/lib/scraper";
import {
  getAveragePrice,
  getEmailNotifType,
  getHighestPrice,
  getLowestPrice,
} from "@/lib/util";
import { NextResponse } from "next/server";

export const maxDuration = 50; // 1 minutes

export const dynamic = "force-dynamic";

export const revalidate = 10;

export async function GET() {
  try {
    connectToDB(); // connected to the Database

    // find the specific product
    const product = await Product.find({});

    if (!product) throw new Error("No product found");

    // SCRAPE LATEST PRODUCT DETAILS & UPDATE DB

    // update the price history and current price
    const updatedProducts = await Promise.all(
      product.map(async (currentProduct) => {
        const scrapedProduct = await scrapeAmazonProduct(currentProduct.url);

        if (!scrapedProduct) throw new Error("No Product Found!");

        const updatedPriceHistory: any = [
          ...currentProduct.priceHistory,
          { price: scrapedProduct.currentPrice },
        ];

        // change the previous price's with new one
        const product = {
          ...scrapedProduct,
          priceHistory: updatedPriceHistory,
          lowestPrice: getLowestPrice(updatedPriceHistory),
          highestPrice: getHighestPrice(updatedPriceHistory),
          averagePrice: getAveragePrice(updatedPriceHistory),
        };

        const updatedProduct = await Product.findOneAndUpdate(
          { url: product.url },
          product
        );

        // 2. CHECK EACH PRODUCT STATUS & SEND EMAIL ACCORDINGLY
        const emailNotifType = getEmailNotifType(
          scrapedProduct,
          currentProduct
        );

        if (emailNotifType && updatedProduct.users.length > 0) {
          const productInfo = {
            title: updatedProduct.title,
            url: updatedProduct.url,
          };

          const emailContent = await generateEmailBody(
            productInfo,
            emailNotifType
          );

          const userEmails = updatedProduct.users.map(
            (user: any) => user.email
          );

          await sendEmail(emailContent, userEmails);
        }

        return updatedProduct;
      })
    );

    return NextResponse.json({
      message: "ok",
      data: updatedProducts,
    });
  } catch (error) {
    throw new Error(`Error in GET : ${error}`);
  }
}
