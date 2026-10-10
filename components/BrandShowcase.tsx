"use client";

import { useEffect, useMemo, useRef } from "react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/components/context/CartContext";

type SampleProduct = {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  inStock: boolean;
  category: string;
};

type BrandConfig = {
  key: string;
  nameFa: string;
  nameEn: string;
  direction: 1 | -1;
  speed: number;
  invertTheme?: boolean;
  products: SampleProduct[];
};

// ─────────────────────────────────────────────
// 🎭 محصولات نمونه
// ─────────────────────────────────────────────
const SAMPLE_PRODUCTS: Record<string, SampleProduct[]> = {
  naturehike: [
    { id: "n1", name: "چادر بادی ۴ نفره نیچرهایک مدل CNK2550", price: 15500000, oldPrice: 18500000, image: "/images/categories/photos/tent.jpg", inStock: true, category: "tent" },
    { id: "n2", name: "کیسه خواب چهارفصل نیچرهایک", price: 4200000, oldPrice: 5200000, image: "/images/categories/photos/sleep.jpg", inStock: true, category: "sleep" },
    { id: "n3", name: "زیرانداز بادی نیچرهایک", price: 2800000, image: "/images/categories/photos/mattress.jpg", inStock: true, category: "mattress" },
    { id: "n4", name: "کوله پشتی کوهنوردی نیچرهایک ۵۰ لیتری", price: 3800000, oldPrice: 4500000, image: "/images/categories/photos/backpack.jpg", inStock: true, category: "backpack" },
    { id: "n5", name: "صندلی کمپینگ تاشو نیچرهایک", price: 1850000, image: "/images/categories/photos/lighting.jpg", inStock: true, category: "accessories" },
  ],
  shinetrip: [
    { id: "s1", name: "چادر اتوماتیک شاین تریپ ۳ نفره", price: 8500000, oldPrice: 9800000, image: "/images/categories/photos/tent.jpg", inStock: true, category: "tent" },
    { id: "s2", name: "اجاق گاز کمپینگ شاین تریپ", price: 2100000, image: "/images/categories/photos/cooking.jpg", inStock: true, category: "cooking" },
    { id: "s3", name: "چراغ قوه LED شاین تریپ", price: 950000, oldPrice: 1200000, image: "/images/categories/photos/lighting.jpg", inStock: true, category: "lighting" },
    { id: "s4", name: "قمقمه استیل شاین تریپ", price: 680000, image: "/images/categories/photos/bottle.jpg", inStock: true, category: "bottle" },
    { id: "s5", name: "میز کمپینگ تاشو شاین تریپ", price: 3200000, oldPrice: 3800000, image: "/images/categories/photos/lighting.jpg", inStock: true, category: "accessories" },
  ],
  mountainhiker: [
    { id: "m1", name: "کفش کوهنوردی ماونتین هایکر", price: 4800000, oldPrice: 5500000, image: "/images/categories/photos/boots.jpg", inStock: true, category: "shoes" },
    { id: "m2", name: "کاپشن بادگیر ماونتین هایکر", price: 3500000, image: "/images/categories/photos/clothing.jpg", inStock: true, category: "clothing" },
    { id: "m3", name: "کوله پشتی تاکتیکال ۶۵ لیتری", price: 5200000, oldPrice: 6200000, image: "/images/categories/photos/backpack.jpg", inStock: true, category: "backpack" },
    { id: "m4", name: "باتوم کوهنوردی تلسکوپی", price: 1200000, image: "/images/categories/photos/tools.jpg", inStock: true, category: "tools" },
    { id: "m5", name: "دستکش کوهنوردی ضخیم", price: 580000, oldPrice: 720000, image: "/images/categories/photos/clothing.jpg", inStock: true, category: "clothing" },
  ],
  blackdog: [
    { id: "b1", name: "کول باکس بلک داگ BD-BWX003", price: 4800000, oldPrice: 5600000, image: "/images/categories/photos/backpack.jpg", inStock: true, category: "tools" },
    { id: "b2", name: "اجاق گاز بلک داگ CBD2300", price: 3200000, image: "/images/categories/photos/cooking.jpg", inStock: true, category: "cooking" },
    { id: "b3", name: "لیوان لعابی بلک داگ", price: 420000, oldPrice: 550000, image: "/images/categories/photos/bottle.jpg", inStock: true, category: "cooking" },
    { id: "b4", name: "بیل تاشو چندکاره بلک داگ", price: 1950000, image: "/images/categories/photos/tools.jpg", inStock: true, category: "tools" },
    { id: "b5", name: "میز کمپینگ بلک داگ CBD2550", price: 5500000, oldPrice: 6300000, image: "/images/categories/photos/lighting.jpg", inStock: true, category: "accessories" },
  ],
};

const BRANDS: BrandConfig[] = [
  {
    key: "naturehike",
    nameFa: "نیچرهایک",
    nameEn: "NatureHike",
    direction: 1,
    speed: 35,
    products: SAMPLE_PRODUCTS.naturehike,
  },
  {
    key: "shinetrip",
    nameFa: "شاین تریپ",
    nameEn: "Shine Trip",
    direction: -1,
    speed: 40,
    invertTheme: true,
    products: SAMPLE_PRODUCTS.shinetrip,
  },
  {
    key: "mountainhiker",
    nameFa: "ماونتین هایکر",
    nameEn: "Mountainhiker",
    direction: 1,
    speed: 38,
    products: SAMPLE_PRODUCTS.mountainhiker,
  },
  {
    key: "blackdog",
    nameFa: "بلک داگ",
    nameEn: "BLACK DOG",
    direction: -1,
    speed: 42,
    invertTheme: true,
    products: SAMPLE_PRODUCTS.blackdog,
  },
];

// ─────────────────────────────────────────────
// ردیف متحرک
// ─────────────────────────────────────────────
function BrandRow({ brand }: { brand: BrandConfig }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef(false);
  const offsetRef = useRef(0);
  const dragRef = useRef({
    active: false,
    moved: false,
    startX: 0,
    startOffset: 0,
    pointerId: -1,
  });

  const items = brand.products;

  const loopItems = useMemo(() => {
    if (items.length === 0) return [];
    return [...items, ...items, ...items];
  }, [items]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || loopItems.length === 0) return;

    let frameId: number;
    let lastTime = performance.now();

    function apply() {
      if (!track) return;
      const third = track.offsetWidth / 3;
      if (third > 0) {
        offsetRef.current = ((offsetRef.current % third) + third) % third;
      }
      const dir = brand.direction === 1 ? -1 : 1;
      track.style.transform = `translate3d(${
        dir * offsetRef.current
      }px, 0, 0)`;
    }

    function step(time: number) {
      const delta = Math.min(time - lastTime, 50);
      lastTime = time;

      if (!hoverRef.current && !dragRef.current.active) {
        offsetRef.current += (brand.speed * delta) / 1000;
      }

      apply();
      frameId = requestAnimationFrame(step);
    }

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [loopItems.length, brand.direction, brand.speed]);

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
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

  const invert = !!brand.invertTheme;

  // 🆕 کلاس‌های مخالف تم
  const rowBg = invert
    ? "bg-black dark:bg-white" // توی دارک مود سفید، توی لایت مشکی
    : "bg-theme-surface";

  const headingColor = invert
    ? "text-white dark:text-black"
    : "text-theme";

  const subHeadingColor = invert
    ? "text-white/60 dark:text-black/60"
    : "text-theme-muted";

  const allLinkColor = invert
    ? "text-white/80 hover:text-white dark:text-black/80 dark:hover:text-black"
    : "text-accent";

  const cardBg = invert
    ? "bg-zinc-900 dark:bg-zinc-100"
    : "bg-theme-card";

  const cardBorder = invert
    ? "border-zinc-700 dark:border-zinc-300"
    : "border-theme";

  const cardTitleColor = invert
    ? "text-white group-hover/card:text-accent dark:text-black dark:group-hover/card:text-accent"
    : "text-theme group-hover/card:text-accent";

  const cardOldPriceColor = invert
    ? "text-white/50 dark:text-black/50"
    : "text-theme-muted";

  const addBtnCls = invert
    ? "border-white text-white hover:bg-white hover:text-black dark:border-black dark:text-black dark:hover:bg-black dark:hover:text-white"
    : "border-accent text-accent hover:bg-accent hover:text-white";

  const dividerColor = invert
    ? "bg-white/20 dark:bg-black/20"
    : "bg-theme";

  return (
    <div className={`relative ${rowBg} py-5 md:py-8`}>
      {/* هدر برند */}
      <div className="mb-3 flex items-center justify-between gap-3 px-4 md:mb-4 md:px-12 lg:px-16">
        <div className="flex items-center gap-2.5">
          <div className="h-6 w-1 rounded-full bg-accent md:h-8" />
          <div>
            <h3 className={`text-sm font-black md:text-lg ${headingColor}`}>
              {brand.nameFa}
            </h3>
            <p
              dir="ltr"
              className={`text-[9px] font-bold uppercase tracking-[0.2em] md:text-[11px] ${subHeadingColor}`}
            >
              {brand.nameEn}
            </p>
          </div>
        </div>

        <a
          href={`/products?brand=${brand.key}`}
          className={`flex items-center gap-1 text-[10px] font-bold transition hover:gap-2 md:text-xs ${allLinkColor}`}
        >
          <span>همه محصولات</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="h-3 w-3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </a>
      </div>

      {/* ردیف متحرک */}
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
        <div
          ref={trackRef}
          dir="rtl"
          className="flex w-max"
          style={{ willChange: "transform", backfaceVisibility: "hidden" }}
        >
          {loopItems.map((product, idx) => {
            const hasDiscount = !!product.oldPrice;
            const discount = product.oldPrice
              ? Math.round(
                  ((product.oldPrice - product.price) / product.oldPrice) * 100
                )
              : 0;

            return (
              <a
                key={`${product.id}-${idx}`}
                draggable={false}
                href={`/product/${product.id}`}
                className={`group/card relative ml-2.5 w-[120px] flex-shrink-0 overflow-hidden rounded-lg border transition-colors duration-300 sm:ml-3 sm:w-[140px] md:ml-4 md:w-[170px] md:rounded-xl lg:w-[190px] ${cardBg} ${cardBorder}`}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-theme-surface">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    draggable={false}
                    className="h-full w-full object-cover object-center transition duration-500 group-hover/card:scale-105"
                  />

                  {hasDiscount && discount > 0 && (
                    <span className="absolute right-1 top-1 rounded bg-accent px-1 py-0.5 text-[8px] font-black text-white shadow-lg md:right-1.5 md:top-1.5 md:px-1.5 md:text-[9px]">
                      {discount}٪
                    </span>
                  )}

                  {!product.inStock && (
                    <span className="absolute inset-0 flex items-center justify-center bg-black/70 text-[10px] font-bold text-white md:text-xs">
                      ناموجود
                    </span>
                  )}
                </div>

                <div className="p-1.5 md:p-2">
                  <h4
                    className={`line-clamp-1 text-[10px] font-bold transition md:text-xs ${cardTitleColor}`}
                  >
                    {product.name}
                  </h4>

                  <div className="mt-1 flex items-center justify-between gap-1 md:mt-1.5">
                    <div className="flex min-w-0 flex-col">
                      {product.oldPrice && (
                        <span
                          className={`text-[8px] line-through md:text-[9px] ${cardOldPriceColor}`}
                        >
                          {formatPrice(product.oldPrice)}
                        </span>
                      )}
                      <span className="text-[10px] font-black text-accent md:text-xs">
                        {formatPrice(product.price)}
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={!product.inStock}
                      aria-label="افزودن به کوله"
                      className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded border bg-transparent transition disabled:cursor-not-allowed disabled:opacity-40 md:h-7 md:w-7 ${addBtnCls}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="h-2.5 w-2.5 md:h-3 md:w-3"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4.5v15m7.5-7.5h-15"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// کامپوننت اصلی
// ─────────────────────────────────────────────
export default function BrandShowcase() {
  return (
    <section className="relative py-10 md:py-16">
      {/* Header */}
      <div className="mx-auto max-w-[1400px] px-4 text-center md:px-12 lg:px-16">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-3 py-1 backdrop-blur-sm md:mb-4 md:px-4 md:py-1.5">
          <span className="text-[10px] font-bold tracking-[0.15em] text-accent md:text-xs">
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

      {/* ۴ ردیف */}
      <div className="mt-8 md:mt-12">
        {BRANDS.map((brand) => (
          <BrandRow key={brand.key} brand={brand} />
        ))}
      </div>
    </section>
  );
}