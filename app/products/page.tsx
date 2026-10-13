"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGridCard from "@/components/products/ProductGridCard";
import { categories } from "@/data/products";
import { useProducts } from "@/components/context/ProductsContext";
import ScrollToHash from "@/components/ScrollToHash";

const ITEMS_PER_PAGE = 24;
const FALLBACK_MAX_PRICE = 2_000_000_000;

const SPEC_FILTER_MAP: Record<string, string[]> = {
  capacity: ["ظرفیت", "تعداد نفرات", "ظرفیت خواب", "ظرفیت نشستن"],
  weight: ["وزن"],
  material: ["جنس", "جنس بدنه", "پارچه"],
  warranty: ["گارانتی"],
};

const SORT_OPTIONS = [
  { key: "cheap", label: "قیمت: کم به زیاد" },
  { key: "expensive", label: "قیمت: زیاد به کم" },
  { key: "popular", label: "مرتبط‌ترین" },
  { key: "newest", label: "جدیدترین" },
];

function normalizeDigits(s: string): string {
  const persian = "۰۱۲۳۴۵۶۷۸۹";
  const arabic = "٠١٢٣٤٥٦٧٨٩";
  return s.replace(/[۰-۹٠-٩]/g, (d) => {
    const pi = persian.indexOf(d);
    if (pi !== -1) return String(pi);
    const ai = arabic.indexOf(d);
    if (ai !== -1) return String(ai);
    return d;
  });
}

function extractNumbers(s: string): number[] {
  const normalized = normalizeDigits(s);
  const matches = normalized.match(/\d+/g) || [];
  return matches.map(Number);
}

function matchesSpecValue(productValue: string, targetValue: string): boolean {
  const productNums = extractNumbers(productValue);
  const targetNums = extractNumbers(targetValue);

  if (productNums.length === 0 || targetNums.length === 0) {
    return normalizeDigits(productValue)
      .toLowerCase()
      .includes(normalizeDigits(targetValue).toLowerCase());
  }
  if (targetNums.length === 1) return productNums.includes(targetNums[0]);

  const min = Math.min(...targetNums);
  const max = Math.max(...targetNums);
  return productNums.some((n) => n >= min && n <= max);
}

function getPageMeta(params: {
  sort: string;
  cat: string | null;
  brand: string | null;
}) {
  const { sort, cat, brand } = params;

  if (brand) {
    return {
      breadcrumb: ["خانه", "برندها"],
      title: brand,
      description: `همهٔ محصولات برند ${brand} در دسترس`,
    };
  }
  if (cat) {
    const catLabel = categories.find((c) => c.key === cat)?.label || cat;
    return {
      breadcrumb: ["خانه", "دسته‌بندی‌ها"],
      title: catLabel,
      description: `همهٔ محصولات دستهٔ ${catLabel}`,
    };
  }
  if (sort === "newest") {
    return {
      breadcrumb: ["خانه", "محصولات"],
      title: "تازه‌های رسیده",
      description: "محصولات تازه، دلیل‌های تازه برای رفتن به کوه. خوش آمدید.",
    };
  }
  if (sort === "discount") {
    return {
      breadcrumb: ["خانه", "محصولات"],
      title: "تخفیف‌های ویژه",
      description: "محصولات با بهترین قیمت و بیشترین تخفیف",
    };
  }
  return {
    breadcrumb: ["خانه", "محصولات"],
    title: "همهٔ محصولات",
    description: "همهٔ محصولات کاو کمپ",
  };
}

function Accordion({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-black/10 dark:border-white/10">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-5 text-[14px] font-semibold text-theme"
      >
        <span>{title}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && <div className="pb-5">{children}</div>}
    </div>
  );
}

function CheckRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 py-2 text-[14px] text-theme-muted hover:text-theme">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-black dark:accent-white"
      />
      {label}
    </label>
  );
}

function SortIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18M6 12h12M10 18h4" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 6h16M7 12h10M10 18h4" />
    </svg>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { products, loading } = useProducts();

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState(FALLBACK_MAX_PRICE);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyOnSale, setOnlyOnSale] = useState(false);

  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [sortSheetOpen, setSortSheetOpen] = useState(false);

  const cat = searchParams.get("cat");
  const sort = searchParams.get("sort") || "popular";
  const brandParam = searchParams.get("brand");

  const activeSpecFilters = useMemo(() => {
    const filters: Record<string, string> = {};
    Object.keys(SPEC_FILTER_MAP).forEach((key) => {
      const value = searchParams.get(key);
      if (value) filters[key] = value;
    });
    return filters;
  }, [searchParams]);

  const priceCeiling = useMemo(() => {
    if (products.length === 0) return FALLBACK_MAX_PRICE;
    const highest = Math.max(...products.map((p) => p.price));
    const magnitude = Math.pow(10, Math.floor(Math.log10(highest)));
    return Math.ceil(highest / magnitude) * magnitude;
  }, [products]);

  useEffect(() => {
    if (products.length > 0) setMaxPrice(priceCeiling);
  }, [priceCeiling, products.length]);

  useEffect(() => {
    if (cat) setSelectedCategories([cat]);
  }, [cat]);

  useEffect(() => {
    setPage(1);
  }, [
    searchQuery,
    selectedCategories,
    maxPrice,
    onlyInStock,
    onlyOnSale,
    brandParam,
    activeSpecFilters,
    sort,
  ]);

  useEffect(() => {
    if (filterDrawerOpen || sortSheetOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [filterDrawerOpen, sortSheetOpen]);

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
    if (brandParam) {
      const target = brandParam.toLowerCase();
      result = result.filter((p) => (p.brand ?? "").toLowerCase() === target);
    }
    Object.entries(activeSpecFilters).forEach(([key, value]) => {
      const labels = SPEC_FILTER_MAP[key];
      if (!labels) return;
      result = result.filter((p) =>
        (p.specs ?? []).some(
          (spec) =>
            labels.includes(spec.label.trim()) &&
            matchesSpecValue(spec.value, value)
        )
      );
    });

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
        const da = a.oldPrice ? (a.oldPrice - a.price) / a.oldPrice : 0;
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
    brandParam,
    activeSpecFilters,
  ]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const meta = getPageMeta({ sort, cat, brand: brandParam });

  const collectionCards = useMemo(() => {
    return categories.slice(0, 5).map((c) => {
      const sample: any = products.find((p) => p.category === c.key);
      const img: string | undefined = sample?.image ?? sample?.images?.[0];
      return { key: c.key, label: c.label, img };
    });
  }, [products]);

  const topInCategory = useMemo(() => {
    return filtered.slice(0, 3);
  }, [filtered]);

  function setSortParam(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`/products?${params.toString()}`, { scroll: false });
    setSortSheetOpen(false);
  }

  function handleReset() {
    setSearchQuery("");
    setMaxPrice(priceCeiling);
    setSelectedCategories([]);
    setOnlyInStock(false);
    setOnlyOnSale(false);
    router.push("/products");
  }

  function toggleCategory(key: string) {
    setSelectedCategories((prev) =>
      prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]
    );
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
      
      <Header />

      {/* ───── هدر صفحه ───── */}
      <div className="w-full px-4 pt-4 sm:px-6 md:px-10 md:pt-10">
        <nav className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold text-theme-muted md:text-[12px]">
          {meta.breadcrumb.map((item, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <span className="opacity-50">/</span>}
              {i === 0 ? (
                <Link href="/" className="transition hover:text-theme">
                  {item}
                </Link>
              ) : (
                <span>{item}</span>
              )}
            </span>
          ))}
        </nav>

        <h1 className="text-3xl font-black uppercase leading-none tracking-tight text-theme md:text-6xl">
          {meta.title}
        </h1>

        <p className="mt-2 text-[11px] text-theme-muted md:mt-3 md:text-[12px]">
          {filtered.length.toLocaleString("fa-IR")} محصول
        </p>

        <p className="mt-3 max-w-2xl text-[12px] font-medium leading-5 text-theme md:mt-4 md:text-[14px] md:leading-6">
          {meta.description}
        </p>
      </div>

      {/* ═══════════════════════════════════════════
          Layout اصلی — دسکتاپ دو ستونی
          ═══════════════════════════════════════════ */}
      <div className="w-full px-4 pb-6 pt-6 sm:px-6 md:px-10 md:pb-14 md:pt-8">
        <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-8">
          {/* ─── سایدبار فیلتر (دسکتاپ) ─── */}
          <aside className="hidden self-start lg:sticky lg:top-6 lg:block lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto lg:pe-2 [scrollbar-width:thin]">
            <div className="mb-6 flex items-end justify-between">
              <h2 className="text-xl font-black uppercase tracking-tight text-theme">
                فیلتر و مرتب‌سازی
              </h2>
              <button
                type="button"
                onClick={handleReset}
                className="text-[12px] font-semibold text-theme underline underline-offset-4"
              >
                پاک کردن همه
              </button>
            </div>

            <Accordion title="مرتب‌سازی" defaultOpen>
              <div className="space-y-4 pt-1">
                {SORT_OPTIONS.map((o) => (
                  <label
                    key={o.key}
                    className="flex cursor-pointer items-center gap-3 text-[14px] text-theme-muted hover:text-theme"
                  >
                    <input
                      type="radio"
                      name="sort"
                      checked={sort === o.key}
                      onChange={() => setSortParam(o.key)}
                      className="h-5 w-5 accent-black dark:accent-white"
                    />
                    {o.label}
                  </label>
                ))}
              </div>
            </Accordion>

            <Accordion title="دسته‌بندی">
              {categories.map((c) => (
                <CheckRow
                  key={c.key}
                  label={c.label}
                  checked={selectedCategories.includes(c.key)}
                  onChange={() => toggleCategory(c.key)}
                />
              ))}
            </Accordion>

            <Accordion title="قیمت">
              <input
                type="range"
                min={0}
                max={priceCeiling}
                step={Math.max(1, Math.round(priceCeiling / 100))}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-black dark:accent-white"
              />
              <p className="mt-2 text-[12px] text-theme-muted">
                تا {maxPrice.toLocaleString("fa-IR")} تومان
              </p>
            </Accordion>

            <Accordion title="ویژگی‌ها">
              <CheckRow
                label="فقط کالاهای موجود"
                checked={onlyInStock}
                onChange={() => setOnlyInStock((v) => !v)}
              />
              <CheckRow
                label="فقط کالاهای تخفیف‌دار"
                checked={onlyOnSale}
                onChange={() => setOnlyOnSale((v) => !v)}
              />
            </Accordion>

            <Accordion title="جستجو">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="نام محصول یا برند"
                className="w-full border border-black/15 bg-transparent px-3 py-2 text-[13px] text-theme outline-none focus:border-black dark:border-white/15 dark:focus:border-white"
              />
            </Accordion>
            <div className="border-t border-black/10 dark:border-white/10" />
          </aside>

          {/* ─── ستون محتوا ─── */}
          <div className="min-w-0">
            {/* ─── کارت‌های کالکشن ─── */}
            <div className="mb-6 md:mb-8">
              <div className="flex gap-1.5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-5 md:gap-1.5 md:overflow-visible md:pb-0">
                {collectionCards.map((c) => (
                  <Link
                    key={c.key}
                    href={`/products?cat=${c.key}`}
                    className="group w-[40%] flex-shrink-0 border border-black/10 bg-theme-surface sm:w-[30%] dark:border-white/10 md:w-auto"
                  >
                    <div className="relative aspect-square overflow-hidden bg-black/5 dark:bg-white/5">
                      <span className="absolute right-1.5 top-1.5 z-10 bg-white px-1.5 py-0.5 text-[9px] font-bold uppercase text-black">
                        جدید
                      </span>
                      {c.img && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={c.img}
                          alt={c.label}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                        />
                      )}
                    </div>
                    <div className="p-1.5 md:p-2">
                      <p className="truncate text-[11px] font-semibold text-theme md:text-[12px]">
                        {c.label}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* ─── تیتر «محبوب‌ترین‌ها» ─── */}
            {topInCategory.length > 0 && (
              <div className="mb-4 flex items-center justify-between md:mb-5">
                <h2 className="text-[14px] font-black uppercase tracking-wider text-theme md:text-[15px]">
                  {brandParam || cat
                    ? `محبوب‌ترین‌های ${meta.title}`
                    : "محبوب‌ترین‌های این دسته"}
                </h2>
                <div className="hidden items-center gap-1 md:flex">
                  <button
                    type="button"
                    aria-label="قبلی"
                    className="flex h-8 w-8 items-center justify-center text-theme-muted transition hover:text-theme"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    aria-label="بعدی"
                    className="flex h-8 w-8 items-center justify-center text-theme-muted transition hover:text-theme"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 5l-7 7 7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* ─── ۳ محصول برتر ─── */}
            {topInCategory.length > 0 && (
              <div className="mb-8 flex gap-1.5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-3 md:gap-2 md:overflow-visible md:pb-0">
                {topInCategory.map((product, idx) => {
                  const sample: any = product;
                  const img: string = sample.image ?? sample.images?.[0] ?? "";
                  return (
                    <Link
                      key={`top-${product.id}`}
                      href={`/product/${product.id}`}
                      className="group w-[65%] flex-shrink-0 border border-black/10 bg-theme-surface dark:border-white/10 sm:w-[48%] md:w-auto"
                    >
                      <div className="relative aspect-square overflow-hidden bg-black/5 dark:bg-white/5">
                        <span className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center bg-white text-[12px] font-black text-black">
                          {idx + 1}
                        </span>
                        {img && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={img}
                            alt={product.name}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                          />
                        )}
                      </div>
                      <div className="p-2 md:p-3">
                        <p className="truncate text-[12px] font-semibold text-theme md:text-[13px]">
                          {product.name}
                        </p>
                        <p className="mt-0.5 truncate text-[10px] text-theme-muted md:text-[11px]">
                          {product.shortDesc || ""}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* ─── نوار Sticky — فقط موبایل ─── */}
            <div className="sticky top-[var(--mobile-header-h,60px)] z-30 -mx-4 mb-4 border-y border-black/10 bg-theme sm:-mx-6 md:hidden dark:border-white/10">
              <div className="grid grid-cols-3 divide-x divide-black/10 dark:divide-white/10">
                <button
                  type="button"
                  onClick={() => setSortSheetOpen(true)}
                  className="flex items-center justify-center gap-2 py-3.5 text-[13px] font-bold text-theme"
                >
                  <SortIcon />
                  <span>مرتب‌سازی</span>
                </button>

                <div className="flex items-center justify-center py-3.5 text-[13px] font-semibold text-theme-muted">
                  {filtered.length.toLocaleString("fa-IR")} محصول
                </div>

                <button
                  type="button"
                  onClick={() => setFilterDrawerOpen(true)}
                  className="flex items-center justify-center gap-2 py-3.5 text-[13px] font-bold text-theme"
                >
                  <FilterIcon />
                  <span>فیلتر</span>
                </button>
              </div>
            </div>

            {/* ─── تیتر بالای گرید ─── */}
            <div className="mb-4 flex items-end justify-between md:mb-5">
              <h2 className="text-[14px] font-black uppercase tracking-wider text-theme md:text-[15px]">
                همهٔ محصولات
              </h2>
              <p className="text-[11px] text-theme-muted md:text-[12px]">
                {filtered.length.toLocaleString("fa-IR")} محصول
              </p>
            </div>

            {/* ─── گرید محصولات ─── */}
            <div
              id="products-list"
              className="flex min-h-[calc(100vh-300px)] scroll-mt-24 flex-col"
            >
              {paginated.length === 0 ? (
                <div className="border border-black/10 bg-theme-surface p-12 text-center dark:border-white/10">
                  <p className="font-bold text-theme">
                    محصولی با این فیلترها یافت نشد
                  </p>
                  <button
                    onClick={handleReset}
                    className="mt-4 bg-black px-5 py-2 text-sm font-bold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                  >
                    حذف فیلترها
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-[5px] md:grid-cols-3 lg:grid-cols-4">
                    {paginated.map((product) => (
                      <ProductGridCard key={product.id} product={product} />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="mt-auto pt-12">
                      {/* دسکتاپ: pagination کامل */}
                      <div className="hidden items-center justify-center gap-2 md:flex">
                        <button
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          disabled={page === 1}
                          className="flex h-9 w-9 items-center justify-center border border-black/15 text-theme-muted transition hover:border-black hover:text-theme disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/15 dark:hover:border-white"
                        >
                          ›
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                          <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`h-9 min-w-[36px] border px-3 text-xs font-bold transition ${
                              p === page
                                ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                                : "border-black/15 text-theme-muted hover:border-black hover:text-theme dark:border-white/15 dark:hover:border-white"
                            }`}
                          >
                            {p.toLocaleString("fa-IR")}
                          </button>
                        ))}
                        <button
                          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                          disabled={page === totalPages}
                          className="flex h-9 w-9 items-center justify-center border border-black/15 text-theme-muted transition hover:border-black hover:text-theme disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/15 dark:hover:border-white"
                        >
                          ‹
                        </button>
                      </div>

                      {/* موبایل: اسکرول افقی */}
                      <div className="flex snap-x snap-mandatory items-center gap-1.5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:hidden">
                        <button
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          disabled={page === 1}
                          className="flex h-9 w-9 flex-shrink-0 snap-start items-center justify-center border border-black/15 text-theme-muted transition hover:border-black hover:text-theme disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/15 dark:hover:border-white"
                        >
                          ›
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                          <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`h-9 min-w-[36px] flex-shrink-0 snap-start border px-3 text-xs font-bold transition ${
                              p === page
                                ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                                : "border-black/15 text-theme-muted hover:border-black hover:text-theme dark:border-white/15 dark:hover:border-white"
                            }`}
                          >
                            {p.toLocaleString("fa-IR")}
                          </button>
                        ))}
                        <button
                          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                          disabled={page === totalPages}
                          className="flex h-9 w-9 flex-shrink-0 snap-start items-center justify-center border border-black/15 text-theme-muted transition hover:border-black hover:text-theme disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/15 dark:hover:border-white"
                        >
                          ‹
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          Bottom Sheet فیلتر (موبایل)
          ═══════════════════════════════════════════ */}
      <div
        onClick={() => setFilterDrawerOpen(false)}
        aria-hidden="true"
        className={
          "fixed inset-0 z-[205] bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden " +
          (filterDrawerOpen ? "visible opacity-100" : "invisible opacity-0")
        }
      />

      <div
        dir="rtl"
        className={
          "fixed inset-x-0 bottom-0 z-[210] flex h-[92dvh] flex-col rounded-t-2xl bg-theme shadow-2xl transition-transform duration-300 md:hidden " +
          (filterDrawerOpen ? "translate-y-0" : "translate-y-full")
        }
      >
        <div className="flex flex-shrink-0 justify-center pt-3 pb-1">
          <span className="h-1 w-10 rounded-full bg-black/20 dark:bg-white/20" />
        </div>

        <div className="flex flex-shrink-0 items-center justify-between px-5 py-3">
          <h2 className="text-[16px] font-black uppercase tracking-wide text-theme">
            فیلترها
          </h2>
          <button
            type="button"
            onClick={handleReset}
            className="text-[13px] font-semibold text-theme-muted transition hover:text-theme"
          >
            پاک کردن همه
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-4">
          <Accordion title="مرتب‌سازی" defaultOpen>
            <div className="space-y-4 pt-1">
              {SORT_OPTIONS.map((o) => (
                <label
                  key={o.key}
                  className="flex cursor-pointer items-center gap-3 text-[14px] text-theme-muted hover:text-theme"
                >
                  <input
                    type="radio"
                    name="sort-mobile"
                    checked={sort === o.key}
                    onChange={() => setSortParam(o.key)}
                    className="h-5 w-5 accent-black dark:accent-white"
                  />
                  {o.label}
                </label>
              ))}
            </div>
          </Accordion>

          <Accordion title="دسته‌بندی">
            {categories.map((c) => (
              <CheckRow
                key={c.key}
                label={c.label}
                checked={selectedCategories.includes(c.key)}
                onChange={() => toggleCategory(c.key)}
              />
            ))}
          </Accordion>

          <Accordion title="قیمت">
            <input
              type="range"
              min={0}
              max={priceCeiling}
              step={Math.max(1, Math.round(priceCeiling / 100))}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-black dark:accent-white"
            />
            <p className="mt-2 text-[12px] text-theme-muted">
              تا {maxPrice.toLocaleString("fa-IR")} تومان
            </p>
          </Accordion>

          <Accordion title="ویژگی‌ها">
            <CheckRow
              label="فقط کالاهای موجود"
              checked={onlyInStock}
              onChange={() => setOnlyInStock((v) => !v)}
            />
            <CheckRow
              label="فقط کالاهای تخفیف‌دار"
              checked={onlyOnSale}
              onChange={() => setOnlyOnSale((v) => !v)}
            />
          </Accordion>

          <Accordion title="جستجو">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="نام محصول یا برند"
              className="w-full border border-black/15 bg-transparent px-3 py-2 text-[13px] text-theme outline-none focus:border-black dark:border-white/15 dark:focus:border-white"
            />
          </Accordion>
          <div className="border-t border-black/10 dark:border-white/10" />
        </div>

        <div className="flex-shrink-0 border-t border-black/10 p-4 pb-safe dark:border-white/10">
          <button
            type="button"
            onClick={() => setFilterDrawerOpen(false)}
            className="w-full bg-black py-3.5 text-[14px] font-bold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            مشاهدهٔ {filtered.length.toLocaleString("fa-IR")} محصول
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          Bottom Sheet مرتب‌سازی (موبایل)
          ═══════════════════════════════════════════ */}
      <div
        onClick={() => setSortSheetOpen(false)}
        aria-hidden="true"
        className={
          "fixed inset-0 z-[205] bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden " +
          (sortSheetOpen ? "visible opacity-100" : "invisible opacity-0")
        }
      />

      <div
        dir="rtl"
        className={
          "fixed inset-x-0 bottom-0 z-[210] flex flex-col rounded-t-2xl bg-theme shadow-2xl transition-transform duration-300 md:hidden " +
          (sortSheetOpen ? "translate-y-0" : "translate-y-full")
        }
      >
        <div className="flex justify-center pt-3 pb-1">
          <span className="h-1 w-10 rounded-full bg-black/20 dark:bg-white/20" />
        </div>

        <div className="flex items-center justify-between border-b border-black/10 px-5 py-3 dark:border-white/10">
          <h2 className="text-[15px] font-black uppercase tracking-tight text-theme">
            مرتب‌سازی
          </h2>
          <button
            type="button"
            onClick={() => setSortSheetOpen(false)}
            aria-label="بستن"
            className="flex h-9 w-9 items-center justify-center text-theme"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col p-2 pb-safe">
          {SORT_OPTIONS.map((o) => (
            <button
              key={o.key}
              type="button"
              onClick={() => setSortParam(o.key)}
              className={
                "flex items-center gap-3 px-4 py-3.5 text-right text-[14px] transition " +
                (sort === o.key
                  ? "font-bold text-theme"
                  : "text-theme-muted hover:text-theme")
              }
            >
              <span
                className={
                  "flex h-5 w-5 items-center justify-center rounded-full border-2 " +
                  (sort === o.key
                    ? "border-black dark:border-white"
                    : "border-black/30 dark:border-white/30")
                }
              >
                {sort === o.key && (
                  <span className="h-2.5 w-2.5 rounded-full bg-black dark:bg-white" />
                )}
              </span>
              <span>{o.label}</span>
            </button>
          ))}
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