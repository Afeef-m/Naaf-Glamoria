import Hero from "@/components/hero";
import { getDictionary } from "@/lib/i18n";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;

  const locale =
    resolvedParams.locale === "ar" ? "ar" : "en";

  const dict = getDictionary(locale);

  return <Hero dict={dict} locale={locale} />;
}