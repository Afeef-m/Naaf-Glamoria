import { getProductBySlugServer } from "@/lib/api/product";
import { IndianRupee } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  const data = await getProductBySlugServer(slug);
  const product = data.data;

  return {
    title: product.name[locale === "ar" ? "ar" : "en"],
    description: product.description[locale === "ar" ? "ar" : "en"],
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const finalLocale = locale === "ar" ? "ar" : "en";

  try {
    const data = await getProductBySlugServer(slug);
    const product = data.data;

    if (!product) return notFound();

    return (
      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">
        <div className="relative w-full aspect-square bg-gray-100 rounded-2xl overflow-hidden">
          <Image
            src={product.images?.[0] ?? "/images/products/p-placeholder.jpg"}
            alt={product.name[finalLocale]}
            fill
            className="object-cover"
          />
        </div>

        <div className="space-y-6">
          <p className="text-sm uppercase tracking-wide text-gray-400">
            {product.category?.name?.[finalLocale]}
          </p>

          <h1 className="text-3xl font-semibold text-[#154415]">
            {product.name[finalLocale]}
          </h1>

          <p className="text-gray-600 leading-relaxed">
            {product.description[finalLocale]}
          </p>

          <div className="flex items-center gap-2 text-2xl font-bold text-[#154415]">
            <IndianRupee className="w-5 h-5" />
            {product.price}
          </div>
        </div>
      </div>
    );
  } catch {
    return notFound();
  }
}