"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { searchProducts, popularSearches } from "@/lib/search";

function getCategoryEmoji(cat: string) {
  const map: Record<string, string> = {
    tent: "⛺",
    sleep: "🛏️",
    mattress: "🟦",
    backpack: "🎒",
    clothing: "🧥",
    shoes: "🥾",
    socks: "🧦",
    gaiters: "🦵",
    tools: "🧰",
    lighting: "🔦",
    bottle: "🥤",
    cooking: "🍳",
    sunglasses: "🕶️",
    watch: "⌚",
    bicycle: "🚲",
    accessories: "🎁",
  };
  return map[cat] || "📦";
}

export default function SearchPanel({
  onClose,
  forceOpen = false,
}: {
  onClose?: () => void;
  forceOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(forceOpen);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if ((isOpen || forceOpen) && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, forceOpen]);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        closePanel();
      }
    }
    if (isOpen || forceOpen) {
      document.addEventListener("keydown", handleEsc);
    }
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, forceOpen]);

  useEffect(() => {
    if (isOpen || forceOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, forceOpen]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return searchProducts(query, products);
  }, [query]);

  const topResults = results.slice(0, 6);
  const totalResults = results.length;

  const showPanel = isOpen || forceOpen;

  function closePanel() {
    setIsOpen(false);
    setQuery("");
    if (onClose) onClose();
  }

  function handleSubmit(e?: FormEvent) {
    e?.preventDefault();
    if (query.trim()) {
      router.push("/search?q=" + encodeURIComponent(query.trim()));
      closePanel();
    }
  }

  function goToProduct(id: string) {
    closePanel();
    router.push("/product/" + id);
  }

  function searchFor(term: string) {
    setQuery(term);
    if (inputRef.current) inputRef.current.focus();
  }

  return (
    <>
      {/* دکمه جستجو (فقط اگه forceOpen نباشه) */}
      {!forceOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="جستجو"
          className="text-theme transition hover:text-accent"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-6 w-6 md:h-7 md:w-7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
            />
          </svg>
        </button>
      )}

      {/* Backdrop (فقط اگه forceOpen نباشه) */}
      {!forceOpen && (
        <div
          onClick={closePanel}
          className={
            "fixed inset-0 z-[200] bg-black/50 transition-opacity duration-300 " +
            (showPanel ? "visible opacity-100" : "invisible opacity-0")
          }
        />
      )}

      {/* پنل جستجو */}
      <div
        className={
          "bg-theme-card shadow-2xl transition-transform duration-300 " +
          (forceOpen
            ? "fixed inset-0 z-[300] h-screen w-screen"
            : "fixed left-0 right-0 top-0 z-[210] " +
              (showPanel ? "translate-y-0" : "-translate-y-full"))
        }
        dir="rtl"
      >
        <div className="mx-auto flex h-full max-h-screen max-w-[1600px] flex-col p-3 md:p-6">
          {/* فرم جستجو */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-shrink-0 items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="جستجوی محصول، برند، کد یا مدل..."
                className="w-full rounded-lg border border-theme bg-theme-surface px-4 py-3 text-sm text-theme outline-none transition focus:border-accent md:text-base"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="پاک کردن"
                  className="absolute left-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-theme-surface text-xs text-theme-muted transition hover:bg-theme"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              type="submit"
              className="hidden rounded-lg bg-accent px-6 py-3 text-sm font-bold text-white transition hover:bg-accent-hover md:block md:text-base"
            >
              جستجو
            </button>

            <button
              type="button"
              onClick={closePanel}
              aria-label="بستن"
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border border-theme text-xl text-theme-muted transition hover:bg-theme-surface"
            >
              ✕
            </button>
          </form>

          {/* محتوای پنل */}
          <div className="mt-3 flex-1 overflow-y-auto md:mt-4">
            {/* حالت ۱: query خالیه */}
            {!query.trim() && (
              <div>
                <div className="mb-2 flex items-center gap-2 text-xs font-bold text-theme-muted md:text-sm">
                  <span>🔥</span>
                  <span>جستجوهای محبوب</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => searchFor(term)}
                      className="rounded-full border border-theme bg-theme-card px-4 py-2 text-xs font-semibold text-theme transition hover:border-accent hover:bg-accent/10 hover:text-accent md:text-sm"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* حالت ۲: نتیجه‌ای نیست */}
            {query.trim() && totalResults === 0 && (
              <div className="space-y-4">
                <div className="rounded-xl border-2 border-dashed border-theme bg-theme-surface p-6 text-center md:p-8">
                  <p className="text-5xl">🔍</p>
                  <p className="mt-4 text-base font-bold text-theme">
                    نتیجه‌ای برای «{query}» پیدا نشد
                  </p>
                  <p className="mt-2 text-sm text-theme-muted">
                    املای کلمه رو چک کن یا از پیشنهادات زیر استفاده کن
                  </p>
                </div>

                <div className="rounded-lg border border-accent/30 bg-accent/10 p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">💡</span>
                    <div className="text-sm text-accent md:text-base">
                      <p className="font-bold">راهنمای جستجو:</p>
                      <ul className="mt-2 space-y-1 leading-7">
                        <li>• با <b>کد محصول</b> (مثل <b>19</b>) جستجو کن</li>
                        <li>• با <b>مدل</b> (مثل <b>CNK2550</b>) جستجو کن</li>
                        <li>• با <b>برند</b> (مثل <b>naturehike</b>) جستجو کن</li>
                        <li>• با <b>نام فارسی</b> (مثل <b>چادر بادی</b>) جستجو کن</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center gap-2 text-xs font-bold text-theme-muted md:text-sm">
                    <span>🔥</span>
                    <span>اینا رو امتحان کن</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => searchFor(term)}
                        className="rounded-full border border-theme bg-theme-card px-4 py-2 text-xs font-semibold text-theme transition hover:border-accent hover:bg-accent/10 hover:text-accent md:text-sm"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* حالت ۳: نتیجه داریم */}
            {query.trim() && totalResults > 0 && (
              <div>
                <div className="mb-3 flex items-center justify-between text-xs text-theme-muted md:text-sm">
                  <span>
                    <span className="font-bold text-theme">
                      {totalResults}
                    </span>{" "}
                    نتیجه برای «
                    <span className="font-bold text-accent">{query}</span>»
                  </span>
                </div>

                <div className="overflow-hidden rounded-xl border border-theme bg-theme-card">
                  {topResults.map(({ product, matchReason }) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => goToProduct(product.id)}
                      className="flex w-full items-center gap-3 border-b border-theme p-3 text-right transition last:border-0 hover:bg-theme-surface"
                    >
                      <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-theme-surface text-2xl md:h-16 md:w-16">
                        {getCategoryEmoji(product.category)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="line-clamp-1 text-sm font-bold text-theme md:text-base">
                          {product.name}
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-theme-muted">
                          <span>{product.brand || "کاو کمپ"}</span>
                          <span className="text-accent">•</span>
                          <span className="rounded bg-accent/10 px-1.5 py-0.5 text-[10px] font-semibold text-accent">
                            {matchReason}
                          </span>
                        </div>
                      </div>

                      <div className="flex-shrink-0 text-left">
                        <div className="text-xs font-bold text-theme md:text-sm">
                          {formatPrice(product.price)}
                        </div>
                      </div>
                    </button>
                  ))}

                  {totalResults > 6 && (
                    <button
                      type="button"
                      onClick={() => handleSubmit()}
                      className="w-full border-t border-theme bg-theme-surface p-3 text-center text-xs font-bold text-accent transition hover:bg-theme md:text-sm"
                    >
                      مشاهده همه {totalResults} نتیجه ←
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* دکمه موبایل */}
          {query.trim() && (
            <button
              type="button"
              onClick={() => handleSubmit()}
              className="mt-3 w-full flex-shrink-0 rounded-lg bg-accent py-3 text-sm font-bold text-white transition hover:bg-accent-hover md:hidden"
            >
              جستجوی کامل برای «{query}»
            </button>
          )}
        </div>
      </div>
    </>
  );
}