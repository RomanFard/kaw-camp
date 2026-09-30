"use client";

import { useState } from "react";
import { Product } from "@/data/products";
import { useCart } from "@/components/context/CartContext";
import { formatPrice } from "@/lib/utils";

export default function AddToCartSection({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  function handleAdd() {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <aside className="sticky top-4 h-fit space-y-4">
      {/* کارت قیمت */}
      <div className="rounded-xl border border-[#E8DFC8] bg-white p-5">
        {/* قیمت */}
        <div className="text-right">
          {product.oldPrice && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="line-through">{formatPrice(product.oldPrice)}</span>
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700">
                {discount}٪
              </span>
            </div>
          )}
          <div className="mt-1 text-2xl font-bold text-gray-900">
            {formatPrice(product.price)}
          </div>
          <div className="text-xs text-gray-500">تومان</div>
        </div>

        {/* گزینه‌ها */}
        <ul className="mt-4 space-y-3 border-t border-[#EDE4CE] pt-4 text-sm">
          <li className="flex items-center justify-between text-gray-700">
            <span>خرید قسطی با اسنپ‌پی</span>
            <span className="text-amber-500">💳</span>
          </li>
          <li className="flex items-center justify-between text-gray-700">
            <span>گارانتی اصالت و سلامت کالا</span>
            <span className="text-amber-500">🛡️</span>
          </li>
          <li className="flex items-center justify-between text-gray-700">
            <span>۷ روز ضمانت بازگشت وجه</span>
            <span className="text-amber-500">↩️</span>
          </li>
          <li className="flex items-center justify-between text-gray-700">
            <span>بروزرسانی قیمت: امروز</span>
            <span className="text-amber-500">$</span>
          </li>
        </ul>

        {/* تعداد */}
        <div className="mt-4 flex items-center justify-center gap-3 rounded-lg border border-[#E8DFC8] p-1">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-9 w-9 items-center justify-center rounded text-lg font-bold text-gray-600 transition hover:bg-gray-100"
          >
            −
          </button>
          <span className="min-w-[40px] text-center text-base font-bold text-gray-800">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="flex h-9 w-9 items-center justify-center rounded text-lg font-bold text-gray-600 transition hover:bg-gray-100"
          >
            +
          </button>
        </div>

        {/* افزودن به سبد */}
        <button
          type="button"
          onClick={handleAdd}
          disabled={!product.inStock}
          className={
            "mt-3 flex w-full items-center justify-center gap-2 rounded-lg py-3 text-base font-bold text-white transition disabled:cursor-not-allowed disabled:bg-gray-300 " +
            (added ? "bg-green-600" : "bg-green-700 hover:bg-green-800")
          }
        >
          {added ? (
            <>
              <span>✓</span>
              <span>به سبد اضافه شد</span>
            </>
          ) : (
            <>
              <span>🛍️</span>
              <span>{product.inStock ? "افزودن به سبد خرید" : "ناموجود"}</span>
            </>
          )}
        </button>
      </div>

      {/* کارت فروشنده */}
      <div className="rounded-xl border border-[#E8DFC8] bg-white p-5">
        <div className="flex items-center justify-between border-b border-[#EDE4CE] pb-3">
          <span className="text-sm font-bold text-gray-800">فروشنده</span>
          <span className="text-sm font-bold text-amber-600">کو کمپ</span>
        </div>

        <ul className="mt-3 space-y-2.5 text-sm text-gray-700">
          <li className="flex items-center justify-between">
            <span>گارانتی اصالت و سلامت کالا</span>
            <span>✓</span>
          </li>
          <li className="flex items-center justify-between">
            <span>آماده ارسال از امروز</span>
            <span>🚚</span>
          </li>
        </ul>
      </div>
    </aside>
  );
}