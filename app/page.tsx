"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import HeroVideo from "@/components/HeroVideo";
import HeroBannerImage from "@/components/HeroBannerImage";
import CategoryGrid from "@/components/CategoryGrid";
import DiscountProducts from "@/components/DiscountProducts";
import BrandShowcase from "@/components/BrandShowcase";
import LatestProducts from "@/components/LatestProducts";
import Footer from "@/components/Footer";
import LiveBackground from "@/components/LiveBackground";
import SnowBackground from "@/components/SnowBackground";
import { useDevicePerformance } from "@/hooks/useDevicePerformance";
import { useSiteSettings } from "@/components/context/SiteSettingsContext";
import NewsletterSection from "@/components/NewsletterSection";
import CategoryLinks from "@/components/CategoryLinks";

export default function Home() {
  const { mounted, level } = useDevicePerformance();
  const { settings } = useSiteSettings();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const showBackground =
    isClient &&
    mounted &&
    level !== "low" &&
    settings.bg_variant !== "none";

  const quality =
    settings.bg_quality === "auto" ? level : settings.bg_quality;

  const particleCount =
    quality === "low"
      ? Math.min(settings.bg_particle_count, 20)
      : quality === "medium"
      ? Math.min(settings.bg_particle_count, 40)
      : settings.bg_particle_count;

  return (
    <main className="relative min-h-screen bg-theme">
      {showBackground && (
        <div className="pointer-events-none fixed inset-0 z-0">
          {settings.bg_variant === "sparks" && (
            <LiveBackground
              variant="sparks"
              color={settings.bg_color}
              particleCount={particleCount}
              quality={quality}
            />
          )}

          {settings.bg_variant === "night" && (
            <LiveBackground
              variant="night"
              particleCount={particleCount}
              quality={quality}
              sky={false}
            />
          )}

          {settings.bg_variant === "snow" && (
            <SnowBackground
              color={settings.bg_color || undefined}
              particleCount={particleCount}
              quality={quality}
              windStrength={settings.snow_wind_strength}
            />
          )}
        </div>
      )}

      <div className="relative z-10">
        <Header />
        <HeroVideo />
        <LatestProducts />
        <HeroBannerImage />
        <DiscountProducts />

        {/* ─── برندها — اسلاید ۱: نیچرهایک + بلک داگ ─── */}
        <BrandShowcase
          brands={[
            {
              key: "naturehike",
              nameFa: "نیچرهایک",
              nameEn: "NatureHike",
              matchNames: ["naturehike", "نیچرهایک", "نیچر هایک"],
            },
            {
              key: "blackdog",
              nameFa: "بلک داگ",
              nameEn: "BLACK DOG",
              matchNames: [
                "blackdog",
                "black dog",
                "black-dog",
                "بلک داگ",
                "بلک‌داگ",
              ],
            },
          ]}
          productsPerBrand={4}
        />

        {/* ─── برندها — اسلاید ۲: ماونتین هایکر + شاین تریپ ─── */}
        <BrandShowcase
          brands={[
            {
              key: "mountainhiker",
              nameFa: "ماونتین هایکر",
              nameEn: "Mountainhiker",
              matchNames: [
                "mountainhiker",
                "mountain hiker",
                "ماونتین هایکر",
                "ماونتین‌هایکر",
              ],
            },
            {
              key: "shinetrip",
              nameFa: "شاین تریپ",
              nameEn: "Shine Trip",
              matchNames: ["shinetrip", "shine trip", "شاین تریپ"],
            },
          ]}
          productsPerBrand={4}
        />

        <CategoryGrid />
        <CategoryLinks />

        <NewsletterSection />

        <Footer />
      </div>
    </main>
  );
}