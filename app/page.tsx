"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Header from "@/components/Header";
import HeroVideo from "@/components/HeroVideo";
import AboutSection from "@/components/AboutSection";
import CategoryGrid from "@/components/CategoryGrid";
import DiscountProducts from "@/components/DiscountProducts";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import LiveBackground from "@/components/LiveBackground";
import { useDevicePerformance } from "@/hooks/useDevicePerformance";

export default function Home() {
  const { mounted, level } = useDevicePerformance();
  const { resolvedTheme } = useTheme();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const particleCount =
    level === "low" ? 15 : level === "medium" ? 35 : 60;

  // ─── LiveBackground فقط توی Dark mode ───
  const showLiveBackground =
    isClient &&
    mounted &&
    level !== "low" &&
    resolvedTheme === "dark";

  return (
    <main className="relative min-h-screen bg-theme">
      {showLiveBackground && (
        <div className="pointer-events-none fixed inset-0 z-0">
          <LiveBackground
            color="#6ECB9E"
            particleCount={particleCount}
            quality={level}
          />
        </div>
      )}

      <div className="relative z-10">
        <Header />
        <HeroVideo />
        <AboutSection />
        <CategoryGrid />
        <DiscountProducts />
        <ContactSection />
        <Footer />
      </div>
    </main>
  );
}