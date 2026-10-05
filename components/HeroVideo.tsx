"use client";

import { useEffect, useRef, useState } from "react";

const SLIDES = [
  {
    eyebrow: "KAW CAMP — فروشگاه تخصصی",
    titleLine1: "تجهیزات",
    titleLine2: "کوهنوردی حرفه‌ای",
    description:
      "لوازم فنی، کوله‌های تخصصی، چادرهای چهارفصل و تجهیزات کمپینگ. تجربه‌ات را به سطح بعد ببر.",
    primaryCta: { label: "شروع خرید", href: "/products" },
    secondaryCta: { label: "آفرود و تور", href: "/explore" },
    video: "",
    poster: "https://picsum.photos/seed/hero1/1920/1080",
  },
  {
    eyebrow: "آفرود و تور — KAW CAMP",
    titleLine1: "ماجراجویی",
    titleLine2: "در دل طبیعت",
    description:
      "تورهای آفرود، کوهنوردی و کمپینگ با لیدرهای حرفه‌ای و تجهیزات کامل.",
    primaryCta: { label: "مشاهده تورها", href: "/explore" },
    secondaryCta: { label: "تماس با ما", href: "/contact" },
    video: "",
    poster: "https://picsum.photos/seed/hero2/1920/1080",
  },
  {
    eyebrow: "تخفیف‌های ویژه",
    titleLine1: "فصل",
    titleLine2: "ماجراجویی",
    description:
      "با تخفیف‌های ویژه KAW CAMP، تجهیزات رویایی‌ات را با بهترین قیمت تهیه کن.",
    primaryCta: { label: "تخفیف‌ها", href: "/products?sort=discount" },
    secondaryCta: { label: "جدیدترین‌ها", href: "/products?sort=newest" },
    video: "",
    poster: "https://picsum.photos/seed/hero3/1920/1080",
  },
];

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (videoRef.current && SLIDES[current].video) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
    setLoaded(true);
  }, [current]);

  function goNext() {
    setCurrent((c) => (c + 1) % SLIDES.length);
  }

  function goPrev() {
    setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length);
  }

  const slide = SLIDES[current];

  return (
    <section
      dir="rtl"
      className="relative h-[600px] w-full overflow-hidden bg-black md:h-[700px] lg:h-screen lg:max-h-[900px]"
    >
      {/* ─── ویدیو یا عکس ─── */}
      {slide.video ? (
        <video
          key={current}
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={slide.poster}
          onLoadedData={() => setLoaded(true)}
          className={
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-700 " +
            (loaded ? "opacity-100" : "opacity-0")
          }
        >
          <source src={slide.video} type="video/mp4" />
        </video>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={current}
          src={slide.poster}
          alt={slide.titleLine1}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/* ─── Overlay تیره ─── */}
      <div className="absolute inset-0 bg-gradient-to-l from-black via-black/70 to-black/30" />

      {/* ─── محتوای اصلی ─── */}
      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto w-full max-w-[1600px] px-6 md:px-12 lg:px-20">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <div className="mb-4 flex items-center gap-3">
              <span className="h-[2px] w-10 bg-[#F59E0B]" />
              <span className="text-xs font-bold tracking-wider text-[#F59E0B] md:text-sm">
                {slide.eyebrow}
              </span>
            </div>

            {/* عنوان بزرگ */}
            <h1 className="mb-5 text-4xl font-black leading-[1.15] text-white drop-shadow-2xl md:text-6xl lg:text-7xl">
              {slide.titleLine1}
              <br />
              <span className="text-[#F59E0B]">{slide.titleLine2}</span>
            </h1>

            {/* توضیحات */}
            <p className="mb-8 max-w-xl text-sm leading-7 text-zinc-300 md:text-base md:leading-8">
              {slide.description}
            </p>

            {/* دکمه‌ها */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={slide.primaryCta.href}
                className="group inline-flex items-center gap-2 rounded-lg bg-[#F59E0B] px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-[#F59E0B]/30 transition hover:bg-[#D97706] hover:shadow-[#F59E0B]/50 md:px-8 md:text-base"
              >
                <span>{slide.primaryCta.label}</span>
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

              <a
                href={slide.secondaryCta.href}
                className="inline-flex items-center gap-2 rounded-lg border-2 border-white/30 bg-transparent px-6 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:border-white hover:bg-white/10 md:px-8 md:text-base"
              >
                {slide.secondaryCta.label}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ─── فلش راست ─── */}
      <button
        type="button"
        onClick={goNext}
        aria-label="اسلاید بعدی"
        className="absolute right-4 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center text-white/70 transition hover:scale-110 hover:text-[#F59E0B] lg:flex"
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

      {/* ─── فلش چپ ─── */}
      <button
        type="button"
        onClick={goPrev}
        aria-label="اسلاید قبلی"
        className="absolute left-4 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center text-white/70 transition hover:scale-110 hover:text-[#F59E0B] lg:flex"
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

      {/* ─── نقطه‌های پایین ─── */}
      <div className="absolute bottom-6 right-1/2 z-20 flex translate-x-1/2 items-center gap-3 md:bottom-8">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrent(i)}
            aria-label={`اسلاید ${i + 1}`}
            className={
              "h-1 rounded-full transition-all duration-300 " +
              (i === current
                ? "w-10 bg-[#F59E0B]"
                : "w-5 bg-white/40 hover:bg-white/70")
            }
          />
        ))}
      </div>

      {/* ─── دایره تزئینی ─── */}
      <div className="pointer-events-none absolute right-8 top-1/2 z-10 hidden h-16 w-16 -translate-y-1/2 items-center justify-center lg:flex xl:right-16">
        <div className="absolute inset-0 animate-ping rounded-full border-2 border-[#F59E0B]/40" />
        <div className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#F59E0B]">
          <div className="h-2 w-2 rounded-full bg-[#F59E0B]" />
        </div>
      </div>
    </section>
  );
}