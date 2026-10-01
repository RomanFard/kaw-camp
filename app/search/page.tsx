import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { products, categories } from "@/data/products";
import { searchProducts, popularSearches } from "@/lib/search";

type SearchParams = Promise<{ q?: string; cat?: string; sort?: string }>;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { q, cat, sort } = await searchParams;
  const query = (q || "").trim();

  // جستجوی هوشمند
  let results = query ? searchProducts(query, products) : [];

  // فیلتر بر اساس دسته (اگه انتخاب شده)
  if (cat) {
    results = results.filter((r) => r.product.category === cat);
  }

  // مرتب‌سازی
  if (sort === "cheap") {
    results.sort((a, b) => a.product.price - b.product.price);
  } else if (sort === "expensive") {
    results.sort((a, b) => b.product.price - a.product.price);
  } else if (sort === "popular") {
    results.sort((a, b) => b.product.rating - a.product.rating);
  }

  const totalResults = results.length;
  const resultProducts = results.map((r) => r.product);

  // دسته‌های موجود در نتایج
  const availableCategories = Array.from(
    new Set(resultProducts.map((p) => p.category))
  ).map((key) => categories.find((c) => c.key === key)!);

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

        {/* حالت ۱: بدون query */}
        {!query && (
          <div className="mx-auto max-w-2xl">
            <div className="rounded-2xl border border-[#E8DFC8] bg-white p-8 text-center md:p-12">
              <p className="text-6xl">🔍</p>
              <p className="mt-5 text-lg font-bold text-gray-800 md:text-xl">
                چی میخوای پیدا کنی؟
              </p>
              <p className="mt-2 text-sm text-gray-500">
                از آیکون جستجو توی هدر استفاده کن یا از پیشنهادات زیر انتخاب کن
              </p>

              {/* جستجوهای محبوب */}
              <div className="mt-6">
                <p className="mb-3 text-xs font-bold text-gray-500">
                  🔥 جستجوهای محبوب
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {popularSearches.map((term) => (
                    <a
                      key={term}
                      href={"/search?q=" + encodeURIComponent(term)}
                      className="rounded-full border border-[#E8DFC8] bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition hover:border-amber-500 hover:bg-amber-50 hover:text-amber-600 md:text-sm"
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
        {query && totalResults === 0 && (
          <div className="mx-auto max-w-2xl">
            <div className="rounded-2xl border border-[#E8DFC8] bg-white p-8 text-center md:p-12">
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
                      className="rounded-full border border-[#E8DFC8] bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition hover:border-amber-500 hover:bg-amber-50 hover:text-amber-600 md:text-sm"
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
        {query && totalResults > 0 && (
          <>
            {/* هدر نتایج */}
            <div className="mb-5 rounded-xl border border-[#E8DFC8] bg-white px-4 py-4 md:px-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm text-gray-600 md:text-base">
                  <span className="font-bold text-gray-800">
                    {totalResults}
                  </span>{" "}
                  نتیجه برای «
                  <span className="font-bold text-amber-600">{query}</span>»
                </div>

                {/* مرتب‌سازی */}
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

              {/* فیلتر دسته‌بندی */}
              {availableCategories.length > 1 && (
                <div className="mt-3 flex flex-wrap gap-2 border-t border-[#EDE4CE] pt-3">
                  <a
                    href={"/search?q=" + encodeURIComponent(query)}
                    className={
                      "rounded-full px-3 py-1 text-xs font-semibold transition " +
                      (!cat
                        ? "bg-amber-500 text-white"
                        : "border border-[#E8DFC8] bg-white text-gray-700 hover:border-amber-500")
                    }
                  >
                    همه ({totalResults})
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
                            : "border border-[#E8DFC8] bg-white text-gray-700 hover:border-amber-500")
                        }
                      >
                        {c.label} ({count})
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            {/* گرید نتایج */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
              {resultProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            {/* پیشنهاد جستجوهای مرتبط */}
            <div className="mt-8 rounded-xl border border-[#E8DFC8] bg-white p-5 md:p-6">
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
                      className="rounded-full border border-[#E8DFC8] bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition hover:border-amber-500 hover:bg-amber-50 hover:text-amber-600 md:text-sm"
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