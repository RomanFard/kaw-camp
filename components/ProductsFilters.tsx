"use client";

import { useState } from "react";

export default function ProductsFilters({
  activeCategory,
}: {
  categories?: { key: string; label: string; emoji: string }[];
  activeCategory?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50_000_000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);

  function applyFilters() {
    const params = new URLSearchParams();
    if (activeCategory) params.set("cat", activeCategory);
    if (minPrice > 0) params.set("minPrice", String(minPrice));
    if (maxPrice < 50_000_000) params.set("maxPrice", String(maxPrice));
    if (inStockOnly) params.set("inStock", "1");
    if (onSaleOnly) params.set("onSale", "1");
    window.location.href = "/products?" + params.toString();
  }

  function resetFilters() {
    setMinPrice(0);
    setMaxPrice(50_000_000);
    setInStockOnly(false);
    setOnSaleOnly(false);
    window.location.href = "/products";
  }

  const filterContent = (
    <>
      {/* فیلتر قیمت */}
      <div className="mb-6 border-b border-[#EDE4CE] pb-6">
        <h3 className="mb-4 text-sm font-bold text-gray-900">
          فیلتر بر اساس قیمت
        </h3>

        {/* اسلایدر قیمت */}
        <div className="mb-4 space-y-2">
          <input
            type="range"
            min={0}
            max={50_000_000}
            step={100_000}
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
            className="w-full accent-amber-500"
          />
          <input
            type="range"
            min={0}
            max={50_000_000}
            step={100_000}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-amber-500"
          />
        </div>

        <div className="mb-3 flex items-center justify-between text-xs">
          <span className="text-gray-500">قیمت:</span>
          <span className="font-bold text-gray-800">
            {formatPrice(minPrice)} — {formatPrice(maxPrice)}
          </span>
        </div>

        <button
          type="button"
          onClick={applyFilters}
          className="w-full rounded-lg bg-gray-100 py-2 text-xs font-bold text-gray-700 transition hover:bg-amber-500 hover:text-white"
        >
          صافی
        </button>
      </div>

      {/* فیلتر موجودی */}
      <div className="mb-6 border-b border-[#EDE4CE] pb-6">
        <h3 className="mb-4 text-sm font-bold text-gray-900">وضعیت کالا</h3>
        <label className="mb-3 flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="h-4 w-4 accent-amber-500"
          />
          <span className="text-gray-700">فقط کالاهای موجود</span>
        </label>

        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={onSaleOnly}
            onChange={(e) => setOnSaleOnly(e.target.checked)}
            className="h-4 w-4 accent-amber-500"
          />
          <span className="text-gray-700">فقط کالاهای تخفیف‌دار</span>
        </label>
      </div>

      {/* دکمه‌ها */}
      <button
        type="button"
        onClick={applyFilters}
        className="mb-2 w-full rounded-lg bg-amber-500 py-2.5 text-sm font-bold text-white transition hover:bg-amber-600"
      >
        اعمال فیلتر
      </button>

      <button
        type="button"
        onClick={resetFilters}
        className="w-full rounded-lg border border-[#E8DFC8] py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
      >
        حذف فیلترها
      </button>
    </>
  );

  return (
    <>
      {/* دکمه موبایل */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-lg bg-blue-800 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-900 lg:hidden"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
          />
        </svg>
        <span>فیلترها</span>
      </button>

      {/* Backdrop موبایل */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-[200] bg-black/50 lg:hidden"
        />
      )}

      {/* دراور فیلتر موبایل */}
      <aside
        className={
          "fixed right-0 top-0 z-[210] h-screen w-[85vw] max-w-[350px] overflow-y-auto bg-white p-5 shadow-2xl transition-transform duration-300 lg:hidden " +
          (isOpen ? "translate-x-0" : "translate-x-full")
        }
        dir="rtl"
      >
        <div className="mb-5 flex items-center justify-between border-b border-[#EDE4CE] pb-3">
          <span className="text-base font-black text-amber-600">فیلترها</span>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-xl text-gray-500 transition hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        {filterContent}
      </aside>

      {/* سایدبار فیلتر دسکتاپ */}
      <div className="hidden rounded-2xl border border-[#E8DFC8] bg-white p-5 shadow-sm lg:block">
        <h3 className="mb-4 border-b border-[#EDE4CE] pb-3 text-base font-black text-amber-600">
          فیلترها
        </h3>
        {filterContent}
      </div>
    </>
  );
}

function formatPrice(n: number): string {
  return new Intl.NumberFormat("fa-IR").format(n) + " تومان";
}