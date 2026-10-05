import Header from "@/components/Header";
import HeroVideo from "@/components/HeroVideo";
import AboutSection from "@/components/AboutSection";
import BrandCarousel from "@/components/BrandCarousel";
import CategoryGrid from "@/components/CategoryGrid";
import DiscountProducts from "@/components/DiscountProducts";
import DiscountBanner from "@/components/DiscountBanner";
import Footer from "@/components/Footer";
import LiveBackground from "@/components/LiveBackground";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-black">
      <div className="pointer-events-none fixed inset-0 z-0">
        <LiveBackground color="#F59E0B" particleCount={60} />
      </div>

      <div className="relative z-10">
        <Header />

        {/* بنر تمام صفحه */}
        <HeroVideo />

        <AboutSection />
        <BrandCarousel />
        <CategoryGrid />
        <DiscountProducts />
        <DiscountBanner />

        <Footer />
      </div>
    </main>
  );
}