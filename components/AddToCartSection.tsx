"use client";

import { useState } from "react";
import { Product } from "@/data/products";
import { useCart } from "@/components/context/CartContext";
import { formatPrice } from "@/lib/utils";

export default function AddToCartSection({
  product,
  selectedColor,
  onColorChange,
}: {
  product: Product;
  selectedColor?: string;
  onColorChange?: (color: string) => void;
}) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");

  const colors = product.colors || [];
  const hasColors = colors.length > 0;

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  function handleAdd() {
    if (hasColors && !selectedColor) {
      setError("لطفاً ابتدا رنگ محصول را انتخاب کنید");
      setTimeout(() => setError(""), 3000);
      return;
    }

    addItem(product, quantity);
    setAdded(true);
    setError("");
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <aside className="space-y-4">
      <div className="rounded-xl border border-[#D4C5A0] bg-white p-5">
        {/* قیمت */}
        <div className="border-b border-[#EDE4CE] pb-4">
          {product.oldPrice && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="line-through">
                {formatPrice(product.oldPrice)}
              </span>
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700">
                {discount}٪
              </span>
            </div>
          )}
          <div className="mt-1 flex items-end justify-between">
            <div className="text-2xl font-black text-gray-900">
              {formatPrice(product.price)}
            </div>
            <span className="text-xs text-gray-500">تومان</span>
          </div>
        </div>

        {/* انتخاب رنگ */}
        {hasColors && (
          <div className="mt-4 border-b border-[#EDE4CE] pb-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-bold text-gray-800">
                انتخاب رنگ:
              </span>
              {selectedColor && (
                <span className="text-xs text-amber-600">{selectedColor}</span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {colors.map((c) => (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => {
                    if (onColorChange) onColorChange(c.label);
                    setError("");
                  }}
                  className={
                    "rounded-lg border-2 px-4 py-2 text-sm font-semibold transition " +
                    (selectedColor === c.label
                      ? "border-amber-500 bg-amber-50 text-amber-700"
                      : "border-[#D4C5A0] bg-white text-gray-700 hover:border-amber-300")
                  }
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* پیام خطا */}
        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3">
            <p className="flex items-center gap-2 text-xs font-semibold text-red-700">
              <span>⚠️</span>
              <span>{error}</span>
            </p>
          </div>
        )}

        {/* تعداد */}
        <div className="mt-4 flex items-center justify-center gap-3 rounded-lg border border-[#D4C5A0] p-1">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-9 w-9 items-center justify-center rounded text-lg font-bold text-gray-600 transition hover:bg-[#F7F1E3]"
          >
            −
          </button>
          <span className="min-w-[40px] text-center text-base font-bold text-gray-800">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="flex h-9 w-9 items-center justify-center rounded text-lg font-bold text-gray-600 transition hover:bg-[#F7F1E3]"
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
              <span>
                {product.inStock ? "افزودن به سبد خرید" : "ناموجود"}
              </span>
            </>
          )}
        </button>
      </div>

      {/* فروشنده */}
      <div className="rounded-xl border border-[#D4C5A0] bg-white p-5">
        <div className="flex items-center justify-between border-b border-[#EDE4CE] pb-3">
          <span className="text-sm font-bold text-gray-800">فروشنده</span>
          <span className="text-sm font-bold text-amber-600">کاو کمپ</span>
        </div>

        <ul className="mt-3 space-y-2.5 text-sm text-gray-700">
          <li className="flex items-center justify-between">
            <span>گارانتی اصالت و سلامت کالا</span>
            <span className="text-green-600">✓</span>
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