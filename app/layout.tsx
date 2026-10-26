
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Naaf Glamoria",
  description: "Discover jewellery at Naaf Glamoria.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
