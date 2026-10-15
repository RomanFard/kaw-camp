import type { Metadata } from "next";

import "leaflet/dist/leaflet.css";
import "./globals.css";
import { CartProvider } from "@/components/context/CartContext";
import { WishlistProvider } from "@/components/context/WishlistContext";
import { ToastProvider } from "@/components/context/ToastContext";
import LoadingScreen from "@/components/LoadingScreen";
import { ProductsProvider } from "@/components/context/ProductsContext";
import { SiteSettingsProvider } from "@/components/context/SiteSettingsContext";
import { HeroSlideProvider } from "@/components/context/HeroSlideContext";

import ToastContainer from "@/components/ToastContainer";

export const metadata: Metadata = {
  title: "کاو کمپ | فروشگاه تخصصی لوازم کمپینگ و کوهنوردی",

  description: "فروشگاه تخصصی لوازم کمپینگ و کوهنوردی — KAW CAMP",

  icons: {
    icon: [{ url: "/images/logo2.png", type: "image/png" }],
    shortcut: "/images/logo2.png",
    apple: "/images/logo2.png",
  },

  other: {
    enamad: "74148659",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className="light" suppressHydrationWarning>
      <head>
        {/* 🔴 Anti-Flash — همیشه روشن */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // حذف هر تم ذخیره‌شده‌ای
                  localStorage.removeItem('theme');

                  // اجبار به light
                  var html = document.documentElement;
                  html.classList.remove('dark');
                  html.classList.add('light');
                  html.style.colorScheme = 'light';

                  // رنگ accent
                  var settings = localStorage.getItem('kaw-site-settings');
                  if (settings) {
                    var s = JSON.parse(settings);
                    if (s.accent_color) {
                      html.style.setProperty('--accent', s.accent_color);
                    }
                    if (s.accent_hover) {
                      html.style.setProperty('--accent-hover', s.accent_hover);
                    }
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/AmirAbbasVafaee/persian-fonts-cdn@main/css/iran-yekan.css"
        />
      </head>
      <body className="font-[IranYekan] bg-theme">
        <SiteSettingsProvider>
          <HeroSlideProvider>
            <LoadingScreen />
            <ToastProvider>
              <ProductsProvider>
                <CartProvider>
                  <WishlistProvider>
                    {children}

                    <ToastContainer />
                  </WishlistProvider>
                </CartProvider>
              </ProductsProvider>
            </ToastProvider>
          </HeroSlideProvider>
        </SiteSettingsProvider>
      </body>
    </html>
  );
}