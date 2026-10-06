import type { Metadata } from "next";
import FloatingButtons from "@/components/FloatingButtons";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import { CartProvider } from "@/components/context/CartContext";
import { ThemeProvider } from "@/components/context/ThemeProvider";
import { WishlistProvider } from "@/components/context/WishlistContext";
import { ToastProvider } from "@/components/context/ToastContext";
import LoadingScreen from "@/components/LoadingScreen";
import { ProductsProvider } from "@/components/context/ProductsContext";
import { SiteSettingsProvider } from "@/components/context/SiteSettingsContext";
import { HeroSlideProvider } from "@/components/context/HeroSlideContext";
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
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        {/* ⬇️ اسکریپت ضد فلش: تم رو قبل از هر paint اعمال می‌کنه */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme')||'dark';if(t==='dark'){document.documentElement.classList.add('dark')}else{document.documentElement.classList.remove('dark')}}catch(e){}})();`,
          }}
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/AmirAbbasVafaee/persian-fonts-cdn@main/css/iran-yekan.css"
        />
      </head>
      <body className="font-[IranYekan] bg-theme">
        <ThemeProvider>
          <SiteSettingsProvider>
            <HeroSlideProvider>
              <LoadingScreen />
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
            </HeroSlideProvider>
          </SiteSettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}