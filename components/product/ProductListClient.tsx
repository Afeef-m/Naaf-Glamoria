"use client";

import { useState} from "react";
import ProductCard from "@/components/product/ProductCard";
import { Product } from "@/types/product";
import { getProductsClient } from "@/lib/api/product";
import { useQuery } from "@tanstack/react-query";

type ProductResponse = {
  products: Product[]
}

export default function ProductListClient({
  initialProducts,
  locale,
}: {
  initialProducts: Product[];
  locale: "en" | "ar";
}) {

  const [sort, setSort] = useState("");
  const fetchProducts = () =>
  getProductsClient(sort ? `?sort=price&order=${sort}` : "");

const { data } = useQuery<ProductResponse>({
  queryKey: ["products", sort],
  queryFn: fetchProducts,
  initialData: { products: initialProducts },
});
  const products = data?.products ?? []
  console.log("ProductListClient rendered");
  return (
    <>
      {/* Sorting UI */}
      <div className="p-4">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border p-2"
        >
          <option value="">Default</option>
          <option value="asc">Price Low → High</option>
          <option value="desc">Price High → Low</option>
        </select>
      </div>

      {/* Product Grid */}
     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 md:px-8">
        {products.map((product: Product) => (
          <ProductCard
            key={product._id}
            product={product}
            locale={locale}
          />
        ))}
      </div>
    </>
  );
}