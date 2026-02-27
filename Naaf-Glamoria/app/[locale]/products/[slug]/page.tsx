import { products } from "@/lib/mockProducts";
import Image from "next/image";

export default async function ProductDetails({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const finalLocale = locale === "ar" ? "ar" : "en";

  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="p-8">
      <Image
        src={product.image}
        alt={product.name[finalLocale]}
        fill
        className="w-full object-cover"
      />

      <h1 className="text-2xl font-bold mt-4">{product.name[finalLocale]}</h1>

      <p className="mt-2">{product.description[finalLocale]}</p>

      <p className="mt-4 font-semibold">${product.price}</p>
    </div>
  );
}
