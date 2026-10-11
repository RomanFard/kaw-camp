"use client";

import { useEffect, useRef, useState } from "react";
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

const PEEK = 18;
const BEHIND_OPACITY = 0.35;
const PAD = 20;

const AUTOPLAY_MS = 4500;      // فاصله بین اسلایدها در حالت خودکار
const IDLE_RESUME_MS = 300;   // بعد از نیم ثانیه بی‌کاری، حرکت ادامه پیدا می‌کند

export default function CategoryGrid() {
  const [filters, setFilters] = useState<CategoryGridFilter[]>(DEFAULT_FILTERS);
  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // وضعیت کشیدن
  const wrapRef = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef<number | null>(null);
  const moved = useRef(false);

  // زمان آخرین تعامل کاربر
  const lastInteractRef = useRef(Date.now());

  function markInteraction() {
    lastInteractRef.current = Date.now();
  }

  // ─── لود فیلترها ───
  useEffect(() => {
    (async () => {
      const data = await getAppContent<CategoryGridFilter[]>("category_grid");
      if (data && data.length > 0) setFilters(data);
    })();
  }, []);

  // ─── تشخیص موبایل ───
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ─── اندازه عرض ───
  useEffect(() => {
    const measure = () => setW(wrapRef.current?.offsetWidth || 0);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // ─── autoplay فقط در موبایل ───
  useEffect(() => {
    if (!isMobile) return;
    if (filters.length <= 1) return;

    const id = setInterval(() => {
      // اگه کاربر اخیراً تعامل داشته، جلو نرو
      if (Date.now() - lastInteractRef.current < IDLE_RESUME_MS) return;
      // اگه در حال کشیدنه، جلو نرو
      if (dragging) return;
      // اگه موس روی کاروسله (فقط دسکتاپ، ولی برای اطمینان)، جلو نرو
      if (isHovering) return;

      setIndex((i) => (i + 1) % filters.length);
    }, AUTOPLAY_MS);

    return () => clearInterval(id);
  }, [isMobile, filters.length, dragging, isHovering]);

  const last = filters.length - 1;
  const goTo = (i: number) => {
    markInteraction();
    setIndex(Math.max(0, Math.min(last, i)));
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    markInteraction();
    startX.current = e.clientX;
    moved.current = false;
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (startX.current === null) return;
    const d = e.clientX - startX.current;
    if (!moved.current) {
      if (Math.abs(d) < 6) return;
      moved.current = true;
      setDragging(true);
      markInteraction();
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {}
    }
    markInteraction();
    setDx(d);
  };

  const endDrag = () => {
    if (startX.current === null) return;
    const d = dx;
    startX.current = null;
    setDragging(false);
    setDx(0);
    markInteraction();
    if (!moved.current) return;
    const threshold = Math.max(60, w * 0.2);
    if (d < -threshold) goTo(index + 1);
    else if (d > threshold) goTo(index - 1);
  };

  const onClickCapture = (e: React.MouseEvent) => {
    if (moved.current) {
      e.preventDefault();
      e.stopPropagation();
      moved.current = false;
    }
  };

  // استایل هر صفحه
  const pageStyle = (rel: number): React.CSSProperties => {
    const p = w ? Math.min(Math.abs(dx) / w, 1) : 0;
    const toNext = dragging && dx < 0 && index < last;
    const toPrev = dragging && dx > 0 && index > 0;

    let tx: number | string = 0;
    let ty = 0;
    let op = 1;

    if (rel > 0) {
      tx = "calc(100% + 40px)";
      if (toNext && rel === 1) tx = Math.max(0, w + dx);
    } else if (rel === 0) {
      if (toNext) {
        tx = -PEEK * p;
        ty = -PEEK * p;
        op = 1 - (1 - BEHIND_OPACITY) * p;
      } else if (toPrev) {
        tx = dx;
      }
    } else if (rel === -1) {
      tx = -PEEK;
      ty = -PEEK;
      op = BEHIND_OPACITY;
      if (toPrev) {
        tx = -PEEK * (1 - p);
        ty = -PEEK * (1 - p);
        op = BEHIND_OPACITY + (1 - BEHIND_OPACITY) * p;
      } else if (toNext) {
        op = BEHIND_OPACITY * (1 - p);
      }
    } else {
      tx = -PEEK;
      ty = -PEEK;
      op = 0;
      if (toPrev && rel === -2) op = BEHIND_OPACITY * p;
    }

    const txs = typeof tx === "number" ? `${tx}px` : tx;

    return {
      zIndex: rel + 1000,
      opacity: op,
      transform: `translate(${txs}, ${ty}px)`,
      pointerEvents: rel === 0 ? "auto" : "none",
      transition: dragging
        ? "none"
        : "transform 0.75s cubic-bezier(0.77, 0, 0.175, 1), opacity 0.75s ease",
    };
  };

  return (
    <section
      className="relative py-12 md:py-16"
      style={{ isolation: "isolate", zIndex: 1 }}
    >
      <div className="relative w-full bg-theme py-12 md:py-16">
        <div className="relative mx-auto max-w-[1400px] px-6 md:px-12 lg:px-16">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-3.5 py-1.5 backdrop-blur-sm">
              <span className="text-[11px] font-bold tracking-[0.15em] text-accent md:text-xs">
                OUR WORK
              </span>
            </div>

            <h2 className="text-2xl font-black tracking-tight text-theme md:text-3xl lg:text-4xl">
              دسته‌بندی‌های <span className="text-accent">محبوب</span>
            </h2>

            <div className="mx-auto mt-4 h-[3px] w-14 rounded-full bg-accent" />
          </div>

          <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
            {filters.map((f, i) => (
              <button
                key={f.key}
                type="button"
                onClick={() => goTo(i)}
                className={
                  "rounded-full border px-4 py-1.5 text-[11px] font-bold tracking-wider transition md:text-xs " +
                  (index === i
                    ? "border-accent bg-accent text-white shadow-lg shadow-accent/20"
                    : "border-theme bg-transparent text-theme-muted hover:border-accent/50 hover:text-accent")
                }
              >
                {f.label}
              </button>
            ))}
          </div>

          <div
            ref={wrapRef}
            dir="ltr"
            className="relative select-none overflow-hidden px-5 pt-5"
            style={{
              touchAction: "pan-y",
              cursor: dragging ? "grabbing" : "grab",
              paddingLeft: PAD,
              paddingRight: PAD,
              paddingTop: PAD,
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onClickCapture={onClickCapture}
            onPointerEnter={(e) => {
              if (e.pointerType !== "mouse") return;
              setIsHovering(true);
            }}
            onPointerLeave={(e) => {
              if (e.pointerType !== "mouse") return;
              setIsHovering(false);
            }}
          >
            <div className="grid">
              {filters.map((f, pageIdx) => {
                const rel = pageIdx - index;
                return (
                  <div
                    key={f.key}
                    dir="rtl"
                    aria-hidden={rel !== 0}
                    className="col-start-1 row-start-1 grid w-full grid-cols-2 gap-2 rounded-xl bg-theme shadow-[-10px_10px_40px_rgba(0,0,0,0.45)] sm:grid-cols-3 md:gap-4"
                    style={pageStyle(rel)}
                  >
                    {f.photos.map((photoName, idx) => {
                      const imageSrc = `/images/categories/photos/${photoName}.jpg`;
                      const label = LABELS[photoName] || photoName;
                      const href =
                        f.key === "best" ? "/products" : `/products?cat=${f.key}`;

                      return (
                        <a
                          key={`${f.key}-${idx}`}
                          href={href}
                          draggable={false}
                          tabIndex={rel === 0 ? 0 : -1}
                          className="group relative block aspect-[4/3] overflow-hidden rounded-lg bg-theme-card transition duration-500"
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
                            className="h-full w-full object-cover object-center transition duration-700 group-hover:scale-110"
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition duration-500 group-hover:from-black/90 group-hover:via-black/60" />

                          <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full border-2 border-accent opacity-0 transition duration-500 group-hover:opacity-100">
                            <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                          </div>

                          <div className="absolute bottom-0 right-0 left-0 p-4">
                            <div className="mb-2.5 h-[3px] w-0 bg-accent transition-all duration-500 group-hover:w-8" />

                            <h3 className="translate-y-2 text-sm font-black text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 md:text-base">
                              {label}
                            </h3>

                            <p className="mt-0.5 translate-y-2 text-[10px] font-bold text-accent opacity-0 transition-all duration-500 delay-75 group-hover:translate-y-0 group-hover:opacity-100 md:text-[11px]">
                              مشاهده محصولات
                            </p>
                          </div>

                          <div className="absolute bottom-0 right-0 left-0 h-[3px] w-0 bg-accent transition-all duration-500 group-hover:w-full" />
                        </a>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2">
            {filters.map((f, i) => (
              <button
                key={f.key}
                type="button"
                aria-label={f.label}
                onClick={() => goTo(i)}
                className={
                  "h-1.5 rounded-full transition-all duration-500 " +
                  (index === i ? "w-6 bg-accent" : "w-1.5 bg-accent/30")
                }
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}