import { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: "gold-ring-1",
    slug: "gold-ring-1",
    name: {
      en: "Golden Ring",
      ar: "خاتم ذهبي",
    },
    description: {
      en: "Elegant handcrafted golden ring.",
      ar: "خاتم ذهبي أنيق مصنوع يدويًا.",
    },
    price: 250,
    originalPrice: 329,
    image: "/images/products/ring.jpg",
    category: {
      en: "Ring",
      ar: "خاتم",
    },
    rating: 4,
    reviewsCount: 21,
    isFeatured: true,
  },
];