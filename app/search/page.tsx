"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { categories } from "@/data/products";
import { searchProducts, popularSearches } from "@/lib/search";
import { useProducts } from "@/components/context/ProductsContext";

function SearchContent() {
  const searchParams = useSearchParams();
  const { products, loading } = useProducts();

  const query = (searchParams.get("q") || "").trim();
  const cat = searchParams.get("cat");
  const sort = searchParams.get("sort");

  // ─── جستجو + فیلتر + مرتب‌سازی ───
  const { results, resultProducts, availableCategories } = useMemo(() => {
    let r = query ? searchProducts(query, products) : [];

    // فیلتر دسته
    if (cat) {
      r = r.filter((x) => x.product.category === cat);
    }

    // مرتب‌سازی
    if (sort === "cheap") {
      r.sort((a, b) => a.product.price - b.product.price);
    } else if (sort === "expensive") {
      r.sort((a, b) => b.product.price - a.product.price);
    } else if (sort === "popular") {
      r.sort((a, b) => b.product.rating - a.product.rating);
    }

    const resultProducts = r.map((x) => x.product);
    const availableCategories = Array.from(
      new Set(resultProducts.map((p) => p.category))
    )
      .map((key) => categories.find((c) => c.key === key)!)
      .filter(Boolean);

    return { results: r, resultProducts, availableCategories };
  }, [query, cat, sort, products]);

  const totalResults = results.length;

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F7F1E3]">
      <Header />

      <div className="mx-auto max-w-[1600px] px-4 py-5 md:px-6 md:py-8">
        {/* مسیر ناوبری */}
        <nav className="mb-4 text-xs text-gray-500 md:mb-5 md:text-sm">
          <a href="/" className="hover:text-amber-600">خانه</a>
          <span className="mx-2">/</span>
          <span className="text-gray-800">جستجو</span>
          {query && (
            <>
              <span className="mx-2">/</span>
              <span className="text-amber-600">«{query}»</span>
            </>
          )}
        </nav>

        {/* حالت لودینگ */}
        {loading && (
          <div className="mx-auto max-w-2xl">
            <div className="rounded-2xl border border-[#D4C5A0] bg-white p-12 text-center">
              <p className="text-sm text-gray-500">در حال بارگذاری محصولات...</p>
            </div>
          </div>
        )}

        {/* حالت ۱: بدون query */}
        {!loading && !query && (
          <div className="mx-auto max-w-2xl">
            <div className="rounded-2xl border border-[#D4C5A0] bg-white p-8 text-center md:p-12">
              <p className="text-6xl">🔍</p>
              <p className="mt-5 text-lg font-bold text-gray-800 md:text-xl">
                چی میخوای پیدا کنی؟
              </p>
              <p className="mt-2 text-sm text-gray-500">
                از آیکون جستجو توی هدر استفاده کن یا از پیشنهادات زیر انتخاب کن
              </p>

              <div className="mt-6">
                <p className="mb-3 text-xs font-bold text-gray-500">
                  🔥 جستجوهای محبوب
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {popularSearches.map((term) => (
                    <a
                      key={term}
                      href={"/search?q=" + encodeURIComponent(term)}
                      className="rounded-full border border-[#D4C5A0] bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition hover:border-amber-500 hover:bg-amber-50 hover:text-amber-600 md:text-sm"
                    >
                      {term}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* حالت ۲: query داریم ولی نتیجه‌ای نیست */}
        {!loading && query && totalResults === 0 && (
          <div className="mx-auto max-w-2xl">
            <div className="rounded-2xl border border-[#D4C5A0] bg-white p-8 text-center md:p-12">
              <p className="text-6xl">😔</p>
              <p className="mt-5 text-lg font-bold text-gray-800 md:text-xl">
                نتیجه‌ای برای «{query}» پیدا نشد
              </p>
              <p className="mt-2 text-sm text-gray-500">
                املای کلمه رو چک کن یا کلمه دیگه‌ای امتحان کن
              </p>

              <div className="mt-6">
                <p className="mb-3 text-xs font-bold text-gray-500">
                  💡 اینا رو امتحان کن
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {popularSearches.slice(0, 6).map((term) => (
                    <a
                      key={term}
                      href={"/search?q=" + encodeURIComponent(term)}
                      className="rounded-full border border-[#D4C5A0] bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition hover:border-amber-500 hover:bg-amber-50 hover:text-amber-600 md:text-sm"
                    >
                      {term}
                    </a>
                  ))}
                </div>
              </div>

              <a
                href="/products"
                className="mt-6 inline-block rounded-lg bg-amber-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-amber-600"
              >
                مشاهده همه محصولات
              </a>
            </div>
          </div>
        )}

        {/* حالت ۳: نتیجه داریم */}
        {!loading && query && totalResults > 0 && (
          <>
            {/* هدر نتایج */}
            <div className="mb-5 rounded-xl border border-[#D4C5A0] bg-white px-4 py-4 md:px-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm text-gray-600 md:text-base">
                  <span className="font-bold text-gray-800">
                    {totalResults.toLocaleString("fa-IR")}
                  </span>{" "}
                  نتیجه برای «
                  <span className="font-bold text-amber-600">{query}</span>»
                </div>

                <div className="flex items-center gap-2 text-xs md:text-sm">
                  <span className="text-gray-500">مرتب‌سازی:</span>
                  <a
                    href={
                      "/search?q=" +
                      encodeURIComponent(query) +
                      (cat ? "&cat=" + cat : "") +
                      "&sort=popular"
                    }
                    className={
                      "rounded px-3 py-1.5 transition " +
                      (sort === "popular" || !sort
                        ? "bg-amber-500 text-white"
                        : "text-gray-700 hover:bg-gray-100")
                    }
                  >
                    محبوب‌ترین
                  </a>
                  <a
                    href={
                      "/search?q=" +
                      encodeURIComponent(query) +
                      (cat ? "&cat=" + cat : "") +
                      "&sort=cheap"
                    }
                    className={
                      "rounded px-3 py-1.5 transition " +
                      (sort === "cheap"
                        ? "bg-amber-500 text-white"
                        : "text-gray-700 hover:bg-gray-100")
                    }
                  >
                    ارزان‌ترین
                  </a>
                  <a
                    href={
                      "/search?q=" +
                      encodeURIComponent(query) +
                      (cat ? "&cat=" + cat : "") +
                      "&sort=expensive"
                    }
                    className={
                      "rounded px-3 py-1.5 transition " +
                      (sort === "expensive"
                        ? "bg-amber-500 text-white"
                        : "text-gray-700 hover:bg-gray-100")
                    }
                  >
                    گران‌ترین
                  </a>
                </div>
              </div>

              {availableCategories.length > 1 && (
                <div className="mt-3 flex flex-wrap gap-2 border-t border-[#EDE4CE] pt-3">
                  <a
                    href={"/search?q=" + encodeURIComponent(query)}
                    className={
                      "rounded-full px-3 py-1 text-xs font-semibold transition " +
                      (!cat
                        ? "bg-amber-500 text-white"
                        : "border border-[#D4C5A0] bg-white text-gray-700 hover:border-amber-500")
                    }
                  >
                    همه ({totalResults.toLocaleString("fa-IR")})
                  </a>
                  {availableCategories.map((c) => {
                    const count = resultProducts.filter(
                      (p) => p.category === c.key
                    ).length;
                    return (
                      <a
                        key={c.key}
                        href={
                          "/search?q=" +
                          encodeURIComponent(query) +
                          "&cat=" +
                          c.key
                        }
                        className={
                          "rounded-full px-3 py-1 text-xs font-semibold transition " +
                          (cat === c.key
                            ? "bg-amber-500 text-white"
                            : "border border-[#D4C5A0] bg-white text-gray-700 hover:border-amber-500")
                        }
                      >
                        {c.label} ({count.toLocaleString("fa-IR")})
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
              {resultProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            <div className="mt-8 rounded-xl border border-[#D4C5A0] bg-white p-5 md:p-6">
              <p className="mb-3 text-sm font-bold text-gray-800 md:text-base">
                🔎 جستجوهای مرتبط
              </p>
              <div className="flex flex-wrap gap-2">
                {popularSearches
                  .filter((term) => term !== query)
                  .slice(0, 6)
                  .map((term) => (
                    <a
                      key={term}
                      href={"/search?q=" + encodeURIComponent(term)}
                      className="rounded-full border border-[#D4C5A0] bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition hover:border-amber-500 hover:bg-amber-50 hover:text-amber-600 md:text-sm"
                    >
                      {term}
                    </a>
                  ))}
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </main>
  );
}

export default function SearchPage() {
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
      <SearchContent />
    </Suspense>
  );
}