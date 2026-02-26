import type { Metadata } from "next";
import localFont from "next/font/local";
import { Montserrat, Almarai } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Providers } from "@/components/Providers";

const caslon = localFont({
  src: "./fonts/CaslonTitling.otf",
  variable: "--font-caslon",
  weight: "400",
});
const libreCaslon = localFont({
  src: "./fonts/LibreCaslonText-Regular.ttf",
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

export const metadata: Metadata = {
  title: {
    default: "Naaf Glamoria",
    template: "%s | Naaf Glamoria",
  },
  description: "Discover Naaf Glamoria - where timeless elegance meets modern luxury. Explore our exclusive collection of fine jewelry. Coming Soon.",
  keywords: ["Jewelry", "Naaf Glamoria", "Luxury", "Gold", "Diamonds", "Rings", "Necklaces", "Fine Jewelry"],
  openGraph: {
    title: "Naaf Glamoria",
    description:
      "Discover Naaf Glamoria - where timeless elegance meets modern luxury. Explore our exclusive collection of fine jewelry. Coming Soon.",
    type: "website",
    locale: "en_US",
    siteName: "Naaf Glamoria",
    images: [
      {
        url: "https://naaf-glamoria.vercel.app/images/og-image.png", // Ensure this file exists in your public folder
        width: 1200,
        height: 630,
        alt: "Naaf Glamoria - Timeless Elegance",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Naaf Glamoria",
    description:
      "Discover Naaf Glamoria - where timeless elegance meets modern luxury. Explore our exclusive collection of fine jewelry. Coming Soon.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` ${caslon.variable} ${libreCaslon.variable} ${montserrat.variable} ${almarai.variable} antialiased`}>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
