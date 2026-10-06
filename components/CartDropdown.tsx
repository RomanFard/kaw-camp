"use client";

import { useState } from "react";
import { useCart } from "@/components/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { getProductPlaceholder } from "@/lib/placeholder";

function getCategoryEmojiFromName(name: string) {
  if (name.includes("چادر")) return "⛺";
  if (name.includes("کوله")) return "🎒";
  if (name.includes("کیسه")) return "🛏️";
  if (name.includes("تشک") || name.includes("زیرانداز")) return "🟦";
  if (name.includes("گاز") || name.includes("اجاق") || name.includes("پخت")) return "🍳";
  if (name.includes("فانوس") || name.includes("لامپ") || name.includes("پروژکتور")) return "🔦";
  if (name.includes("قمقمه") || name.includes("لیوان")) return "🥤";
  if (name.includes("عصا")) return "🧰";
  if (name.includes("کاپشن") || name.includes("شلوار") || name.includes("دستکش") || name.includes("کلاه")) return "🧥";
  if (name.includes("کفش")) return "🥾";
  if (name.includes("جوراب")) return "🧦";
  if (name.includes("گتر")) return "🦵";
  if (name.includes("عینک")) return "🕶️";
  if (name.includes("ساعت")) return "⌚";
  if (name.includes("دوچرخه")) return "🚲";
  return "📦";
}

function BackpackIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      {/* دستگیره بالایی */}
      <path d="M11 1h2a0.5 0.5 0 0 1 0 1h-2a0.5 0.5 0 0 1 0-1z" opacity="0.55" />
      {/* فلپ بالایی */}
      <path d="M8.5 3C8.5 2.2 9.2 1.5 10 1.5h4c0.8 0 1.5 0.7 1.5 1.5V4h-7V3z" />
      {/* بدنه اصلی — باریک و کشیده */}
      <path d="M7 6.5C7 5.7 7.7 5 8.5 5h7c0.8 0 1.5 0.7 1.5 1.5V22c0 0.8-0.7 1.5-1.5 1.5h-7c-0.8 0-1.5-0.7-1.5-1.5V6.5z" />
      {/* جیب کناری چپ */}
      <ellipse cx="6.3" cy="14" rx="0.9" ry="3.5" />
      {/* جیب کناری راست */}
      <ellipse cx="17.7" cy="14" rx="0.9" ry="3.5" />
      {/* زیپ وسط چپ */}
      <rect x="11.05" y="6.5" width="0.55" height="15.5" rx="0.27" fill="#fff" opacity="0.9" />
      {/* زیپ وسط راست */}
      <rect x="12.4" y="6.5" width="0.55" height="15.5" rx="0.27" fill="#fff" opacity="0.9" />
      {/* بند فلپ */}
      <rect x="11.5" y="1.7" width="1" height="3.3" rx="0.25" fill="#fff" opacity="0.55" />
    </svg>
  );
}

export default function CartDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { items, removeItem, totalItems, totalPrice } = useCart();

  return (
    <>
      {/* دکمه سبد */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        data-cart-icon
        className="relative flex items-center gap-2 text-gray-700 transition hover:text-amber-600"
      >
        <span className="relative">
          <BackpackIcon className="h-10 w-9" />
          {totalItems > 0 && (
            <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-white">
              {totalItems}
            </span>
          )}
        </span>
        <span className="hidden text-lg font-bold md:inline">
          {formatPrice(totalPrice)}
        </span>
      </button>

      {/* Backdrop تاریک */}
      <div
        onClick={() => setIsOpen(false)}
        className={
          "fixed inset-0 z-[100] bg-black/40 transition-opacity duration-300 " +
          (isOpen ? "visible opacity-100" : "invisible opacity-0")
        }
      />

      {/* پنل کناری چپ */}
      <aside
        className={
          "fixed left-0 top-0 z-[110] h-screen w-[400px] max-w-full bg-white shadow-2xl transition-transform duration-300 " +
          (isOpen ? "translate-x-0" : "-translate-x-full")
        }
      >
        {/* هدر پنل */}
        <div className="flex items-center justify-between border-b border-[#EDE4CE] px-5 py-4">
          <span className="text-base font-bold text-gray-800">
            محصولات داخل کوله
          </span>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="بستن"
            className="flex h-8 w-8 items-center justify-center rounded-full text-xl font-light text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
          >
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          /* کوله خالی */
          <div className="flex h-[calc(100vh-140px)] flex-col items-center justify-center p-8 text-center">
            <BackpackIcon className="h-24 w-20 text-gray-300" />
            <p className="mt-4 text-base font-bold text-gray-700">
              کوله شما خالی است
            </p>
            <a
              href="/products"
              className="mt-5 inline-block rounded-lg bg-amber-500 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-amber-600"
            >
              مشاهده محصولات
            </a>
          </div>
        ) : (
          <>
            {/* لیست آیتم‌ها */}
            <div className="h-[calc(100vh-230px)] overflow-y-auto">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 border-b border-[#EDE4CE] px-5 py-4 last:border-0"
                >
                  {/* تصویر */}
                  <a
                    href={"/product/" + item.id}
                    className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-[#EDE4CE] bg-[#F7F1E3]"
                  >
                    <img
                      src={getProductPlaceholder(item.name, getCategoryEmojiFromName(item.name))}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </a>

                  {/* اطلاعات */}
                  <div className="flex flex-1 flex-col">
                    <a
                      href={"/product/" + item.id}
                      className="line-clamp-2 text-sm font-semibold text-gray-800 hover:text-amber-600"
                    >
                      {item.name}
                    </a>

                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-sm font-bold text-gray-900">
                        {formatPrice(item.price)}
                        <span className="mx-1 text-gray-400">×</span>
                        {item.quantity}
                      </div>

                      {/* حذف */}
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        aria-label="حذف"
                        className="flex h-6 w-6 items-center justify-center rounded-full border border-[#DDD1B5] text-xs text-gray-400 transition hover:border-red-500 hover:text-red-500"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* جمع جزء + دکمه‌ها */}
            <div className="absolute bottom-0 left-0 right-0 border-t border-[#EDE4CE] bg-white">
              <div className="flex items-center justify-between px-5 py-3">
                <span className="text-sm font-bold text-gray-700">جمع جزء</span>
                <span className="text-base font-black text-red-600">
                  {formatPrice(totalPrice)}
                </span>
              </div>

              <div className="flex gap-2 px-5 pb-5">
                <a
                  href="/cart"
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-100 py-3 text-sm font-bold text-emerald-800 transition hover:bg-emerald-200"
                >
                  <BackpackIcon className="h-4 w-3.5" />
                  <span>مشاهده کوله</span>
                </a>
                <a
                  href="/checkout"
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 py-3 text-sm font-bold text-white transition hover:bg-red-700"
                >
                  <span>✓</span>
                  <span>تسویه حساب</span>
                </a>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}