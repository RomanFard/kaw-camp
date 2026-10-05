"use client";

import { useEffect, useMemo, useRef } from "react";
import { formatPrice } from "@/lib/utils";
import { getProductImage } from "@/lib/productImages";
import { useProducts } from "@/components/context/ProductsContext";
import { useCart } from "@/components/context/CartContext";

const EDGE_MASK =
  "linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%)";

// تنظیمات حالت سه‌بعدی
const MAX_ANGLE = 55; // بیشترین زاویه چرخش (درجه)
const MAX_DEPTH = 80; // میزان رفتن به عقب (پیکسل)
const MIN_SCALE = 0.82; // کوچک‌ترین اندازه در لبه
const FLAT_ZONE = 0.5; // بخش میانی که کارت‌ها صاف می‌مانند (۰ تا ۱)

export default function DiscountProducts() {
  const { products, loading } = useProducts();
  const { addItem } = useCart();
  const scrollRef = useRef<HTMLDivElement>(null);

  const hoverRef = useRef(false);
  const busyRef = useRef(false);
  const posRef = useRef(0);
  const busyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // وضعیت کشیدن با موس
  const dragRef = useRef({
    active: false,
    moved: false,
    startX: 0,
    startScroll: 0,
    pointerId: -1,
  });

  const items = useMemo(() => {
    const withDiscount = products.filter((p) => p.oldPrice);
    const withoutDiscount = products.filter((p) => !p.oldPrice);
    return [...withDiscount, ...withoutDiscount].slice(0, 12);
  }, [products]);

  const loopItems = useMemo(() => [...items, ...items], [items]);

  // ─── حرکت خودکار + افکت سه‌بعدی ───
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-card]"));
    posRef.current = el.scrollLeft;

    let frameId: number;
    let lastTime = performance.now();
    const pixelsPerSecond = 40;

    function step(time: number) {
      const delta = time - lastTime;
      lastTime = time;

      // حرکت خودکار
      if (
        el &&
        !hoverRef.current &&
        !busyRef.current &&
        !dragRef.current.active
      ) {
        const half = el.scrollWidth / 2;
        posRef.current += (pixelsPerSecond * delta) / 1000;
        if (posRef.current >= half) posRef.current -= half;
        el.scrollLeft = posRef.current;
      }

      // افکت سه‌بعدی بر اساس فاصله از مرکز
      if (el) {
        const box = el.getBoundingClientRect();
        const centerX = box.left + box.width / 2;
        const halfWidth = box.width / 2;

        for (const card of cards) {
          const r = card.getBoundingClientRect();
          const t = Math.max(
            -1,
            Math.min(1, (r.left + r.width / 2 - centerX) / halfWidth)
          );
          const e = Math.max(0, (Math.abs(t) - FLAT_ZONE) / (1 - FLAT_ZONE));

          const angle = Math.sign(t) * MAX_ANGLE * e;
          const depth = -MAX_DEPTH * e;
          const scale = 1 - (1 - MIN_SCALE) * e;

          card.style.transform = `perspective(900px) translateZ(${depth}px) rotateY(${angle}deg) scale(${scale})`;
        }
      }

      frameId = requestAnimationFrame(step);
    }

    frameId = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(frameId);
      if (busyTimerRef.current) clearTimeout(busyTimerRef.current);
    };
  }, [items.length]);

  // ─── دکمه‌های فلش ───
  function scrollBy(dir: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;

    const amount = 300;
    const half = el.scrollWidth / 2;

    busyRef.current = true;
    if (busyTimerRef.current) clearTimeout(busyTimerRef.current);

    if (el.scrollLeft >= half) el.scrollLeft -= half;
    if (dir === "left" && el.scrollLeft < amount) el.scrollLeft += half;

    el.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });

    busyTimerRef.current = setTimeout(() => {
      posRef.current = el.scrollLeft;
      busyRef.current = false;
    }, 700);
  }

  // ─── کشیدن با موس ───
  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const el = scrollRef.current;
    if (!el) return;

    const d = dragRef.current;
    d.active = true;
    d.moved = false;
    d.startX = e.clientX;
    d.startScroll = el.scrollLeft;
    d.pointerId = e.pointerId;
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const d = dragRef.current;
    const el = scrollRef.current;
    if (!d.active || !el) return;

    const dx = e.clientX - d.startX;

    if (!d.moved) {
      if (Math.abs(dx) < 5) return;
      d.moved = true;
      el.setPointerCapture(d.pointerId);
      el.style.cursor = "grabbing";
    }

    // لیست دو بار تکرار شده، پس با باقی‌مانده نیمه‌ی عرض لوپ می‌شود
    const half = el.scrollWidth / 2;
    const raw = d.startScroll - dx;
    const next = ((raw % half) + half) % half;

    el.scrollLeft = next;
    posRef.current = next;
  }

  function endDrag() {
    const d = dragRef.current;
    const el = scrollRef.current;
    if (!d.active) return;

    d.active = false;
    if (el) {
      el.style.cursor = "";
      if (el.hasPointerCapture?.(d.pointerId)) {
        el.releasePointerCapture(d.pointerId);
      }
      posRef.current = el.scrollLeft;
    }
  }

  // اگر کاربر کشیده بود، کلیک روی لینک کارت نباید انجام شود
  function handleClickCapture(e: React.MouseEvent) {
    if (dragRef.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      dragRef.current.moved = false;
    }
  }

  function handleAddToCart(
    e: React.MouseEvent,
    product: (typeof products)[0]
  ) {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;
    addItem(product, 1);
  }

  if (loading || items.length === 0) return null;

  return (
    <section className="relative py-16 md:py-20">
      {/* Header */}
      <div className="mx-auto max-w-[1600px] px-6 text-center md:px-12 lg:px-20">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#F59E0B]/30 bg-[#F59E0B]/5 px-4 py-1.5 backdrop-blur-sm">
          <span className="text-[11px] font-bold tracking-[0.15em] text-[#F59E0B] md:text-xs">
            SHOP
          </span>
        </div>

        <h2 className="text-2xl font-black tracking-tight text-white md:text-4xl lg:text-5xl">
          تخفیف‌های <span className="text-[#F59E0B]">ویژه</span>
        </h2>

        <div className="mx-auto mt-4 h-[2px] w-16 bg-[#F59E0B]" />
      </div>

      {/* Slider: داخل کادر ۱۶۰۰px */}
      <div className="relative mx-auto mt-10 w-full max-w-[1600px] px-6 md:px-12 lg:px-20">
        <button
          type="button"
          onClick={() => scrollBy("left")}
          aria-label="قبلی"
          className="absolute left-3 top-1/2 z-30 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-700 bg-[#0A0A0A]/95 text-white backdrop-blur-sm transition hover:border-[#F59E0B] hover:bg-[#F59E0B] lg:flex xl:left-5"
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

        <button
          type="button"
          onClick={() => scrollBy("right")}
          aria-label="بعدی"
          className="absolute right-3 top-1/2 z-30 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-700 bg-[#0A0A0A]/95 text-white backdrop-blur-sm transition hover:border-[#F59E0B] hover:bg-[#F59E0B] lg:flex xl:right-5"
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

        {/* ناحیه اسکرول */}
        <div
          ref={scrollRef}
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
          className="scrollbar-hide cursor-grab select-none overflow-x-auto overflow-y-hidden"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitMaskImage: EDGE_MASK,
            maskImage: EDGE_MASK,
          }}
        >
          <div dir="rtl" className="flex w-max gap-3 py-4">
            {loopItems.map((product, idx) => {
              const hasDiscount = !!product.oldPrice;
              const discount = product.oldPrice
                ? Math.round(
                    ((product.oldPrice - product.price) / product.oldPrice) *
                      100
                  )
                : 0;
              const image =
                product.image || getProductImage(product.category, product.id);

              return (
                <a
                  key={`${product.id}-${idx}`}
                  data-card
                  draggable={false}
                  href={`/product/${product.id}`}
                  className="group/card relative w-[160px] flex-shrink-0 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/50 transition-colors duration-300 hover:border-[#F59E0B]/50 sm:w-[180px] md:w-[200px] lg:w-[220px]"
                  style={{ willChange: "transform" }}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-zinc-950">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image}
                      alt={product.name}
                      loading="lazy"
                      draggable={false}
                      className="h-full w-full object-cover object-center transition duration-500 group-hover/card:scale-105"
                    />

                    {hasDiscount && discount > 0 && (
                      <span className="absolute right-1.5 top-1.5 rounded bg-[#F59E0B] px-1.5 py-0.5 text-[9px] font-black text-white shadow-lg">
                        {discount}٪
                      </span>
                    )}

                    {!hasDiscount && (
                      <span className="absolute right-1.5 top-1.5 rounded bg-zinc-700/90 px-1.5 py-0.5 text-[9px] font-black text-white backdrop-blur-sm">
                        جدید
                      </span>
                    )}

                    {!product.inStock && (
                      <span className="absolute inset-0 flex items-center justify-center bg-black/70 text-xs font-bold text-white">
                        ناموجود
                      </span>
                    )}
                  </div>

                  <div className="p-2.5">
                    <h3 className="line-clamp-1 text-[11px] font-bold text-white transition group-hover/card:text-[#F59E0B] md:text-xs">
                      {product.name}
                    </h3>

                    <div className="mt-2 flex items-center justify-between gap-1.5">
                      <div className="flex flex-col">
                        {product.oldPrice && (
                          <span className="text-[9px] text-zinc-500 line-through">
                            {formatPrice(product.oldPrice)}
                          </span>
                        )}
                        <span className="text-xs font-black text-[#F59E0B] md:text-sm">
                          {formatPrice(product.price)}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleAddToCart(e, product)}
                        disabled={!product.inStock}
                        aria-label="افزودن به سبد"
                        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded border border-[#F59E0B] bg-transparent text-[#F59E0B] transition hover:bg-[#F59E0B] hover:text-white disabled:cursor-not-allowed disabled:border-zinc-700 disabled:text-zinc-600"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="h-3 w-3"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
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

      {/* CTA */}
      <div className="mt-10 text-center">
        <a
          href="/products?sort=discount"
          className="group inline-flex items-center gap-2 border border-[#F59E0B] bg-transparent px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#F59E0B] transition hover:bg-[#F59E0B] hover:text-white md:text-sm"
        >
          <span>مشاهده همه تخفیف‌ها</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="h-3.5 w-3.5 transition group-hover:-translate-x-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
        </a>
      </div>
    </section>
  );
}