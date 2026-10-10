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
  const percent = ((maxPrice - 100_000) / (MAX_PRICE - 100_000)) * 100;

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="rounded-2xl border border-theme bg-theme-card p-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="جستجو در محصولات..."
          className="w-full rounded-lg border border-theme bg-theme-surface px-4 py-2.5 text-sm text-theme outline-none transition placeholder:text-theme-muted focus:border-accent"
        />
      </div>

      {/* Categories */}
      <div className="rounded-2xl border border-theme bg-theme-card p-4">
        <h3 className="mb-3 text-xs font-black text-theme">دسته‌بندی‌ها</h3>
        <div className="space-y-2.5">
          {categories.map((cat) => {
            const isActive = selectedCategories.includes(cat.key);
            return (
              <label
                key={cat.key}
                className="group flex cursor-pointer items-center gap-2.5 text-xs text-theme-muted transition hover:text-theme"
              >
                <span
                  className={`flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center rounded-full border transition ${
                    isActive ? "border-accent" : "border-theme"
                  }`}
                >
                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
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

      {/* Price */}
      <div className="rounded-2xl border border-theme bg-theme-card p-4">
        <h3 className="mb-3 text-xs font-black text-theme">محدوده قیمت</h3>

        <div className="relative pb-1 pt-1">
          {/* Track خاکستری */}
          <div className="absolute left-0 right-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-theme-surface" />

{/* Track پر شده */}
<div
  className="absolute right-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-accent transition-[width] duration-75"
  style={{ width: `${percent}%` }}
/>

{/* Thumb */}
<div
  className="pointer-events-none absolute top-1/2 h-4 w-4 rounded-full bg-accent shadow-lg shadow-accent/40 ring-2 ring-theme-card"
  style={{
    right: `${percent}%`,
    transform: "translate(50%, -50%)",
  }}
/>

          {/* Input نامرئی */}
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
          <span className="text-theme-muted">۰ تومان</span>
          <span className="font-bold text-accent">
            {formatShort(maxPrice)} تومان
          </span>
        </div>
      </div>

      {/* Availability */}
      <div className="rounded-2xl border border-theme bg-theme-card p-4">
        <h3 className="mb-3 text-xs font-black text-theme">وضعیت کالا</h3>
        <div className="space-y-2.5">
          <label className="group flex cursor-pointer items-center gap-2.5 text-xs text-theme-muted transition hover:text-theme">
            <span
              className={`flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center rounded border transition ${
                onlyInStock ? "border-accent" : "border-theme"
              }`}
            >
              {onlyInStock && (
                <span className="h-1.5 w-1.5 rounded-sm bg-accent" />
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

          <label className="group flex cursor-pointer items-center gap-2.5 text-xs text-theme-muted transition hover:text-theme">
            <span
              className={`flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center rounded border transition ${
                onlyOnSale ? "border-accent" : "border-theme"
              }`}
            >
              {onlyOnSale && (
                <span className="h-1.5 w-1.5 rounded-sm bg-accent" />
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
        className="w-full rounded-lg border border-theme bg-theme-card py-2.5 text-xs font-bold text-theme-muted transition hover:bg-theme-surface hover:text-theme"
      >
        🔄 حذف فیلترها
      </button>
    </div>
  );
}