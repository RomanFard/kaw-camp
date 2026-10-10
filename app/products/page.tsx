"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGridCard from "@/components/products/ProductGridCard";
import ProductFilterSidebar from "@/components/products/ProductFilterSidebar";
import SortDropdown from "@/components/products/SortDropdown";
import { categories } from "@/data/products";
import { useProducts } from "@/components/context/ProductsContext";
import ScrollToHash from "@/components/ScrollToHash";

const ITEMS_PER_PAGE = 12;
const MAX_PRICE = 50_000_000;

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { products, loading } = useProducts();

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyOnSale, setOnlyOnSale] = useState(false);

  const cat = searchParams.get("cat");
  const sort = searchParams.get("sort") || "popular";

  useEffect(() => {
    if (cat) setSelectedCategories([cat]);
  }, [cat]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedCategories, maxPrice, onlyInStock, onlyOnSale]);

  const filtered = useMemo(() => {
    let result = [...products];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.brand ?? "").toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q)
      );
    }

    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }

    result = result.filter((p) => p.price <= maxPrice);

    if (onlyInStock) result = result.filter((p) => p.inStock);
    if (onlyOnSale) result = result.filter((p) => p.oldPrice);

    if (sort === "cheap") result.sort((a, b) => a.price - b.price);
    else if (sort === "expensive") result.sort((a, b) => b.price - a.price);
    else if (sort === "popular") result.sort((a, b) => b.rating - a.rating);
    else if (sort === "newest")
      result.sort((a, b) => Number(b.id) - Number(a.id));
    else if (sort === "discount")
      result.sort((a, b) => {
        const da = a.oldPrice ? (a.oldPrice - b.price) / a.oldPrice : 0;
        const db = b.oldPrice ? (b.oldPrice - b.price) / b.oldPrice : 0;
        return db - da;
      });

    return result;
  }, [
    products,
    searchQuery,
    selectedCategories,
    maxPrice,
    onlyInStock,
    onlyOnSale,
    sort,
  ]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // 🆕 اسکرول نرم به لیست محصولات
  function scrollToList() {
    let cancelled = false;
    let attempts = 0;

    function tryScroll() {
      if (cancelled) return;

      const el = document.getElementById("products-list");
      if (el) {
        const isMobile = window.innerWidth < 768;
        const offset = isMobile ? 90 : 20;
        const targetY =
          el.getBoundingClientRect().top + window.scrollY - offset;

        // 🆕 اسکرول نرم
        window.scrollTo({
          top: targetY,
          behavior: "smooth",
        });
        return;
      }

      attempts++;
      if (attempts < 20) {
        window.setTimeout(tryScroll, 100);
      }
    }

    // صبر کن تا state آپدیت بشه و محصولات دوباره رندر بشن
    window.setTimeout(tryScroll, 250);
  }

  function handleSortChange(newSort: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", newSort);
    router.push(`/products?${params.toString()}`);
  }

  function handleReset() {
    setSearchQuery("");
    setMaxPrice(MAX_PRICE);
    setSelectedCategories([]);
    setOnlyInStock(false);
    setOnlyOnSale(false);
    router.push("/products");
  }

  // 🆕 toggle category + اسکرول
  function toggleCategory(key: string) {
    setSelectedCategories((prev) =>
      prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]
    );
    scrollToList();
  }

  // 🆕 handlers فیلترها + اسکرول
  function handleMaxPriceChange(v: number) {
    setMaxPrice(v);
    scrollToList();
  }

  function handleOnlyInStockChange(v: boolean) {
    setOnlyInStock(v);
    scrollToList();
  }

  function handleOnlyOnSaleChange(v: boolean) {
    setOnlyOnSale(v);
    scrollToList();
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-theme">
        <Header />
        <div className="mx-auto max-w-[1600px] px-6 py-20 text-center">
          <p className="text-sm text-theme-muted">در حال بارگذاری...</p>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-theme">
      <ScrollToHash />
      <Header />

      <div className="mx-auto max-w-[1600px] px-6 py-8 md:px-12 md:py-12 lg:px-20">
        {/* Top bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-theme-muted md:text-sm">
            نمایش{" "}
            <span className="font-bold text-theme">
              {(startIndex + 1).toLocaleString("fa-IR")}-
              {Math.min(
                startIndex + ITEMS_PER_PAGE,
                filtered.length
              ).toLocaleString("fa-IR")}
            </span>{" "}
            از{" "}
            <span className="font-bold text-theme">
              {filtered.length.toLocaleString("fa-IR")}
            </span>{" "}
            نتیجه
          </p>

          <SortDropdown value={sort} onChange={handleSortChange} />
        </div>

        {/* Layout */}
        <div className="grid gap-6 lg:grid-cols-[280px_1fr] lg:gap-8">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-4 lg:h-fit">
            <ProductFilterSidebar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              categories={categories}
              selectedCategories={selectedCategories}
              onToggleCategory={toggleCategory}
              minPrice={0}
              maxPrice={maxPrice}
              onMinPriceChange={() => {}}
              onMaxPriceChange={handleMaxPriceChange}
              onlyInStock={onlyInStock}
              onOnlyInStockChange={handleOnlyInStockChange}
              onlyOnSale={onlyOnSale}
              onOnlyOnSaleChange={handleOnlyOnSaleChange}
              onReset={handleReset}
            />
          </aside>

          {/* Grid */}
          <div
            id="products-list"
            className="flex min-h-[calc(100vh-300px)] scroll-mt-24 flex-col"
          >
            {paginated.length === 0 ? (
              <div className="rounded-2xl border border-theme bg-theme-card p-12 text-center">
                <p className="text-4xl">🔍</p>
                <p className="mt-3 font-bold text-theme">محصولی یافت نشد</p>
                <button
                  onClick={handleReset}
                  className="mt-4 rounded-lg bg-accent px-5 py-2 text-sm font-bold text-white transition hover:bg-accent-hover"
                >
                  حذف فیلترها
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-4">
                  {paginated.map((product) => (
                    <ProductGridCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-auto flex items-center justify-center gap-2 pt-10">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-theme text-theme-muted transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      ‹
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (p) => (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`h-9 min-w-[36px] rounded-lg border px-3 text-xs font-bold transition ${
                            p === page
                              ? "border-accent bg-accent text-white"
                              : "border-theme text-theme-muted hover:border-accent hover:text-accent"
                          }`}
                        >
                          {p.toLocaleString("fa-IR")}
                        </button>
                      )
                    )}

                    <button
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-theme text-theme-muted transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      ›
                    </button>
                  </div>
                )}
              </>
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
        <main className="min-h-screen bg-theme">
          <Header />
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-sm text-theme-muted">در حال بارگذاری...</div>
          </div>
        </main>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}