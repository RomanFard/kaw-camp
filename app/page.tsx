"use client";

import Header from "@/components/Header";
import HeroVideo from "@/components/HeroVideo";
import AboutSection from "@/components/AboutSection";
import BrandCarousel from "@/components/BrandCarousel";
import CategoryGrid from "@/components/CategoryGrid";
import DiscountProducts from "@/components/DiscountProducts";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import LiveBackground from "@/components/LiveBackground";
import { useDevicePerformance } from "@/hooks/useDevicePerformance";

export default function Home() {
  const { level, mounted } = useDevicePerformance();

  const particleCount =
    level === "low" ? 15 : level === "medium" ? 35 : 60;

  return (
    <main className="relative min-h-screen bg-[#050505]">
      {mounted && level !== "low" && (
        <div className="pointer-events-none fixed inset-0 z-0">
          <LiveBackground
            color="#E89070"
            particleCount={particleCount}
            quality={level}
          />
        </div>
      )}

      <div className="relative z-10">
        <Header />
        <HeroVideo />
        <AboutSection />
        <BrandCarousel />
        <CategoryGrid />
        <DiscountProducts />
        <ContactSection />
        <Footer />
      </div>
    </main>
  );
}