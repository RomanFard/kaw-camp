"use client";

import { useState } from "react";
import { useCart } from "@/components/context/CartContext";
import { formatPrice } from "@/lib/utils";

export default function CartDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { items, removeItem, totalItems, totalPrice } = useCart();

  return (
    <>
      {/* دکمه سبد */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="relative flex items-center gap-2 text-gray-700 transition hover:text-amber-600"
      >
        <span className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-7 w-7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
            />
          </svg>
          {totalItems > 0 && (
            <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-white">
              {totalItems}
            </span>
          )}
        </span>
        <span className="text-lg font-bold">
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
            محصولات داخل سبد
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
          /* سبد خالی */
          <div className="flex h-[calc(100vh-140px)] flex-col items-center justify-center p-8 text-center">
            <p className="text-6xl">🛒</p>
            <p className="mt-4 text-base font-bold text-gray-700">
              سبد خرید شما خالی است
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
                      src={item.image}
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
                  <span>🛒</span>
                  <span>مشاهده سبد خرید</span>
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