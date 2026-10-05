"use client";

import { useEffect, useMemo, useRef } from "react";
import { formatPrice } from "@/lib/utils";
import { getProductImage } from "@/lib/productImages";
import { useProducts } from "@/components/context/ProductsContext";
import { useCart } from "@/components/context/CartContext";

const PIXELS_PER_SECOND = 40;
const BUTTON_STEP = 300;
const BUTTON_DURATION = 600;

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export default function DiscountProducts() {
  const { products, loading } = useProducts();
  const { addItem } = useCart();

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

  const items = useMemo(() => {
    const withDiscount = products.filter((p) => p.oldPrice);
    const withoutDiscount = products.filter((p) => !p.oldPrice);
    return [...withDiscount, ...withoutDiscount].slice(0, 12);
  }, [products]);

  const loopItems = useMemo(() => [...items, ...items], [items]);

  // ─── حلقه‌ی انیمیشن: حرکت خودکار + دکمه‌ها با transform ───
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frameId: number;
    let lastTime = performance.now();

    function apply() {
      if (!track) return;
      const half = track.offsetWidth / 2;
      if (half > 0) {
        offsetRef.current = ((offsetRef.current % half) + half) % half;
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

  // ─── دکمه‌های فلش ───
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

  // ─── کشیدن با موس و لمس ───
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
            <div className="mx-auto max-w-[1400px] px-6 text-center md:px-12 lg:px-16">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#6ECB9E]/30 bg-[#6ECB9E]/5 px-4 py-1.5 backdrop-blur-sm">
          <span className="text-[11px] font-bold tracking-[0.15em] text-[#6ECB9E] md:text-xs">
            SHOP
          </span>
        </div>

        <h2 className="text-2xl font-black tracking-tight text-white md:text-4xl lg:text-5xl">
          تخفیف‌های <span className="text-[#6ECB9E]">ویژه</span>
        </h2>

        <div className="mx-auto mt-4 h-[2px] w-16 bg-[#6ECB9E]" />
      </div>

      {/* Slider: باریک و وسط‌چین */}
           <div className="relative mx-auto mt-10 w-full max-w-[1400px] px-6 md:px-12 lg:px-16">
        {/* فلش چپ */}
        <button
          type="button"
          onClick={() => scrollBy("left")}
          aria-label="قبلی"
          className="absolute -left-14 top-1/2 z-30 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-700 bg-[#0A0A0A]/95 text-white backdrop-blur-sm transition hover:border-[#6ECB9E] hover:bg-[#6ECB9E] xl:flex"
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
          className="absolute -right-14 top-1/2 z-30 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-700 bg-[#0A0A0A]/95 text-white backdrop-blur-sm transition hover:border-[#6ECB9E] hover:bg-[#6ECB9E] xl:flex"
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

        {/* قاب نمایش: لبه‌ها تیز بریده می‌شوند */}
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
                  draggable={false}
                  href={`/product/${product.id}`}
                  className="group/card relative ml-5 w-[180px] flex-shrink-0 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 transition-colors duration-300 hover:border-[#6ECB9E]/50 md:w-[200px] lg:w-[228px]"
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
                      <span className="absolute right-1.5 top-1.5 rounded bg-[#6ECB9E] px-1.5 py-0.5 text-[9px] font-black text-white shadow-lg">
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
                    <h3 className="line-clamp-1 text-[11px] font-bold text-white transition group-hover/card:text-[#6ECB9E] md:text-xs">
                      {product.name}
                    </h3>

                    <div className="mt-2 flex items-center justify-between gap-1.5">
                      <div className="flex flex-col">
                        {product.oldPrice && (
                          <span className="text-[9px] text-zinc-500 line-through">
                            {formatPrice(product.oldPrice)}
                          </span>
                        )}
                        <span className="text-xs font-black text-[#6ECB9E] md:text-sm">
                          {formatPrice(product.price)}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleAddToCart(e, product)}
                        disabled={!product.inStock}
                        aria-label="افزودن به سبد"
                        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded border border-[#6ECB9E] bg-transparent text-[#6ECB9E] transition hover:bg-[#6ECB9E] hover:text-white disabled:cursor-not-allowed disabled:border-zinc-700 disabled:text-zinc-600"
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
          className="group inline-flex items-center gap-2 border border-[#6ECB9E] bg-transparent px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#6ECB9E] transition hover:bg-[#6ECB9E] hover:text-white md:text-sm"
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
