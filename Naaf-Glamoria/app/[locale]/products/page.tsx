import ProductListClient from "@/components/product/ProductListClient";
import { Product } from "@/types/product";

type ProductResponse = {
  success: boolean;
  products: Product[];
};

export default async function ProductsPage({
    params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const finalLocale = locale === "ar" ? "ar" : "en";

  console.log("Page locale:", finalLocale);

  const res = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/api/v1/products`,
  { next: { revalidate: 60 } }
);

  const data: ProductResponse = await res.json();

  return (
    <ProductListClient
      initialProducts={data.products}
      locale={finalLocale}
    />
  );
}