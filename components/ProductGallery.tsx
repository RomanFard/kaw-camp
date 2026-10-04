"use client";

import { useState, useEffect } from "react";
import { getProductImages } from "@/lib/productImages";

export default function ProductGallery({
  images,
  productName,
  productCategory,
  fallbackEmoji,
  activeImageIndex = 0,
}: {
  images: string[];
  productName: string;
  productCategory?: string;
  fallbackEmoji: string;
  activeImageIndex?: number;
}) {
  const [localIndex, setLocalIndex] = useState(activeImageIndex);

  // ✅ هر URL معتبری (لوکال یا https) قبوله
  const validImages = (images || []).filter((img) => img && img.trim());

  // اگه عکسی نداشت، از عکس‌های دسته‌بندی استفاده کن
  const finalImages =
    validImages.length > 0
      ? validImages
      : productCategory
      ? getProductImages(productCategory, productName)
      : [];

  useEffect(() => {
    setLocalIndex(activeImageIndex);
  }, [activeImageIndex]);

  // اگه هیچ عکسی نبود، ایموجی نشون بده
  if (finalImages.length === 0) {
    return (
      <div className="mx-auto flex aspect-square w-full max-w-[400px] items-center justify-center rounded-xl bg-gradient-to-br from-[#F7F1E3] to-[#EFE7D2]">
        <span className="text-9xl">{fallbackEmoji}</span>
      </div>
    );
  }

  const safeIndex = Math.min(localIndex, finalImages.length - 1);

  return (
    <div className="w-full">
      {/* عکس بزرگ */}
      <div className="mx-auto w-full max-w-[400px] overflow-hidden rounded-xl border border-[#D4C5A0] bg-white md:max-w-[440px]">
        <img
          src={finalImages[safeIndex]}
          alt={productName}
          className="aspect-square h-auto w-full object-contain p-3"
        />
      </div>

      {/* thumbnail ها */}
      {finalImages.length > 1 && (
        <div className="mx-auto mt-3 grid w-full max-w-[400px] grid-cols-4 gap-2 md:max-w-[440px]">
          {finalImages.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setLocalIndex(i)}
              className={
                "aspect-square overflow-hidden rounded-lg border-2 bg-white transition " +
                (i === safeIndex
                  ? "border-amber-500"
                  : "border-[#D4C5A0] opacity-70 hover:opacity-100")
              }
            >
              <img
                src={img}
                alt={productName + " - " + (i + 1)}
                className="h-full w-full object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}