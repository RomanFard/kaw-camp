"use client";

import { useState } from "react";
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

  function nextImage() {
    setActiveImageIndex((i) => (i + 1) % galleryImages.length);
  }

  function prevImage() {
    setActiveImageIndex(
      (i) => (i - 1 + galleryImages.length) % galleryImages.length
    );
  }

  const whyUsItems = [
    {
      title: "پرداخت امن",
      desc: "رمزنگاری SSL ۲۵۶ بیتی",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      ),
    },
    {
      title: "ارسال سریع",
      desc: "۲ تا ۵ روز کاری",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
        </svg>
      ),
    },
    {
      title: "بازگشت آسان",
      desc: "تا ۳۰ روز فرصت بازگشت",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
        </svg>
      ),
    },
    {
      title: "تضمین کیفیت",
      desc: "محصولات اورجینال و باکیفیت",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
        </svg>
      ),
    },
    {
      title: "مورد اعتماد مشتریان",
      desc: "هزاران مشتری راضی",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      {/* ═══════ بخش بالا ═══════ */}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,440px)_1fr] lg:gap-6">
        {/* ═══ ستون چپ: گالری ═══ */}
        <div className="flex flex-col rounded-2xl border border-zinc-800 bg-[#0A0A0A] p-2.5">
          <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeImage}
              alt={product.name}
              className="aspect-square h-auto w-full object-cover"
            />

            {discount > 0 && (
              <span className="absolute right-3 top-3 rounded-md bg-[#6ECB9E] px-3 py-1.5 text-sm font-black text-white shadow-lg">
                -{discount}٪ OFF
              </span>
            )}

            {!product.inStock && (
              <span className="absolute left-3 top-3 rounded-md bg-zinc-700 px-3 py-1.5 text-sm font-black text-white shadow-lg">
                ناموجود
              </span>
            )}
          </div>

          {galleryImages.length > 1 && (
            <div className="relative mt-2.5">
              <button
                type="button"
                onClick={prevImage}
                aria-label="قبلی"
                className="absolute -left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-700 bg-[#0A0A0A] text-white shadow-lg transition hover:border-[#6ECB9E] hover:bg-[#6ECB9E]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>

              <button
                type="button"
                onClick={nextImage}
                aria-label="بعدی"
                className="absolute -right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-700 bg-[#0A0A0A] text-white shadow-lg transition hover:border-[#6ECB9E] hover:bg-[#6ECB9E]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>

              <div className="scrollbar-hide grid grid-cols-3 gap-2">
                {galleryImages.slice(0, 3).map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImageIndex(i)}
                    className={`relative aspect-square overflow-hidden rounded-lg border-2 bg-zinc-950 transition ${
                      i === activeImageIndex
                        ? "border-[#6ECB9E]"
                        : "border-zinc-800 hover:border-zinc-600"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ═══ ستون راست: اطلاعات ═══ */}
        <div className="flex flex-col rounded-2xl border border-zinc-800 bg-[#0A0A0A] p-6">
          {discount > 0 && (
            <span className="mb-4 inline-flex w-fit rounded-md bg-[#6ECB9E] px-3 py-1.5 text-sm font-black text-white">
              -{discount}٪ OFF
            </span>
          )}

          <p className="text-sm font-black uppercase tracking-widest text-zinc-500">
            {brand}
          </p>

          <h1 className="mt-2 text-2xl font-black leading-9 text-white md:text-3xl md:leading-tight">
            {product.name}
          </h1>

          <p className="mt-3 text-sm text-zinc-500" dir="ltr">
            SKU:{" "}
            <span className="font-mono text-zinc-400">{productCode}</span>
          </p>

          <div className="mt-2 flex items-center gap-2 text-base">
            <span className="text-[#6ECB9E]">
              {"★".repeat(Math.round(product.rating))}
              <span className="text-zinc-700">
                {"★".repeat(5 - Math.round(product.rating))}
              </span>
            </span>
            <span className="text-zinc-500">
              ({product.reviews.toLocaleString("fa-IR")} reviews)
            </span>
          </div>

          <div className="mt-4 flex items-baseline gap-4">
            <span className="text-3xl font-black text-[#6ECB9E] md:text-4xl">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-base text-zinc-500 line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>

          <p className="mt-4 text-base leading-8 text-zinc-400">
            {product.shortDesc}
          </p>

          <div className="mt-5 space-y-4">
            {hasColors && (
              <div>
                <p className="mb-3 text-sm font-bold text-zinc-400">
                  رنگ: <span className="text-white">{selectedColor}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {colors.map((c) => (
                    <button
                      key={c.label}
                      type="button"
                      onClick={() => setSelectedColor(c.label)}
                      className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-bold transition ${
                        selectedColor === c.label
                          ? "border-[#6ECB9E] bg-[#6ECB9E]/10 text-[#6ECB9E]"
                          : "border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white"
                      }`}
                    >
                      {c.image && (
                        <span className="h-6 w-6 overflow-hidden rounded border border-zinc-700 bg-zinc-950">
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

            {hasSizes && (
              <div>
                <p className="mb-3 text-sm font-bold text-zinc-400">
                  سایز: <span className="text-white">{selectedSize}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((s) => (
                    <button
                      key={s.label}
                      type="button"
                      onClick={() => setSelectedSize(s.label)}
                      className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-bold transition ${
                        selectedSize === s.label
                          ? "border-[#6ECB9E] bg-[#6ECB9E]/10 text-[#6ECB9E]"
                          : "border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white"
                      }`}
                    >
                      {s.image && (
                        <span className="h-6 w-6 overflow-hidden rounded border border-zinc-700 bg-zinc-950">
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

            {/* ─── تعداد + دکمه + علاقه‌مندی ─── */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <div className="flex items-center rounded-full border border-zinc-800 bg-zinc-950/50 px-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-12 w-9 items-center justify-center text-lg font-bold text-zinc-400 transition hover:text-white"
                >
                  −
                </button>
                <span className="min-w-[32px] text-center text-base font-black text-white">
                  {quantity.toLocaleString("fa-IR")}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex h-12 w-9 items-center justify-center text-lg font-bold text-zinc-400 transition hover:text-white"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={() => product.inStock && addItem(product, quantity)}
                disabled={!product.inStock}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#6ECB9E] px-10 py-3.5 text-base font-black text-white transition hover:bg-[#5AB88A] disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-600 md:text-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                <span>{product.inStock ? "افزودن به سبد" : "ناموجود"}</span>
              </button>

              <button
                type="button"
                onClick={() => toggleItem(product, "product")}
                aria-label="علاقه‌مندی"
                className={`inline-flex h-12 w-12 items-center justify-center rounded-full border transition ${
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
                  className="h-5 w-5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="mt-auto space-y-3 border-t border-zinc-800 pt-4">
            {[
              "موجود در انبار، ارسال فوری",
              "ضمانت اصالت و کیفیت کالا",
              "ارسال رایگان بالای ۲ میلیون",
            ].map((text, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-sm text-zinc-400"
              >
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border border-[#6ECB9E]/40 text-[#6ECB9E]">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="h-3 w-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════ بخش پایین: توضیحات + چرا ما ═══════ */}
      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-zinc-800 bg-[#0A0A0A] p-6 md:p-7">
          <h2 className="mb-5 text-lg font-black text-white md:text-xl">
            توضیحات
          </h2>
          <p className="whitespace-pre-line text-sm leading-8 text-zinc-400 md:text-base md:leading-9">
            {product.description}
          </p>

          {product.features.length > 0 && (
            <ul className="mt-6 space-y-3">
              {product.features.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-3 text-sm text-zinc-400 md:text-base"
                >
                  <span className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#6ECB9E]" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-[#0A0A0A] p-6 md:p-7">
          <h2 className="mb-6 text-lg font-black text-white md:text-xl">
            چرا از ما بخرید؟
          </h2>
          <div className="space-y-5">
            {whyUsItems.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-[#6ECB9E]/30 text-[#6ECB9E]">
                  {item.icon}
                </span>
                <div>
                  <p className="text-sm font-black text-white md:text-base">
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500 md:text-sm">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════ مشخصات فنی ═══════ */}
      <div className="rounded-2xl border border-zinc-800 bg-[#0A0A0A] p-6 md:p-7">
        <h2 className="mb-6 text-lg font-black text-white md:text-xl">
          مشخصات فنی
        </h2>
        <div className="grid gap-3 md:grid-cols-2 md:gap-x-8">
          {[
            { label: "برند", value: brand },
            { label: "نام انگلیسی", value: englishName },
            { label: "شناسه", value: productCode },
            {
              label: "امتیاز",
              value: `${product.rating} از ۵`,
            },
            ...(colors.length > 0
              ? [
                  {
                    label: "رنگ‌ها",
                    value: colors.map((c) => c.label).join(" / "),
                  },
                ]
              : []),
            ...(sizes.length > 0
              ? [
                  {
                    label: "سایزها",
                    value: sizes.map((s) => s.label).join(" / "),
                  },
                ]
              : []),
          ].map((row, i) => (
            <div
              key={i}
              className="flex items-center justify-between border-b border-zinc-800 py-3 text-sm md:text-base"
            >
              <span className="text-zinc-500">{row.label}</span>
              <span
                className="font-bold text-white"
                dir={row.label === "نام انگلیسی" || row.label === "شناسه" ? "ltr" : undefined}
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
