"use client";

import { useRef, useState } from "react";
import { formatPrice } from "@/lib/utils";
import { getProductImage } from "@/lib/productImages";
import { useWishlist } from "@/components/context/WishlistContext";
import { Product } from "@/data/products";

type FlyingItem = {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
};

export default function ProductGridCard({ product }: { product: Product }) {
  const { toggleItem, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const [flying, setFlying] = useState<FlyingItem | null>(null);

  const image =
    product.image || getProductImage(product.category, product.id);
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  function getTargetPosition() {
    const isMobile = window.innerWidth < 768;
    const selector = isMobile
      ? "[data-wishlist-icon-mobile]"
      : "[data-wishlist-icon]";
    const el = document.querySelector(selector) as HTMLElement;

    if (el) {
      const rect = el.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    }

    return isMobile
      ? { x: window.innerWidth / 2, y: window.innerHeight - 40 }
      : { x: window.innerWidth - 150, y: 100 };
  }

  function handleWishlistToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!inWishlist && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const target = getTargetPosition();

      setFlying({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        targetX: target.x,
        targetY: target.y,
      });

      setTimeout(() => setFlying(null), 800);
    }

    toggleItem(product, "product");
  }

  return (
    <>
      <a
        href={`/product/${product.id}`}
        className="group relative block overflow-hidden rounded-xl border border-theme bg-theme-card transition duration-300 hover:border-accent/60 hover:shadow-lg hover:shadow-accent/10"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-theme-surface">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover object-center transition duration-700 group-hover:scale-105"
          />

          {discount > 0 && (
            <span className="absolute right-2 top-2 rounded bg-accent px-2 py-0.5 text-[10px] font-black text-white shadow-lg">
              {discount}٪
            </span>
          )}

          {!product.inStock && (
            <span className="absolute inset-0 flex items-center justify-center bg-black/70 text-xs font-bold text-white">
              ناموجود
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          <p className="text-[9px] font-bold uppercase tracking-wider text-theme-muted">
            {product.brand || product.category}
          </p>
          <h3 className="mt-1 line-clamp-1 text-xs font-bold text-theme md:text-sm">
            {product.name}
          </h3>

          <div className="mt-2.5 flex items-center justify-between gap-2">
            <div className="flex flex-col">
              {product.oldPrice && (
                <span className="text-[10px] text-theme-muted line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
              <span className="text-xs font-black text-theme md:text-sm">
                {formatPrice(product.price)}
              </span>
            </div>

            {/* دکمه قلب */}
            <button
              ref={buttonRef}
              type="button"
              onClick={handleWishlistToggle}
              aria-label={inWishlist ? "حذف از علاقه‌مندی" : "افزودن به علاقه‌مندی"}
              className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border transition ${
                inWishlist
                  ? "border-red-500 bg-red-500 text-white"
                  : "border-theme bg-transparent text-theme-muted hover:border-red-500 hover:text-red-500"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={inWishlist ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-3.5 w-3.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
            </button>
          </div>
        </div>
      </a>

      {/* ─── انیمیشن پرتاب قلب ─── */}
      {flying && (
        <div
          className="pointer-events-none fixed z-[9999]"
          style={{
            left: flying.x,
            top: flying.y,
            ["--target-x" as any]: `${flying.targetX - flying.x}px`,
            ["--target-y" as any]: `${flying.targetY - flying.y}px`,
            animation:
              "flyToWishlist 0.8s cubic-bezier(0.5, -0.5, 1, 1) forwards",
          }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white shadow-2xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="h-5 w-5"
            >
              <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes flyToWishlist {
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
    </>
  );
}