import {
  getProductBySlugServer,
  getRelatedProductsServer,
} from "@/lib/api/product";

import { Product } from "@/types/product";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";

type Props = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const lang = locale === "ar" ? "ar" : "en";

  try {
    const response = await getProductBySlugServer(slug);
    const product = response.data;

    if (!product) {
      return {
        title: "Product Not Found | Naaf Glamoria",
      };
    }

    return {
      title: `${product.name[lang]} | Naaf Glamoria`,
      description: product.description[lang],
    };
  } catch {
    return {
      title: "Product Not Found | Naaf Glamoria",
    };
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const finalLocale = locale === "ar" ? "ar" : "en";

  try {
    // 1. Fetch current product
    const response = await getProductBySlugServer(slug);
    const product = response.data;

    if (!product) {
      notFound();
    }

    // 2. Fetch related products
    let relatedProducts: Product[] = [];

    if (product.category?._id) {
      try {
        relatedProducts = await getRelatedProductsServer(
          product.category._id,
          product._id,
        );
      } catch (error) {
        console.error("Related products fetching failed:", error);
      }
    }

    // 3. Render product page
    return (
      <ProductDetailClient
        product={product}
        locale={finalLocale}
        relatedProducts={relatedProducts}
      />
    );
  } catch {
    notFound();
  }
}
