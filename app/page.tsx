import Header from "@/components/Header";
import HeroVideo from "@/components/HeroVideo";
import AboutSection from "@/components/AboutSection";
import BrandCarousel from "@/components/BrandCarousel";
import CategoryGrid from "@/components/CategoryGrid";
import DiscountProducts from "@/components/DiscountProducts";
import DiscountBanner from "@/components/DiscountBanner";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import LiveBackground from "@/components/LiveBackground";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-black">
      <div className="pointer-events-none fixed inset-0 z-0">
        <LiveBackground color="#E89070" particleCount={60} />
      </div>

      <div className="relative z-10">
        <Header />
        <HeroVideo />
        <AboutSection />
        <BrandCarousel />
        <CategoryGrid />
        <DiscountProducts />
        <DiscountBanner />
        <ContactSection />
        <Footer />
      </div>
    </main>
  );
}