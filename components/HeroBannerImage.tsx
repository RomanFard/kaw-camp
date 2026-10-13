"use client";

import { useEffect, useState } from "react";
import {
  getActiveHeroSlides,
  type HeroSlide,
} from "@/lib/supabase/heroSlides";

// اسلایدی که به‌عنوان بنر تصویری نمایش داده می‌شود (index 1 = اسلاید دوم)
const SLIDE_INDEX = 1;

const FALLBACK_SLIDE: HeroSlide = {
  id: "fallback-2",
  order_index: 1,
  eyebrow: "",
  title_line1: "ماجراجویی",
  title_line2: "در دل طبیعت",
  description:
    "با KAW CAMP به دل طبیعت بزن و از هر لحظه لذت ببر. تجهیزات حرفه‌ای، تورهای هیجان‌انگیز.",
  primary_label: "مشاهده تورها",
  primary_href: "/explore",
  secondary_label: "همه محصولات",
  secondary_href: "/products",
  video: "",
  poster: "https://picsum.photos/seed/hero2/1920/1080",
  is_active: true,
};

const SECTION_SIZE =
  "aspect-[3/4] sm:aspect-[2/3] md:aspect-auto md:h-[600px] lg:h-[700px] xl:h-[760px]";

export default function HeroBannerImage() {
  const [slide, setSlide] = useState<HeroSlide>(FALLBACK_SLIDE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getActiveHeroSlides();
      if (data.length > SLIDE_INDEX) {
        setSlide({ ...data[SLIDE_INDEX], video: "" });
      } else if (data.length > 0) {
        setSlide({ ...data[0], video: "" });
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="w-full px-3 sm:px-6 md:px-7">
        <section
          className={`relative w-full overflow-hidden bg-black ${SECTION_SIZE}`}
        >
          <div className="h-full w-full animate-pulse bg-zinc-900" />
        </section>
      </div>
    );
  }

  return (
    <div className="w-full px-3 sm:px-6 md:px-7">
      <section
        dir="rtl"
        className={`relative w-full overflow-hidden bg-black ${SECTION_SIZE}`}
      >
        {/* ─── عکس ─── */}
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slide.poster}
            alt={slide.title_line1}
            className="h-full w-full object-cover object-center"
          />

          {/* ─── Overlay ─── */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent md:bg-gradient-to-tr md:from-black/90 md:via-black/40 md:to-transparent" />
        </div>

        {/* ─── محتوا ─── */}
        <div className="relative z-10 flex h-full items-end pb-8 md:pb-14 lg:pb-16">
          <div className="w-full px-5 sm:px-6 md:px-10 lg:px-14">
            <div className="max-w-md text-right sm:max-w-lg" dir="rtl">
              {/* ─── تیتر خط ۱ ─── */}
              <h1 className="mb-1 text-2xl font-black leading-[1.15] text-white drop-shadow-2xl md:text-4xl lg:text-5xl">
                {slide.title_line1}
              </h1>

              {/* ─── تیتر خط ۲ ─── */}
              <h1 className="mb-3 text-2xl font-black leading-[1.15] text-white drop-shadow-2xl md:mb-4 md:text-4xl lg:text-5xl">
                {slide.title_line2}
              </h1>

              {/* ─── توضیحات ─── */}
              {slide.description && (
                <p className="mb-5 max-w-md text-[11px] leading-5 text-white/90 md:mb-6 md:text-[13px] md:leading-6">
                  {slide.description}
                </p>
              )}

              {/* ─── دکمه‌ها ─── */}
              <div className="flex flex-wrap items-center justify-start gap-2 md:gap-3">
                {slide.primary_label && slide.primary_href && (
                  <a
                    href={slide.primary_href}
                    className="inline-flex items-center justify-center rounded-none bg-white px-6 py-2.5 text-[12px] font-bold text-black transition hover:bg-white/90 md:px-8 md:py-3 md:text-[13px]"
                  >
                    {slide.primary_label}
                  </a>
                )}

                {slide.secondary_label && slide.secondary_href && (
                  <a
                    href={slide.secondary_href}
                    className="inline-flex items-center justify-center rounded-none border-2 border-white bg-transparent px-6 py-2.5 text-[12px] font-bold text-white transition hover:bg-white hover:text-black md:px-8 md:py-3 md:text-[13px]"
                  >
                    {slide.secondary_label}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}