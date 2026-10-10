import { clientFetch } from "./client";
import { serverFetch } from "./server";
import { Product } from "@/types/product";

type ProductResponse = {
  success: boolean;
  products: Product[];
};

type SingleProductResponse = {
  success: boolean;
  data: Product;
};

// SSR - get all products
export async function getProductsServer(query = "") {
  return serverFetch<ProductResponse>(
    `/products${query}`,
    60
  );
}

// CSR - get all products
export async function getProductsClient(query = "") {
  return clientFetch<ProductResponse>(
    `/products${query}`
  );
}

// SSR - get single product
export async function getProductBySlugServer(slug: string) {
  return serverFetch<SingleProductResponse>(
    `/products/${slug}`,
    60
  );
}