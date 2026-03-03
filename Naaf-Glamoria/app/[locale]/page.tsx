import Hero from "@/components/hero";
import { getDictionary } from "@/lib/i18n";
import ProductGrid from "@/components/product/ProductGrid";
import { getProductsServer } from "@/lib/api/product";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const finalLocale = locale === "ar" ? "ar" : "en";

  const dict = getDictionary(finalLocale);

  const data = await getProductsServer();
  const products = data.products;

  return (
    <>
      <Hero dict={dict} locale={finalLocale} />
      <ProductGrid products={products} locale={finalLocale} />
    </>
  );
}