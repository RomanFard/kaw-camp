"use client";

type Props = {
  searchQuery: string;
  onSearchChange: (v: string) => void;
  categories: { key: string; label: string; emoji: string }[];
  selectedCategories: string[];
  onToggleCategory: (key: string) => void;
  minPrice: number;
  maxPrice: number;
  onMinPriceChange: (v: number) => void;
  onMaxPriceChange: (v: number) => void;
  onlyInStock: boolean;
  onOnlyInStockChange: (v: boolean) => void;
  onlyOnSale: boolean;
  onOnlyOnSaleChange: (v: boolean) => void;
  onReset: () => void;
};

const MAX_PRICE = 50_000_000;

function formatShort(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toLocaleString("fa-IR")}M`;
  if (n >= 1_000) return `${(n / 1_000).toLocaleString("fa-IR")}K`;
  return n.toLocaleString("fa-IR");
}

export default function ProductFilterSidebar({
  searchQuery,
  onSearchChange,
  categories,
  selectedCategories,
  onToggleCategory,
  maxPrice,
  onMaxPriceChange,
  onlyInStock,
  onOnlyInStockChange,
  onlyOnSale,
  onOnlyOnSaleChange,
  onReset,
}: Props) {
  // درصد موقعیت thumb روی اسلایدر
  const percent = ((maxPrice - 100_000) / (MAX_PRICE - 100_000)) * 100;

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="rounded-2xl border border-zinc-800 bg-[#0A0A0A] p-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="جستجو در محصولات..."
          className="w-full rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-600"
        />
      </div>

      {/* Categories — بدون محدودیت ارتفاع */}
      <div className="rounded-2xl border border-zinc-800 bg-[#0A0A0A] p-4">
        <h3 className="mb-3 text-xs font-black text-white">دسته‌بندی‌ها</h3>
        <div className="space-y-2.5">
          {categories.map((cat) => {
            const isActive = selectedCategories.includes(cat.key);
            return (
              <label
                key={cat.key}
                className="group flex cursor-pointer items-center gap-2.5 text-xs text-zinc-400 transition hover:text-white"
              >
                <span
                  className={`flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center rounded-full border transition ${
                    isActive ? "border-[#E84C4C]" : "border-zinc-600"
                  }`}
                >
                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#E84C4C]" />
                  )}
                </span>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={() => onToggleCategory(cat.key)}
                  className="sr-only"
                />
                <span className="flex-1">{cat.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price — اسلایدر سفارشی */}
      <div className="rounded-2xl border border-zinc-800 bg-[#0A0A0A] p-4">
        <h3 className="mb-3 text-xs font-black text-white">محدوده قیمت</h3>

        <div className="relative pt-1 pb-1">
          {/* Track خاکستری */}
          <div className="absolute left-0 right-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-zinc-700" />

          {/* Track پر شده (کورال) */}
          <div
            className="absolute right-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-[#E84C4C]"
            style={{ width: `${100 - percent}%` }}
          />

          {/* Thumb (دایره نارنجی) */}
          <div
            className="pointer-events-none absolute top-1/2 h-3 w-3 -translate-y-1/2 translate-x-1/2 rounded-full bg-[#E84C4C] shadow-lg shadow-[#E84C4C]/40"
            style={{ right: `${100 - percent}%` }}
          />

          {/* Input نامرئی برای گرفتن کاربر */}
          <input
            type="range"
            min={100_000}
            max={MAX_PRICE}
            step={100_000}
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(Number(e.target.value))}
            className="relative z-10 w-full cursor-pointer opacity-0"
          />
        </div>

        <div className="mt-2 flex items-center justify-between text-[11px]">
          <span className="text-zinc-400">۰ تومان</span>
          <span className="font-bold text-[#E84C4C]">
            {formatShort(maxPrice)} تومان
          </span>
        </div>
      </div>

      {/* Availability */}
      <div className="rounded-2xl border border-zinc-800 bg-[#0A0A0A] p-4">
        <h3 className="mb-3 text-xs font-black text-white">وضعیت کالا</h3>
        <div className="space-y-2.5">
          <label className="group flex cursor-pointer items-center gap-2.5 text-xs text-zinc-400 transition hover:text-white">
            <span
              className={`flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center rounded border transition ${
                onlyInStock ? "border-[#E84C4C]" : "border-zinc-600"
              }`}
            >
              {onlyInStock && (
                <span className="h-1.5 w-1.5 rounded-sm bg-[#E84C4C]" />
              )}
            </span>
            <input
              type="checkbox"
              checked={onlyInStock}
              onChange={(e) => onOnlyInStockChange(e.target.checked)}
              className="sr-only"
            />
            فقط کالاهای موجود
          </label>

          <label className="group flex cursor-pointer items-center gap-2.5 text-xs text-zinc-400 transition hover:text-white">
            <span
              className={`flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center rounded border transition ${
                onlyOnSale ? "border-[#E84C4C]" : "border-zinc-600"
              }`}
            >
              {onlyOnSale && (
                <span className="h-1.5 w-1.5 rounded-sm bg-[#E84C4C]" />
              )}
            </span>
            <input
              type="checkbox"
              checked={onlyOnSale}
              onChange={(e) => onOnlyOnSaleChange(e.target.checked)}
              className="sr-only"
            />
            فقط کالاهای تخفیف‌دار
          </label>
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={onReset}
        className="w-full rounded-lg border border-zinc-800 bg-[#0A0A0A] py-2.5 text-xs font-bold text-zinc-400 transition hover:border-zinc-700 hover:bg-zinc-900 hover:text-white"
      >
        🔄 حذف فیلترها
      </button>
    </div>
  );
}

