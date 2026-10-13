"use client";

import { useEffect, useRef, useState } from "react";
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

// آیکن خطی کوله، هم‌سبک آیکن‌های قلب و کاربر در هدر
function BackpackIcon({
  className = "",
  strokeWidth = 2,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* دسته */}
      <path d="M9.5 5V4a2.5 2.5 0 015 0v1" />
      {/* بدنه */}
      <path d="M7 21h10a2 2 0 002-2v-9a5 5 0 00-5-5h-4a5 5 0 00-5 5v9a2 2 0 002 2z" />
      {/* جیب جلو */}
      <path d="M8.5 21v-5a1 1 0 011-1h5a1 1 0 011 1v5" />
      {/* خط بالای جیب */}
      <path d="M9 10h6" />
    </svg>
  );
}

export default function CartDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [bump, setBump] = useState(false);
  const { items, removeItem, totalItems, totalPrice } = useCart();
  const prevTotal = useRef(totalItems);

  // وقتی تعداد محصولات زیاد شد، عدد کوله یک بار بالا می‌پرد
  useEffect(() => {
    if (totalItems > prevTotal.current) {
      setBump(true);
      prevTotal.current = totalItems;
      const t = setTimeout(() => setBump(false), 350);
      return () => clearTimeout(t);
    }
    prevTotal.current = totalItems;
  }, [totalItems]);

  return (
    <>
      {/* دکمه سبد */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        data-cart-icon
        aria-label="کوله خرید"
        className="relative flex h-11 w-11 items-center justify-center text-theme transition hover:opacity-60"
      >
        <span className="relative flex items-center justify-center">
          <BackpackIcon className="h-6 w-6" />
          {totalItems > 0 && (
            <span
              className={
                "absolute -right-1.5 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-blue-900 px-1 text-[10px] font-bold text-white transition-transform duration-200 ease-out dark:bg-blue-600 " +
                (bump ? "-translate-y-2 scale-125" : "translate-y-0 scale-100")
              }
            >
              {totalItems}
            </span>
          )}
        </span>
      </button>

      {/* Backdrop */}
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
          "fixed left-0 top-0 z-[110] h-screen w-[400px] max-w-full bg-theme-card shadow-2xl transition-transform duration-300 " +
          (isOpen ? "translate-x-0" : "-translate-x-full")
        }
      >
        {/* هدر پنل */}
        <div className="flex items-center justify-between border-b border-theme px-5 py-4">
          <span className="text-base font-bold text-theme">
            محصولات داخل کوله
          </span>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="بستن"
            className="flex h-8 w-8 items-center justify-center rounded-full text-xl font-light text-theme-muted transition hover:bg-theme-surface hover:text-theme"
          >
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          /* کوله خالی */
          <div className="flex h-[calc(100vh-140px)] flex-col items-center justify-center p-8 text-center">
            <BackpackIcon
              strokeWidth={1.2}
              className="h-20 w-20 text-theme-muted/40"
            />
            <p className="mt-4 text-base font-bold text-theme">
              کوله شما خالی است
            </p>
            <a
              href="/products"
              className="mt-5 inline-block rounded-lg bg-accent px-6 py-2.5 text-sm font-bold text-white transition hover:bg-accent-hover"
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
                  className="flex items-center gap-3 border-b border-theme px-5 py-4 last:border-0"
                >
                  {/* تصویر */}
                  <a
                    href={"/product/" + item.id}
                    className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-theme bg-theme-surface"
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
                      className="line-clamp-2 text-sm font-semibold text-theme transition hover:text-accent"
                    >
                      {item.name}
                    </a>

                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-sm font-bold text-theme">
                        {formatPrice(item.price)}
                        <span className="mx-1 text-theme-muted">×</span>
                        {item.quantity}
                      </div>

                      {/* حذف */}
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        aria-label="حذف"
                        className="flex h-6 w-6 items-center justify-center rounded-full border border-theme text-xs text-theme-muted transition hover:border-red-500 hover:text-red-500"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* جمع جزء + دکمه‌ها */}
            <div className="absolute bottom-0 left-0 right-0 border-t border-theme bg-theme-card">
              <div className="flex items-center justify-between px-5 py-3">
                <span className="text-sm font-bold text-theme-muted">
                  جمع جزء
                </span>
                <span className="text-base font-black text-accent">
                  {formatPrice(totalPrice)}
                </span>
              </div>

              <div className="flex gap-2 px-5 pb-5">
                <a
                  href="/cart"
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-theme bg-theme-surface py-3 text-sm font-bold text-theme transition hover:border-accent hover:text-accent"
                >
                  <BackpackIcon className="h-4 w-4" />
                  <span>مشاهده کوله</span>
                </a>
                <a
                  href="/checkout"
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-accent py-3 text-sm font-bold text-white transition hover:bg-accent-hover"
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