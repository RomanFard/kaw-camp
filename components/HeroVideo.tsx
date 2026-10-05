"use client";

import { useEffect, useRef, useState } from "react";
import {
  getActiveHeroSlides,
  type HeroSlide,
} from "@/lib/supabase/heroSlides";

const AUTOPLAY_MS = 4000;

// ─── Fallback: اگه Supabase خالی بود ───
const FALLBACK_SLIDES: HeroSlide[] = [
  {
    id: "fallback-1",
    order_index: 0,
    eyebrow: "KAW CAMP — فروشگاه تخصصی",
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

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [textKey, setTextKey] = useState(0);

  // ─── لود اسلایدها از Supabase ───
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
    if (videoRef.current && slide?.video) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
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

  // ─── حالت لودینگ ───
  if (loading) {
    return (
      <section
        dir="rtl"
        className="relative h-[600px] w-full overflow-hidden bg-black md:h-[700px] lg:h-screen lg:max-h-[900px]"
      >
        <div className="h-full w-full animate-pulse bg-zinc-900" />
      </section>
    );
  }

  return (
    <section
      dir="rtl"
      className="relative h-[600px] w-full overflow-hidden bg-black md:h-[700px] lg:h-screen lg:max-h-[900px]"
    >
      {/* ─── تصاویر: fade آرام ─── */}
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
                className="h-full w-full object-cover"
              >
                <source src={s.video} type="video/mp4" />
              </video>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={s.poster}
                alt={s.title_line1}
                className={`h-full w-full object-cover transition-transform duration-[8000ms] ease-out ${
                  isActive ? "scale-110" : "scale-100"
                }`}
              />
            )}
          </div>
        );
      })}

      {/* ─── Overlay تیره ─── */}
      <div className="absolute inset-0 bg-gradient-to-l from-black via-black/70 to-black/30" />

      {/* ─── محتوای اصلی ─── */}
      <div className="relative z-10 flex h-full items-center overflow-hidden">
        <div className="mx-auto w-full max-w-[1400px] px-6 md:px-12 lg:px-16">
          <div
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className="max-w-2xl text-right"
          >
            <div key={textKey}>
              {/* Eyebrow */}
              {slide.eyebrow && (
                <div className="animate-hero-1 mb-4 flex items-center justify-center gap-3">
                  <span className="h-[2px] w-10 bg-[#6ECB9E]" />
                  <span className="text-xs font-bold tracking-wider text-[#6ECB9E] md:text-sm">
                    {slide.eyebrow}
                  </span>
                </div>
              )}

              {/* خط اول عنوان */}
              <h1 className="animate-hero-2 mb-0 text-4xl font-black leading-[1.15] text-white drop-shadow-2xl md:text-6xl lg:text-7xl">
                {slide.title_line1}
              </h1>

              {/* خط دوم عنوان */}
              <h1 className="animate-hero-3 mb-5 text-4xl font-black leading-[1.15] text-[#6ECB9E] drop-shadow-2xl md:text-6xl lg:text-7xl">
                {slide.title_line2}
              </h1>

              {/* توضیحات */}
              {slide.description && (
                <p className="animate-hero-4 mb-8 max-w-xl text-sm leading-7 text-zinc-300 md:text-base md:leading-8">
                  {slide.description}
                </p>
              )}

              {/* دکمه‌ها */}
                    <div className="animate-hero-5 flex flex-wrap items-center justify-start gap-3">
                {slide.primary_label && slide.primary_href && (
                  <a
                    href={slide.primary_href}
                    className="group inline-flex items-center gap-2 rounded-lg bg-[#6ECB9E] px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-[#6ECB9E]/30 transition hover:bg-[#5AB88A] hover:shadow-[#6ECB9E]/50 md:px-8 md:text-base"
                  >
                    <span>{slide.primary_label}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                      className="h-4 w-4 transition group-hover:-translate-x-1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                      />
                    </svg>
                  </a>
                )}

                {slide.secondary_label && slide.secondary_href && (
                  <a
                    href={slide.secondary_href}
                    className="inline-flex items-center gap-2 rounded-lg border-2 border-white/30 bg-transparent px-6 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:border-white hover:bg-white/10 md:px-8 md:text-base"
                  >
                    {slide.secondary_label}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── فلش راست ─── */}
      {slides.length > 1 && (
        <button
          type="button"
          onClick={goNext}
          aria-label="اسلاید بعدی"
          className="absolute right-4 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center text-white/70 transition hover:scale-110 hover:text-[#6ECB9E] lg:flex"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="h-8 w-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>
      )}

      {/* ─── فلش چپ ─── */}
      {slides.length > 1 && (
        <button
          type="button"
          onClick={goPrev}
          aria-label="اسلاید قبلی"
          className="absolute left-4 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center text-white/70 transition hover:scale-110 hover:text-[#6ECB9E] lg:flex"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="h-8 w-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      )}

      {/* ─── نقطه‌های پایین ─── */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 right-1/2 z-20 flex translate-x-1/2 items-center gap-3 md:bottom-8">
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
                  className="absolute inset-y-0 right-0 bg-[#6ECB9E]"
                  style={{
                    animation: `heroProgress ${AUTOPLAY_MS}ms linear forwards`,
                  }}
                />
              )}
              {i === current && paused && (
                <span className="absolute inset-0 bg-[#6ECB9E]" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* ─── دایره تزئینی ─── */}
      <div className="pointer-events-none absolute right-8 top-1/2 z-10 hidden h-16 w-16 -translate-y-1/2 items-center justify-center lg:flex xl:right-16">
        <div className="absolute inset-0 animate-ping rounded-full border-2 border-[#6ECB9E]/40" />
        <div className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#6ECB9E]">
          <div className="h-2 w-2 rounded-full bg-[#6ECB9E]" />
        </div>
      </div>

      {/* ─── انیمیشن‌ها ─── */}
      <style jsx global>{`
        @keyframes heroProgress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }

        @keyframes heroSlideIn {
          0% {
            opacity: 0;
            transform: translateX(120px);
            filter: blur(8px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
            filter: blur(0);
          }
        }

        .animate-hero-1 {
          animation: heroSlideIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0s both;
        }
        .animate-hero-2 {
          animation: heroSlideIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both;
        }
        .animate-hero-3 {
          animation: heroSlideIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both;
        }
        .animate-hero-4 {
          animation: heroSlideIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both;
        }
        .animate-hero-5 {
          animation: heroSlideIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.4s both;
        }
      `}</style>
    </section>
  );
}
