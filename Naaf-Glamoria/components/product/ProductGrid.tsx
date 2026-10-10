import { Product } from "@/types/product";
import ProductCard from "./ProductCard";

export default function ProductGrid({
  products,
  locale,
}: {
  products: Product[],
  locale: "en" | "ar";
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 sm:px-6 lg:px-12 py-10">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          locale={locale}
        />
      ))}
    </div>
  );
}