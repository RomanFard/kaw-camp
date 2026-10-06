"use client";

import { useState, useRef } from "react";
import { Product } from "@/data/products";
import { useCart } from "@/components/context/CartContext";
import { useWishlist } from "@/components/context/WishlistContext";
import { formatPrice } from "@/lib/utils";

export default function ProductPageClient({ product }: { product: Product }) {
  const colors = product.colors || [];
  const sizes = product.sizes || [];
  const hasColors = colors.length > 0;
  const hasSizes = sizes.length > 0;

  const [selectedColor, setSelectedColor] = useState(
    hasColors ? colors[0].label : ""
  );
  const [selectedSize, setSelectedSize] = useState(
    hasSizes ? sizes[0].label : ""
  );
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const buttonRef = useRef<HTMLButtonElement>(null);

  // ─── عکس‌ها ───
  const galleryImages = product.images?.length
    ? product.images
    : [product.image];

  const activeImage = galleryImages[activeImageIndex] || product.image;

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const brand = product.brand || "KAW CAMP";
  const englishName = product.englishName || product.slug;
  const productCode = "KC-" + product.id.padStart(4, "0");

  function handleAdd() {
    if (!product.inStock) return;
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const [added, setAdded] = useState(false);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
      {/* ═══ ستون چپ: گالری ═══ */}
      <div>
        {/* عکس اصلی */}
        <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activeImage}
            alt={product.name}
            className="aspect-square h-auto w-full object-contain p-6"
          />

          {/* Badge تخفیف */}
          {discount > 0 && (
            <span className="absolute right-4 top-4 rounded bg-[#E84C4C] px-3 py-1 text-xs font-black text-white">
              {discount}٪ تخفیف
            </span>
          )}

          {/* Badge ناموجود */}
          {!product.inStock && (
            <span className="absolute left-4 top-4 rounded bg-zinc-700 px-3 py-1 text-xs font-black text-white">
              ناموجود
            </span>
          )}
        </div>

        {/* thumbnail ها */}
        {galleryImages.length > 1 && (
          <div className="mt-3 grid grid-cols-4 gap-3">
            {galleryImages.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveImageIndex(i)}
                className={`overflow-hidden rounded-lg border-2 bg-zinc-950 transition ${
                  i === activeImageIndex
                    ? "border-[#E84C4C]"
                    : "border-zinc-800 hover:border-zinc-600"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt={`${product.name} ${i + 1}`}
                  className="aspect-square h-auto w-full object-contain p-2"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ═══ ستون راست: اطلاعات ═══ */}
      <div className="space-y-5">
        {/* عنوان */}
        <div>
          <h1 className="text-xl font-black leading-8 text-white md:text-2xl">
            {product.name}
          </h1>
          <p className="mt-1 text-xs text-zinc-500" dir="ltr">
            {englishName}
          </p>
        </div>

        {/* SKU + امتیاز */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500">
          <span dir="ltr">
            شناسه: <span className="font-mono text-zinc-300">{productCode}</span>
          </span>

          <div className="flex items-center gap-1">
            <span className="text-[#E84C4C]">
              {"★".repeat(Math.round(product.rating))}
              <span className="text-zinc-700">
                {"★".repeat(5 - Math.round(product.rating))}
              </span>
            </span>
            <span className="text-zinc-500">
              ({product.reviews.toLocaleString("fa-IR")} نظر)
            </span>
          </div>
        </div>

        {/* قیمت */}
        <div className="flex items-baseline gap-3">
          <span className="text-2xl font-black text-[#E84C4C] md:text-3xl">
            {formatPrice(product.price)}
          </span>
          {product.oldPrice && (
            <span className="text-sm text-zinc-500 line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>

        {/* توضیح کوتاه */}
        <p className="text-sm leading-7 text-zinc-400">{product.shortDesc}</p>

        {/* ویژگی‌های کلیدی */}
        {product.features.length > 0 && (
          <ul className="space-y-1.5">
            {product.features.slice(0, 6).map((f) => (
              <li
                key={f}
                className="flex items-start gap-2 text-xs text-zinc-400"
              >
                <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-[#E84C4C]" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        )}

        {/* رنگ */}
        {hasColors && (
          <div>
            <p className="mb-2 text-xs font-bold text-zinc-400">
              رنگ: <span className="text-white">{selectedColor}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {colors.map((c) => (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => setSelectedColor(c.label)}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-bold transition ${
                    selectedColor === c.label
                      ? "border-[#E84C4C] bg-[#E84C4C]/10 text-[#E84C4C]"
                      : "border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white"
                  }`}
                >
                  {c.image && (
                    <span className="h-5 w-5 overflow-hidden rounded border border-zinc-700 bg-zinc-950">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={c.image}
                        alt={c.label}
                        className="h-full w-full object-cover"
                      />
                    </span>
                  )}
                  <span>{c.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* سایز */}
        {hasSizes && (
          <div>
            <p className="mb-2 text-xs font-bold text-zinc-400">
              سایز / ظرفیت:{" "}
              <span className="text-white">{selectedSize}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {sizes.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => setSelectedSize(s.label)}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-bold transition ${
                    selectedSize === s.label
                      ? "border-[#E84C4C] bg-[#E84C4C]/10 text-[#E84C4C]"
                      : "border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white"
                  }`}
                >
                  {s.image && (
                    <span className="h-5 w-5 overflow-hidden rounded border border-zinc-700 bg-zinc-950">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={s.image}
                        alt={s.label}
                        className="h-full w-full object-cover"
                      />
                    </span>
                  )}
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* تعداد + دکمه‌ها */}
        <div className="space-y-3">
          {/* ردیف ۱: تعداد + افزودن به سبد */}
          <div className="flex gap-3">
            <div className="flex items-center rounded-lg border border-zinc-800">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-11 w-11 items-center justify-center text-lg font-bold text-zinc-400 transition hover:text-white"
              >
                −
              </button>
              <span className="min-w-[40px] text-center text-sm font-bold text-white">
                {quantity.toLocaleString("fa-IR")}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="flex h-11 w-11 items-center justify-center text-lg font-bold text-zinc-400 transition hover:text-white"
              >
                +
              </button>
            </div>

            <button
              ref={buttonRef}
              type="button"
              onClick={handleAdd}
              disabled={!product.inStock || added}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-sm font-black transition ${
                added
                  ? "bg-green-600 text-white"
                  : "bg-[#E84C4C] text-white hover:bg-[#D63F3F] disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-600"
              }`}
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
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                />
              </svg>
              <span>
                {added
                  ? "افزوده شد"
                  : product.inStock
                  ? "افزودن به سبد"
                  : "ناموجود"}
              </span>
            </button>
          </div>

          {/* ردیف ۲: علاقه‌مندی */}
          <button
            type="button"
            onClick={() => toggleItem(product, "product")}
            className={`flex w-full items-center justify-center gap-2 rounded-lg border py-2.5 text-xs font-bold transition ${
              inWishlist
                ? "border-red-500 bg-red-500/10 text-red-500"
                : "border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill={inWishlist ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
            <span>
              {inWishlist ? "حذف از علاقه‌مندی" : "افزودن به علاقه‌مندی"}
            </span>
          </button>
        </div>

        {/* اطلاعات اعتماد */}
        <div className="space-y-2 border-t border-zinc-800 pt-4">
          {[
            { icon: "✓", text: "موجود در انبار، ارسال فوری" },
            { icon: "🛡️", text: "ضمانت اصالت و کیفیت کالا" },
            { icon: "🚚", text: "ارسال رایگان برای خرید بالای ۲ میلیون" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-xs text-zinc-400"
            >
              <span className="text-[#E84C4C]">{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

