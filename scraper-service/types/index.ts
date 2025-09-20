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
