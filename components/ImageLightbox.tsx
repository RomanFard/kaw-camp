"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  images: string[];
  index: number;
  onClose: () => void;
  onIndexChange?: (i: number) => void;
  alt?: string;
};

export default function ImageLightbox({
  images,
  index,
  onClose,
  onIndexChange,
  alt = "",
}: Props) {
  const [current, setCurrent] = useState(index);
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);

  // pinch/pan refs
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);
  const startTx = useRef(0);
  const startTy = useRef(0);
  const startDist = useRef<number | null>(null);
  const startScale = useRef(1);

  // swipe
  const swipeX = useRef<number | null>(null);

  // هماهنگی با والد
  useEffect(() => {
    onIndexChange?.(current);
  }, [current, onIndexChange]);

  // قفل اسکرول
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Escape بستن + فلش‌ها
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft")
        setCurrent((c) => (c + 1) % images.length);
      if (e.key === "ArrowRight")
        setCurrent((c) => (c - 1 + images.length) % images.length);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [images.length, onClose]);

  function reset() {
    setScale(1);
    setTx(0);
    setTy(0);
  }

  function toggleZoom() {
    if (scale > 1) reset();
    else setScale(2);
  }

  function onPointerDown(e: React.PointerEvent) {
    if (e.pointerType === "touch" && scale === 1) {
      // swipe mode
      swipeX.current = e.clientX;
      return;
    }
    // pan mode
    startX.current = e.clientX;
    startY.current = e.clientY;
    startTx.current = tx;
    startTy.current = ty;
    (e.target as Element).setPointerCapture?.(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (swipeX.current !== null) return; // swipe handled on up
    if (startX.current === null || startY.current === null) return;
    if (scale <= 1) return;
    const dx = e.clientX - startX.current;
    const dy = e.clientY - startY.current;
    setTx(startTx.current + dx);
    setTy(startTy.current + dy);
  }

  function onPointerUp(e: React.PointerEvent) {
    // swipe
    if (swipeX.current !== null) {
      const dx = e.clientX - swipeX.current;
      swipeX.current = null;
      if (Math.abs(dx) > 60 && images.length > 1) {
        if (dx < 0) {
          setCurrent((c) => (c + 1) % images.length);
        } else {
          setCurrent((c) => (c - 1 + images.length) % images.length);
        }
      }
      return;
    }
    startX.current = null;
    startY.current = null;
  }

  // pinch (فقط لمس)
  function onTouchStart(e: React.TouchEvent) {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      startDist.current = Math.hypot(dx, dy);
      startScale.current = scale;
    }
  }

  function onTouchMove(e: React.TouchEvent) {
    if (e.touches.length === 2 && startDist.current) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const d = Math.hypot(dx, dy);
      const next = Math.min(
        4,
        Math.max(1, startScale.current * (d / startDist.current))
      );
      setScale(next);
    }
  }

  function onTouchEnd() {
    startDist.current = null;
    if (scale < 1.05) {
      reset();
    }
  }

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-[1000] bg-black/95"
      role="dialog"
      aria-modal="true"
    >
      {/* Close — گوشه بالا چپ */}
      <button
        type="button"
        onClick={onClose}
        aria-label="بستن"
        className="absolute left-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
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
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* شمارنده */}
      {images.length > 1 && (
        <div className="absolute right-4 top-4 z-20 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
          {(current + 1).toLocaleString("fa-IR")} /{" "}
          {images.length.toLocaleString("fa-IR")}
        </div>
      )}

      {/* Zoom toggle */}
      <button
        type="button"
        onClick={toggleZoom}
        aria-label="زوم"
        className="absolute right-4 bottom-24 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 md:bottom-8"
      >
        {scale > 1 ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
            />
          </svg>
        )}
      </button>

      {/* Image area */}
      <div
        className="absolute inset-0 flex select-none items-center justify-center overflow-hidden"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onDoubleClick={toggleZoom}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[current]}
          alt={alt}
          draggable={false}
          className="max-h-[85vh] max-w-[95vw] object-contain transition-transform duration-100"
          style={{
            transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
            cursor: scale > 1 ? "grab" : "zoom-in",
            touchAction: scale > 1 ? "none" : "pan-y",
          }}
        />
      </div>

      {/* Navigation arrows — فقط اگه بیش از یک عکس */}
      {images.length > 1 && scale === 1 && (
        <>
          <button
            type="button"
            aria-label="قبلی"
            onClick={() =>
              setCurrent((c) => (c - 1 + images.length) % images.length)
            }
            className="absolute right-4 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 md:flex"
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
          <button
            type="button"
            aria-label="بعدی"
            onClick={() => setCurrent((c) => (c + 1) % images.length)}
            className="absolute left-4 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 md:flex"
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
        </>
      )}

      {/* Thumbnails پایین */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 z-20 flex max-w-[90vw] -translate-x-1/2 gap-2 overflow-x-auto rounded-full bg-white/10 p-2 backdrop-blur [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setCurrent(i);
                reset();
              }}
              className={
                "relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border-2 transition " +
                (i === current
                  ? "border-accent"
                  : "border-transparent opacity-60 hover:opacity-100")
              }
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt=""
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}