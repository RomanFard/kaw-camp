"use client";

import { useState, useEffect } from "react";

export default function ProductGallery({
  images,
  productName,
  fallbackEmoji,
  activeImageIndex = 0,
}: {
  images: string[];
  productName: string;
  fallbackEmoji: string;
  activeImageIndex?: number;
}) {
  const [localIndex, setLocalIndex] = useState(activeImageIndex);

  // وقتی رنگ عوض میشه، عکس فعال هم عوض میشه
  useEffect(() => {
    setLocalIndex(activeImageIndex);
  }, [activeImageIndex]);

  const validImages = (images || []).filter(
    (img) => img && img.startsWith("/")
  );

  if (validImages.length === 0) {
    return (
      <div className="mx-auto flex aspect-square w-full max-w-[400px] items-center justify-center rounded-xl bg-gradient-to-br from-[#F7F1E3] to-[#EFE7D2]">
        <span className="text-9xl">{fallbackEmoji}</span>
      </div>
    );
  }

  const safeIndex = Math.min(localIndex, validImages.length - 1);

  return (
    <div className="w-full">
      {/* عکس بزرگ */}
      <div className="mx-auto w-full max-w-[400px] overflow-hidden rounded-xl border border-[#E8DFC8] bg-white md:max-w-[440px]">
        <img
          src={validImages[safeIndex]}
          alt={productName}
          className="aspect-square h-auto w-full object-contain p-3"
        />
      </div>

      {/* thumbnail ها */}
      {validImages.length > 1 && (
        <div className="mx-auto mt-3 grid w-full max-w-[400px] grid-cols-4 gap-2 md:max-w-[440px]">
          {validImages.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setLocalIndex(i)}
              className={
                "aspect-square overflow-hidden rounded-lg border-2 bg-white transition " +
                (i === safeIndex
                  ? "border-amber-500"
                  : "border-[#E8DFC8] opacity-70 hover:opacity-100")
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