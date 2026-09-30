import Header from "@/components/Header";
import HeroSlider from "@/components/HeroSlider";
import CategoryGrid from "@/components/CategoryGrid";
import ProductGrid from "@/components/ProductGrid";
import DiscountBanner from "@/components/DiscountBanner";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F7F1E3]">
      <Header />
      <HeroSlider />
      <CategoryGrid />
      <ProductGrid />
      <DiscountBanner />
      <Footer />
    </main>
  );
}