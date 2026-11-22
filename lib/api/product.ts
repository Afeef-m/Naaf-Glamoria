import { clientFetch } from "./client";
import { serverFetch } from "./server";
import { Product } from "@/types/product";

type ProductResponse = {
  success: boolean;
  products: Product[];
  pagination?: {
    total: number;
    page: number;
    pages: number;
  };
};

type SingleProductResponse = {
  success: boolean;
  data: Product;
};

// SSR - get all products
export async function getProductsServer(query = "") {
  return serverFetch<ProductResponse>(`/products${query}`, 0);
}

// CSR - get all products
export async function getProductsClient(query = "") {
  return clientFetch<ProductResponse>(`/products${query}`);
}

// SSR - get single product
export async function getProductBySlugServer(slug: string) {
  return serverFetch<SingleProductResponse>(`/products/${slug}`, 60);
}

// SSR - get related products by category
export async function getRelatedProductsServer(
  categoryId: string,
  currentProductId: string,
): Promise<Product[]> {
  if (!categoryId) return [];

  const response = await getProductsServer(
    `?category=${encodeURIComponent(categoryId)}&limit=5&sort=createdAt&order=desc`,
  );

  return (response.products ?? [])
    .filter((product) => product._id !== currentProductId)
    .slice(0, 4);
}
