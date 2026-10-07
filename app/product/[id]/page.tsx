"use client";

import { use } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductPageClient from "@/components/ProductPageClient";
import { useProducts } from "@/components/context/ProductsContext";

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { products, loading } = useProducts();

  const product = products.find((p) => p.id === id);

  if (loading) {
    return (
      <main className="min-h-screen bg-theme">
        <Header />
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <p className="text-theme-muted">در حال بارگذاری...</p>
        </div>
        <Footer />
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-theme">
        <Header />
        <div className="mx-auto max-w-2xl px-6 py-20 text-center">
          <h1 className="text-2xl font-black text-theme">محصول یافت نشد</h1>
          <p className="mt-4 text-theme-muted">
            محصولی با شناسه {id} در فروشگاه موجود نیست.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-block rounded-lg bg-[#E84C4C] px-6 py-3 font-bold text-white transition hover:bg-[#D63F3F]"
          >
            بازگشت به محصولات
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-theme">
      <Header />

      <div className="mx-auto max-w-7xl px-6 py-6 md:px-8 md:py-10">
        <nav className="mb-5 text-sm text-theme-muted">
          <Link href="/" className="transition hover:text-[#E84C4C]">
            خانه
          </Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="transition hover:text-[#E84C4C]">
            محصولات
          </Link>
          <span className="mx-2">/</span>
          <span className="text-theme">{product.name}</span>
        </nav>

        <ProductPageClient product={product} />
      </div>

      <Footer />
    </main>
  );
}