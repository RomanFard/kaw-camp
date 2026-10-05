"use client";

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
  const { mounted } = useDevicePerformance();

  const particleCount = 60;
  const quality = "high" as const;

  return (
    <main className="relative min-h-screen bg-[#050505]">
      {mounted && (
        <div className="pointer-events-none fixed inset-0 z-0">
          <LiveBackground
            color="#6ECB9E"
            particleCount={particleCount}
            quality="high"
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
