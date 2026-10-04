"use client";

import { useState, useRef } from "react";
import { Product } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { getProductImage } from "@/lib/productImages";
import { useWishlist } from "@/components/context/WishlistContext";
import { useCart } from "@/components/context/CartContext";

type FlyingItem = {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  type: "cart" | "wishlist";
};

export default function ProductCard({ product }: { product: Product }) {
  const { toggleItem, isInWishlist } = useWishlist();
  const { items, addItem } = useCart();
  const inWishlist = isInWishlist(product.id);
  const inCart = items.some((i) => i.id === product.id);

  const cartButtonRef = useRef<HTMLButtonElement>(null);
  const wishlistButtonRef = useRef<HTMLButtonElement>(null);
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const image = product.image || getProductImage(product.category, product.id);

  const colors = product.colors || [];

  function getTargetPosition(target: "cart" | "wishlist") {
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      const mobileSelector =
        target === "cart"
          ? "[data-cart-icon-mobile]"
          : "[data-wishlist-icon-mobile]";
      const mobileEl = document.querySelector(mobileSelector) as HTMLElement;

      if (mobileEl) {
        const rect = mobileEl.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
      }

      // Fallback
      return {
        x: target === "cart" ? window.innerWidth / 2 : window.innerWidth - 100,
        y: window.innerHeight - 40,
      };
    } else {
      const selector = target === "cart" ? "[data-cart-icon]" : "[data-wishlist-icon]";
      const desktopEl = document.querySelector(selector) as HTMLElement;

      if (desktopEl) {
        const rect = desktopEl.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
      }

      // Fallback
      return {
        x: window.innerWidth - (target === "cart" ? 150 : 220),
        y: 100,
      };
    }
  }

  function triggerAnimation(
    buttonRef: React.RefObject<HTMLButtonElement | null>,
    type: "cart" | "wishlist"
  ) {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const target = getTargetPosition(type);

    const newItem: FlyingItem = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      targetX: target.x,
      targetY: target.y,
      type,
    };

    setFlyingItems((prev) => [...prev, newItem]);

    setTimeout(() => {
      setFlyingItems((prev) => prev.filter((i) => i !== newItem));
    }, 800);
  }

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!product.inStock) return;

    triggerAnimation(cartButtonRef, "cart");
    addItem(product, 1);
  }

  function handleWishlistToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    // اگه داشت اضافه میشد، انیمیشن نشون بده
    if (!inWishlist) {
      triggerAnimation(wishlistButtonRef, "wishlist");
    }

    toggleItem(product, "product");
  }

  return (
    <>
      <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#E8DFC8] bg-white transition hover:border-amber-500 hover:shadow-lg">
        {/* آیکون سبد خرید (گوشه چپ-بالا) */}
        <button
          ref={cartButtonRef}
          type="button"
          onClick={handleAddToCart}
          disabled={!product.inStock}
          aria-label="افزودن به سبد خرید"
          className={
            "absolute left-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded-full border shadow-sm transition disabled:cursor-not-allowed " +
            (inCart
              ? "border-green-600 bg-green-600 text-white"
              : "border-[#E8DFC8] bg-white text-gray-500 hover:border-amber-500 hover:bg-amber-500 hover:text-white disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-300")
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
            />
          </svg>
        </button>

        {/* دکمه قلب (گوشه راست-بالا) */}
        <button
          ref={wishlistButtonRef}
          type="button"
          onClick={handleWishlistToggle}
          aria-label={inWishlist ? "حذف از علاقه‌مندی" : "افزودن به علاقه‌مندی"}
          className={
            "absolute right-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded-full border shadow-sm transition " +
            (inWishlist
              ? "border-red-500 bg-red-500 text-white"
              : "border-[#E8DFC8] bg-white text-gray-400 hover:border-red-500 hover:text-red-500")
          }
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
        </button>

        <a
          href={`/product/${product.id}`}
          className="flex flex-1 flex-col"
        >
          {/* تصویر */}
          <div className="relative aspect-square overflow-hidden bg-white">
            <img
              src={image}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-contain p-3 transition duration-500 group-hover:scale-105"
            />

            {/* برچسب تخفیف */}
            {discount > 0 && (
              <span className="absolute bottom-2 right-2 rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-bold text-white shadow md:text-xs">
                {discount}٪ تخفیف
              </span>
            )}

            {/* برچسب ناموجود */}
            {!product.inStock && (
              <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-sm font-bold text-white">
                ناموجود
              </span>
            )}
          </div>

          {/* اطلاعات */}
          <div className="flex flex-1 flex-col p-3">
            <h3 className="line-clamp-2 min-h-[2.5rem] text-xs font-bold leading-6 text-gray-800 transition group-hover:text-amber-600 md:text-sm">
              {product.name}
            </h3>

            {/* رنگ‌ها */}
            {colors.length > 0 && (
              <div className="mt-2 flex items-center gap-1.5">
                {colors.slice(0, 4).map((c, i) => (
                  <span
                    key={i}
                    title={c.label}
                    className="h-3.5 w-3.5 rounded-full border border-gray-200"
                    style={{ backgroundColor: getColorHex(c.label) }}
                  />
                ))}
                {colors.length > 4 && (
                  <span className="text-[10px] text-gray-500">
                    +{colors.length - 4}
                  </span>
                )}
              </div>
            )}

            {/* موجودی */}
            <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-green-600 md:text-xs">
              {product.inStock ? (
                <>
                  <span>✓</span>
                  <span>موجود در انبار</span>
                </>
              ) : (
                <span className="text-red-500">ناموجود</span>
              )}
            </div>

            {/* قیمت */}
            <div className="mt-auto pt-3">
              {product.oldPrice && (
                <div className="mb-0.5 text-[11px] text-gray-400 line-through md:text-xs">
                  {formatPrice(product.oldPrice)}
                </div>
              )}
              <div className="text-sm font-black text-gray-900 md:text-base">
                {formatPrice(product.price)}
              </div>
            </div>
          </div>
        </a>
      </div>

      {/* ─── انیمیشن‌های پرتاب ─── */}
      {flyingItems.map((item, index) => (
        <div
          key={index}
          className="pointer-events-none fixed z-[9999]"
          style={{
            left: item.x,
            top: item.y,
            ["--target-x" as any]: `${item.targetX - item.x}px`,
            ["--target-y" as any]: `${item.targetY - item.y}px`,
            animation:
              "flyToCartCard 0.8s cubic-bezier(0.5, -0.5, 1, 1) forwards",
          }}
        >
          <div
            className={
              "flex h-10 w-10 items-center justify-center rounded-full shadow-2xl " +
              (item.type === "cart" ? "bg-amber-500" : "bg-red-500")
            }
          >
            {item.type === "cart" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="white"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="white"
                viewBox="0 0 24 24"
                className="h-5 w-5"
              >
                <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            )}
          </div>
        </div>
      ))}

      <style jsx global>{`
        @keyframes flyToCartCard {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          30% {
            transform: translate(-50%, -150%) scale(1.3);
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

function getColorHex(name: string): string {
  const map: Record<string, string> = {
    مشکی: "#1a1a1a",
    سفید: "#ffffff",
    قرمز: "#dc2626",
    آبی: "#2563eb",
    سبز: "#16a34a",
    زرد: "#eab308",
    خاکی: "#a8917a",
    بژ: "#e8dcc4",
    نارنجی: "#ea580c",
    قهوه‌ای: "#78350f",
    طوسی: "#6b7280",
    خاکستری: "#9ca3af",
    صورتی: "#ec4899",
    بنفش: "#7c3aed",
  };
  return map[name] || "#d1d5db";
}