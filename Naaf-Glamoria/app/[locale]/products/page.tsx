import { products } from "@/lib/mockProducts";
import ProductCard from "@/components/product/ProductCard";

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const finalLocale = locale === "ar" ? "ar" : "en";

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          locale={finalLocale}
        />
      ))}
    </div>
  );
}