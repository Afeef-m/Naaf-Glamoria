import localFont from "next/font/local";
import { Montserrat, Almarai } from "next/font/google";
import "@/app/globals.css";
import Navbar from "@/components/Navbar";

const caslon = localFont({
  src: "../fonts/CaslonTitling.otf",
  variable: "--font-caslon",
  weight: "400",
});

const libreCaslon = localFont({
  src: "../fonts/LibreCaslonText-Regular.ttf",
  variable: "--font-librecaslon",
  weight: "400",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const almarai = Almarai({
  subsets: ["arabic"],
  weight: ["300", "400", "700", "800"],
  variable: "--font-almarai",
});

import { getDictionary } from "@/lib/i18n";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
params:Promise< { locale: string }>;
}) {
  const { locale } = await params;
  const finalLocale = locale === "ar" ? "ar" : "en";

  const dict = getDictionary(finalLocale);

  return (
    <html lang={finalLocale} dir={finalLocale === "ar" ? "rtl" : "ltr"}>
       <body
        className={`${caslon.variable} ${libreCaslon.variable} ${montserrat.variable} ${almarai.variable} antialiased`}
      >
          <Navbar dict={dict} locale={finalLocale} />
          {children}
      </body>
    </html>
  );
}