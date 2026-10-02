"use client";

import { Product } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { getProductImage } from "@/lib/productImages";

export default function ProductCard({ product }: { product: Product }) {
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const image =
    product.image && product.image.startsWith("/")
      ? product.image
      : getProductImage(product.category, product.id);

  const colors = product.colors || [];

  return (
    <a
      href={`/product/${product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#E8DFC8] bg-white transition hover:border-amber-500 hover:shadow-lg"
    >
      {/* تصویر */}
     <div className="relative aspect-[4/3] overflow-hidden bg-white">
        <img
          src={image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-contain p-3 transition duration-500 group-hover:scale-105"
        />

        {/* آیکون سبد خرید (گوشه چپ بالا) */}
        <button
          type="button"
          aria-label="افزودن به سبد"
          className="absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border border-[#E8DFC8] bg-white text-gray-500 shadow-sm transition hover:border-amber-500 hover:text-amber-600"
          onClick={(e) => {
            e.preventDefault();
            // TODO: افزودن به سبد
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
            />
          </svg>
        </button>

        {/* برچسب تخفیف */}
        {discount > 0 && (
          <span className="absolute right-2 top-2 rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-bold text-white shadow md:text-xs">
            {discount}٪ تخفیف
          </span>
        )}

        {/* برچسب ناموجود */}
        {!product.inStock && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-sm font-bold text-white">
            ناموجود
          </span>
        )}
      </div>

      {/* اطلاعات */}
      <div className="flex flex-1 flex-col p-3">
        {/* نام */}
        <h3 className="line-clamp-2 min-h-[2.5rem] text-xs font-bold leading-6 text-gray-800 transition group-hover:text-amber-600 md:text-sm">
          {product.name}
        </h3>

        {/* رنگ‌ها */}
        {colors.length > 0 && (
          <div className="mt-2 flex items-center gap-1.5">
            {colors.slice(0, 4).map((c, i) => (
              <span
                key={i}
                title={c.label}
                className="h-3.5 w-3.5 rounded-full border border-gray-200"
                style={{
                  backgroundColor: getColorHex(c.label),
                }}
              />
            ))}
            {colors.length > 4 && (
              <span className="text-[10px] text-gray-500">
                +{colors.length - 4}
              </span>
            )}
          </div>
        )}

        {/* موجودی */}
        <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-green-600 md:text-xs">
          {product.inStock ? (
            <>
              <span>✓</span>
              <span>موجود در انبار</span>
            </>
          ) : (
            <span className="text-red-500">ناموجود</span>
          )}
        </div>

        {/* قیمت */}
        <div className="mt-auto pt-3">
          {product.oldPrice && (
            <div className="mb-0.5 flex items-center gap-1 text-[11px] text-gray-400 line-through md:text-xs">
              <span>{formatPrice(product.oldPrice)}</span>
            </div>
          )}
          <div className="text-sm font-black text-gray-900 md:text-base">
            {formatPrice(product.price)}
          </div>
        </div>
      </div>
    </a>
  );
}

/* ─────── تبدیل اسم رنگ به کد رنگ ─────── */
function getColorHex(name: string): string {
  const map: Record<string, string> = {
    "مشکی": "#1a1a1a",
    "سفید": "#ffffff",
    "قرمز": "#dc2626",
    "آبی": "#2563eb",
    "سبز": "#16a34a",
    "زرد": "#eab308",
    "خاکی": "#a8917a",
    "بژ": "#e8dcc4",
    "نارنجی": "#ea580c",
    "قهوه‌ای": "#78350f",
    "طوسی": "#6b7280",
    "خاکستری": "#9ca3af",
    "صورتی": "#ec4899",
    "بنفش": "#7c3aed",
  };
  return map[name] || "#d1d5db";
}