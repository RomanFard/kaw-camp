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
    <section className="relative py-10 md:py-20">
      {/* Header */}
      <div className="mx-auto max-w-[1400px] px-4 text-center md:px-12 lg:px-16">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-3 py-1 backdrop-blur-sm md:mb-4 md:px-4 md:py-1.5">
          <span className="text-[10px] font-bold tracking-[0.15em] text-accent md:text-xs">
            SHOP
          </span>
        </div>

        <h2 className="text-xl font-black tracking-tight text-theme md:text-4xl lg:text-5xl">
          تخفیف‌های <span className="text-accent">ویژه</span>
        </h2>

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
                  className="group/card relative ml-2.5 w-[130px] flex-shrink-0 overflow-hidden rounded-lg border border-theme bg-theme-card transition-colors duration-300 hover:border-accent/50 sm:ml-3 sm:w-[150px] md:ml-5 md:w-[200px] md:rounded-xl lg:w-[228px]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-theme-surface">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image}
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

                    {!hasDiscount && (
                      <span className="absolute right-1 top-1 rounded bg-theme-surface/90 px-1 py-0.5 text-[8px] font-black text-theme backdrop-blur-sm md:right-1.5 md:top-1.5 md:px-1.5 md:text-[9px]">
                        جدید
                      </span>
                    )}

                    {!product.inStock && (
                      <span className="absolute inset-0 flex items-center justify-center bg-black/70 text-[10px] font-bold text-white md:text-xs">
                        ناموجود
                      </span>
                    )}
                  </div>

                  <div className="p-1.5 md:p-2.5">
                    <h3 className="line-clamp-1 text-[10px] font-bold text-theme transition group-hover/card:text-accent md:text-xs">
                      {product.name}
                    </h3>

                    <div className="mt-1.5 flex items-center justify-between gap-1 md:mt-2 md:gap-1.5">
                      <div className="flex min-w-0 flex-col">
                        {product.oldPrice && (
                          <span className="text-[8px] text-theme-muted line-through md:text-[9px]">
                            {formatPrice(product.oldPrice)}
                          </span>
                        )}
                        <span className="text-[10px] font-black text-accent md:text-sm">
                          {formatPrice(product.price)}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleAddToCart(e, product)}
                        disabled={!product.inStock}
                        aria-label="افزودن به کوله"
                        className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded border border-accent bg-transparent text-accent transition hover:bg-accent hover:text-white disabled:cursor-not-allowed disabled:border-theme disabled:text-theme-muted md:h-7 md:w-7"
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

      {/* CTA */}
      <div className="mt-6 text-center md:mt-10">
        <a
          href="/products?sort=discount"
          className="group inline-flex items-center gap-2 border border-accent bg-transparent px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-accent transition hover:bg-accent hover:text-white md:px-6 md:py-2.5 md:text-sm"
        >
          <span>مشاهده همه تخفیف‌ها</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="h-3 w-3 transition group-hover:-translate-x-1 md:h-3.5 md:w-3.5"
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