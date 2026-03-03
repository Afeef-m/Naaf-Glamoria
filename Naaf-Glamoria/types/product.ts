export interface Product {
  _id: string;
  slug: string;

  name: { en: string; ar: string };
  description: { en: string; ar: string };

  category: {
    _id: string;
    name: { en: string; ar: string };
    slug: string;
  };

  price: number;
  originalPrice?: number;
  images: string[];

  rating?: number;
  reviewsCount?: number;
  isFeatured: boolean;
}