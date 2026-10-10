"use client";

import { useEffect, useMemo, useRef } from "react";

export type BrandItem = {
  key: string;
  nameFa: string;
  nameEn: string;
  photo: string;
  href: string;
};

const DEFAULT_BRANDS: BrandItem[] = [
  {
    key: "naturehike",
    nameFa: "نیچرهایک",
    nameEn: "NatureHike",
    photo: "/images/brands/naturehike.jpg",
    href: "/products?brand=naturehike",
  },
  {
    key: "shinetrip",
    nameFa: "شاین تریپ",
    nameEn: "Shine Trip",
    photo: "/images/brands/shinetrip.jpg",
    href: "/products?brand=shinetrip",
  },
  {
    key: "mountainhiker",
    nameFa: "ماونتین هایکر",
    nameEn: "Mountainhiker",
    photo: "/images/brands/mountainhiker.jpg",
    href: "/products?brand=mountainhiker",
  },
  {
    key: "blackdog",
    nameFa: "بلک داگ",
    nameEn: "BLACK DOG",
    photo: "/images/brands/blackdog.jpg",
    href: "/products?brand=blackdog",
  },
];

const PIXELS_PER_SECOND = 40;
const BUTTON_STEP = 300;
const BUTTON_DURATION = 600;

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export default function BrandShowcase() {
  const trackRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef(false);
  const offsetRef = useRef(0);

  const animRef = useRef<{
    from: number;
    to: number;
    start: number;
  } | null>(null);

  const dragRef = useRef({
    active: false,
    moved: false,
    startX: 0,
    startOffset: 0,
    pointerId: -1,
  });

  const items = DEFAULT_BRANDS;
  const loopItems = useMemo(() => [...items, ...items, ...items], [items]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frameId: number;
    let lastTime = performance.now();

    function apply() {
      if (!track) return;
      const third = track.offsetWidth / 3;
      if (third > 0) {
        offsetRef.current = ((offsetRef.current % third) + third) % third;
      }
      track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
    }

    function step(time: number) {
      const delta = Math.min(time - lastTime, 50);
      lastTime = time;

      const anim = animRef.current;
      if (anim) {
        const t = Math.min(1, (time - anim.start) / BUTTON_DURATION);
        offsetRef.current = anim.from + (anim.to - anim.from) * easeInOut(t);
        if (t >= 1) animRef.current = null;
      } else if (!hoverRef.current && !dragRef.current.active) {
        offsetRef.current += (PIXELS_PER_SECOND * delta) / 1000;
      }

      apply();
      frameId = requestAnimationFrame(step);
    }

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [items.length]);

  function scrollBy(dir: "left" | "right") {
    const track = trackRef.current;
    if (!track) return;

    const current = animRef.current ? animRef.current.to : offsetRef.current;
    animRef.current = {
      from: offsetRef.current,
      to: current + (dir === "left" ? -BUTTON_STEP : BUTTON_STEP),
      start: performance.now(),
    };
  }

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "mouse" && e.button !== 0) return;

    animRef.current = null;
    const d = dragRef.current;
    d.active = true;
    d.moved = false;
    d.startX = e.clientX;
    d.startOffset = offsetRef.current;
    d.pointerId = e.pointerId;
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const d = dragRef.current;
    if (!d.active) return;

    const dx = e.clientX - d.startX;

    if (!d.moved) {
      if (Math.abs(dx) < 5) return;
      d.moved = true;
      e.currentTarget.setPointerCapture(d.pointerId);
      e.currentTarget.style.cursor = "grabbing";
    }

    offsetRef.current = d.startOffset - dx;
  }

  function endDrag(e: React.PointerEvent<HTMLDivElement>) {
    const d = dragRef.current;
    if (!d.active) return;

    d.active = false;
    e.currentTarget.style.cursor = "";
    if (e.currentTarget.hasPointerCapture?.(d.pointerId)) {
      e.currentTarget.releasePointerCapture(d.pointerId);
    }
  }

  function handleClickCapture(e: React.MouseEvent) {
    if (dragRef.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      dragRef.current.moved = false;
    }
  }

  return (
    <section className="relative py-10 md:py-20">
      {/* Header */}
      <div className="mx-auto max-w-[1400px] px-4 text-center md:px-12 lg:px-16">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#E84C4C]/30 bg-[#E84C4C]/5 px-3 py-1 backdrop-blur-sm md:mb-4 md:px-4 md:py-1.5">
          <span className="text-[10px] font-bold tracking-[0.15em] text-[#E84C4C] md:text-xs">
            BRANDS
          </span>
        </div>

        <h2 className="text-xl font-black tracking-tight text-theme md:text-4xl lg:text-5xl">
          برندهای <span className="text-accent">معتبر</span>
        </h2>

        <p className="mt-2 text-[11px] text-theme-muted md:mt-3 md:text-sm">
          با بهترین برندهای جهانی کمپینگ و کوهنوردی همکاری می‌کنیم
        </p>

        <div className="mx-auto mt-3 h-[2px] w-12 bg-accent md:mt-4 md:w-16" />
      </div>

      {/* Slider */}
      <div className="relative mx-auto mt-6 w-full max-w-[1400px] px-4 md:mt-10 md:px-12 lg:px-16">
        {/* فلش چپ */}
        <button
          type="button"
          onClick={() => scrollBy("left")}
          aria-label="قبلی"
          className="absolute -left-14 top-1/2 z-30 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-theme bg-theme-card/95 text-theme backdrop-blur-sm transition hover:border-accent hover:bg-accent hover:text-white xl:flex"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>

        {/* فلش راست */}
        <button
          type="button"
          onClick={() => scrollBy("right")}
          aria-label="بعدی"
          className="absolute -right-14 top-1/2 z-30 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-theme bg-theme-card/95 text-theme backdrop-blur-sm transition hover:border-accent hover:bg-accent hover:text-white xl:flex"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>

        {/* قاب نمایش */}
        <div
          dir="ltr"
          onMouseEnter={() => {
            hoverRef.current = true;
          }}
          onMouseLeave={() => {
            hoverRef.current = false;
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClickCapture={handleClickCapture}
          className="cursor-grab select-none overflow-hidden"
          style={{ touchAction: "pan-y" }}
        >
          {/* ریل متحرک */}
          <div
            ref={trackRef}
            dir="rtl"
            className="flex w-max"
            style={{ willChange: "transform", backfaceVisibility: "hidden" }}
          >
            {loopItems.map((brand, idx) => (
              <a
                key={`${brand.key}-${idx}`}
                draggable={false}
                href={brand.href}
                className="group/card relative ml-2.5 w-[180px] flex-shrink-0 overflow-hidden rounded-lg border border-theme bg-theme-card transition-colors duration-300 hover:border-accent/50 sm:ml-3 sm:w-[210px] md:ml-5 md:w-[260px] md:rounded-xl lg:w-[300px]"
              >
                {/* تصویر برند */}
                <div className="relative aspect-[4/5] overflow-hidden bg-theme-surface">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={brand.photo}
                    alt={brand.nameFa}
                    loading="lazy"
                    draggable={false}
                    className="h-full w-full object-cover object-center transition duration-700 group-hover/card:scale-110"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = "none";
                    }}
                  />

                  {/* gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition duration-500 group-hover/card:from-black/95 group-hover/card:via-black/55" />

                  {/* آیکون گوشه بالا راست */}
                  <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-accent/60 bg-black/40 backdrop-blur transition duration-500 group-hover/card:border-accent group-hover/card:bg-accent md:right-3 md:top-3 md:h-8 md:w-8">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                      className="h-3 w-3 text-white md:h-3.5 md:w-3.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                      />
                    </svg>
                  </div>

                  {/* اسم برند روی تصویر */}
                  <div className="absolute bottom-0 left-0 right-0 p-2.5 md:p-4">
                    <div className="mb-1.5 h-[2px] w-5 bg-accent transition-all duration-500 group-hover/card:w-10 md:mb-2 md:h-[3px] md:w-6 md:group-hover/card:w-12" />

                    <h3 className="text-sm font-black leading-tight text-white transition duration-500 group-hover/card:text-accent md:text-lg">
                      {brand.nameFa}
                    </h3>

                    <p
                      dir="ltr"
                      className="mt-0.5 text-[8px] font-bold uppercase tracking-[0.2em] text-white/60 md:mt-1 md:text-[10px]"
                    >
                      {brand.nameEn}
                    </p>
                  </div>

                  {/* خط accent پایین */}
                  <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-accent transition-all duration-500 group-hover/card:w-full md:h-[3px]" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}