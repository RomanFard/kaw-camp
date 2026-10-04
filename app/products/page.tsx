"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ProductsFilters from "@/components/ProductsFilters";
import ProductsSort from "@/components/ProductsSort";
import { categories, type Category } from "@/data/products";
import { useProducts } from "@/components/context/ProductsContext";
import ScrollToHash from "@/components/ScrollToHash";

function ProductsContent() {
  const searchParams = useSearchParams();
  const { products, loading } = useProducts();

  const cat = searchParams.get("cat");
  const sort = searchParams.get("sort");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const inStock = searchParams.get("inStock");
  const onSale = searchParams.get("onSale");

  // ─── فیلتر + مرتب‌سازی (useMemo برای performance) ───
  const filtered = useMemo(() => {
    let result = cat
      ? products.filter((p) => p.category === (cat as Category))
      : [...products];

    // فیلتر قیمت
    if (minPrice) {
      result = result.filter((p) => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      result = result.filter((p) => p.price <= Number(maxPrice));
    }

    // فیلتر موجودی
    if (inStock === "1") {
      result = result.filter((p) => p.inStock);
    }

    // فیلتر تخفیف
    if (onSale === "1") {
      result = result.filter((p) => p.oldPrice);
    }

    // مرتب‌سازی
    if (sort === "cheap") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "expensive") {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === "popular") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sort === "newest") {
      result.sort((a, b) => Number(b.id) - Number(a.id));
    } else if (sort === "discount") {
      result.sort((a, b) => {
        const da = a.oldPrice ? (a.oldPrice - a.price) / a.oldPrice : 0;
        const db = b.oldPrice ? (b.oldPrice - b.price) / b.oldPrice : 0;
        return db - da;
      });
    }

    return result;
  }, [products, cat, sort, minPrice, maxPrice, inStock, onSale]);

  const activeCategory = categories.find((c) => c.key === cat);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F7F1E3]">
      <ScrollToHash />
      <Header />

      <div className="mx-auto max-w-[1600px] px-3 py-4 md:px-6 md:py-6">
        {/* مسیر ناوبری */}
        <nav className="mb-4 text-xs text-gray-500 md:text-sm">
          <a href="/" className="hover:text-amber-600">خانه</a>
          <span className="mx-2">/</span>
          <span className="text-gray-800">
            {activeCategory ? activeCategory.label : "تمامی محصولات"}
          </span>
        </nav>

        {/* عنوان */}
        <div className="mb-4 text-center md:mb-6">
          <h1 className="text-2xl font-black text-amber-600 md:text-4xl">
            {activeCategory ? activeCategory.label : "کمپینگ و کوهنوردی"}
          </h1>
        </div>

        {/* نوار مرتب‌سازی + تعداد */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="text-xs text-gray-600 md:text-sm">
              {loading ? (
                <span className="text-gray-400">در حال بارگذاری...</span>
              ) : (
                <>
                  <span className="font-bold text-gray-800">
                    {filtered.length.toLocaleString("fa-IR")}
                  </span>{" "}
                  محصول
                </>
              )}
            </div>

            {/* دکمه فیلتر موبایل */}
            <div className="lg:hidden">
              <ProductsFilters
                categories={categories}
                activeCategory={cat ?? undefined}
              />
            </div>
          </div>

          <ProductsSort cat={cat ?? undefined} sort={sort ?? undefined} />
        </div>

        {/* گرید اصلی */}
        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          {/* فیلتر کنار */}
          <aside className="hidden lg:block">
            <div className="sticky top-4">
              <ProductsFilters
                categories={categories}
                activeCategory={cat ?? undefined}
              />
            </div>
          </aside>

          {/* محصولات */}
          <div className="min-w-0">
            {loading ? (
              <div
                id="products-list"
                className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5"
              >
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-72 animate-pulse rounded-2xl bg-gray-100"
                  />
                ))}
              </div>
            ) : filtered.length > 0 ? (
              <div
                id="products-list"
                className="grid scroll-mt-24 grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5"
              >
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-[#E8DFC8] bg-white p-12 text-center">
                <p className="text-4xl">🔍</p>
                <p className="mt-3 font-bold text-gray-800">محصولی یافت نشد</p>
                <a
                  href="/products"
                  className="mt-3 inline-block text-sm text-amber-600 hover:underline"
                >
                  مشاهده همه محصولات
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#F7F1E3]">
          <Header />
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-sm text-gray-500">در حال بارگذاری...</div>
          </div>
        </main>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}