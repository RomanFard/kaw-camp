"use client";

import { useEffect, useRef, useState } from "react";
import {
  getActiveHeroSlides,
  type HeroSlide,
} from "@/lib/supabase/heroSlides";
import { useHeroSlide } from "@/components/context/HeroSlideContext";

const AUTOPLAY_MS = 4000;

const FALLBACK_SLIDES: HeroSlide[] = [
  {
    id: "fallback-1",
    order_index: 0,
    eyebrow: "",
    title_line1: "تجهیزات",
    title_line2: "کوهنوردی حرفه‌ای",
    description:
      "لوازم فنی، کوله‌های تخصصی، چادرهای چهارفصل و تجهیزات کمپینگ. تجربه‌ات را به سطح بعد ببر.",
    primary_label: "شروع خرید",
    primary_href: "/products",
    secondary_label: "آفرود و تور",
    secondary_href: "/explore",
    video: "",
    poster: "https://picsum.photos/seed/hero1/1920/1080",
    is_active: true,
  },
];

const SECTION_SIZE =
  "aspect-[3/4] sm:aspect-[2/3] md:aspect-auto md:h-[600px] lg:h-[700px] xl:h-[760px]";

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [textKey, setTextKey] = useState(0);
  const { setSlideState } = useHeroSlide();

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    if (slides.length > 0) {
      setSlideState(current, slides.length);
    }
  }, [current, slides.length, setSlideState]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getActiveHeroSlides();
      setSlides(data.length > 0 ? data : FALLBACK_SLIDES);
      setLoading(false);
    }
    load();
  }, []);

  const slide = slides[current] || FALLBACK_SLIDES[0];

  useEffect(() => {
    const videoEl = videoRef.current;
    if (videoEl && slide?.video) {
      videoEl.muted = true;
      videoEl.playsInline = true;
      videoEl.load();
      videoEl.play().catch((err) => {
        console.warn("Autoplay blocked or failed:", err);
      });
    }
    setTextKey((k) => k + 1);
  }, [current, slide?.video]);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, current, slides.length]);

  function goNext() {
    setCurrent((c) => (c + 1) % slides.length);
  }

  function goPrev() {
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    setPaused(true);
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;

    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) goNext();
      else goPrev();
    }

    touchStartX.current = null;
    touchStartY.current = null;
    setPaused(false);
  }

  if (loading) {
    return (
      <div className="w-full px-3 sm:px-6 md:px-7">
        <section
          dir="rtl"
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
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* ─── تصاویر و ویدیو ─── */}
        <div className="absolute inset-0">
          {slides.map((s, i) => {
            const isActive = i === current;
            return (
              <div
                key={s.id || i}
                className="absolute inset-0 transition-opacity duration-[2000ms] ease-in-out"
                style={{ opacity: isActive ? 1 : 0 }}
              >
                {s.video ? (
                  <video
                    ref={i === current ? videoRef : null}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    poster={s.poster}
                    className="h-full w-full object-cover object-center"
                  >
                    <source src={s.video} type="video/mp4" />
                  </video>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={s.poster}
                    alt={s.title_line1}
                    className={`h-full w-full object-cover object-center transition-transform duration-[8000ms] ease-out ${
                      isActive ? "md:scale-110" : "scale-100"
                    }`}
                  />
                )}
              </div>
            );
          })}

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent md:bg-gradient-to-tr md:from-black/90 md:via-black/40 md:to-transparent" />
        </div>

        {/* ─── محتوا ─── */}
        <div className="relative z-10 flex h-full items-end pb-8 md:pb-14 lg:pb-16">
          <div className="w-full px-5 sm:px-6 md:px-10 lg:px-14">
            <div
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              className="max-w-md text-right sm:max-w-lg"
              dir="rtl"
            >
              <div key={textKey}>
                <h1 className="animate-hero-1 mb-1 text-2xl font-black leading-[1.15] text-white drop-shadow-2xl md:text-4xl lg:text-5xl">
                  {slide.title_line1}
                </h1>

                <h1 className="animate-hero-2 mb-3 text-2xl font-black leading-[1.15] text-white drop-shadow-2xl md:mb-4 md:text-4xl lg:text-5xl">
                  {slide.title_line2}
                </h1>

                {slide.description && (
                  <p className="animate-hero-3 mb-5 max-w-md text-[11px] leading-5 text-white/90 md:mb-6 md:text-[13px] md:leading-6">
                    {slide.description}
                  </p>
                )}

                {/* ─── دکمه‌ها — تراز راست با متن ─── */}
                <div className="animate-hero-4 flex flex-wrap items-center justify-start gap-2 md:gap-3">
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
        </div>

        {/* ─── فلش‌ها ─── */}
        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={goNext}
              aria-label="اسلاید بعدی"
              className="absolute right-4 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center text-white/70 transition hover:scale-110 hover:text-white lg:flex"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-8 w-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>

            <button
              type="button"
              onClick={goPrev}
              aria-label="اسلاید قبلی"
              className="absolute left-4 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center text-white/70 transition hover:scale-110 hover:text-white lg:flex"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-8 w-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </>
        )}

        {/* ─── نقطه‌ها ─── */}
        {slides.length > 1 && (
          <div className="absolute bottom-3 right-1/2 z-20 flex translate-x-1/2 items-center gap-3 md:bottom-6">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrent(i)}
                aria-label={`اسلاید ${i + 1}`}
                className="group relative h-1 overflow-hidden rounded-full bg-white/30 transition-all duration-300"
                style={{ width: i === current ? "40px" : "20px" }}
              >
                {i === current && !paused && (
                  <span
                    key={current}
                    className="absolute inset-y-0 right-0 bg-white"
                    style={{ animation: `heroProgress ${AUTOPLAY_MS}ms linear forwards` }}
                  />
                )}
                {i === current && paused && (
                  <span className="absolute inset-0 bg-white" />
                )}
              </button>
            ))}
          </div>
        )}

        <style jsx global>{`
          @keyframes heroProgress {
            from { width: 0%; }
            to { width: 100%; }
          }

          @keyframes heroSlideIn {
            0% { opacity: 0; transform: translateX(-40px); filter: blur(8px); }
            100% { opacity: 1; transform: translateX(0); filter: blur(0); }
          }

          .animate-hero-1 { animation: heroSlideIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0s both; }
          .animate-hero-2 { animation: heroSlideIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both; }
          .animate-hero-3 { animation: heroSlideIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both; }
          .animate-hero-4 { animation: heroSlideIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both; }
        `}</style>
      </section>
    </div>
  );
}