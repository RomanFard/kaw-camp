"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

const ASPECT = 0.7;

// ─── Types ───
export type CategoryShowcaseItem = {
  key: string;
  label: string;
  subtitle: string;
  iconKey: string;
  href: string;
  image: string;
};

export type CategoryShowcaseData = {
  items: CategoryShowcaseItem[];
};

export const DEFAULT_CATEGORY_SHOWCASE: CategoryShowcaseData = {
  items: [
    { key: "stove", label: "اجاق گاز", subtitle: "بلک داگ CBD2300CW013", iconKey: "cooking", href: "/products?cat=cooking", image: "/images/categories/photos/cooking.jpg" },
    { key: "spice-set", label: "ست ادویه", subtitle: "بلک داگ CBD2450XB019", iconKey: "cooking", href: "/products?cat=cooking", image: "/images/categories/photos/bottle.jpg" },
    { key: "tent-auto", label: "چادر اتوماتیک", subtitle: "Xianju 2.1 — CBD2450WS029", iconKey: "tent", href: "/products?cat=tent", image: "/images/categories/photos/tent.jpg" },
    { key: "cool-box", label: "کول باکس", subtitle: "بلک داگ BD-BWX003", iconKey: "tools", href: "/products?cat=tools", image: "/images/categories/photos/backpack.jpg" },
    { key: "enamel-mug", label: "لیوان لعابی", subtitle: "بلک داگ CBD2450CF018", iconKey: "cooking", href: "/products?cat=cooking", image: "/images/categories/photos/bottle.jpg" },
    { key: "camp-table", label: "میز کمپینگ", subtitle: "بلک داگ CBD2550JJ025", iconKey: "lighting", href: "/products?cat=lighting", image: "/images/categories/photos/lighting.jpg" },
    { key: "folding-shovel", label: "بیل تاشو چندکاره", subtitle: "بلک داگ CBD2450PJ018", iconKey: "tools", href: "/products?cat=tools", image: "/images/categories/photos/backpack.jpg" },
    { key: "tent-family", label: "چادر مسافرتی", subtitle: "بلک داگ CBD2550WS018", iconKey: "tent", href: "/products?cat=tent", image: "/images/categories/photos/tent.jpg" },
  ],
};

const mod = (a: number, m: number) => ((a % m) + m) % m;
const wrapP = (x: number, n: number) => mod(x + n / 2, n) - n / 2;

const lerpTable = (a: number, table: number[]) => {
  const i = Math.min(table.length - 2, Math.floor(a));
  const t = Math.min(1, Math.max(0, a - i));
  return table[i] + (table[i + 1] - table[i]) * t;
};

const X_TABLE = [0, 0.39, 0.8, 1.2];
const SCALE_TABLE = [1, 0.73, 0.47, 0.3];

// ─── Props ───
type Props = {
  data?: CategoryShowcaseData;
  editable?: boolean;
  onChange?: (data: CategoryShowcaseData) => void;
  onImagePick?: (key: string) => void;
};

export default function CategoryShowcase({
  data = DEFAULT_CATEGORY_SHOWCASE,
  editable = false,
  onChange,
  onImagePick,
}: Props) {
  const items = data.items;

  return (
    <section dir="rtl" className="overflow-hidden py-12 md:py-24">
      <div className="mx-auto max-w-[1400px] px-4 md:hidden">
        <SectionHeading />
      </div>

      <CategoryCarousel items={items} />

      {/* ─── Edit Panel (only in admin) ─── */}
      {editable && onChange && (
        <div className="mx-auto mt-16 max-w-[1000px] px-4">
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5">
            <h3 className="mb-4 text-sm font-bold text-amber-200">
              ✏️ ویرایش دسته‌بندی‌ها
            </h3>

            <div className="space-y-3">
              {items.map((item, i) => (
                <div
                  key={item.key}
                  className="flex flex-col gap-3 rounded-lg border border-white/10 bg-black/30 p-3 md:flex-row md:items-center"
                >
                  {/* Thumbnail */}
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-black/40">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.label}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Label input */}
                  <input
                    value={item.label}
                    onChange={(e) => {
                      const next = items.map((it, idx) =>
                        idx === i ? { ...it, label: e.target.value } : it
                      );
                      onChange({ items: next });
                    }}
                    placeholder="نام دسته"
                    className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-amber-400 md:flex-1"
                  />

                  {/* Subtitle input */}
                  <input
                    value={item.subtitle}
                    onChange={(e) => {
                      const next = items.map((it, idx) =>
                        idx === i ? { ...it, subtitle: e.target.value } : it
                      );
                      onChange({ items: next });
                    }}
                    placeholder="زیرنویس"
                    className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-xs text-white/80 outline-none focus:border-amber-400 md:flex-1"
                  />

                  {/* Upload button */}
                  <button
                    type="button"
                    onClick={() => onImagePick?.(item.key)}
                    className="shrink-0 rounded-md bg-amber-500 px-3 py-2 text-xs font-bold text-black transition hover:bg-amber-400"
                  >
                    📷 تغییر تصویر
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function SectionHeading() {
  return (
    <div className="flex flex-col items-center text-center">
      <span className="rounded-full border border-accent/40 bg-accent/5 px-5 py-1.5 text-xs font-bold uppercase tracking-wider text-accent">
        BLACK DOG
      </span>

      <h2 className="mt-5 text-3xl font-black md:text-5xl">
        بلک <span className="text-accent">داگ</span>
      </h2>

      <div className="mt-5 h-1 w-16 rounded-full bg-accent" />
    </div>
  );
}

function CategoryCarousel({ items }: { items: CategoryShowcaseItem[] }) {
  const [wrapW, setWrapW] = useState(900);
  const [activeKey, setActiveKey] = useState<string>(items[0]?.key ?? "");

  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const capRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const posRef = useRef(0);
  const targetRef = useRef<number | null>(null);
  const dragStartX = useRef<number | null>(null);
  const dragged = useRef(false);
  const activeRef = useRef(items[0]?.key ?? "");

  const n = items.length;
  const isMobile = wrapW < 640;

  const cardW = isMobile
    ? Math.round(Math.min(240, wrapW * 0.55))
    : Math.round(Math.min(384, Math.max(220, wrapW * 0.3)));
  const cardH = Math.round(cardW / ASPECT);

  const nRef = useRef(n);
  const cardWRef = useRef(cardW);
  nRef.current = n;
  cardWRef.current = cardW;

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setWrapW(el.offsetWidth || 900);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const applyRef = useRef<() => void>(() => {});
  applyRef.current = () => {
    const nn = nRef.current;
    const W = cardWRef.current;
    const pos = posRef.current;
    if (nn === 0) return;

    for (let i = 0; i < nn; i++) {
      const el = cardRefs.current[i];
      if (!el) continue;

      const p = wrapP(i - pos, nn);
      const a = Math.abs(p);
      const sign = p < 0 ? -1 : 1;

      const x = sign * lerpTable(a, X_TABLE) * W;
      const scale = lerpTable(a, SCALE_TABLE);
      const opacity = a <= 2.4 ? 1 : Math.max(0, 1 - (a - 2.4) / 0.6);

      el.style.transform = `translate(-50%, -50%) translateX(${x.toFixed(1)}px) scale(${scale.toFixed(4)})`;
      el.style.opacity = opacity.toFixed(3);
      el.style.pointerEvents = opacity > 0.05 ? "auto" : "none";
      el.style.zIndex = String(100 - Math.round(a * 10));

      const cap = capRefs.current[i];
      if (cap) {
        cap.style.transform = `translate(-50%, 0) translateX(${x.toFixed(1)}px)`;
        cap.style.opacity = Math.max(0, 1 - a * 1.8).toFixed(3);
      }
    }

    const centerIdx = mod(Math.round(pos), nn);
    const centerKey = items[centerIdx]?.key;
    if (centerKey && centerKey !== activeRef.current) {
      activeRef.current = centerKey;
      setActiveKey(centerKey);
    }
  };

  useLayoutEffect(() => {
    applyRef.current();
  }, [cardW, n, items]);

  useEffect(() => {
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

  const onPointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
    dragged.current = false;
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
  };

  return (
    <div className="mx-auto mt-10 max-w-[1400px] px-4 md:mt-0 md:px-12 lg:px-16">
      <div
        dir="ltr"
        className="relative mb-24 flex flex-col items-stretch gap-6 md:mt-44 md:block"
      >
        <ul
          dir="rtl"
          className="hidden shrink-0 flex-row flex-wrap justify-center gap-x-5 gap-y-2 md:absolute md:right-0 md:top-1/2 md:z-[200] md:flex md:w-40 md:-translate-y-1/2 md:flex-col md:justify-start md:gap-3"
        >
          {items.map((cat, i) => {
            const active = cat.key === activeKey;
            return (
              <li key={cat.key}>
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  className={`text-right text-sm font-black tracking-wide transition-colors md:text-base ${
                    active
                      ? "text-[#5b0a0a]"
                      : "text-neutral-500 hover:text-neutral-800"
                  }`}
                >
                  {cat.label}
                </button>
              </li>
            );
          })}
        </ul>

        <div
          ref={wrapRef}
          className="relative w-full min-w-0 select-none touch-pan-y"
          style={{ height: cardH + 40 }}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => {
            dragStartX.current = null;
          }}
        >
          <div className="pointer-events-none absolute bottom-full left-1/2 mb-10 hidden w-max -translate-x-1/2 md:block">
            <SectionHeading />
          </div>

          {items.map((cat, i) => {
            const image = cat.image || "/images/categories/photos/tent.jpg";

            return (
              <a
                key={cat.key}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                href={cat.href}
                draggable={false}
                aria-label={cat.label}
                onClick={(e) => {
                  if (dragged.current) {
                    e.preventDefault();
                    dragged.current = false;
                    return;
                  }
                  const p = wrapP(i - posRef.current, nRef.current);
                  if (Math.abs(p) > 0.5) {
                    e.preventDefault();
                    goTo(i);
                  }
                }}
                className="absolute left-1/2 top-1/2 block"
                style={{
                  width: cardW,
                  height: cardH,
                  willChange: "transform, opacity",
                }}
              >
                <div className="h-full w-full overflow-hidden rounded-2xl bg-theme-card shadow-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt={cat.label}
                    loading="lazy"
                    draggable={false}
                    className="h-full w-full object-cover"
                  />
                </div>
              </a>
            );
          })}

          {/* mobile: names under the cards, one visible at a time, sliding with the images */}
          {items.map((cat, i) => (
            <span
              key={`cap-${cat.key}`}
              ref={(el) => {
                capRefs.current[i] = el;
              }}
              dir="rtl"
              className="pointer-events-none absolute left-1/2 z-[300] whitespace-nowrap text-base font-black text-theme md:hidden"
              style={{ top: cardH + 26 }}
            >
              {cat.label}
            </span>
          ))}

          {n > 1 && (
            <div
              dir="ltr"
              className="absolute left-1/2 top-full mt-14 flex -translate-x-1/2 items-center gap-5 md:mt-4"
            >
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={goNext}
                aria-label="بعدی"
                className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-neutral-900 transition hover:bg-accent-hover"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={goPrev}
                aria-label="قبلی"
                className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-neutral-900 transition hover:bg-accent-hover"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth={2.5} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}