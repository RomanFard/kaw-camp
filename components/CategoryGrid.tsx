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

const SPEED = 0.5;
const STEP_DEG = 26;
const GAP = 1.04;
const PERSPECTIVE = 2400;

const MOBILE_MAX = 640;
const RESUME_DELAY = 2000;

const mod = (a: number, m: number) => ((a % m) + m) % m;
const wrapP = (x: number, n: number) => mod(x + n / 2, n) - n / 2;

// 🆕 تایپ عکس دسته‌بندی
type CategoryPhoto = {
  name: string;
  url: string;
};

type PhotoMap = Record<string, string>;

type RowProps = {
  photos: string[];
  reverse?: boolean;
  photoMap: PhotoMap;
};

function Carousel3D({ photos, reverse = false, photoMap }: RowProps) {
  const [wrapW, setWrapW] = useState(1200);
  const [dot, setDot] = useState(0);

  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const posRef = useRef(0);
  const velRef = useRef(0);
  const targetRef = useRef<number | null>(null);
  const dotRef = useRef(0);
  const dragStartX = useRef<number | null>(null);
  const dragged = useRef(false);

  const hoverRef = useRef(false);
  const pauseUntilRef = useRef(0);
  const activeCardIdxRef = useRef<number | null>(null);

  const reverseRef = useRef(reverse);
  reverseRef.current = reverse;

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
  const isMobile = wrapW < MOBILE_MAX;

  const size = isMobile
    ? Math.round(Math.min(130, Math.max(80, wrapW * 0.28)))
    : Math.round(Math.min(240, Math.max(100, wrapW * 0.2)));

  const radius = (size * GAP) / 2 / Math.tan((STEP_DEG / 2) * (Math.PI / 180));

  const nRef = useRef(n);
  const radiusRef = useRef(radius);
  nRef.current = n;
  radiusRef.current = radius;

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

      const p = wrapP(i - pos - 0.5, nn);
      const a = Math.abs(p);
      const beyond = Math.max(0, a - 0.5);

      const opacity =
        a <= fadeStart
          ? 1
          : Math.max(0, 1 - (a - fadeStart) / (fadeEnd - fadeStart));
      const textOpacity = 1 - Math.min(1, beyond / 0.6);

      const angle = (p * STEP_DEG).toFixed(3);
      el.style.transform = `translate(-50%, -50%) rotateY(${angle}deg) translateZ(${R.toFixed(1)}px)`;
      el.style.filter =
        beyond > 0.02 ? `blur(${(beyond * 3.2).toFixed(2)}px)` : "none";
      el.style.opacity = opacity.toFixed(3);
      el.style.pointerEvents = opacity > 0.3 ? "auto" : "none";
      el.style.setProperty("--t", textOpacity.toFixed(3));

      const inner = el.firstElementChild as HTMLElement | null;
      if (inner) {
        const isActive =
          activeCardIdxRef.current === i && dragStartX.current === null;
        if (isActive) {
          if (!inner.classList.contains("is-active"))
            inner.classList.add("is-active");
        } else {
          if (inner.classList.contains("is-active"))
            inner.classList.remove("is-active");
        }
      }
    }

    const d = mod(Math.round(pos), nn);
    if (d !== dotRef.current) {
      dotRef.current = d;
      setDot(d);
    }
  };

  useLayoutEffect(() => {
    applyRef.current();
  }, [size, n]);

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
        const canMove =
          !hoverRef.current &&
          dragStartX.current === null &&
          Date.now() >= pauseUntilRef.current;

        const dir = reverseRef.current ? -1 : 1;
        const goal =
          !canMove || reduced || nRef.current < 2 ? 0 : SPEED * dir;
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

  const edge = `calc(50% - ${Math.round(size * GAP)}px)`;
  const fadeMask = `linear-gradient(to right,
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
    hoverRef.current = true;
    activeCardIdxRef.current = null;
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
    pauseUntilRef.current = Date.now() + RESUME_DELAY;
  };

  return (
    <div>
      <div
        ref={wrapRef}
        dir="ltr"
        className="relative w-full select-none touch-pan-y"
        style={{
          height: size + 90,
          perspective: `${PERSPECTIVE}px`,
          WebkitMaskImage: fadeMask,
          maskImage: fadeMask,
        }}
        onPointerEnter={(e) => {
          if (e.pointerType !== "mouse") return;
          hoverRef.current = true;
        }}
        onPointerLeave={(e) => {
          if (e.pointerType !== "mouse") return;
          hoverRef.current = false;
          pauseUntilRef.current = Date.now() + RESUME_DELAY;
          activeCardIdxRef.current = null;
        }}
        onTouchStart={() => {
          hoverRef.current = true;
        }}
        onTouchEnd={() => {
          hoverRef.current = false;
          pauseUntilRef.current = Date.now() + RESUME_DELAY;
          activeCardIdxRef.current = null;
        }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          dragStartX.current = null;
          hoverRef.current = false;
          pauseUntilRef.current = Date.now() + RESUME_DELAY;
          activeCardIdxRef.current = null;
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
            // 🆕 استفاده از map — اگه override داشته باشه، از اون، وگرنه از مسیر سخت‌کد
            const imageSrc =
              photoMap[photoName] ||
              `/images/categories/photos/${photoName}.jpg`;
            const label = LABELS[photoName] || photoName;

            return (
              <a
                key={`${photoName}-${i}`}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                href="/products"
                onPointerEnter={(e) => {
                  if (e.pointerType !== "mouse") return;
                  activeCardIdxRef.current = i;
                }}
                onPointerLeave={(e) => {
                  if (e.pointerType !== "mouse") return;
                  if (activeCardIdxRef.current === i)
                    activeCardIdxRef.current = null;
                }}
                onTouchStart={() => {
                  activeCardIdxRef.current = i;
                }}
                onTouchEnd={() => {
                  if (activeCardIdxRef.current === i)
                    activeCardIdxRef.current = null;
                }}
                onClick={(e) => {
                  if (dragged.current) {
                    e.preventDefault();
                    dragged.current = false;
                    return;
                  }
                  const p = wrapP(i - posRef.current - 0.5, nRef.current);
                  if (Math.abs(p) > 0.55) {
                    e.preventDefault();
                    if (p < 0) goTo(i);
                    else goTo(i - 1);
                  }
                }}
                draggable={false}
                className="group absolute left-1/2 top-1/2 block"
                style={{
                  width: size,
                  height: size,
                  willChange: "transform, filter, opacity",
                }}
              >
                <div className="kaw-card-inner">
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
                        wrapper.innerHTML = `<span style="font-size: 2rem">📦</span>`;
                        parent.appendChild(wrapper);
                      }
                    }}
                    className="h-full w-full object-cover object-center"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  <div
                    dir="rtl"
                    className="absolute bottom-0 left-0 right-0 p-2 md:p-3"
                    style={{ opacity: "var(--t, 1)" }}
                  >
                    <div className="mb-1 h-[2px] w-6 bg-accent md:mb-1.5" />
                    <h3 className="text-[10px] font-black text-white md:text-xs">
                      {label}
                    </h3>
                    <p className="mt-0.5 text-[8px] font-bold text-accent md:text-[10px]">
                      مشاهده محصولات
                    </p>
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        <button
          type="button"
          aria-label="قبلی"
          onClick={goPrev}
          onPointerDown={(e) => e.stopPropagation()}
          onPointerUp={(e) => e.stopPropagation()}
          className="absolute left-2 top-1/2 z-40 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur transition hover:border-accent hover:text-accent md:left-6 md:h-9 md:w-9"
        >
          ‹
        </button>
        <button
          type="button"
          aria-label="بعدی"
          onClick={goNext}
          onPointerDown={(e) => e.stopPropagation()}
          onPointerUp={(e) => e.stopPropagation()}
          className="absolute right-2 top-1/2 z-40 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur transition hover:border-accent hover:text-accent md:right-6 md:h-9 md:w-9"
        >
          ›
        </button>
      </div>

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

      <style jsx>{`
        .kaw-card-inner {
          position: absolute;
          inset: 0;
          overflow: hidden;
          border-radius: 0.75rem;
          transform: scale(1);
          transform-origin: center center;
          transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1),
            box-shadow 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
          box-shadow: 0 24px 50px -22px rgba(0, 0, 0, 0.85);
          will-change: transform;
        }
        .kaw-card-inner.is-active {
          transform: scale(1.18);
          box-shadow: 0 24px 50px -22px rgba(0, 0, 0, 0.85),
            0 0 28px rgba(232, 76, 76, 0.45);
          z-index: 10;
        }
        @media (max-width: 640px) {
          .kaw-card-inner.is-active {
            transform: scale(1.2);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .kaw-card-inner {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}

export default function CategoryGrid() {
  const [filters, setFilters] = useState<CategoryGridFilter[]>(DEFAULT_FILTERS);
  // 🆕 map عکس‌ها (name → url)
  const [photoMap, setPhotoMap] = useState<PhotoMap>({});

  // لود فیلترها
  useEffect(() => {
    (async () => {
      const data = await getAppContent<CategoryGridFilter[]>("category_grid");
      if (data && data.length > 0) setFilters(data);
    })();
  }, []);

  // 🆕 لود عکس‌ها
  useEffect(() => {
    (async () => {
      try {
        const photos = await getAppContent<CategoryPhoto[]>("category_photos");
        if (photos && photos.length > 0) {
          const map: PhotoMap = {};
          photos.forEach((p) => {
            if (p.name && p.url) map[p.name] = p.url;
          });
          setPhotoMap(map);
        }
      } catch (e) {
        console.error("category_photos load error", e);
      }
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

        {/* 🆕 پاس دادن photoMap */}
        <Carousel3D photos={photos} photoMap={photoMap} />
        <div className="mt-2 md:mt-4">
          <Carousel3D photos={photos} reverse photoMap={photoMap} />
        </div>
      </div>
    </section>
  );
}