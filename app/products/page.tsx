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
}>;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { cat, sort } = await searchParams;

  let filtered = cat
    ? products.filter((p) => p.category === (cat as Category))
    : [...products];

  // ─── منطق مرتب‌سازی ───
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

      <div className="mx-auto max-w-[1600px] px-4 py-5 md:px-6 md:py-8">
        {/* مسیر ناوبری */}
        <nav className="mb-4 text-xs text-gray-500 md:mb-5 md:text-sm">
          <a href="/" className="hover:text-amber-600">خانه</a>
          <span className="mx-2">/</span>
          <span className="text-gray-800">
            {activeCategory ? activeCategory.label : "تمامی محصولات"}
          </span>
        </nav>

        {/* عنوان */}
        <div className="mb-6 text-center md:mb-8">
          <h1 className="text-2xl font-black text-amber-600 md:text-4xl">
            {activeCategory ? activeCategory.label : "کمپینگ و کوهنوردی"}
          </h1>
        </div>

        {/* گرید اصلی: فیلتر + محصولات */}
        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          {/* فیلتر کنار (راست - دسکتاپ) */}
          <aside className="hidden lg:block">
            <ProductsFilters
              categories={categories}
              activeCategory={cat}
            />
          </aside>

          {/* محصولات (چپ) */}
          <div className="min-w-0">
            {/* نوار بالا: فیلتر موبایل + مرتب‌سازی */}
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              {/* فیلتر موبایل (راست در RTL) */}
              <div className="lg:hidden">
                <ProductsFilters
                  categories={categories}
                  activeCategory={cat}
                />
              </div>

              {/* مرتب‌سازی (چپ در RTL) */}
              <div className="mr-auto">
                <ProductsSort cat={cat} sort={sort} />
              </div>
            </div>

            {/* تعداد محصولات */}
            <div className="mb-3 text-xs text-gray-600 md:text-sm">
              <span className="font-bold text-gray-800">{filtered.length}</span> محصول
            </div>

            {/* گرید محصولات */}
            {filtered.length > 0 ? (
              <div
                id="products-list"
                className="grid scroll-mt-24 grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4"
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