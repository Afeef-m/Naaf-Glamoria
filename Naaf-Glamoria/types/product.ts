export interface Product {
  id: string;
  slug: string;

  name: { en: string; ar: string };
  description: { en: string; ar: string };
  category: { en: string; ar: string };

  price: number;
  originalPrice?: number;

  image: string;

  rating?: number;
  reviewsCount?: number;

  isFeatured: boolean;
}