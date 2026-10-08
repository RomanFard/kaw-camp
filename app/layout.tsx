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
        {/* ═══════════════════════════════════════════════
            🔴 Anti-Flash Script
            - تم (dark/light) رو از localStorage می‌خونه
            - رنگ accent رو از localStorage می‌خونه
            - قبل از هر paint روی <html> اعمال می‌کنه
            ═══════════════════════════════════════════════ */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // ─── تم ───
                  var stored = localStorage.getItem('theme');
                  var theme = stored === 'light' ? 'light' : 'dark';
                  var html = document.documentElement;
                  html.classList.remove('dark', 'light');
                  html.classList.add(theme);
                  html.style.colorScheme = theme;

                  // ─── رنگ accent ───
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