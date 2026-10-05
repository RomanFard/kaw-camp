import type { Metadata } from "next";
import FloatingButtons from "@/components/FloatingButtons";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import { CartProvider } from "@/components/context/CartContext";
import { WishlistProvider } from "@/components/context/WishlistContext";
import { ToastProvider } from "@/components/context/ToastContext";
import { ProductsProvider } from "@/components/context/ProductsContext";
import MobileBottomNav from "@/components/MobileBottomNav";
import ToastContainer from "@/components/ToastContainer";

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
        <ToastProvider>
          <ProductsProvider>
            <CartProvider>
              <WishlistProvider>
                {children}
               <MobileBottomNav />
<FloatingButtons />
<ToastContainer />
              </WishlistProvider>
            </CartProvider>
          </ProductsProvider>
        </ToastProvider>
      </body>
    </html>
  );
}