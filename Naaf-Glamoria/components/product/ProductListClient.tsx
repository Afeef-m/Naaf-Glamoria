"use client";

import { useState} from "react";
import ProductCard from "@/components/product/ProductCard";
import { Product } from "@/types/product";
import { getProductsClient } from "@/lib/api/product";

export default function ProductListClient({
  initialProducts,
  locale,
}: {
  initialProducts: Product[];
  locale: "en" | "ar";
}) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [sort, setSort] = useState("");

  const handleSortChange = async (value: string) => {
    setSort(value);

   const data = await getProductsClient(
  `?sort=price&order=${value}`
);
    setProducts(data.products);
    console.log(data.products)
  };
  return (
    <>
      {/* Sorting UI */}
      <div className="p-4">
        <select
          value={sort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="border p-2"
        >
          <option value="">Default</option>
          <option value="asc">Price Low → High</option>
          <option value="desc">Price High → Low</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8">
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