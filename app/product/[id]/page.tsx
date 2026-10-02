import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductPageClient from "@/components/ProductPageClient";
import { getProductById, categories } from "@/data/products";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  const categoryLabel =
    categories.find((c) => c.key === product.category)?.label ||
    product.category;

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F7F1E3]">
      <Header />

      <div className="mx-auto max-w-[1600px] px-4 py-4 md:px-6 md:py-6">
        {/* مسیر ناوبری */}
        <nav className="mb-4 text-xs text-gray-500 md:mb-5 md:text-sm">
          <a href="/" className="hover:text-amber-600">خانه</a>
          <span className="mx-2">/</span>
          <a href="/products" className="hover:text-amber-600">محصولات</a>
          <span className="mx-2">/</span>
          <a
            href={"/products?cat=" + product.category}
            className="hover:text-amber-600"
          >
            {categoryLabel}
          </a>
          <span className="mx-2">/</span>
          <span className="text-gray-800">{product.name}</span>
        </nav>

        {/* محتوای محصول */}
        <ProductPageClient product={product} />
      </div>

      <Footer />
    </main>
  );
}