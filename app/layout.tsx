import type { Metadata, Viewport } from "next";

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

// 🆕 Viewport — جدا از metadata
export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "کاو کمپ | فروشگاه تخصصی لوازم کمپینگ و کوهنوردی",

  description: "فروشگاه تخصصی لوازم کمپینگ و کوهنوردی — KAW CAMP",

  // 🆕 PWA Manifest (آیکون هوم اسکرین)
  manifest: "/manifest.webmanifest",

  // 🆕 Apple PWA (iPhone/iPad)
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "KAW CAMP",
  },

  // 🆕 آیکون‌ها — همه logo2.png
  icons: {
    icon: [
      { url: "/images/logo2.png", type: "image/png", sizes: "192x192" },
      { url: "/images/logo2.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/images/logo2.png",
    apple: [
      { url: "/images/logo2.png", sizes: "180x180", type: "image/png" },
    ],
  },

  // 🆕 Open Graph
  openGraph: {
    title: "کاو کمپ | فروشگاه تخصصی لوازم کمپینگ و کوهنوردی",
    description: "فروشگاه تخصصی لوازم کمپینگ و کوهنوردی — KAW CAMP",
    url: "https://kawcamp.com",
    siteName: "KAW CAMP",
    images: [
      {
        url: "https://kawcamp.com/images/logo2.png",
        width: 512,
        height: 512,
        alt: "KAW CAMP",
      },
    ],
    locale: "fa_IR",
    type: "website",
  },

  // 🆕 Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "کاو کمپ | فروشگاه تخصصی لوازم کمپینگ و کوهنوردی",
    description: "فروشگاه تخصصی لوازم کمپینگ و کوهنوردی — KAW CAMP",
    images: ["https://kawcamp.com/images/logo2.png"],
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
        {/* 🆕 Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "کاو کمپ | KAW CAMP",
              alternateName: "KAW CAMP",
              url: "https://kawcamp.com",
              logo: "https://kawcamp.com/images/logo2.png",
              image: "https://kawcamp.com/images/logo2.png",
              description:
                "فروشگاه تخصصی لوازم کمپینگ و کوهنوردی — KAW CAMP",
              address: {
                "@type": "PostalAddress",
                addressCountry: "IR",
                addressLocality: "بانه",
                addressRegion: "کردستان",
                streetAddress: "کوچه پاساژ نور، پلاک ۲",
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+98-918-054-0019",
                contactType: "customer service",
                areaServed: "IR",
                availableLanguage: ["Persian"],
              },
              sameAs: [
                "https://www.instagram.com/kawcamp",
                "https://t.me/kawcamp",
              ],
            }),
          }}
        />

        {/* 🔴 Anti-Flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  localStorage.removeItem('theme');
                  var html = document.documentElement;
                  html.classList.remove('dark');
                  html.classList.add('light');
                  html.style.colorScheme = 'light';
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