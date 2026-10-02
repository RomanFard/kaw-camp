"use client";

import { useState } from "react";
import ProductGallery from "./ProductGallery";
import AddToCartSection from "./AddToCartSection";
import { Product } from "@/data/products";

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
  const [selectedColor, setSelectedColor] = useState<string>(
    colors.length > 0 ? colors[0].label : ""
  );

  const currentImageIndex = colors.findIndex(
    (c) => c.label === selectedColor
  );

  return (
    <div className="grid gap-4 md:gap-6 lg:grid-cols-[1fr_320px]">
      {/* ─────── محتوای اصلی (راست) ─────── */}
      <div className="min-w-0 space-y-4 md:space-y-6">
        {/* کارت محصول */}
        <div className="rounded-xl border border-[#D4C5A0] bg-white p-4 md:p-6">
          {/* ─── دسکتاپ: گالری سمت چپ، اطلاعات سمت راست ─── */}
          <div className="md:grid md:grid-cols-2 md:gap-6">
            {/* گالری تصاویر */}
            <div className="mb-6 md:mb-0">
<ProductGallery
  images={
    product.images && product.images.length > 0
      ? product.images
      : [product.image]
  }
  productName={product.name}
  productCategory={product.category}
  fallbackEmoji={getCategoryEmoji(product.category)}
  activeImageIndex={currentImageIndex >= 0 ? currentImageIndex : 0}
/>
            </div>

            {/* اطلاعات محصول */}
            <div className="min-w-0">
              {/* نام انگلیسی */}
              <p
                className="break-words text-xs text-gray-400 md:text-sm"
                dir="ltr"
              >
                {product.englishName || product.slug}
              </p>

              {/* نام محصول */}
              <h1 className="mt-2 break-words text-base font-bold leading-7 text-gray-900 md:text-lg md:leading-8">
                {product.name}
              </h1>

              {/* توضیح کوتاه */}
              <p className="mt-4 break-words text-xs leading-6 text-gray-700 md:text-sm md:leading-7">
                {product.shortDesc}
              </p>

              {/* خط جداکننده */}
              <div className="my-4 border-t border-[#EDE4CE]"></div>

              {/* ویژگی‌ها */}
              <div className="text-sm font-bold text-gray-800">ویژگی‌ها</div>

              <ul className="mt-3 space-y-2">
                {product.features.slice(0, 5).map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 break-words text-xs text-gray-700 md:text-sm"
                  >
                    <span className="mt-0.5 text-amber-500">◆</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ─────── سایدبار (چپ) ─────── */}
      <div className="min-w-0 lg:sticky lg:top-4 lg:h-fit">
        <AddToCartSection
          product={product}
          selectedColor={selectedColor}
          onColorChange={setSelectedColor}
        />
      </div>
    </div>
  );
}