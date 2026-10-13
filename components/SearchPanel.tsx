"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { searchProducts, popularSearches } from "@/lib/search";
import { getProductPlaceholder } from "@/lib/placeholder";

const SEARCH_PATH = "M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z";
const CLOSE_PATH = "M6 18L18 6M6 6l12 12";
const BACK_PATH = "M8.25 4.5l7.5 7.5-7.5 7.5";

function Svg({
  d,
  className,
  strokeWidth = 2,
}: {
  d: string;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      stroke="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

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

  // بخش «پرفروش‌ترین‌ها» در حالت بدون جستجو
  const bestSellers = useMemo(() => products.slice(0, 4), []);

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

  const trendingList = (
    <ul className="mt-4 space-y-3">
      {popularSearches.map((term) => (
        <li key={term}>
          <button
            type="button"
            onClick={() => searchFor(term)}
            className="text-[14px] text-theme-muted transition hover:text-theme"
          >
            {term}
          </button>
        </li>
      ))}
    </ul>
  );

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
          <Svg d={SEARCH_PATH} className="h-6 w-6 md:h-7 md:w-7" />
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

      {/* لایه تیره پشت پنل در دسکتاپ (مثل Gymshark) */}
      {forceOpen && (
        <div
          aria-hidden="true"
          onClick={closePanel}
          className="fixed inset-0 z-[290] hidden bg-black/50 md:block"
        />
      )}

      {/* پنل جستجو */}
      <div
        className={
          "bg-theme-card " +
          (forceOpen
            ? "fixed inset-0 z-[300] h-screen w-screen overflow-y-auto md:bottom-auto md:h-auto md:max-h-[85vh]"
            : "fixed left-0 right-0 top-0 z-[210] shadow-2xl transition-transform duration-300 " +
              (showPanel ? "translate-y-0" : "-translate-y-full"))
        }
        dir="rtl"
      >
        {/* ═══ نوار بالا: بازگشت (موبایل) / جستجوی وسط‌چین + بستن (دسکتاپ) ═══ */}
        <form
          onSubmit={handleSubmit}
          className="relative flex h-16 items-center gap-2 border-b border-theme px-3 md:h-20 md:justify-center md:px-8"
        >
          <button
            type="button"
            onClick={closePanel}
            aria-label="بازگشت"
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center text-theme md:hidden"
          >
            <Svg d={BACK_PATH} strokeWidth={2.2} className="h-6 w-6" />
          </button>

          <div className="flex h-11 flex-1 items-center border border-neutral-900 bg-theme-surface dark:border-neutral-300 md:w-[350px] md:flex-none">
            <Svg
              d={SEARCH_PATH}
              className="mx-3 h-[18px] w-[18px] flex-shrink-0 text-theme"
            />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="دنبال چی می‌گردی؟"
              className="h-full min-w-0 flex-1 bg-transparent pe-3 text-[14px] text-theme outline-none placeholder:text-theme-muted"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="پاک کردن"
                className="me-2 flex h-6 w-6 flex-shrink-0 items-center justify-center text-xs text-theme-muted transition hover:text-theme"
              >
                ✕
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={closePanel}
            aria-label="بستن"
            className="absolute end-8 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center text-theme transition hover:opacity-60 md:flex"
          >
            <Svg d={CLOSE_PATH} className="h-6 w-6" />
          </button>
        </form>

        {/* ═══ محتوای پنل ═══ */}
        <div className="mx-auto max-w-[1100px] px-4 pb-8 pt-6 md:px-8 md:pb-10 md:pt-8">
          {/* حالت ۱: query خالیه → جستجوهای پرطرفدار + پرفروش‌ترین‌ها */}
          {!query.trim() && (
            <div className="grid gap-8 md:grid-cols-[220px_1fr] md:gap-12">
              <div>
                <h3 className="text-[15px] font-extrabold text-theme">
                  جستجوهای پرطرفدار
                </h3>
                {trendingList}
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-[15px] font-extrabold text-theme">
                    پرفروش‌ترین‌ها
                  </h3>
                  <a
                    href="/products"
                    onClick={closePanel}
                    className="text-[13px] font-semibold text-theme underline underline-offset-2"
                  >
                    مشاهده همه
                  </a>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
                  {bestSellers.map((product) => (
                    <a
                      key={product.id}
                      href={"/product/" + product.id}
                      onClick={closePanel}
                      className="block"
                    >
                      <div className="aspect-[4/5] w-full overflow-hidden bg-theme-surface">
                        <img
                          src={getProductPlaceholder(
                            product.name,
                            getCategoryEmoji(product.category)
                          )}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="mt-2 line-clamp-1 text-[13px] font-semibold text-theme md:text-[14px]">
                        {product.name}
                      </div>
                      <div className="mt-0.5 text-[12px] text-theme-muted">
                        {product.brand || "کاو کمپ"}
                      </div>
                      <div className="mt-2 text-[13px] font-bold text-theme">
                        {formatPrice(product.price)}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* حالت ۲: نتیجه‌ای نیست */}
          {query.trim() && totalResults === 0 && (
            <div className="space-y-6">
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
                <h3 className="text-[15px] font-extrabold text-theme">
                  اینا رو امتحان کن
                </h3>
                {trendingList}
              </div>
            </div>
          )}

          {/* حالت ۳: نتیجه داریم */}
          {query.trim() && totalResults > 0 && (
            <div>
              <div className="mb-3 flex items-center justify-between text-xs text-theme-muted md:text-sm">
                <span>
                  <span className="font-bold text-theme">{totalResults}</span>{" "}
                  نتیجه برای «
                  <span className="font-bold text-accent">{query}</span>»
                </span>
              </div>

              <div className="overflow-hidden border border-theme bg-theme-card">
                {topResults.map(({ product, matchReason }) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => goToProduct(product.id)}
                    className="flex w-full items-center gap-3 border-b border-theme p-3 text-right transition last:border-0 hover:bg-theme-surface"
                  >
                    <div className="h-14 w-14 flex-shrink-0 overflow-hidden bg-theme-surface md:h-16 md:w-16">
                      <img
                        src={getProductPlaceholder(
                          product.name,
                          getCategoryEmoji(product.category)
                        )}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
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

              {/* دکمه موبایل */}
              <button
                type="button"
                onClick={() => handleSubmit()}
                className="mt-4 w-full bg-accent py-3 text-sm font-bold text-white transition hover:bg-accent-hover md:hidden"
              >
                جستجوی کامل برای «{query}»
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}