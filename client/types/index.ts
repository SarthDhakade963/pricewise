export type PriceHistoryItem = {
  price: number;
};

export type User = {
  phoneNumber: string;
};

export type Product = {
  reviews: number;
  _id?: string;
  url: string;
  currency: string;
  image: string;
  title: string;
  currentPrice: number;
  originalPrice: number;
  priceHistory: PriceHistoryItem[] | [];
  highestPrice: number;
  lowestPrice: number;
  averagePrice: number;
  discountRate: number;
  description: string;
  stars: number;
  isOutOfStock: Boolean;
  users?: User[];
};

export type NotificationType =
  | "WELCOME"
  | "CHANGE_OF_STOCK"
  | "LOWEST_PRICE"
  | "THRESHOLD_MET";

export type EmailContent = {
  subject: string;
  body: string;
};

export type EmailProductInfo = {
  title: string;
  url: string;
};

// scraper/types.ts
export interface ScrapedProduct {
  url: string;
  title: string;
  currentPrice: number;
  originalPrice: number;
  priceHistory: { price: number }[];
  isOutOfStock: boolean;
  image: string;
  currency: string;
  discountRate?: number;
  reviews?: number;
  stars?: number;
  description?: string;
  lowestPrice: number;
  highestPrice: number;
  averagePrice: number;
}
