"use client";

import { useMemo, useRef } from "react";
import Link from "next/link";
import { useProducts } from "@/components/context/ProductsContext";
import { useWishlist } from "@/components/context/WishlistContext";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/data/products";

const PRODUCTS_TO_SHOW = 10;

const HEART_PATH =
  "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z";

const HEART_FILLED_PATH =
  "M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z";

const BAG_PATH =
  "M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z";

const CHEVRON_LEFT = "M15.75 19.5L8.25 12l7.5-7.5";
const CHEVRON_RIGHT = "M8.25 4.5l7.5 7.5-7.5 7.5";

function Icon({
  d,
  className,
  strokeWidth = 2,
}: {
  d: string;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      stroke="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

function ProductCard({ product }: { product: Product }) {
 const { isInWishlist, toggleItem } = useWishlist();
  const inWishlist = isInWishlist(product.id);
  const hasDiscount = !!product.oldPrice;
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  // 🆕 عکس دوم (اگه موجود باشه)
  const secondImage = product.images?.[1];

  return (
    <div className="group relative">
      <Link
        href={`/product/${product.id}`}
        className="relative block aspect-[3/4] w-full overflow-hidden bg-theme-surface"
      >
        {/* ─── عکس اول (پیش‌فرض) ─── */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        {/* ─── عکس دوم (فقط اگه موجود باشه) — fade-in روی hover ─── */}
        {secondImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={secondImage}
            alt={`${product.name} — نمای دوم`}
            loading="lazy"
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover object-center opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
          />
        )}

        {/* ناموجود */}
        {!product.inStock && (
          <span className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 text-xs font-bold text-white">
            ناموجود
          </span>
        )}

        {/* تخفیف — بالا چپ */}
        {hasDiscount && discount > 0 && (
          <span className="absolute left-2 top-2 z-10 rounded-sm bg-accent px-1.5 py-0.5 text-[10px] font-black text-white md:left-3 md:top-3">
            {discount}٪
          </span>
        )}

        {/* بج «جدید» — پایین چپ */}
        <span className="absolute bottom-2 left-2 z-10 bg-white px-2.5 py-1 text-[10px] font-bold text-black md:bottom-3 md:left-3 md:text-[11px]">
          جدید
        </span>
      </Link>

      {/* ─── آیکون‌های شناور بالا ─── */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between p-2 md:p-3">
        <button
          type="button"
          aria-label="افزودن به سبد"
          className="pointer-events-auto flex h-7 w-7 items-center justify-center text-black transition hover:opacity-60 md:h-8 md:w-8"
          onClick={(e) => {
            e.preventDefault();
            // TODO: add to cart
          }}
        >
          <Icon d={BAG_PATH} className="h-5 w-5 md:h-6 md:w-6" strokeWidth={1.6} />
        </button>

        <button
          type="button"
          aria-label="افزودن به علاقه‌مندی"
          className={
            "pointer-events-auto flex h-7 w-7 items-center justify-center transition hover:opacity-60 md:h-8 md:w-8 " +
            (inWishlist ? "text-red-500" : "text-black")
          }
onClick={(e) => {
  e.preventDefault();
  toggleItem(product, "product");
}}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={inWishlist ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={1.6}
            className="h-5 w-5 md:h-6 md:w-6"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={inWishlist ? HEART_FILLED_PATH : HEART_PATH}
            />
          </svg>
        </button>
      </div>

      {/* ─── اطلاعات ─── */}
      <Link href={`/product/${product.id}`} className="mt-2.5 block md:mt-3">
        <h3 className="line-clamp-1 text-[13px] font-semibold text-theme md:text-[14px]">
          {product.name}
        </h3>

        <p className="mt-0.5 line-clamp-1 text-[12px] text-theme-muted md:text-[13px]">
          {product.inStock ? "موجود در انبار" : "ناموجود"}
        </p>

        <div className="mt-1.5 flex items-center gap-2">
          <span className="text-[14px] font-bold text-theme md:text-[15px]">
            {formatPrice(product.price)}
          </span>
          {product.oldPrice && (
            <span className="text-[12px] text-theme-muted line-through md:text-[13px]">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
}

export default function CategoryGrid() {
  const { products, loading } = useProducts();
  const scrollRef = useRef<HTMLDivElement>(null);

  const latestProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => Number(b.id) - Number(a.id))
      .slice(0, PRODUCTS_TO_SHOW);
  }, [products]);

  function scrollPrev() {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: el.clientWidth * 0.8, behavior: "smooth" });
  }

  function scrollNext() {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: -el.clientWidth * 0.8, behavior: "smooth" });
  }

  if (loading) {
    return (
      <div className="w-full px-3 sm:px-6 md:px-7">
        <section className="py-10 md:py-14">
          <div className="mb-6 flex items-center justify-between md:mb-8">
            <div className="h-7 w-32 animate-pulse bg-theme-surface" />
            <div className="h-5 w-20 animate-pulse bg-theme-surface" />
          </div>
          <div className="flex gap-2 md:gap-2.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="w-[58%] shrink-0 sm:w-[calc((100%-16px)/3)] md:w-[calc((100%-20px)/4)] lg:w-[calc((100%-40px)/5)]"
              >
                <div className="aspect-[3/4] w-full animate-pulse bg-theme-surface" />
                <div className="mt-2.5 h-4 w-3/4 animate-pulse bg-theme-surface" />
                <div className="mt-2 h-4 w-1/3 animate-pulse bg-theme-surface" />
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (latestProducts.length === 0) return null;

  return (
    <div className="w-full px-3 sm:px-6 md:px-7">
      <section className="py-10 md:py-14">
        {/* ─── هدر سکشن ─── */}
        <div className="mb-6 flex items-end justify-between md:mb-8">
          {/* راست: تیتر + «مشاهده همه» (فقط دسکتاپ، کنار تیتر) */}
          <div className="flex items-baseline gap-4">
            <h2 className="text-lg font-black tracking-tight text-theme md:text-xl lg:text-2xl">
              جدیدترین‌ها
            </h2>

            <Link
              href="/products?sort=newest"
              className="hidden text-[12px] font-semibold text-theme-muted underline underline-offset-4 transition hover:text-theme md:inline md:text-[13px]"
            >
              مشاهده همه
            </Link>
          </div>

          {/* چپ: «مشاهده همه» (موبایل) + فلش‌ها (دسکتاپ) */}
          <div className="flex items-center gap-3 md:gap-1">
            {/* مشاهده همه — فقط موبایل */}
            <Link
              href="/products?sort=newest"
              className="text-[12px] font-semibold text-theme-muted underline underline-offset-4 transition hover:text-theme md:hidden"
            >
              مشاهده همه
            </Link>

            {/* فلش‌ها — فقط دسکتاپ */}
            <div className="hidden items-center gap-1 md:flex">
              <button
                type="button"
                aria-label="قبلی"
                onClick={scrollPrev}
                className="flex h-9 w-9 items-center justify-center text-theme transition hover:opacity-50"
              >
                <Icon d={CHEVRON_RIGHT} strokeWidth={2} className="h-6 w-6" />
              </button>

              <button
                type="button"
                aria-label="بعدی"
                onClick={scrollNext}
                className="flex h-9 w-9 items-center justify-center text-theme transition hover:opacity-50"
              >
                <Icon d={CHEVRON_LEFT} strokeWidth={2} className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* ─── اسکرول افقی ─── */}
        <div
          ref={scrollRef}
          className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2 scrollbar-hide md:gap-2.5"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {latestProducts.map((product) => (
            <div
              key={product.id}
              className="w-[58%] shrink-0 snap-start sm:w-[calc((100%-16px)/3)] md:w-[calc((100%-20px)/4)] lg:w-[calc((100%-40px)/5)]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}