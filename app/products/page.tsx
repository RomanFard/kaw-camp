import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ScrollToHash from "@/components/ScrollToHash";
import { products, categories, Category } from "@/data/products";

type SearchParams = Promise<{ cat?: string; sort?: string }>;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { cat, sort } = await searchParams;

  let filtered = cat
    ? products.filter((p) => p.category === (cat as Category))
    : [...products];

  if (sort === "cheap") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === "expensive") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sort === "popular") {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  const activeCategory = categories.find((c) => c.key === cat);

  return (
    <main className="min-h-screen bg-[#F7F1E3]">
      <Suspense fallback={null}>
        <ScrollToHash />
      </Suspense>

      <Header />

      <div className="mx-auto max-w-[1600px] px-6 py-8">
        {/* مسیر ناوبری */}
        <nav className="mb-6 text-sm text-gray-500">
          <a href="/" className="hover:text-amber-600">خانه</a>
          <span className="mx-2">/</span>
          <span className="text-gray-800">
            {activeCategory ? activeCategory.label : "تمامی محصولات"}
          </span>
        </nav>

        <div className="grid gap-6 md:grid-cols-[260px_1fr]">
          {/* سایدبار */}
          <aside className="min-w-0 space-y-6 rounded-xl border border-[#E8DFC8] bg-white p-5">
            <div>
              <div className="mb-3 border-b border-[#EDE4CE] pb-3 text-base font-bold text-gray-900">
                لوازم کمپینگ و کوهنوردی
              </div>
              <ul className="space-y-1">
                <li>
                  <a
                    href="/products"
                    className={
                      !cat
                        ? "block rounded px-3 py-2.5 text-base font-semibold text-amber-600 bg-amber-50"
                        : "block rounded px-3 py-2.5 text-base font-semibold text-gray-700 hover:bg-amber-50 hover:text-amber-600"
                    }
                  >
                    همه محصولات
                  </a>
                </li>
                {categories.map((c) => (
                  <li key={c.key}>
                    <a
                      href={"/products?cat=" + c.key}
                      className={
                        cat === c.key
                          ? "block rounded px-3 py-2.5 text-base font-semibold text-amber-600 bg-amber-50"
                          : "block rounded px-3 py-2.5 text-base font-semibold text-gray-700 hover:bg-amber-50 hover:text-amber-600"
                      }
                    >
                      {c.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
{/* محتوا */}
<div id="products-list" className="min-w-0 scroll-mt-24">
            {/* نوار مرتب‌سازی */}
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E8DFC8] bg-white px-5 py-3">
              <div className="text-sm text-gray-600">
                <span className="font-bold text-gray-800">{filtered.length}</span> محصول
              </div>

              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">مرتب‌سازی:</span>
                <a
                  href={"/products?" + (cat ? "cat=" + cat + "&" : "") + "sort=popular"}
                  className={
                    sort === "popular" || !sort
                      ? "rounded px-3 py-1.5 bg-amber-500 text-white"
                      : "rounded px-3 py-1.5 text-gray-700 hover:bg-gray-100"
                  }
                >
                  محبوب‌ترین
                </a>
                <a
                  href={"/products?" + (cat ? "cat=" + cat + "&" : "") + "sort=cheap"}
                  className={
                    sort === "cheap"
                      ? "rounded px-3 py-1.5 bg-amber-500 text-white"
                      : "rounded px-3 py-1.5 text-gray-700 hover:bg-gray-100"
                  }
                >
                  ارزان‌ترین
                </a>
                <a
                  href={"/products?" + (cat ? "cat=" + cat + "&" : "") + "sort=expensive"}
                  className={
                    sort === "expensive"
                      ? "rounded px-3 py-1.5 bg-amber-500 text-white"
                      : "rounded px-3 py-1.5 text-gray-700 hover:bg-gray-100"
                  }
                >
                  گران‌ترین
                </a>
              </div>
            </div>

            {/* گرید محصولات */}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-[#E8DFC8] bg-white p-12 text-center">
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