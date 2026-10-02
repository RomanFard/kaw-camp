"use client";

import { useRef } from "react";
import { brands } from "@/lib/brands";

export default function BrandCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scrollLeft() {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  }

  function scrollRight() {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  }

  return (
    <section className="mx-auto max-w-[1600px] px-4 py-6 md:px-6 md:py-8">
      <div className="relative">
        {/* دکمه چپ */}
        <button
          type="button"
          onClick={scrollLeft}
          aria-label="قبلی"
          className="absolute right-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#E8DFC8] bg-white text-lg font-bold text-gray-600 shadow-md transition hover:bg-amber-50 hover:text-amber-600 md:h-12 md:w-12"
        >
          ›
        </button>

        {/* اسکرول برندها */}
        <div
          ref={scrollRef}
          className="scrollbar-hide flex items-center gap-3 overflow-x-auto px-12 py-2 md:gap-4 md:px-16"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {brands.map((brand) => (
            <a
              key={brand.key}
              href={brand.href}
              className="group flex h-20 w-[140px] flex-shrink-0 items-center justify-center rounded-xl border border-[#E8DFC8] bg-white p-3 transition hover:border-amber-500 hover:shadow-md md:h-24 md:w-[160px]"
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-full w-full object-contain opacity-70 transition duration-300 group-hover:opacity-100 group-hover:scale-110"
              />
            </a>
          ))}
        </div>

        {/* دکمه راست */}
        <button
          type="button"
          onClick={scrollRight}
          aria-label="بعدی"
          className="absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#E8DFC8] bg-white text-lg font-bold text-gray-600 shadow-md transition hover:bg-amber-50 hover:text-amber-600 md:h-12 md:w-12"
        >
          ‹
        </button>
      </div>
    </section>
  );
}