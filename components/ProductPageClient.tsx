"use client";

import { useState, useRef } from "react";
import { Product } from "@/data/products";
import { useCart } from "@/components/context/CartContext";
import { useWishlist } from "@/components/context/WishlistContext";
import { formatPrice } from "@/lib/utils";

type FlyingItem = {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
};

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
  const [activeTab, setActiveTab] = useState<"desc" | "specs">("specs");
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);

  const cartButtonRef = useRef<HTMLButtonElement>(null);

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

  function getCartTarget() {
    const isMobile = window.innerWidth < 768;
    const selector = isMobile
      ? "[data-cart-icon-mobile]"
      : "[data-cart-icon]";
    const el = document.querySelector(selector) as HTMLElement | null;
    if (el) {
      const rect = el.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    }
    // fallback
    return {
      x: isMobile ? window.innerWidth / 2 : window.innerWidth - 100,
      y: isMobile ? window.innerHeight - 40 : 100,
    };
  }

  function handleAddToCart() {
    if (!product.inStock) return;

    // انیمیشن پرتاب
    if (cartButtonRef.current) {
      const rect = cartButtonRef.current.getBoundingClientRect();
      const target = getCartTarget();
      const newItem: FlyingItem = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        targetX: target.x,
        targetY: target.y,
      };
      setFlyingItems((prev) => [...prev, newItem]);
      setTimeout(() => {
        setFlyingItems((prev) => prev.filter((i) => i !== newItem));
      }, 800);
    }

    addItem(product, quantity);
  }

  return (
    <div className="space-y-6">
      {/* ═══════ گرید اصلی: گالری + اطلاعات ═══════ */}
      <div className="grid gap-6 lg:grid-cols-[1fr_540px] lg:gap-8">
        {/* ═══ ستون گالری ═══ */}
        <div className="overflow-hidden rounded-lg border border-theme bg-theme-card">
          <div className="relative aspect-square w-full overflow-hidden bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeImage}
              alt={product.name}
              className="absolute inset-0 h-full w-full object-cover"
            />

            {discount > 0 && (
              <span className="absolute right-3 top-3 z-10 rounded bg-accent px-2.5 py-1 text-sm font-bold text-white">
                -{discount}%
              </span>
            )}

            {!product.inStock && (
              <span className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 text-lg font-bold text-white">
                ناموجود
              </span>
            )}
          </div>

          {galleryImages.length > 1 && (
            <div className="flex items-center justify-start gap-2 overflow-x-auto border-t border-theme bg-theme-surface/40 p-2 md:gap-3 md:p-3">
              {galleryImages.slice(0, 12).map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImageIndex(i)}
                  className={`relative aspect-square w-14 flex-shrink-0 overflow-hidden rounded border-2 transition md:w-16 ${
                    i === activeImageIndex
                      ? "border-accent"
                      : "border-theme/40 hover:border-theme"
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
          )}
        </div>

        {/* ═══ ستون اطلاعات ═══ */}
        <div className="rounded-lg border border-theme bg-theme-card p-6 md:p-8">
          <h1 className="text-2xl font-bold leading-tight text-theme md:text-3xl">
            {product.name}
          </h1>

          <p className="mt-3 text-sm font-semibold uppercase tracking-widest text-theme-muted">
            {brand}
          </p>

          <div className="my-6 border-t border-theme" />

          <div className="flex items-center gap-2">
            <div className="flex text-xl tracking-wider md:text-2xl">
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className="text-theme-muted">
                  ☆
                </span>
              ))}
            </div>
            <span className="text-sm text-theme-muted md:text-base">
              ({product.reviews.toLocaleString("fa-IR")} نظر)
            </span>
          </div>

          {hasColors && (
            <div className="mt-7">
              <p className="mb-3 text-base font-bold text-theme md:text-lg">
                رنگ:{" "}
                <span className="font-normal text-theme-muted">
                  {selectedColor}
                </span>
              </p>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => (
                  <button
                    key={c.label}
                    type="button"
                    onClick={() => setSelectedColor(c.label)}
                    className={`flex min-w-[90px] items-center justify-center gap-2 rounded border px-4 py-3 text-base font-semibold transition md:text-lg ${
                      selectedColor === c.label
                        ? "border-theme bg-theme-surface text-theme"
                        : "border-theme text-theme-muted hover:border-theme-muted"
                    }`}
                  >
                    {c.image && (
                      <span className="h-5 w-5 overflow-hidden rounded-sm border border-theme">
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
            <div className="mt-6">
              <p className="mb-3 text-base font-bold text-theme md:text-lg">
                سایز:{" "}
                <span className="font-normal text-theme-muted">
                  {selectedSize}
                </span>
              </p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => setSelectedSize(s.label)}
                    className={`min-w-[90px] rounded border px-4 py-3 text-base font-semibold transition md:text-lg ${
                      selectedSize === s.label
                        ? "border-theme bg-theme-surface text-theme"
                        : "border-theme text-theme-muted hover:border-theme-muted"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-7 flex items-baseline gap-4">
            <span className="text-3xl font-bold text-theme md:text-4xl">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-lg text-theme-muted line-through md:text-xl">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>

          <div className="mt-7">
            <p className="mb-3 text-base font-bold text-theme md:text-lg">
              تعداد:
            </p>
            <div className="flex w-fit items-center rounded border border-theme">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-12 w-12 items-center justify-center text-2xl text-theme-muted transition hover:text-theme md:h-14 md:w-14"
              >
                −
              </button>
              <span className="w-16 border-x border-theme py-3 text-center text-lg font-bold text-theme md:text-xl">
                {quantity.toLocaleString("fa-IR")}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="flex h-12 w-12 items-center justify-center text-2xl text-theme-muted transition hover:text-theme md:h-14 md:w-14"
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-3">
            <button
              ref={cartButtonRef}
              type="button"
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="rounded bg-accent px-4 py-4 text-base font-bold text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:bg-theme-surface disabled:text-theme-muted md:text-lg"
            >
              {product.inStock ? "افزودن به کوله" : "ناموجود"}
            </button>

            <button
              type="button"
              onClick={() => {
                if (product.inStock) {
                  addItem(product, quantity);
                  window.location.href = "/checkout";
                }
              }}
              disabled={!product.inStock}
              className="rounded bg-zinc-900 px-4 py-4 text-base font-bold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 md:text-lg dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
            >
              خرید سریع
            </button>
          </div>

          <button
            type="button"
            className="mt-4 w-full text-center text-sm font-medium text-theme-muted underline underline-offset-4 transition hover:text-theme md:text-base"
          >
            گزینه‌های پرداخت دیگر
          </button>

          <div className="mt-7 grid grid-cols-2 gap-5 border-t border-theme pt-7">
            {[
              {
                title: "ارسال رایگان",
                desc: "سفارش بالای ۲ میلیون",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                ),
              },
              {
                title: "بازگشت رایگان",
                desc: "تا ۳۰ روز",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                  </svg>
                ),
              },
              {
                title: "ارسال ۱-۲ روزه",
                desc: "سریع و مطمئن",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
              {
                title: "پشتیبانی عالی",
                desc: "همیشه در دسترس",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded border border-theme text-theme-muted md:h-11 md:w-11">
                  {item.icon}
                </span>
                <div>
                  <p className="text-sm font-bold text-theme md:text-base">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-xs text-theme-muted md:text-sm">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════ تب مشخصات فنی / توضیحات ═══════ */}
      <div className="rounded-lg border border-theme bg-theme-card p-6 md:p-8">
        <div className="mb-6 flex gap-2 border-b border-theme pb-3">
          <button
            type="button"
            onClick={() => setActiveTab("specs")}
            className={
              "rounded-lg px-6 py-3 text-base font-bold transition md:text-lg " +
              (activeTab === "specs"
                ? "bg-accent text-white shadow-lg shadow-accent/20"
                : "bg-theme-surface text-theme-muted hover:text-accent")
            }
          >
            مشخصات فنی
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("desc")}
            className={
              "rounded-lg px-6 py-3 text-base font-bold transition md:text-lg " +
              (activeTab === "desc"
                ? "bg-accent text-white shadow-lg shadow-accent/20"
                : "bg-theme-surface text-theme-muted hover:text-accent")
            }
          >
            توضیحات
          </button>
        </div>

        {activeTab === "specs" ? (
          <div className="grid gap-3 md:grid-cols-2 md:gap-x-10">
            {[
              { label: "برند", value: brand },
              { label: "نام انگلیسی", value: englishName },
              { label: "شناسه", value: productCode },
              { label: "امتیاز", value: `${product.rating} از ۵` },
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
                className="flex items-center justify-between border-b border-theme py-4 text-base md:text-lg"
              >
                <span className="text-theme-muted">{row.label}</span>
                <span
                  className="font-bold text-theme"
                  dir={
                    row.label === "نام انگلیسی" || row.label === "شناسه"
                      ? "ltr"
                      : undefined
                  }
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div>
            {product.shortDesc && (
              <p className="mb-5 text-base font-bold text-theme md:text-lg">
                {product.shortDesc}
              </p>
            )}

            <p className="mb-6 text-sm text-theme-muted md:text-base">
              شناسه: <span className="font-mono">{productCode}</span> | برند:{" "}
              {brand} | امتیاز: {product.rating} از ۵
            </p>

            <p className="whitespace-pre-line text-base leading-9 text-theme-muted md:text-lg md:leading-10">
              {product.description}
            </p>

            {product.features.length > 0 && (
              <ul className="mt-7 space-y-3">
                {product.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-3 text-base text-theme-muted md:text-lg"
                  >
                    <span className="mt-3 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-theme-muted" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* ═══════ انیمیشن پرتاب به کوله ═══════ */}
      {flyingItems.map((item, index) => (
        <div
          key={index}
          className="pointer-events-none fixed z-[9999]"
          style={{
            left: item.x,
            top: item.y,
            ["--target-x" as any]: `${item.targetX - item.x}px`,
            ["--target-y" as any]: `${item.targetY - item.y}px`,
            animation: "flyToCartPage 0.8s cubic-bezier(0.5, -0.5, 1, 1) forwards",
          }}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent shadow-2xl shadow-accent/50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="white"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>
          </div>
        </div>
      ))}

      <style jsx global>{`
        @keyframes flyToCartPage {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          30% {
            transform: translate(-50%, -150%) scale(1.4);
            opacity: 1;
          }
          100% {
            transform: translate(
                calc(-50% + var(--target-x)),
                calc(-50% + var(--target-y))
              )
              scale(0.2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}