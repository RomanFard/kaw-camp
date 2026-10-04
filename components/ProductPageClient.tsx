"use client";

import { useState, useRef, useMemo } from "react";
import ProductGallery from "./ProductGallery";
import { Product } from "@/data/products";
import { useCart } from "@/components/context/CartContext";
import { formatPrice } from "@/lib/utils";

function getCategoryEmoji(cat: string) {
  const map: Record<string, string> = {
    tent: "⛺",
    sleep: "🛏️",
    mattress: "🟦",
    backpack: "🎒",
    clothing: "🧥",
    shoes: "🥾",
    socks: "🧦",
    gaiters: "🦵",
    tools: "🧰",
    lighting: "🔦",
    bottle: "🥤",
    cooking: "🍳",
    sunglasses: "🕶️",
    watch: "⌚",
    bicycle: "🚲",
    accessories: "🎁",
  };
  return map[cat] || "📦";
}

export default function ProductPageClient({ product }: { product: Product }) {
  const colors = product.colors || [];
  const sizes = product.sizes || [];
  const hasColors = colors.length > 0;
  const hasSizes = sizes.length > 0;

  const [selectedColor, setSelectedColor] = useState<string>(
    hasColors ? colors[0].label : ""
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    hasSizes ? sizes[0].label : ""
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [error, setError] = useState("");
  const [flyingImage, setFlyingImage] = useState<{
    x: number;
    y: number;
    targetX: number;
    targetY: number;
  } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { addItem } = useCart();

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const brand = product.brand || "کو کمپ";
  const englishName = product.englishName || product.slug;
  const productCode = "KC-" + product.id.padStart(4, "0");

  // ─── عکس فعال بر اساس رنگ انتخاب‌شده ───
  const activeColorImage = useMemo(() => {
    if (!selectedColor) return null;
    const color = colors.find((c) => c.label === selectedColor);
    return color?.image || null;
  }, [selectedColor, colors]);

  // ─── عکس فعال بر اساس سایز انتخاب‌شده (fallback) ───
  const activeSizeImage = useMemo(() => {
    if (!selectedSize || activeColorImage) return null;
    const size = sizes.find((s) => s.label === selectedSize);
    return size?.image || null;
  }, [selectedSize, sizes, activeColorImage]);

  // ─── لیست نهایی عکس‌ها برای گالری ───
  // اگه رنگ انتخاب‌شده عکس داره، اول لیست میاد
  const galleryImages = useMemo(() => {
    const baseImages =
      product.images && product.images.length > 0
        ? product.images
        : [product.image];

    const activeImage = activeColorImage || activeSizeImage;

    if (activeImage) {
      // عکس فعال رو اول بذار (بدون تکرار)
      const filtered = baseImages.filter((img) => img !== activeImage);
      return [activeImage, ...filtered];
    }

    return baseImages;
  }, [product.images, product.image, activeColorImage, activeSizeImage]);

  function handleAdd() {
    if (hasColors && !selectedColor) {
      setError("لطفاً ابتدا رنگ محصول را انتخاب کنید");
      setTimeout(() => setError(""), 3000);
      return;
    }
    if (hasSizes && !selectedSize) {
      setError("لطفاً ابتدا سایز محصول را انتخاب کنید");
      setTimeout(() => setError(""), 3000);
      return;
    }

    // انیمیشن پرتاب
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const isMobile = window.innerWidth < 768;

      let cartX = 0;
      let cartY = 0;

      if (isMobile) {
        const mobileCart = document.querySelector(
          "[data-cart-icon-mobile]"
        ) as HTMLElement;
        if (mobileCart) {
          const cartRect = mobileCart.getBoundingClientRect();
          cartX = cartRect.left + cartRect.width / 2;
          cartY = cartRect.top + cartRect.height / 2;
        } else {
          cartX = window.innerWidth / 2;
          cartY = window.innerHeight - 40;
        }
      } else {
        const desktopCart = document.querySelector(
          "[data-cart-icon]"
        ) as HTMLElement;
        if (desktopCart) {
          const cartRect = desktopCart.getBoundingClientRect();
          cartX = cartRect.left + cartRect.width / 2;
          cartY = cartRect.top + cartRect.height / 2;
        } else {
          cartX = window.innerWidth - 150;
          cartY = 100;
        }
      }

      setFlyingImage({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        targetX: cartX,
        targetY: cartY,
      });
    }

    addItem(product, quantity);
    setError("");

    setTimeout(() => {
      setFlyingImage(null);
      setAdded(true);
    }, 800);

    setTimeout(() => {
      setShowCheckout(true);
    }, 2000);
  }

  return (
    <div>
      {/* ═══ بخش بالا: گالری + اطلاعات ═══ */}
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
        {/* گالری تصاویر */}
        <div className="order-1">
          <ProductGallery
            images={galleryImages}
            productName={product.name}
            productCategory={product.category}
            fallbackEmoji={getCategoryEmoji(product.category)}
            activeImageIndex={0}
          />
        </div>

        {/* اطلاعات محصول */}
        <div className="order-2 space-y-4">
          {/* عنوان */}
          <div>
            <h1 className="text-lg font-black leading-8 text-gray-900 md:text-2xl md:leading-10">
              {product.name}
            </h1>
            <p
              className="mt-1 hidden break-words text-xs text-gray-400 md:block md:text-sm"
              dir="ltr"
            >
              {englishName}
            </p>
          </div>

          {/* ویژگی‌های کلیدی (فقط دسکتاپ) */}
          <div className="hidden space-y-2.5 border-y border-[#E8DFC8] py-4 md:block">
            {product.features.slice(0, 6).map((f) => (
              <div key={f} className="flex items-start gap-2 text-sm">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500"></span>
                <span className="break-words text-gray-700">{f}</span>
              </div>
            ))}
          </div>

          {/* برند + شناسه */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-500">برند: </span>
              <span className="font-bold text-gray-900">{brand}</span>
            </div>
            <div>
              <span className="text-gray-500">شناسه: </span>
              <span className="font-bold text-gray-900" dir="ltr">
                {productCode}
              </span>
            </div>
          </div>

          {/* وضعیت موجودی */}
          <div>
            <span
              className={
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold " +
                (product.inStock
                  ? "border border-green-200 bg-green-50 text-green-700"
                  : "border border-red-200 bg-red-50 text-red-700")
              }
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
              {product.inStock ? "موجود در انبار" : "ناموجود"}
            </span>
          </div>

          {/* قیمت */}
          <div className="border-t border-[#E8DFC8] pt-4">
            {product.oldPrice && (
              <div className="mb-1 flex items-center gap-2 text-sm">
                <span className="text-gray-400 line-through">
                  {formatPrice(product.oldPrice)}
                </span>
                <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700">
                  {discount}٪ تخفیف
                </span>
              </div>
            )}
            <div className="text-2xl font-black text-gray-900 md:text-3xl">
              {formatPrice(product.price)}
            </div>
          </div>

          {/* ─── انتخاب رنگ ─── */}
          {hasColors && (
            <div className="border-t border-[#E8DFC8] pt-4">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-gray-500">رنگ:</span>
                <span className="font-bold text-amber-600">{selectedColor}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => (
                  <button
                    key={c.label}
                    type="button"
                    onClick={() => {
                      setSelectedColor(c.label);
                      setError("");
                    }}
                    className={
                      "group flex items-center gap-2 rounded-lg border-2 px-3 py-1.5 text-sm font-semibold transition " +
                      (selectedColor === c.label
                        ? "border-amber-500 bg-amber-50 text-amber-700"
                        : "border-[#E8DFC8] bg-white text-gray-700 hover:border-amber-300")
                    }
                  >
                    {c.image && (
                      <span className="h-7 w-7 overflow-hidden rounded border border-[#D4C5A0] bg-white">
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

          {/* ─── انتخاب سایز ─── */}
          {hasSizes && (
            <div className="border-t border-[#E8DFC8] pt-4">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-gray-500">سایز / ظرفیت:</span>
                <span className="font-bold text-amber-600">{selectedSize}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => {
                      setSelectedSize(s.label);
                      setError("");
                    }}
                    className={
                      "group flex items-center gap-2 rounded-lg border-2 px-3 py-1.5 text-sm font-semibold transition " +
                      (selectedSize === s.label
                        ? "border-amber-500 bg-amber-50 text-amber-700"
                        : "border-[#E8DFC8] bg-white text-gray-700 hover:border-amber-300")
                    }
                  >
                    {s.image && (
                      <span className="h-7 w-7 overflow-hidden rounded border border-[#D4C5A0] bg-white">
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

          {/* تعداد + دکمه */}
          <div className="flex items-stretch gap-3">
            <div className="flex items-center rounded-lg border border-[#E8DFC8] p-1">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-10 w-10 items-center justify-center rounded text-lg font-bold text-gray-600 transition hover:bg-[#F7F1E3]"
              >
                −
              </button>
              <span className="min-w-[40px] text-center font-bold text-gray-900">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="flex h-10 w-10 items-center justify-center rounded text-lg font-bold text-gray-600 transition hover:bg-[#F7F1E3]"
              >
                +
              </button>
            </div>

            {showCheckout && product.inStock ? (
              <a
                href="/checkout"
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-base font-bold text-white shadow-sm transition hover:bg-green-700"
              >
                <span>✓</span>
                <span>ادامه فرآیند خرید</span>
              </a>
            ) : (
              <button
                ref={buttonRef}
                type="button"
                onClick={handleAdd}
                disabled={!product.inStock || added}
                className={
                  "flex-1 rounded-lg px-6 py-3 text-base font-bold text-white shadow-sm transition disabled:cursor-not-allowed disabled:bg-gray-300 " +
                  (added ? "bg-green-600" : "bg-blue-800 hover:bg-blue-900")
                }
              >
                {added
                  ? "✓ به سبد اضافه شد"
                  : product.inStock
                  ? "افزودن به سبد خرید"
                  : "ناموجود"}
              </button>
            )}
          </div>

          {/* پیام خطا */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
              ⚠️ {error}
            </div>
          )}

          {/* اشتراک‌گذاری */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E8DFC8] pt-4 text-xs">
            <div className="flex items-center gap-3 text-gray-600">
              <span>اشتراک‌گذاری:</span>
              <button aria-label="تلگرام" className="transition hover:text-amber-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="h-4 w-4">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
              </button>
              <button aria-label="ایمیل" className="transition hover:text-amber-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </button>
              <button aria-label="واتساپ" className="transition hover:text-amber-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="h-4 w-4">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ بخش پایین: تب‌های توضیحات و نظرات ═══ */}
      <div className="mt-8">
        <ProductDetailTabs
          product={product}
          productCode={productCode}
          brand={brand}
          englishName={englishName}
          colors={colors}
          sizes={sizes}
        />
      </div>

      {/* انیمیشن پرتاب */}
      {flyingImage && (
        <div
          className="pointer-events-none fixed z-[9999]"
          style={{
            left: flyingImage.x,
            top: flyingImage.y,
            ["--target-x" as any]: `${flyingImage.targetX - flyingImage.x}px`,
            ["--target-y" as any]: `${flyingImage.targetY - flyingImage.y}px`,
            animation: "flyToCart 0.8s cubic-bezier(0.5, -0.5, 1, 1) forwards",
          }}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 text-2xl shadow-2xl md:h-16 md:w-16">
            {getCategoryEmoji(product.category)}
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes flyToCart {
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

/* ─────── تب‌های توضیحات ─────── */
function ProductDetailTabs({
  product,
  productCode,
  brand,
  englishName,
  colors,
  sizes,
}: {
  product: Product;
  productCode: string;
  brand: string;
  englishName: string;
  colors: { label: string; value: string; image?: string }[];
  sizes: { label: string; value: string; image?: string }[];
}) {
  const [activeTab, setActiveTab] = useState<"desc" | "reviews">("desc");

  return (
    <div className="rounded-xl border border-[#E8DFC8] bg-white">
      <div className="flex border-b border-[#E8DFC8]">
        <button
          type="button"
          onClick={() => setActiveTab("desc")}
          className={
            "flex items-center gap-2 border-b-2 px-4 py-4 text-sm font-bold transition md:px-6 md:text-base " +
            (activeTab === "desc"
              ? "border-amber-500 text-amber-600"
              : "border-transparent text-gray-600 hover:text-amber-600")
          }
        >
          <span>📝</span>
          <span>توضیحات محصول</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("reviews")}
          className={
            "flex items-center gap-2 border-b-2 px-4 py-4 text-sm font-bold transition md:px-6 md:text-base " +
            (activeTab === "reviews"
              ? "border-amber-500 text-amber-600"
              : "border-transparent text-gray-600 hover:text-amber-600")
          }
        >
          <span>💬</span>
          <span>نظرات ({product.reviews})</span>
        </button>
      </div>

      <div className="p-4 md:p-6">
        {activeTab === "desc" && (
          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            <div>
              <h3 className="mb-3 text-base font-bold text-gray-900">
                {product.name}
              </h3>
              <p className="whitespace-pre-line text-sm leading-8 text-gray-700">
                {product.description}
              </p>

              <h4 className="mt-6 mb-3 text-sm font-bold text-gray-800">
                ویژگی‌های کلیدی
              </h4>
              <ul className="space-y-2">
                {product.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-sm text-gray-700"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500"></span>
                    <span className="break-words">{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl bg-[#F7F1E3]/50 p-5">
              <h4 className="mb-4 border-b border-[#E8DFC8] pb-3 text-sm font-bold text-gray-900">
                مشخصات فنی
              </h4>
              <table className="w-full text-xs md:text-sm">
                <tbody>
                  <tr className="border-b border-[#EDE4CE]">
                    <td className="py-2.5 text-gray-500">برند</td>
                    <td className="py-2.5 text-left font-semibold text-gray-900">
                      {brand}
                    </td>
                  </tr>
                  <tr className="border-b border-[#EDE4CE]">
                    <td className="py-2.5 text-gray-500">نام انگلیسی</td>
                    <td
                      className="break-words py-2.5 text-left font-semibold text-gray-900"
                      dir="ltr"
                    >
                      {englishName}
                    </td>
                  </tr>
                  <tr className="border-b border-[#EDE4CE]">
                    <td className="py-2.5 text-gray-500">شناسه</td>
                    <td
                      className="py-2.5 text-left font-semibold text-gray-900"
                      dir="ltr"
                    >
                      {productCode}
                    </td>
                  </tr>
                  {colors.length > 0 && (
                    <tr className="border-b border-[#EDE4CE]">
                      <td className="py-2.5 text-gray-500">رنگ‌ها</td>
                      <td className="break-words py-2.5 text-left font-semibold text-gray-900">
                        {colors.map((c) => c.label).join(" / ")}
                      </td>
                    </tr>
                  )}
                  {sizes.length > 0 && (
                    <tr className="border-b border-[#EDE4CE]">
                      <td className="py-2.5 text-gray-500">سایزها</td>
                      <td className="break-words py-2.5 text-left font-semibold text-gray-900">
                        {sizes.map((s) => s.label).join(" / ")}
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td className="py-2.5 text-gray-500">امتیاز</td>
                    <td className="py-2.5 text-left font-semibold text-gray-900">
                      {product.rating} از ۵ ⭐
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div>
            <div className="mb-6 flex flex-wrap items-center gap-6 rounded-xl border border-[#E8DFC8] bg-[#F7F1E3]/50 p-5">
              <div className="text-center">
                <div className="text-4xl font-black text-amber-600">
                  {product.rating}
                </div>
                <div className="mt-1 text-xs text-gray-500">از ۵</div>
              </div>
              <div className="flex-1">
                <div className="mb-2 text-2xl text-amber-500">
                  {"★".repeat(Math.round(product.rating))}
                  <span className="text-gray-300">
                    {"★".repeat(5 - Math.round(product.rating))}
                  </span>
                </div>
                <div className="text-xs text-gray-600">
                  بر اساس {product.reviews} نظر
                </div>
              </div>
            </div>

            {product.reviews === 0 ? (
              <div className="rounded-xl border-2 border-dashed border-[#E8DFC8] bg-[#F7F1E3]/30 p-8 text-center">
                <p className="text-5xl">💬</p>
                <p className="mt-4 text-base font-bold text-gray-700">
                  هنوز دیدگاهی ثبت نشده
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  اولین نفری باشید که نظر خود را ثبت می‌کند
                </p>
              </div>
            ) : (
              <div className="rounded-xl border-2 border-dashed border-[#E8DFC8] bg-[#F7F1E3]/30 p-8 text-center">
                <p className="text-sm text-gray-500">
                  {product.reviews} نظر ثبت شده
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}