import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ProductsFilters from "@/components/ProductsFilters";
import ProductsSort from "@/components/ProductsSort";
import { products, categories, Category } from "@/data/products";
import { Suspense } from "react";
import ScrollToHash from "@/components/ScrollToHash";

type SearchParams = Promise<{
  cat?: string;
  sort?: string;
  minPrice?: string;
  maxPrice?: string;
  inStock?: string;
  onSale?: string;
}>;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { cat, sort, minPrice, maxPrice, inStock, onSale } = await searchParams;

  let filtered = cat
    ? products.filter((p) => p.category === (cat as Category))
    : [...products];

  // ─── فیلتر قیمت ───
  if (minPrice) {
    filtered = filtered.filter((p) => p.price >= Number(minPrice));
  }
  if (maxPrice) {
    filtered = filtered.filter((p) => p.price <= Number(maxPrice));
  }

  // ─── فیلتر موجودی ───
  if (inStock === "1") {
    filtered = filtered.filter((p) => p.inStock);
  }

  // ─── فیلتر تخفیف ───
  if (onSale === "1") {
    filtered = filtered.filter((p) => p.oldPrice);
  }

  // ─── مرتب‌سازی ───
  if (sort === "cheap") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === "expensive") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sort === "popular") {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (sort === "newest") {
    filtered.sort((a, b) => Number(b.id) - Number(a.id));
  } else if (sort === "discount") {
    filtered.sort((a, b) => {
      const da = a.oldPrice ? (a.oldPrice - a.price) / a.oldPrice : 0;
      const db = b.oldPrice ? (b.oldPrice - b.price) / b.oldPrice : 0;
      return db - da;
    });
  }

  const activeCategory = categories.find((c) => c.key === cat);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F7F1E3]">
      <Suspense fallback={null}>
        <ScrollToHash />
      </Suspense>

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

        {/* ═══ نوار مرتب‌سازی + تعداد (تمام‌عرض) ═══ */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="text-xs text-gray-600 md:text-sm">
              <span className="font-bold text-gray-800">{filtered.length}</span>{" "}
              محصول
            </div>

            {/* دکمه فیلتر موبایل */}
            <div className="lg:hidden">
              <ProductsFilters
                categories={categories}
                activeCategory={cat}
              />
            </div>
          </div>

          <ProductsSort cat={cat} sort={sort} />
        </div>

        {/* ═══ گرید اصلی: فیلتر راست + محصولات چپ ═══ */}
        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          {/* فیلتر کنار (راست در RTL) */}
          <aside className="hidden lg:block">
            <div className="sticky top-4">
              <ProductsFilters
                categories={categories}
                activeCategory={cat}
              />
            </div>
          </aside>

          {/* محصولات (چپ در RTL) */}
          <div className="min-w-0">
            {filtered.length > 0 ? (
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
                <p className="mt-3 font-bold text-gray-800">
                  محصولی یافت نشد
                </p>
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