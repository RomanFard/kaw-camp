import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/context/CartContext";
import MobileBottomNav from "@/components/MobileBottomNav";

export const metadata: Metadata = {
  title: "KAW CAMP | فروشگاه تخصصی کمپینگ و کوهنوردی",
  description: "فروشگاه تخصصی لوازم کمپینگ و کوهنوردی — KAW CAMP",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/AmirAbbasVafaee/persian-fonts-cdn@main/css/iran-yekan.css"
        />
      </head>
      <body className="font-[IranYekan] bg-gray-50">
        <CartProvider>
          {children}
          <MobileBottomNav />
        </CartProvider>
      </body>
    </html>
  );
}