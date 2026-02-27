import { products } from "@/lib/mockProducts";
import ProductCard from "./ProductCard";

export default function ProductGrid({
  locale,
}: {
  locale: "en" | "ar";
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          locale={locale}
        />
      ))}
    </div>
  );
}