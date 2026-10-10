"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { formatPrice } from "@/lib/utils";
import { getProductImage } from "@/lib/productImages";
import { useProducts } from "@/components/context/ProductsContext";
import { useCart } from "@/components/context/CartContext";

type Product = ReturnType<typeof useProducts>["products"][number];

const REEL_COUNT = 3;
const FACES = 8; // تعداد کارت‌های روی هر استوانه
const STEP = 360 / FACES; // زاویه‌ی بین دو کارت (۴۵ درجه: انحنای واضح)
// شعاع استوانه به‌صورت ضریبی از ارتفاع کارت: (1/2) / tan(STEP/2)
const RADIUS_K = 0.5 / Math.tan((STEP / 2) * (Math.PI / 180));
const BASE_DURATION = 2200; // مدت چرخش اولین ریل (میلی‌ثانیه)
const REEL_DELAY = 650; // تأخیر توقف هر ریل نسبت به قبلی

const GOLD =
  "linear-gradient(135deg,#fff3b0 0%,#e8b923 22%,#a8780b 45%,#ffe58a 62%,#b8860b 82%,#f7d56b 100%)";
const GOLD_V =
  "linear-gradient(90deg,#8a6209,#ffe58a 45%,#b8860b)";

const SPARKLES = [
  { l: "3%", t: "12%", s: 14, d: 0, du: 3.2 },
  { l: "94%", t: "8%", s: 18, d: 0.8, du: 3.8 },
  { l: "-1%", t: "50%", s: 10, d: 1.4, du: 2.8 },
  { l: "99%", t: "42%", s: 12, d: 0.3, du: 3.4 },
  { l: "4%", t: "88%", s: 16, d: 1.1, du: 4 },
  { l: "93%", t: "92%", s: 12, d: 1.9, du: 3 },
  { l: "50%", t: "-5%", s: 14, d: 0.5, du: 3.6 },
  { l: "26%", t: "-3%", s: 9, d: 2, du: 3.1 },
  { l: "76%", t: "-4%", s: 10, d: 1.2, du: 3.9 },
];

type ReelState = { pos: number; animating: boolean; duration: number };

function getDiscount(p: Product) {
  return p.oldPrice
    ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)
    : 0;
}

function ProductCell({
  product,
  highlight,
  onAdd,
}: {
  product: Product;
  highlight: boolean;
  onAdd: (e: React.MouseEvent, p: Product) => void;
}) {
  const discount = getDiscount(product);
  const image = product.image || getProductImage(product.category, product.id);

  return (
    <a
      href={`/product/${product.id}`}
      draggable={false}
      className={`group/card relative flex h-full w-full flex-col overflow-hidden bg-theme-card transition-shadow duration-300 ${
        highlight ? "shadow-[inset_0_0_0_2px_#ffd56b]" : ""
      }`}
    >
      <div className="relative min-h-0 flex-1 overflow-hidden bg-theme-surface">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={product.name}
          loading="lazy"
          draggable={false}
          className="h-full w-full object-cover object-center transition duration-500 group-hover/card:scale-105"
        />

        {discount > 0 ? (
          <span className="absolute right-1 top-1 rounded bg-accent px-1 py-0.5 text-[9px] font-black text-white shadow-lg md:right-1.5 md:top-1.5 md:px-1.5 md:text-[11px] lg:right-2.5 lg:top-2.5 lg:px-2.5 lg:py-1 lg:text-sm">
            {discount}٪
          </span>
        ) : (
          <span className="absolute right-1 top-1 rounded bg-theme-surface/90 px-1 py-0.5 text-[9px] font-black text-theme backdrop-blur-sm md:right-1.5 md:top-1.5 md:px-1.5 md:text-[11px] lg:right-2.5 lg:top-2.5 lg:px-2.5 lg:py-1 lg:text-sm">
            جدید
          </span>
        )}

        {highlight && (
          <span className="absolute bottom-1 left-1 right-1 rounded bg-[#ffd56b] px-1 py-0.5 text-center text-[8px] font-black text-[#3a2200] md:text-[10px] lg:bottom-2 lg:left-2 lg:right-2 lg:py-1 lg:text-xs">
            بهترین تخفیف
          </span>
        )}

        {!product.inStock && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/70 text-[10px] font-bold text-white md:text-xs">
            ناموجود
          </span>
        )}
      </div>

      <div className="p-1.5 md:p-2.5 lg:p-4">
        <h3 className="line-clamp-1 text-[10px] font-bold text-theme transition group-hover/card:text-accent md:text-xs lg:text-base">
          {product.name}
        </h3>

        <div className="mt-1 flex items-center justify-between gap-1 md:mt-2 lg:mt-3">
          <div className="flex min-w-0 flex-col">
            {product.oldPrice && (
              <span className="text-[8px] text-theme-muted line-through md:text-[10px] lg:text-xs">
                {formatPrice(product.oldPrice)}
              </span>
            )}
            <span className="text-[10px] font-black text-accent md:text-sm lg:text-xl">
              {formatPrice(product.price)}
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => onAdd(e, product)}
            disabled={!product.inStock}
            aria-label="افزودن به کوله"
            className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded border border-accent bg-transparent text-accent transition hover:bg-accent hover:text-white disabled:cursor-not-allowed disabled:border-theme disabled:text-theme-muted md:h-7 md:w-7 lg:h-9 lg:w-9"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-2.5 w-2.5 md:h-3 md:w-3 lg:h-4 lg:w-4"
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
}

function Led({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="mb-1 text-[8px] font-bold text-[#f7d56b]/80 md:text-[11px] lg:text-sm">
        {label}
      </div>
      <div className="rounded-md p-px" style={{ background: GOLD }}>
        <div
          dir="ltr"
          className="rounded-[5px] px-1 py-1 font-serif text-xs font-bold tracking-wider md:px-2 md:py-1.5 md:text-2xl lg:py-2.5 lg:text-2xl"
          style={{
            background: "linear-gradient(180deg,#0e0618,#1e0f33)",
            color: "#ffd56b",
            textShadow: "0 0 10px rgba(255,213,107,0.85)",
            boxShadow: "inset 0 0 12px rgba(0,0,0,0.95)",
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

const GEM_BTN =
  "relative flex items-center justify-center overflow-hidden rounded-full px-1 py-2 text-center text-[10px] font-black text-white transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 md:py-3 md:text-sm lg:py-4 lg:text-base";

function Gem({ className, from, to }: { className: string; from: string; to: string }) {
  return (
    <span
      className={`pointer-events-none absolute z-20 block rounded-full ${className}`}
      style={{
        background: `radial-gradient(circle at 32% 28%, #fff 0%, ${from} 28%, ${to} 100%)`,
        boxShadow: `0 0 0 2px #b8860b, 0 0 0 3.5px #ffe58a, 0 0 12px ${from}`,
      }}
    />
  );
}

/* ───────────── پس‌زمینه‌ی کازینویی (فقط دسکتاپ) ───────────── */

const FELT_NOISE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

function ChipStack({
  color,
  dark,
  count,
  size,
  label,
  style,
}: {
  color: string;
  dark: string;
  count: number;
  size: number;
  label: string;
  style: React.CSSProperties;
}) {
  const h = size * 0.62;
  return (
    <div
      className="absolute"
      style={{ width: size, height: h + count * 7, ...style }}
    >
      {Array.from({ length: count }, (_, k) => (
        <span
          key={k}
          className="absolute left-0 block rounded-[50%]"
          style={{
            width: size,
            height: h,
            bottom: k * 7,
            background: `repeating-conic-gradient(#fff 0deg 16deg, ${color} 16deg 45deg)`,
            boxShadow: `0 4px 0 ${dark}, 0 ${k === 0 ? 10 : 0}px 14px rgba(0,0,0,0.5)`,
          }}
        >
          {k === count - 1 && (
            <span
              className="absolute flex items-center justify-center rounded-[50%] text-[11px] font-black text-white"
              style={{
                inset: `${h * 0.14}px ${size * 0.14}px`,
                background: color,
                border: "2px dashed rgba(255,255,255,0.85)",
              }}
            >
              {label}
            </span>
          )}
        </span>
      ))}
    </div>
  );
}

function FlatChip({
  color,
  size,
  label,
  style,
}: {
  color: string;
  size: number;
  label: string;
  style: React.CSSProperties;
}) {
  return (
    <span
      className="absolute block rounded-full"
      style={{
        width: size,
        height: size,
        background: `repeating-conic-gradient(#fff 0deg 18deg, ${color} 18deg 45deg)`,
        boxShadow: "0 3px 0 rgba(0,0,0,0.45), 0 10px 16px rgba(0,0,0,0.5)",
        ...style,
      }}
    >
      <span
        className="absolute flex items-center justify-center rounded-full text-xs font-black text-white"
        style={{
          inset: size * 0.15,
          background: color,
          border: "2px dashed rgba(255,255,255,0.85)",
        }}
      >
        {label}
      </span>
    </span>
  );
}

function PlayCard({
  rank,
  suit,
  red,
  style,
}: {
  rank: string;
  suit: string;
  red?: boolean;
  style: React.CSSProperties;
}) {
  const c = red ? "#c8102e" : "#14141a";
  return (
    <span
      className="absolute block rounded-lg bg-[#f7f7fb]"
      style={{
        width: 96,
        height: 134,
        color: c,
        boxShadow: "0 8px 18px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(0,0,0,0.08)",
        transformOrigin: "10% 95%",
        ...style,
      }}
    >
      <span className="absolute left-2 top-1 text-center text-lg font-black leading-none">
        {rank}
        <br />
        <span className="text-base">{suit}</span>
      </span>
      <span className="absolute inset-0 flex items-center justify-center text-5xl">
        {suit}
      </span>
      <span className="absolute bottom-1 right-2 rotate-180 text-center text-lg font-black leading-none">
        {rank}
        <br />
        <span className="text-base">{suit}</span>
      </span>
    </span>
  );
}

const PIPS: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

function Die({
  n,
  size,
  style,
}: {
  n: number;
  size: number;
  style: React.CSSProperties;
}) {
  return (
    <span
      className="absolute grid grid-cols-3 grid-rows-3 rounded-[16%] p-[12%]"
      style={{
        width: size,
        height: size,
        background: "linear-gradient(135deg,#e5303f,#8f0f1d)",
        boxShadow:
          "inset 0 0 0 2px rgba(255,255,255,0.12), inset -4px -6px 10px rgba(0,0,0,0.35), 0 10px 18px rgba(0,0,0,0.55)",
        ...style,
      }}
    >
      {Array.from({ length: 9 }, (_, k) => (
        <span key={k} className="flex items-center justify-center">
          {PIPS[n].includes(k) && (
            <span
              className="block rounded-full bg-white"
              style={{ width: size * 0.16, height: size * 0.16 }}
            />
          )}
        </span>
      ))}
    </span>
  );
}

function CasinoBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 hidden overflow-hidden lg:block"
    >
      {/* نمد سبز میز */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 45%, #14935f 0%, #0b6a47 40%, #064229 72%, #021f13 100%)",
        }}
      />
      {/* بافت نمد */}
      <div
        className="absolute inset-0 opacity-30 mix-blend-overlay"
        style={{ backgroundImage: FELT_NOISE }}
      />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg,#fff 0 1px,transparent 1px 14px), repeating-linear-gradient(-45deg,#fff 0 1px,transparent 1px 14px)",
        }}
      />

      {/* خطوط میز شرط‌بندی */}
      <svg
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <path id="dpArcTop" d="M 110 470 A 690 350 0 0 1 1490 470" />
          <path id="dpArcBottom" d="M 110 470 A 690 350 0 0 0 1490 470" />
        </defs>
        <g fill="none" stroke="#ffd56b" strokeOpacity="0.4">
          <ellipse cx="800" cy="470" rx="740" ry="390" strokeWidth="3" />
          <ellipse
            cx="800"
            cy="470"
            rx="705"
            ry="360"
            strokeWidth="1.5"
            strokeDasharray="10 10"
          />
          <circle cx="170" cy="190" r="62" strokeWidth="2.5" />
          <circle cx="170" cy="190" r="48" strokeWidth="1" strokeDasharray="4 6" />
          <circle cx="1430" cy="190" r="62" strokeWidth="2.5" />
          <circle cx="1430" cy="190" r="48" strokeWidth="1" strokeDasharray="4 6" />
        </g>
        <g fill="#ffd56b" fillOpacity="0.5" fontSize="34" textAnchor="middle">
          <text letterSpacing="26">
            <textPath href="#dpArcTop" startOffset="50%">
              ♠ ♥ ♦ ♣ ♠ ♥ ♦ ♣ ♠ ♥ ♦ ♣ ♠ ♥ ♦ ♣
            </textPath>
          </text>
          <text letterSpacing="26" dy="12">
            <textPath href="#dpArcBottom" startOffset="50%">
              ♣ ♦ ♥ ♠ ♣ ♦ ♥ ♠ ♣ ♦ ♥ ♠ ♣ ♦ ♥ ♠
            </textPath>
          </text>
          <text x="170" y="206" fontSize="44" fillOpacity="0.55">♠</text>
          <text x="1430" y="206" fontSize="44" fillOpacity="0.55">♥</text>
        </g>
      </svg>

      {/* ورق‌ها (راست پایین) */}
      <div className="absolute bottom-[9%] right-[5%] h-[134px] w-[96px]">
        <PlayCard rank="A" suit="♠" style={{ left: 0, top: 0, transform: "rotate(-28deg)" }} />
        <PlayCard rank="A" suit="♥" red style={{ left: 0, top: 0, transform: "rotate(-9deg)" }} />
        <PlayCard rank="A" suit="♦" red style={{ left: 0, top: 0, transform: "rotate(10deg)" }} />
        <PlayCard rank="A" suit="♣" style={{ left: 0, top: 0, transform: "rotate(29deg)" }} />
      </div>
      {/* ورق‌ها (چپ بالا) */}
      <div className="absolute left-[5%] top-[7%] h-[134px] w-[96px]">
        <PlayCard rank="K" suit="♥" red style={{ left: 0, top: 0, transform: "rotate(-12deg)" }} />
        <PlayCard rank="Q" suit="♠" style={{ left: 0, top: 0, transform: "rotate(12deg)" }} />
      </div>

      {/* پشته‌ی ژتون‌ها (چپ پایین) */}
      <ChipStack color="#e5303f" dark="#8f0f1d" count={6} size={92} label="500" style={{ left: "5%", bottom: "9%" }} />
      <ChipStack color="#2f6fe0" dark="#173f8f" count={5} size={84} label="100" style={{ left: "10.5%", bottom: "13%" }} />
      <ChipStack color="#17a85a" dark="#0b6a35" count={3} size={78} label="25" style={{ left: "8%", bottom: "2.5%" }} />

      {/* ژتون‌های پراکنده */}
      <FlatChip color="#18181d" size={64} label="1K" style={{ right: "7%", top: "10%", transform: "rotate(14deg)" }} />
      <FlatChip color="#e8a30c" size={56} label="50" style={{ right: "13%", top: "19%", transform: "rotate(-20deg)" }} />
      <FlatChip color="#e5303f" size={52} label="5" style={{ left: "17%", top: "22%", transform: "rotate(30deg)" }} />

      {/* تاس‌ها */}
      <Die n={5} size={58} style={{ left: "20%", bottom: "5%", transform: "rotate(-16deg)" }} />
      <Die n={2} size={52} style={{ left: "24%", bottom: "9%", transform: "rotate(22deg)" }} />
      <Die n={6} size={50} style={{ right: "22%", bottom: "4%", transform: "rotate(12deg)" }} />

      {/* تیرگی لبه‌ها */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 95% 85% at 50% 50%, transparent 55%, rgba(0,0,0,0.6) 100%)",
        }}
      />
    </div>
  );
}

export default function DiscountProducts() {
  const { products, loading } = useProducts();
  const { addItem } = useCart();

  const sectionRef = useRef<HTMLElement>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const autoPlayedRef = useRef(false);

  const [reels, setReels] = useState<ReelState[]>(
    Array.from({ length: REEL_COUNT }, () => ({
      pos: 0,
      animating: false,
      duration: 0,
    }))
  );
  const [spinning, setSpinning] = useState(false);
  const [added, setAdded] = useState(false);
  const [cardH, setCardH] = useState(118); // ارتفاع کارت وسط (پیکسل)

  useEffect(() => {
    const md = window.matchMedia("(min-width: 768px)");
    const lg = window.matchMedia("(min-width: 1024px)");
    const update = () => setCardH(lg.matches ? 185 : md.matches ? 170 : 118);
    update();
    md.addEventListener("change", update);
    lg.addEventListener("change", update);
    return () => {
      md.removeEventListener("change", update);
      lg.removeEventListener("change", update);
    };
  }, []);

  // محصولات تخفیف‌دار اول می‌آیند
  const items: Product[] = [
    ...products.filter((p) => p.oldPrice),
    ...products.filter((p) => !p.oldPrice),
  ].slice(0, 12);
  const len = items.length;

  // موقعیت اولیه‌ی ریل‌ها
  useEffect(() => {
    if (len === 0) return;
    setReels(
      Array.from({ length: REEL_COUNT }, (_, i) => ({
        pos: Math.floor((i * FACES) / REEL_COUNT) % FACES,
        animating: false,
        duration: 0,
      }))
    );
  }, [len]);

  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach(clearTimeout);
  }, []);

  const spin = useCallback(() => {
    if (spinning || len === 0) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    setSpinning(true);

    const durations = Array.from({ length: REEL_COUNT }, (_, i) =>
      reduce ? 0 : BASE_DURATION + i * REEL_DELAY
    );

    setReels((prev) =>
      prev.map((r, i) => ({
        pos: r.pos + FACES * (2 + i) + Math.floor(Math.random() * FACES),
        animating: true,
        duration: durations[i],
      }))
    );

    // پایان هر ریل: موقعیت را به محدوده‌ی اول برمی‌گردانیم (بدون پرش دیداری)
    durations.forEach((d, i) => {
      timersRef.current.push(
        setTimeout(() => {
          setReels((prev) =>
            prev.map((r, j) =>
              j === i ? { pos: r.pos % FACES, animating: false, duration: 0 } : r
            )
          );
          if (i === REEL_COUNT - 1) setSpinning(false);
        }, d + 80)
      );
    });
  }, [spinning, len]);

  // یک بار هنگام دیده‌شدن بخش، خودکار بچرخد
  const spinRef = useRef(spin);
  spinRef.current = spin;

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || len === 0 || autoPlayedRef.current) return;
    if (typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !autoPlayedRef.current) {
          autoPlayedRef.current = true;
          timersRef.current.push(setTimeout(() => spinRef.current(), 500));
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [len]);

  function handleAddToCart(e: React.MouseEvent, product: Product) {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;
    addItem(product, 1);
  }

  if (loading || len === 0) return null;

  const productFor = (reelIdx: number, face: number) =>
    items[(face + reelIdx * FACES) % len];
  const shown = reels.map((r, i) => productFor(i, r.pos % FACES));
  const best = Math.max(...shown.map(getDiscount));
  const savings = shown.reduce(
    (sum, p) => sum + (p.oldPrice ? p.oldPrice - p.price : 0),
    0
  );

  function handleAddAll() {
    if (spinning) return;
    shown.forEach((p) => {
      if (p.inStock) addItem(p, 1);
    });
    setAdded(true);
    timersRef.current.push(setTimeout(() => setAdded(false), 1600));
  }

  const H = cardH;
  const R = H * RADIUS_K;
  const faceH = H - 6;

  return (
    <section ref={sectionRef} className="relative py-12 md:py-24 lg:overflow-hidden lg:py-32">
      <CasinoBackdrop />
      <style>{`
        @keyframes dpTwinkle{0%,100%{opacity:.15;transform:scale(.6) rotate(0deg)}50%{opacity:1;transform:scale(1.2) rotate(20deg)}}
        @keyframes dpGlow{0%,100%{box-shadow:0 5px 0 #6b0a14,0 0 14px rgba(255,90,90,.45),0 0 0 2px #ffe58a}50%{box-shadow:0 5px 0 #6b0a14,0 0 30px rgba(255,90,90,.95),0 0 0 2px #ffe58a}}
        @keyframes dpPulse{0%,100%{opacity:.45}50%{opacity:1}}
        @keyframes dpAura{0%,100%{opacity:.7}50%{opacity:1}}
        @media (prefers-reduced-motion: reduce){.dp-anim{animation:none!important}}
      `}</style>

      <div className="relative mx-auto w-full max-w-[640px] px-4 md:px-6 lg:max-w-[780px]">
        {/* هاله‌ی جادویی پشت دستگاه */}
        <div
          className="dp-anim pointer-events-none absolute -inset-x-6 -inset-y-10 blur-2xl"
          style={{
            background:
              "radial-gradient(closest-side, rgba(168,85,247,0.38), rgba(232,76,76,0.2) 55%, transparent 78%)",
            animation: "dpAura 5s ease-in-out infinite",
          }}
        />

        {/* ستاره‌های سوسوزن */}
        {SPARKLES.map((sp, k) => (
          <span
            key={k}
            className="dp-anim pointer-events-none absolute z-30 select-none"
            style={{
              left: sp.l,
              top: sp.t,
              fontSize: sp.s,
              color: "#ffe58a",
              textShadow: "0 0 8px rgba(255,213,107,0.95)",
              animation: `dpTwinkle ${sp.du}s ease-in-out ${sp.d}s infinite`,
            }}
          >
            ✦
          </span>
        ))}

        {/* ستون‌های کناری (فقط دسکتاپ) */}
        {(["-left-14", "-right-14"] as const).map((pos) => (
          <div
            key={pos}
            className={`pointer-events-none absolute ${pos} bottom-8 top-28 hidden w-7 rounded-md lg:block`}
            style={{
              background: GOLD_V,
              boxShadow: "0 0 24px rgba(0,0,0,0.6)",
            }}
          >
            <span
              className="dp-anim absolute -top-7 left-1/2 h-9 w-9 -translate-x-1/2 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 35% 30%,#fff,#ffd56b 40%,#e8531f 100%)",
                boxShadow: "0 0 32px 10px rgba(255,170,60,0.55)",
                animation: "dpPulse 2s ease-in-out infinite",
              }}
            />
            <span className="absolute -bottom-2 left-1/2 h-4 w-11 -translate-x-1/2 rounded bg-[#b8860b]" />
          </div>
        ))}

        {/* قاب طلایی با سر طاق‌دار */}
        <div
          className="relative rounded-t-[44px] rounded-b-[26px] p-[6px] md:rounded-t-[72px] md:rounded-b-[34px] md:p-[9px] lg:rounded-t-[110px] lg:rounded-b-[44px] lg:p-[12px]"
          style={{
            background: GOLD,
            boxShadow:
              "0 25px 60px -20px rgba(0,0,0,0.85), 0 0 40px rgba(255,213,107,0.25)",
          }}
        >
          {/* جواهرها */}
          <Gem className="-top-3 left-1/2 h-6 w-6 -translate-x-1/2 md:-top-4 md:h-9 md:w-9 lg:-top-6 lg:h-12 lg:w-12" from="#ff5a6e" to="#7a0b1c" />
          <Gem className="left-[10px] top-[44%] h-3 w-3 md:left-[14px] md:h-4 md:w-4" from="#6ee7ff" to="#0b4f7a" />
          <Gem className="right-[10px] top-[44%] h-3 w-3 md:right-[14px] md:h-4 md:w-4" from="#7dffb0" to="#0b6a35" />
          <Gem className="-bottom-1.5 left-5 h-4 w-4 md:-bottom-2 md:left-8 md:h-5 md:w-5" from="#d9a6ff" to="#4a1380" />
          <Gem className="-bottom-1.5 right-5 h-4 w-4 md:-bottom-2 md:right-8 md:h-5 md:w-5" from="#d9a6ff" to="#4a1380" />

          <div
            className="relative rounded-t-[38px] rounded-b-[21px] p-2.5 pt-5 md:rounded-t-[64px] md:rounded-b-[26px] md:p-4 md:pt-8 lg:rounded-t-[98px] lg:rounded-b-[32px] lg:p-6 lg:pt-12"
            style={{
              background:
                "radial-gradient(120% 80% at 50% 0%, #3a1a5c 0%, #1c0d30 55%, #0f0719 100%)",
            }}
          >
            {/* خط ظریف داخلی */}
            <div className="pointer-events-none absolute inset-1.5 rounded-[inherit] border border-[#f7d56b]/25 md:inset-2" />

            {/* بنر روبانی */}
            <div className="relative mx-3 md:mx-6">
              <div
                className="absolute -left-5 top-2 h-full w-10 md:-left-8 md:w-16"
                style={{
                  background: "linear-gradient(180deg,#5c1030,#32081c)",
                  clipPath: "polygon(0 0,100% 0,100% 100%,0 100%,28% 50%)",
                }}
              />
              <div
                className="absolute -right-5 top-2 h-full w-10 md:-right-8 md:w-16"
                style={{
                  background: "linear-gradient(180deg,#5c1030,#32081c)",
                  clipPath: "polygon(0 0,100% 0,72% 50%,100% 100%,0 100%)",
                }}
              />
              <div
                className="relative z-10 rounded-md px-3 py-2 text-center md:py-3.5"
                style={{
                  background: "linear-gradient(180deg,#a3213f,#5c0f2a)",
                  boxShadow:
                    "inset 0 0 0 2px #e8b923, inset 0 0 0 4px #5c0f2a, inset 0 0 0 5px #ffe58a, 0 6px 14px rgba(0,0,0,0.5)",
                }}
              >
                <h2
                  className="text-2xl font-black leading-tight md:text-5xl lg:text-6xl"
                  style={{
                    backgroundImage:
                      "linear-gradient(180deg,#fff7c2 0%,#ffd56b 45%,#c98f10 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                    filter: "drop-shadow(0 2px 0 #4a2a00) drop-shadow(0 0 10px rgba(255,213,107,0.5))",
                  }}
                >
                  تخفیف‌های ویژه
                </h2>
                <span className="mt-1 block text-[9px] font-bold tracking-[0.25em] text-[#ffe58a]/90 md:text-xs lg:text-sm">
                  ✦ گنجینه‌ی پیشنهادهای شگفت‌انگیز ✦
                </span>
              </div>
            </div>

            {/* قاب حلقه‌ها */}
            <div
              className="relative mt-3.5 rounded-lg p-1.5 md:mt-6 md:rounded-xl md:p-2.5"
              style={{
                background: GOLD,
                boxShadow: "inset 0 0 6px rgba(0,0,0,0.6)",
              }}
            >
              <div dir="ltr" className="relative flex bg-black">
                {reels.map((reel, i) => {
                  const front = reel.pos % FACES;
                  const product = productFor(i, front);
                  const isBest =
                    !spinning && best > 0 && getDiscount(product) === best;

                  return (
                    <Fragment key={i}>
                      {i > 0 && (
                        <div
                          className="w-1.5 flex-shrink-0 md:w-3"
                          style={{
                            background: GOLD_V,
                            boxShadow:
                              "0 0 8px rgba(0,0,0,0.8), inset 0 0 2px rgba(0,0,0,0.5)",
                            zIndex: 5,
                          }}
                        />
                      )}

                      <div
                        className="relative flex-1 overflow-hidden bg-[#0b0614]"
                        style={{
                          height: H * (H > 170 ? 2.3 : 2.5),
                          perspective: H * 3.2,
                          touchAction: "pan-y",
                        }}
                      >
                        {/* استوانه‌ی سه‌بعدی */}
                        <div
                          dir="rtl"
                          className="absolute inset-0 will-change-transform"
                          style={{
                            transformStyle: "preserve-3d",
                            transform: `translateZ(${-R}px) rotateX(${
                              reel.pos * STEP
                            }deg)`,
                            transition: reel.animating
                              ? `transform ${reel.duration}ms cubic-bezier(0.15, 0.85, 0.25, 1.03)`
                              : "none",
                            pointerEvents: spinning ? "none" : "auto",
                          }}
                        >
                          {Array.from({ length: FACES }, (_, f) => (
                            <div
                              key={f}
                              className="absolute inset-x-0 overflow-hidden rounded-md"
                              style={{
                                top: "50%",
                                height: faceH,
                                marginTop: -faceH / 2,
                                transform: `rotateX(${-f * STEP}deg) translateZ(${R}px)`,
                                backfaceVisibility: "hidden",
                                WebkitBackfaceVisibility: "hidden",
                              }}
                            >
                              <ProductCell
                                product={productFor(i, f)}
                                highlight={isBest && f === front}
                                onAdd={handleAddToCart}
                              />
                            </div>
                          ))}
                        </div>

                        {/* نور استوانه: وسط روشن، دو سر تاریک (کمی بنفش) */}
                        <div
                          className="pointer-events-none absolute inset-0"
                          style={{
                            background:
                              "linear-gradient(to bottom, rgba(10,3,20,0.94) 0%, rgba(10,3,20,0.62) 16%, rgba(10,3,20,0.12) 32%, rgba(0,0,0,0) 40%, rgba(0,0,0,0) 60%, rgba(10,3,20,0.12) 68%, rgba(10,3,20,0.62) 84%, rgba(10,3,20,0.94) 100%)",
                          }}
                        />
                        {/* لبه‌ی طلایی بالا و پایین */}
                        <div
                          className="pointer-events-none absolute inset-x-0 top-0 h-1.5 md:h-2.5"
                          style={{
                            background: "linear-gradient(180deg,#ffe58a,#8a6209)",
                            boxShadow: "0 6px 10px rgba(0,0,0,0.7)",
                          }}
                        />
                        <div
                          className="pointer-events-none absolute inset-x-0 bottom-0 h-1.5 md:h-2.5"
                          style={{
                            background: "linear-gradient(0deg,#ffe58a,#8a6209)",
                            boxShadow: "0 -6px 10px rgba(0,0,0,0.7)",
                          }}
                        />
                        {/* سایه‌ی کناره‌ها */}
                        <div
                          className="pointer-events-none absolute inset-0"
                          style={{
                            boxShadow:
                              "inset 8px 0 12px -6px rgba(0,0,0,0.8), inset -8px 0 12px -6px rgba(0,0,0,0.8)",
                          }}
                        />
                        {/* درخشش بهترین تخفیف */}
                        {isBest && (
                          <div
                            className="dp-anim pointer-events-none absolute inset-0"
                            style={{
                              boxShadow:
                                "inset 0 0 26px rgba(255,213,107,0.75)",
                              animation: "dpPulse 1.6s ease-in-out infinite",
                            }}
                          />
                        )}
                        {/* حالت محو هنگام چرخش */}
                        <div
                          className={`pointer-events-none absolute inset-0 backdrop-blur-[1.5px] transition-opacity duration-300 ${
                            reel.animating ? "opacity-100" : "opacity-0"
                          }`}
                        />
                      </div>
                    </Fragment>
                  );
                })}

                {/* خط وسط */}
                <div className="pointer-events-none absolute inset-x-0 top-1/2 z-10 h-px bg-[#ffd56b]/40" />
                {/* نشانگرهای یاقوتی دو طرف */}
                <div
                  className="pointer-events-none absolute -left-2 top-1/2 z-20 h-4 w-3 -translate-y-1/2 md:-left-3 md:h-6 md:w-4"
                  style={{
                    clipPath: "polygon(0 0, 100% 50%, 0 100%)",
                    background: "linear-gradient(180deg,#ff7b8a,#b3122e)",
                    filter: "drop-shadow(0 0 5px rgba(255,90,110,0.9))",
                  }}
                />
                <div
                  className="pointer-events-none absolute -right-2 top-1/2 z-20 h-4 w-3 -translate-y-1/2 md:-right-3 md:h-6 md:w-4"
                  style={{
                    clipPath: "polygon(100% 0, 0 50%, 100% 100%)",
                    background: "linear-gradient(180deg,#ff7b8a,#b3122e)",
                    filter: "drop-shadow(0 0 5px rgba(255,90,110,0.9))",
                  }}
                />
              </div>
            </div>

            {/* پنل پایین */}
            <div
              className="mt-3 rounded-lg border border-[#f7d56b]/25 p-2 md:mt-5 md:rounded-xl md:p-3.5 lg:mt-7 lg:grid lg:grid-cols-3 lg:gap-4 lg:p-5"
              style={{
                background: "linear-gradient(180deg,#1b0d2e,#12081f)",
                boxShadow: "inset 0 2px 10px rgba(0,0,0,0.7)",
              }}
            >
              <div className="grid grid-cols-3 gap-2 md:gap-3 lg:col-span-3">
                <Led
                  label="بیشترین تخفیف"
                  value={spinning || best === 0 ? "--" : `${best}%`}
                />
                <Led label="تعداد" value={String(REEL_COUNT)} />
                <Led
                  label="صرفه‌جویی (تومان)"
                  value={
                    spinning || savings === 0
                      ? "--"
                      : Math.round(savings).toLocaleString("en-US")
                  }
                />
              </div>

              <div className="mt-2.5 grid grid-cols-3 gap-2 md:mt-4 md:gap-3 lg:col-span-2 lg:mt-0">
                <a
                  href="/products"
                  className={GEM_BTN}
                  style={{
                    background:
                      "radial-gradient(circle at 30% 20%,#9be7ff,#1f8fe0 55%,#0b3f78)",
                    boxShadow: "0 0 0 2px #e8b923, 0 3px 0 #6b4a05, 0 0 12px rgba(80,180,255,0.5)",
                  }}
                >
                  دسته‌بندی‌ها
                </a>
                <button
                  type="button"
                  onClick={handleAddAll}
                  disabled={spinning}
                  className={GEM_BTN}
                  style={{
                    background:
                      "radial-gradient(circle at 30% 20%,#ffe7a0,#f0a000 55%,#8a4f00)",
                    boxShadow: "0 0 0 2px #e8b923, 0 3px 0 #6b4a05, 0 0 12px rgba(255,180,40,0.5)",
                  }}
                >
                  {added ? "اضافه شد" : "افزودن هر سه"}
                </button>
                <a
                  href="/products?sort=discount"
                  className={GEM_BTN}
                  style={{
                    background:
                      "radial-gradient(circle at 30% 20%,#a8ffc4,#17a540 55%,#08512a)",
                    boxShadow: "0 0 0 2px #e8b923, 0 3px 0 #6b4a05, 0 0 12px rgba(60,230,120,0.5)",
                  }}
                >
                  همه تخفیف‌ها
                </a>
              </div>

              <button
                type="button"
                onClick={spin}
                disabled={spinning}
                className="dp-anim relative mt-3.5 flex w-full items-center justify-center gap-2 overflow-hidden rounded-full py-2.5 text-sm font-black tracking-wider text-white transition active:translate-y-[3px] disabled:cursor-not-allowed disabled:opacity-70 md:mt-5 md:py-4 md:text-xl lg:col-span-1 lg:mt-0 lg:py-4 lg:text-xl"
                style={{
                  background:
                    "radial-gradient(120% 140% at 50% 0%,#ff7a7a 0%,#e02828 45%,#8f0f1a 100%)",
                  animation: spinning ? "none" : "dpGlow 2.4s ease-in-out infinite",
                  boxShadow: "0 5px 0 #6b0a14, 0 0 0 2px #ffe58a",
                }}
              >
                <span
                  className="pointer-events-none absolute inset-x-6 top-0 h-1/2 rounded-b-full"
                  style={{
                    background:
                      "linear-gradient(180deg,rgba(255,255,255,0.4),rgba(255,255,255,0))",
                  }}
                />
                <span
                  className={`relative text-[#ffe58a] ${
                    spinning ? "animate-spin" : ""
                  }`}
                >
                  ✦
                </span>
                <span
                  className="relative"
                  style={{ textShadow: "0 2px 0 rgba(90,0,10,0.7)" }}
                >
                  {spinning ? "در حال چرخش..." : "بچرخان"}
                </span>
                <span
                  className={`relative text-[#ffe58a] ${
                    spinning ? "animate-spin" : ""
                  }`}
                >
                  ✦
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}