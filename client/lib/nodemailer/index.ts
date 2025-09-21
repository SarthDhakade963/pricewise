"use server";
import { EmailProductInfo, NotificationType } from "@/types";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const fromNumber = process.env.TWILIO_SMS_NUMBER!;

const client = twilio(accountSid, authToken);

export const THRESHOLD_PERCENTAGE = 40;

export const Notification = {
  WELCOME: "WELCOME",
  CHANGE_OF_STOCK: "CHANGE_OF_STOCK",
  LOWEST_PRICE: "LOWEST_PRICE",
  THRESHOLD_MET: "THRESHOLD_MET",
};

export async function generateWhatsappMessage(
  product: EmailProductInfo,
  type: NotificationType
) {
  const shortenedTitle =
    product.title.length > 20
      ? `${product.title.substring(0, 20)}...`
      : product.title;

  let body = "";

  switch (type) {
    case Notification.WELCOME:
      body = `🚀 Welcome to PriceWise!\n\nYou are now tracking: ${shortenedTitle}\n\nExample alert:\n✅ ${shortenedTitle} is back in stock!\nCheck it out: ${product.url}\n\nStay tuned for more updates.`;
      break;

    case Notification.CHANGE_OF_STOCK:
      body = `📦 Back in stock!\n${shortenedTitle} is now available again.\nGrab it here: ${product.url}`;

      break;

    case Notification.LOWEST_PRICE:
      body = `💰 Lowest Price Alert!\n${shortenedTitle} has reached its lowest price ever.\nSee it here: ${product.url}`;
      break;

    case Notification.THRESHOLD_MET:
      body = `🏷️ Discount Alert!\n${shortenedTitle} is now discounted more than ${THRESHOLD_PERCENTAGE}%!\nBuy now: ${product.url}`;
      break;

    default:
      throw new Error("Invalid notification type.");
  }

  return { body };
}

export const sendSMS = async (
  product: EmailProductInfo,
  type: NotificationType,
  to: string
) => {
  try {
    const messageBody = await generateWhatsappMessage(product, type);
    const toNumber = `+91${to}`;
    console.log("From Number : " + fromNumber);
    console.log("To Number : " + toNumber);
    console.log("Message Body : " + messageBody.body);

    const message = await client.messages.create({
      from: fromNumber,
      to: toNumber,
      body: messageBody.body,
    });

    console.log("SMS sent:", message.sid);

    const status = await client.messages(message.sid).fetch();
    console.log("Message status:", status.status);

    return true;
  } catch (error: any) {
    console.error("Failed to send SMS:", error.message);
    return false;
  }
};
