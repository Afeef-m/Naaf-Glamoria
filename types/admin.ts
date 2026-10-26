export type Admin = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type LocalizedText = { en: string; ar: string };

export type Product = {
  _id: string;
  name: LocalizedText;
  slug: string;
  price: number;
  images?: string[];
  stock?: number;
  isFeatured?: boolean;
};

export type Category = {
  _id: string;
  name: LocalizedText;
  slug: string;
};

export type ProductsResponse = { success: boolean; products?: Product[] };
export type CategoriesResponse = { success: boolean; categories?: Category[] };