"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { getAppContent } from "@/lib/supabase/appContent";
import type { CategoryGridFilter } from "@/lib/contentTypes";

const DEFAULT_FILTERS: CategoryGridFilter[] = [
  { key: "best", label: "منتخب ها", photos: ["tent", "sleep", "mattress", "backpack", "clothing", "boots"] },
  { key: "tent", label: "چادر", photos: ["tent", "bottle", "cooking", "lighting", "tools", "accessories"] },
  { key: "sleep", label: "کیسه خواب", photos: ["sleep", "mattress", "tent", "bottle", "lighting", "backpack"] },
  { key: "mattress", label: "زیرانداز", photos: ["mattress", "sleep", "tent", "backpack", "clothing", "boots"] },
  { key: "backpack", label: "کوله پشتی", photos: ["backpack", "accessories", "bottle", "clothing", "boots", "tent"] },
  { key: "clothing", label: "لباس کوهنوردی", photos: ["clothing", "boots", "socks", "gaiters", "backpack", "tent"] },
  { key: "shoes", label: "کفش کوهنوردی", photos: ["boots", "gaiters", "socks", "clothing", "backpack", "tent"] },
];

const LABELS: Record<string, string> = {
  tent: "چادر و سایبان",
  sleep: "کیسه خواب",
  mattress: "زیرانداز",
  backpack: "کوله پشتی",
  clothing: "لباس کوهنوردی",
  boots: "کفش کوهنوردی",
  socks: "جوراب",
  gaiters: "گتر",
  tools: "ابزار و تجهیزات",
  lighting: "روشنایی و چراغ",
  bottle: "قمقمه و فلاسک",
  cooking: "پخت و پز",
  accessories: "لوازم جانبی",
};

const SPEED = 0.28; // سرعت حرکت پیوسته (تعداد عکس در ثانیه)؛ کمتر = آرام‌تر
const STEP_DEG = 26; // زاویه‌ی بین هر عکس روی قوس (بزرگ‌تر = گردتر)
const GAP = 1.04; // فاصله‌ی مرکز دو عکس مجاور نسبت به اندازه‌ی عکس
const PERSPECTIVE = 2400; // عمق دید

// موبایل: همان کاروسل، ولی عمودی و با حرکت از بالا به پایین
const VERTICAL_MAX = 640; // عرض (px) زیر این مقدار یعنی حالت عمودی
const VERTICAL_SIZE_RATIO = 0.55; // عرض عکس‌ها نسبت به عرض صفحه
const VERTICAL_SIZE_MAX = 280;

const mod = (a: number, m: number) => ((a % m) + m) % m;
// تبدیل به بازه‌ی متقارن [-n/2, n/2)
const wrapP = (x: number, n: number) => mod(x + n / 2, n) - n / 2;

type RowProps = {
  photos: string[];
};

// کاروسل سه‌بعدی: افقی در دسکتاپ، عمودی (از بالا به پایین) در موبایل
function Carousel3D({ photos }: RowProps) {
  const [wrapW, setWrapW] = useState(1200);
  const [dot, setDot] = useState(0);

  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // وضعیت حرکت (بدون رندر دوباره‌ی React در هر فریم)
  const posRef = useRef(0);
  const velRef = useRef(0);
  const targetRef = useRef<number | null>(null);
  const pausedRef = useRef(false);
  const dotRef = useRef(0);
  const dragStartX = useRef<number | null>(null);
  const dragged = useRef(false);
  const hoverRef = useRef(false); // موس روی یکی از عکس‌هاست

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setWrapW(el.offsetWidth || 1200);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const n = photos.length;
  const vertical = wrapW < VERTICAL_MAX;

  const size = vertical
    ? Math.round(Math.min(VERTICAL_SIZE_MAX, wrapW * VERTICAL_SIZE_RATIO))
    : Math.round(Math.min(380, Math.max(140, wrapW * 0.3)));
  const radius = (size * GAP) / 2 / Math.tan((STEP_DEG / 2) * (Math.PI / 180));

  const nRef = useRef(n);
  const radiusRef = useRef(radius);
  const verticalRef = useRef(vertical);
  nRef.current = n;
  radiusRef.current = radius;
  verticalRef.current = vertical;

  // قرار دادن هر عکس در جای پیوسته‌ی خودش
  const applyRef = useRef<() => void>(() => {});
  applyRef.current = () => {
    const nn = nRef.current;
    const R = radiusRef.current;
    const pos = posRef.current;
    if (nn === 0) return;

    const fadeEnd = Math.min(2.9, nn / 2 - 0.05);
    const fadeStart = fadeEnd - 0.6;

    for (let i = 0; i < nn; i++) {
      const el = cardRefs.current[i];
      if (!el) continue;

      // جفتِ وسط روی -0.5 و +0.5
      const p = wrapP(i - pos - 0.5, nn);
      const a = Math.abs(p);
      const beyond = Math.max(0, a - 0.5);

      const opacity =
        a <= fadeStart ? 1 : Math.max(0, 1 - (a - fadeStart) / (fadeEnd - fadeStart));
      const textOpacity = 1 - Math.min(1, beyond / 0.6);

      const angle = (p * STEP_DEG).toFixed(3);
      el.style.transform = verticalRef.current
        ? `translate(-50%, -50%) rotateX(${(-p * STEP_DEG).toFixed(3)}deg) translateZ(${R.toFixed(1)}px)`
        : `translate(-50%, -50%) rotateY(${angle}deg) translateZ(${R.toFixed(1)}px)`;
      el.style.filter = beyond > 0.02 ? `blur(${(beyond * 3.2).toFixed(2)}px)` : "none";
      el.style.opacity = opacity.toFixed(3);
      el.style.pointerEvents = opacity > 0.3 ? "auto" : "none";
      el.style.setProperty("--t", textOpacity.toFixed(3));
    }

    const d = mod(Math.round(pos), nn);
    if (d !== dotRef.current) {
      dotRef.current = d;
      setDot(d);
    }
  };

  useLayoutEffect(() => {
    applyRef.current();
  }, [size, n, vertical]);

  // حلقه‌ی انیمیشن: حرکت پیوسته و هم‌سرعت
  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let last = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      if (targetRef.current !== null) {
        const diff = targetRef.current - posRef.current;
        if (Math.abs(diff) < 0.0005) {
          posRef.current = targetRef.current;
          targetRef.current = null;
        } else {
          posRef.current += diff * (1 - Math.exp(-dt * 5));
        }
        velRef.current = 0;
      } else {
        // موبایل: عکس‌ها از بالا به پایین حرکت می‌کنند
        const dir = verticalRef.current ? -1 : 1;
        const goal =
          pausedRef.current || reduced || nRef.current < 2 ? 0 : SPEED * dir;
        velRef.current += (goal - velRef.current) * (1 - Math.exp(-dt * 3));
        posRef.current += velRef.current * dt;
      }

      applyRef.current();
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const goNext = () => {
    targetRef.current = (targetRef.current ?? Math.floor(posRef.current)) + 1;
  };
  const goPrev = () => {
    targetRef.current = (targetRef.current ?? Math.ceil(posRef.current)) - 1;
  };
  const goTo = (i: number) => {
    targetRef.current = posRef.current + wrapP(i - posRef.current, nRef.current);
  };

  // محوشدن تدریجی به سمت لبه‌ها؛ جفتِ وسط کامل واضح
  const edge = `calc(50% - ${Math.round(size * GAP)}px)`;
  const fadeMask = `linear-gradient(${vertical ? "to bottom" : "to right"},
    transparent 0%,
    rgba(0,0,0,0.12) calc(${edge} * 0.25),
    rgba(0,0,0,0.35) calc(${edge} * 0.5),
    rgba(0,0,0,0.65) calc(${edge} * 0.78),
    black ${edge},
    black calc(100% - ${edge}),
    rgba(0,0,0,0.65) calc(100% - ${edge} * 0.78),
    rgba(0,0,0,0.35) calc(100% - ${edge} * 0.5),
    rgba(0,0,0,0.12) calc(100% - ${edge} * 0.25),
    transparent 100%)`;

  const onPointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
    dragged.current = false;
    pausedRef.current = true;
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (dragStartX.current !== null) {
      const dx = e.clientX - dragStartX.current;
      if (Math.abs(dx) > 50) {
        dragged.current = true;
        if (dx < 0) goNext();
        else goPrev();
      }
    }
    dragStartX.current = null;
    pausedRef.current = hoverRef.current;
  };

  return (
    <div>
      <div
        ref={wrapRef}
        dir="ltr"
        className="relative w-full select-none touch-pan-y"
        style={{
          height: vertical ? Math.round(size * 3.3) : size + 90,
          perspective: `${PERSPECTIVE}px`,
          WebkitMaskImage: fadeMask,
          maskImage: fadeMask,
        }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          dragStartX.current = null;
          pausedRef.current = hoverRef.current;
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            transformStyle: "preserve-3d",
            transform: `translateZ(${-radius}px)`,
          }}
        >
          {photos.map((photoName, i) => {
            const imageSrc = `/images/categories/photos/${photoName}.jpg`;
            const label = LABELS[photoName] || photoName;

            return (
              <a
                key={`${photoName}-${i}`}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                href="/products"
                // توقف فقط با ماوس؛ لمس روی موبایل باعث گیر کردن حرکت نشود
                onPointerEnter={(e) => {
                  if (e.pointerType !== "mouse") return;
                  hoverRef.current = true;
                  pausedRef.current = true;
                }}
                onPointerLeave={(e) => {
                  if (e.pointerType !== "mouse") return;
                  hoverRef.current = false;
                  pausedRef.current = dragStartX.current !== null;
                }}
                onClick={(e) => {
                  if (dragged.current) {
                    e.preventDefault();
                    dragged.current = false;
                    return;
                  }
                  // اگر عکس در جفتِ وسط نیست، کلیک آن را به وسط می‌آورد
                  const p = wrapP(i - posRef.current - 0.5, nRef.current);
                  if (Math.abs(p) > 0.55) {
                    e.preventDefault();
                    if (p < 0) goTo(i);
                    else goTo(i - 1);
                  }
                }}
                draggable={false}
                className="group absolute left-1/2 top-1/2 block overflow-hidden rounded-xl bg-theme-card"
                style={{
                  width: size,
                  height: size,
                  willChange: "transform, filter, opacity",
                  boxShadow: "0 24px 50px -22px rgba(0,0,0,0.85)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageSrc}
                  alt={label}
                  loading="lazy"
                  draggable={false}
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent && !parent.querySelector(".fallback-emoji")) {
                      const wrapper = document.createElement("div");
                      wrapper.className =
                        "fallback-emoji absolute inset-0 flex flex-col items-center justify-center gap-2 bg-theme-surface";
                      wrapper.innerHTML = `<span style="font-size: 3rem">📦</span>`;
                      parent.appendChild(wrapper);
                    }
                  }}
                  className="h-full w-full object-cover object-center transition duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                {/* متن با نزدیک شدن به وسط پررنگ می‌شود */}
                <div
                  dir="rtl"
                  className="absolute bottom-0 left-0 right-0 p-4"
                  style={{ opacity: "var(--t, 1)" }}
                >
                  <div className="mb-2.5 h-[3px] w-8 bg-accent" />
                  <h3 className="text-sm font-black text-white md:text-base">
                    {label}
                  </h3>
                  <p className="mt-0.5 text-[10px] font-bold text-accent md:text-[11px]">
                    مشاهده محصولات
                  </p>
                </div>
              </a>
            );
          })}
        </div>

        {/* دکمه‌های قبلی / بعدی (فقط دسکتاپ) */}
        {!vertical && (
          <>
            <button
              type="button"
              aria-label="قبلی"
              onClick={goPrev}
              onPointerDown={(e) => e.stopPropagation()}
              onPointerUp={(e) => e.stopPropagation()}
              className="absolute left-2 top-1/2 z-40 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur transition hover:border-accent hover:text-accent md:left-6"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="بعدی"
              onClick={goNext}
              onPointerDown={(e) => e.stopPropagation()}
              onPointerUp={(e) => e.stopPropagation()}
              className="absolute right-2 top-1/2 z-40 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur transition hover:border-accent hover:text-accent md:right-6"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* نقطه‌های پایین */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {photos.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`عکس ${i + 1}`}
            onClick={() => goTo(i)}
            className={
              "h-1.5 rounded-full transition-all duration-500 " +
              (i === dot ? "w-8 bg-accent" : "w-2 bg-white/25 hover:bg-white/50")
            }
          />
        ))}
      </div>
    </div>
  );
}

export default function CategoryGrid() {
  const [filters, setFilters] = useState<CategoryGridFilter[]>(DEFAULT_FILTERS);

  useEffect(() => {
    (async () => {
      const data = await getAppContent<CategoryGridFilter[]>("category_grid");
      if (data && data.length > 0) setFilters(data);
    })();
  }, []);

  const photos = filters[0]?.photos || [];

  return (
    <section className="relative py-12 md:py-16">
      <div className="relative w-full overflow-hidden bg-theme py-12 md:py-16">
        <div className="relative mx-auto max-w-[1400px] px-6 md:px-12 lg:px-16">
          <div className="mb-10 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-3.5 py-1.5 backdrop-blur-sm">
              <span className="text-[11px] font-bold tracking-[0.15em] text-accent md:text-xs">
                OUR WORK
              </span>
            </div>

            <h2 className="text-2xl font-black tracking-tight text-theme md:text-3xl lg:text-4xl">
              <span className="text-accent">جدیدترین</span> ها
            </h2>

            <div className="mx-auto mt-4 h-[3px] w-14 rounded-full bg-accent" />
          </div>
        </div>

        <Carousel3D photos={photos} />
      </div>
    </section>
  );
}