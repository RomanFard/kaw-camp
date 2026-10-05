"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductPageClient from "@/components/ProductPageClient";
import { categories } from "@/data/products";
import { useProducts } from "@/components/context/ProductsContext";

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { products, loading } = useProducts();

  // حالت لودینگ
  if (loading) {
    return (
      <main className="min-h-screen bg-[#F7F1E3]">
        <Header />
        <div className="mx-auto max-w-[1600px] px-4 py-6 md:px-6 md:py-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="aspect-square animate-pulse rounded-2xl bg-gray-100" />
            <div className="space-y-4">
              <div className="h-6 w-3/4 animate-pulse rounded bg-gray-100" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-gray-100" />
              <div className="h-10 w-1/3 animate-pulse rounded bg-gray-100" />
              <div className="h-32 animate-pulse rounded bg-gray-100" />
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  const categoryLabel =
    categories.find((c) => c.key === product.category)?.label ||
    product.category;

  return (
       <main className="min-h-screen overflow-x-hidden bg-[#050505]">
      <Header />

          <div className="mx-auto max-w-[1600px] px-6 py-6 md:px-12 md:py-8 lg:px-20">
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