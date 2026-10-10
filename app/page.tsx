"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Header from "@/components/Header";
import HeroVideo from "@/components/HeroVideo";
import CategoryGrid from "@/components/CategoryGrid";
import BrandShowcase from "@/components/BrandShowcase";
import LatestProducts from "@/components/LatestProducts";
import CategoryShowcase, {
  CategoryShowcaseData,
  DEFAULT_CATEGORY_SHOWCASE,
} from "@/components/CategoryShowcase";
import BlackDogSteps, {
  BlackDogStepsData,
  DEFAULT_BLACK_DOG_STEPS,
} from "@/components/BlackDogSteps";
import { getAppContent } from "@/lib/supabase/appContent";
import SpecialDiscountSlot from "@/components/SpecialDiscountSlot";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import LiveBackground from "@/components/LiveBackground";
import SnowBackground from "@/components/SnowBackground";
import { useDevicePerformance } from "@/hooks/useDevicePerformance";
import { useSiteSettings } from "@/components/context/SiteSettingsContext";
import NewsletterSection from "@/components/NewsletterSection";

export default function Home() {
  const { mounted, level } = useDevicePerformance();
  const { resolvedTheme } = useTheme();
  const { settings } = useSiteSettings();
  const [isClient, setIsClient] = useState(false);

  const [blackDogData, setBlackDogData] =
    useState<BlackDogStepsData>(DEFAULT_BLACK_DOG_STEPS);
  const [categoryShowcaseData, setCategoryShowcaseData] =
    useState<CategoryShowcaseData>(DEFAULT_CATEGORY_SHOWCASE);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const saved = await getAppContent<BlackDogStepsData>("black_dog_steps");
        if (saved) setBlackDogData(saved);
      } catch (e) {
        console.error("black_dog_steps load error", e);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const saved = await getAppContent<CategoryShowcaseData>(
          "category_showcase"
        );
        if (saved) setCategoryShowcaseData(saved);
      } catch (e) {
        console.error("category_showcase load error", e);
      }
    })();
  }, []);

  const showBackground =
    isClient &&
    mounted &&
    level !== "low" &&
    settings.bg_variant !== "none" &&
    (!settings.bg_only_dark || resolvedTheme === "dark");

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
              sky={resolvedTheme === "dark"}
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
        <BlackDogSteps data={blackDogData} />
        <BrandShowcase />
        <CategoryShowcase data={categoryShowcaseData} />
        <SpecialDiscountSlot />
        <CategoryGrid />
        <ContactSection />
        <NewsletterSection />
        <Footer />
      </div>
    </main>
  );
}