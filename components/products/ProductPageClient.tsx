"use client";

import { useState, useRef } from "react";
import { Product } from "@/data/products";
import { useCart } from "@/components/context/CartContext";
import { useWishlist } from "@/components/context/WishlistContext";
import { formatPrice } from "@/lib/utils";
import ImageLightbox from "@/components/ImageLightbox";

type FlyingItem = {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
};

type Review = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
};

const SAMPLE_REVIEWS: Review[] = [
  {
    id: "1",
    name: "علی محمدی",
    rating: 5,
    comment:
      "کیفیت ساخت فوق‌العاده‌ست. توی بارون شدید هم آب به داخل نفوذ نکرد. حتماً پیشنهاد می‌کنم.",
    date: "۱۴۰۳/۰۸/۱۵",
  },
  {
    id: "2",
    name: "سارا احمدی",
    rating: 4,
    comment:
      "برپا کردنش واقعاً سریعه ولی برای دو نفر کمی تنگه. برای کوهنوردی تک‌نفره یا دو نفره سبک خوبه.",
    date: "۱۴۰۳/۰۷/۲۸",
  },
  {
    id: "3",
    name: "رضا کریمی",
    rating: 5,
    comment:
      "کیفیت پارچه و دوخت بی‌نظیره. وزنش هم سبکه که برای کوله‌پشتی خیلی مهمه.",
    date: "۱۴۰۳/۰۷/۱۰",
  },
];

type TabKey = "specs" | "desc" | "reviews";

export default function ProductPageClient({ product }: { product: Product }) {
  const colors = product.colors || [];
  const sizes = product.sizes || [];
  const hasColors = colors.length > 0;
  const hasSizes = sizes.length > 0;

  const [selectedColor, setSelectedColor] = useState(
    hasColors ? colors[0].label : ""
  );
  const [selectedSize, setSelectedSize] = useState(
    hasSizes ? sizes[0].label : ""
  );
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<TabKey>("specs");
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState("");
  const [reviews, setReviews] = useState<Review[]>(SAMPLE_REVIEWS);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const cartButtonRef = useRef<HTMLButtonElement>(null);
  const mobileGalleryRef = useRef<HTMLDivElement>(null);

  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const galleryImages = product.images?.length
    ? product.images
    : [product.image];

  const activeImage = galleryImages[activeImageIndex] || product.image;

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const brand = product.brand || "KAW CAMP";
  const englishName = product.englishName || product.slug;
  const productCode = "KC-" + product.id.padStart(4, "0");

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  function goToImage(i: number) {
    setActiveImageIndex(i);
    const slide = mobileGalleryRef.current?.children[i] as
      | HTMLElement
      | undefined;
    slide?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }

  function getCartTarget() {
    const isMobile = window.innerWidth < 768;
    const selector = isMobile ? "[data-cart-icon-mobile]" : "[data-cart-icon]";
    const el = document.querySelector(selector) as HTMLElement | null;
    if (el) {
      const rect = el.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    }
    return {
      x: isMobile ? window.innerWidth / 2 : window.innerWidth - 100,
      y: isMobile ? window.innerHeight - 40 : 100,
    };
  }

  function handleAddToCart() {
    if (!product.inStock) return;

    if (cartButtonRef.current) {
      const rect = cartButtonRef.current.getBoundingClientRect();
      const target = getCartTarget();
      const newItem: FlyingItem = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        targetX: target.x,
        targetY: target.y,
      };
      setFlyingItems((prev) => [...prev, newItem]);
      setTimeout(() => {
        setFlyingItems((prev) => prev.filter((i) => i !== newItem));
      }, 800);
    }

    addItem(product, quantity);
  }

  function submitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim()) return;

    const newReview: Review = {
      id: Date.now().toString(),
      name: newReviewName.trim(),
      rating: newReviewRating,
      comment: newReviewComment.trim(),
      date: new Date().toLocaleDateString("fa-IR"),
    };

    setReviews((prev) => [newReview, ...prev]);
    setNewReviewName("");
    setNewReviewRating(5);
    setNewReviewComment("");
    setShowReviewForm(false);
  }

  return (
    <div className="space-y-6">
      {/* ═══════ گرید اصلی: گالری + اطلاعات ═══════ */}
      <div className="grid gap-6 lg:grid-cols-[1fr_540px] lg:gap-8">
        {/* ═══ ستون گالری ═══ */}
        <div className="overflow-hidden rounded-lg border border-theme bg-theme-card">
          <div className="relative">
            {/* دسکتاپ */}
            <div
              className="relative hidden aspect-square w-full cursor-zoom-in overflow-hidden bg-white md:block"
              onClick={() => setLightboxOpen(true)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeImage}
                alt={product.name}
                className="absolute inset-0 h-full w-full object-cover"
              />

              {discount > 0 && (
                <span className="absolute right-3 top-3 z-10 rounded bg-accent px-2.5 py-1 text-sm font-bold text-white">
                  -{discount}%
                </span>
              )}

              {!product.inStock && (
                <span className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 text-lg font-bold text-white">
                  ناموجود
                </span>
              )}
            </div>

            {/* موبایل */}
            <div
              ref={mobileGalleryRef}
              className="flex snap-x snap-mandatory overflow-x-auto bg-white md:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              onScroll={(e) => {
                const el = e.currentTarget;
                const w = el.clientWidth;
                if (w === 0) return;
                const i = Math.round(Math.abs(el.scrollLeft) / w);
                if (i !== activeImageIndex) setActiveImageIndex(i);
              }}
            >
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setLightboxOpen(true)}
                  className="relative aspect-square w-full flex-shrink-0 snap-center overflow-hidden"
                  aria-label={`${product.name} ${i + 1}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={`${product.name} ${i + 1}`}
                    className="h-full w-full object-cover"
                    draggable={false}
                  />

                  {i === 0 && discount > 0 && (
                    <span className="absolute right-3 top-3 z-10 rounded bg-accent px-2.5 py-1 text-sm font-bold text-white">
                      -{discount}%
                    </span>
                  )}

                  {!product.inStock && (
                    <span className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 text-lg font-bold text-white">
                      ناموجود
                    </span>
                  )}
                </button>
              ))}
            </div>

            {galleryImages.length > 1 && (
              <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 md:hidden">
                {galleryImages.map((_, i) => (
                  <span
                    key={i}
                    className={
                      "h-1.5 rounded-full transition-all " +
                      (i === activeImageIndex
                        ? "w-6 bg-accent"
                        : "w-1.5 bg-white/60")
                    }
                  />
                ))}
              </div>
            )}
          </div>

          {galleryImages.length > 1 && (
            <div className="flex items-center justify-start gap-2 overflow-x-auto border-t border-theme bg-theme-surface/40 p-2 md:gap-3 md:p-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {galleryImages.slice(0, 12).map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goToImage(i)}
                  className={`relative aspect-square w-14 flex-shrink-0 overflow-hidden rounded border-2 transition md:w-16 ${
                    i === activeImageIndex
                      ? "border-accent"
                      : "border-theme/40 hover:border-theme"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={`${product.name} ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ═══ ستون اطلاعات ═══ */}
        <div className="rounded-lg border border-theme bg-theme-card p-4 md:p-8">
          <h1 className="text-lg font-bold leading-tight text-theme md:text-3xl">
            {product.name}
          </h1>

          <p className="mt-2 text-[11px] font-semibold uppercase tracking-widest text-theme-muted md:mt-3 md:text-sm">
            {brand}
          </p>

          <div className="my-4 border-t border-theme md:my-6" />

          <div className="flex items-center gap-2">
            <div className="flex text-base tracking-wider md:text-2xl">
              {[1, 2, 3, 4, 5].map((s) => (
                <span
                  key={s}
                  className={
                    s <= Math.round(avgRating)
                      ? "text-yellow-500"
                      : "text-theme-muted"
                  }
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-xs text-theme-muted md:text-base">
              ({reviews.length.toLocaleString("fa-IR")} نظر)
            </span>
          </div>

          {hasColors && (
            <div className="mt-5 md:mt-7">
              <p className="mb-2 text-sm font-bold text-theme md:mb-3 md:text-lg">
                رنگ:{" "}
                <span className="font-normal text-theme-muted">
                  {selectedColor}
                </span>
              </p>
              <div className="flex flex-wrap gap-1.5 md:gap-2">
                {colors.map((c) => (
                  <button
                    key={c.label}
                    type="button"
                    onClick={() => setSelectedColor(c.label)}
                    className={`flex min-w-[70px] items-center justify-center gap-1.5 rounded border px-3 py-2 text-xs font-semibold transition md:min-w-[90px] md:gap-2 md:px-4 md:py-3 md:text-lg ${
                      selectedColor === c.label
                        ? "border-theme bg-theme-surface text-theme"
                        : "border-theme text-theme-muted hover:border-theme-muted"
                    }`}
                  >
                    {c.image && (
                      <span className="h-4 w-4 overflow-hidden rounded-sm border border-theme md:h-5 md:w-5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={c.image}
                          alt={c.label}
                          className="h-full w-full object-cover"
                        />
                      </span>
                    )}
                    <span>{c.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {hasSizes && (
            <div className="mt-5 md:mt-6">
              <p className="mb-2 text-sm font-bold text-theme md:mb-3 md:text-lg">
                سایز:{" "}
                <span className="font-normal text-theme-muted">
                  {selectedSize}
                </span>
              </p>
              <div className="flex flex-wrap gap-1.5 md:gap-2">
                {sizes.map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => setSelectedSize(s.label)}
                    className={`min-w-[70px] rounded border px-3 py-2 text-xs font-semibold transition md:min-w-[90px] md:px-4 md:py-3 md:text-lg ${
                      selectedSize === s.label
                        ? "border-theme bg-theme-surface text-theme"
                        : "border-theme text-theme-muted hover:border-theme-muted"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5 flex items-baseline gap-2 md:mt-7 md:gap-4">
            <span className="text-xl font-bold text-theme md:text-4xl">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-sm text-theme-muted line-through md:text-xl">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>

          <div className="mt-5 md:mt-7">
            <p className="mb-2 text-sm font-bold text-theme md:mb-3 md:text-lg">
              تعداد:
            </p>
            <div className="flex w-fit items-center rounded border border-theme">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-10 w-10 items-center justify-center text-xl text-theme-muted transition hover:text-theme md:h-14 md:w-14 md:text-2xl"
              >
                −
              </button>
              <span className="w-12 border-x border-theme py-2 text-center text-sm font-bold text-theme md:w-16 md:py-3 md:text-xl">
                {quantity.toLocaleString("fa-IR")}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="flex h-10 w-10 items-center justify-center text-xl text-theme-muted transition hover:text-theme md:h-14 md:w-14 md:text-2xl"
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2 md:mt-7 md:gap-3">
            <button
              ref={cartButtonRef}
              type="button"
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="rounded bg-accent px-3 py-3 text-xs font-bold text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:bg-theme-surface disabled:text-theme-muted md:px-4 md:py-4 md:text-lg"
            >
              {product.inStock ? "افزودن به کوله" : "ناموجود"}
            </button>

            <button
              type="button"
              onClick={() => {
                if (product.inStock) {
                  addItem(product, quantity);
                  window.location.href = "/checkout";
                }
              }}
              disabled={!product.inStock}
              className="rounded bg-zinc-900 px-3 py-3 text-xs font-bold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 md:px-4 md:py-4 md:text-lg dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
            >
              خرید سریع
            </button>
          </div>

          <button
            type="button"
            className="mt-3 w-full text-center text-[11px] font-medium text-theme-muted underline underline-offset-4 transition hover:text-theme md:mt-4 md:text-base"
          >
            گزینه‌های پرداخت دیگر
          </button>

          <div className="mt-5 grid grid-cols-2 gap-3 border-t border-theme pt-5 md:mt-7 md:gap-5 md:pt-7">
            {[
              {
                title: "ارسال رایگان",
                desc: "سفارش بالای ۲ میلیون",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4 md:h-6 md:w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                ),
              },
              {
                title: "بازگشت رایگان",
                desc: "تا ۳۰ روز",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4 md:h-6 md:w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                  </svg>
                ),
              },
              {
                title: "ارسال ۱-۲ روزه",
                desc: "سریع و مطمئن",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4 md:h-6 md:w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
              {
                title: "پشتیبانی عالی",
                desc: "همیشه در دسترس",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4 md:h-6 md:w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2 md:gap-3">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded border border-theme text-theme-muted md:h-11 md:w-11">
                  {item.icon}
                </span>
                <div>
                  <p className="text-xs font-bold text-theme md:text-base">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-[10px] text-theme-muted md:text-sm">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════ تب مشخصات فنی / توضیحات / نظرات ═══════ */}
      <div className="rounded-lg border border-theme bg-theme-card p-3 md:p-8">
        <div className="mb-4 flex gap-1.5 overflow-x-auto border-b border-theme pb-2.5 md:mb-6 md:gap-2 md:pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            type="button"
            onClick={() => setActiveTab("specs")}
            className={
              "whitespace-nowrap rounded-md px-3 py-2 text-xs font-bold transition md:rounded-lg md:px-6 md:py-3 md:text-lg " +
              (activeTab === "specs"
                ? "bg-accent text-white shadow-lg shadow-accent/20"
                : "bg-theme-surface text-theme-muted hover:text-accent")
            }
          >
            مشخصات فنی
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("desc")}
            className={
              "whitespace-nowrap rounded-md px-3 py-2 text-xs font-bold transition md:rounded-lg md:px-6 md:py-3 md:text-lg " +
              (activeTab === "desc"
                ? "bg-accent text-white shadow-lg shadow-accent/20"
                : "bg-theme-surface text-theme-muted hover:text-accent")
            }
          >
            توضیحات
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("reviews")}
            className={
              "whitespace-nowrap rounded-md px-3 py-2 text-xs font-bold transition md:rounded-lg md:px-6 md:py-3 md:text-lg " +
              (activeTab === "reviews"
                ? "bg-accent text-white shadow-lg shadow-accent/20"
                : "bg-theme-surface text-theme-muted hover:text-accent")
            }
          >
            نظرات ({reviews.length.toLocaleString("fa-IR")})
          </button>
        </div>

        <div className="kaw-scrollbar max-h-[360px] overflow-y-auto pl-1 pr-2 md:max-h-[420px]">
          {/* تب مشخصات */}
          {activeTab === "specs" && (
            <div className="grid gap-1.5 md:grid-cols-2 md:gap-x-10 md:gap-y-3">
              {[
                { label: "برند", value: brand },
                { label: "نام انگلیسی", value: englishName },
                { label: "شناسه", value: productCode },
                { label: "امتیاز", value: `${avgRating.toFixed(1)} از ۵` },
                ...(colors.length > 0
                  ? [
                      {
                        label: "رنگ‌ها",
                        value: colors.map((c) => c.label).join(" / "),
                      },
                    ]
                  : []),
                ...(sizes.length > 0
                  ? [
                      {
                        label: "سایزها",
                        value: sizes.map((s) => s.label).join(" / "),
                      },
                    ]
                  : []),
              ].map((row, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b border-theme py-2.5 text-xs md:py-4 md:text-lg"
                >
                  <span className="text-theme-muted">{row.label}</span>
                  <span
                    className="font-bold text-theme"
                    dir={
                      row.label === "نام انگلیسی" || row.label === "شناسه"
                        ? "ltr"
                        : undefined
                    }
                  >
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* تب توضیحات */}
          {activeTab === "desc" && (
            <div>
              {product.shortDesc && (
                <p className="mb-3 text-xs font-bold text-theme md:mb-5 md:text-lg">
                  {product.shortDesc}
                </p>
              )}

              <p className="mb-3 text-[10px] text-theme-muted md:mb-6 md:text-base">
                شناسه: <span className="font-mono">{productCode}</span> | برند:{" "}
                {brand} | امتیاز: {avgRating.toFixed(1)} از ۵
              </p>

              <p className="whitespace-pre-line text-xs leading-6 text-theme-muted md:text-lg md:leading-10">
                {product.description}
              </p>

              {product.features.length > 0 && (
                <ul className="mt-4 space-y-2 md:mt-7 md:space-y-3">
                  {product.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-xs text-theme-muted md:gap-3 md:text-lg"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-theme-muted md:mt-3" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* تب نظرات */}
          {activeTab === "reviews" && (
            <div className="space-y-4 md:space-y-6">
              <div className="flex flex-col items-center gap-3 rounded-xl border border-theme bg-theme-surface/40 p-4 md:flex-row md:items-center md:gap-8 md:p-6">
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-black text-theme md:text-6xl">
                    {avgRating.toFixed(1)}
                  </span>
                  <div className="mt-1.5 flex text-lg md:mt-2 md:text-2xl">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span
                        key={s}
                        className={
                          s <= Math.round(avgRating)
                            ? "text-yellow-500"
                            : "text-theme-muted"
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="mt-1.5 text-[10px] text-theme-muted md:mt-2 md:text-xs">
                    از {reviews.length.toLocaleString("fa-IR")} نظر
                  </span>
                </div>

                <div className="h-px w-full bg-theme md:h-full md:w-px" />

                <div className="flex-1 text-center md:text-right">
                  <p className="text-xs font-bold text-theme md:text-base">
                    نظر شما برای ما مهمه
                  </p>
                  <p className="mt-1 text-[10px] text-theme-muted md:text-sm">
                    تجربه‌ت رو با دیگران به اشتراک بذار
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowReviewForm((s) => !s)}
                    className="mt-3 rounded-lg bg-accent px-4 py-2 text-xs font-bold text-white transition hover:bg-accent-hover md:px-5 md:py-2.5 md:text-sm"
                  >
                    {showReviewForm ? "بستن فرم" : "✍️ ثبت نظر"}
                  </button>
                </div>
              </div>

              {showReviewForm && (
                <form
                  onSubmit={submitReview}
                  className="rounded-xl border border-accent/30 bg-accent/5 p-3 md:p-5"
                >
                  <div className="grid gap-2 md:grid-cols-2 md:gap-3">
                    <input
                      type="text"
                      value={newReviewName}
                      onChange={(e) => setNewReviewName(e.target.value)}
                      placeholder="نام شما"
                      className="rounded-lg border border-theme bg-theme-card px-3 py-2.5 text-xs text-theme outline-none focus:border-accent md:px-4 md:py-3 md:text-sm"
                      required
                    />
                    <div className="flex items-center gap-2 rounded-lg border border-theme bg-theme-card px-3 py-2.5 md:px-4 md:py-3">
                      <span className="text-[10px] text-theme-muted md:text-xs">
                        امتیاز:
                      </span>
                      <div className="flex text-lg md:text-xl">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setNewReviewRating(s)}
                            className={
                              "transition " +
                              (s <= newReviewRating
                                ? "text-yellow-500"
                                : "text-theme-muted hover:text-yellow-400")
                            }
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <textarea
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    placeholder="نظر خود را بنویسید..."
                    rows={3}
                    className="mt-2 w-full rounded-lg border border-theme bg-theme-card px-3 py-2.5 text-xs text-theme outline-none focus:border-accent md:mt-3 md:px-4 md:py-3 md:text-sm"
                    required
                  />

                  <div className="mt-2 flex gap-2 md:mt-3">
                    <button
                      type="submit"
                      className="rounded-lg bg-accent px-4 py-2 text-xs font-bold text-white transition hover:bg-accent-hover md:px-5 md:py-2.5 md:text-sm"
                    >
                      ثبت نظر
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="rounded-lg border border-theme px-4 py-2 text-xs font-bold text-theme-muted transition hover:text-theme md:px-5 md:py-2.5 md:text-sm"
                    >
                      انصراف
                    </button>
                  </div>
                </form>
              )}

              {reviews.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed border-theme p-8 text-center md:p-10">
                  <p className="text-3xl md:text-4xl">💬</p>
                  <p className="mt-3 text-xs font-bold text-theme md:text-sm">
                    هنوز نظری ثبت نشده
                  </p>
                  <p className="mt-1 text-[10px] text-theme-muted md:text-xs">
                    اولین نفری باش که تجربه‌ت رو به اشتراک می‌ذاره
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5 md:space-y-3">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="rounded-xl border border-theme bg-theme-card p-3 md:p-5"
                    >
                      <div className="flex items-start justify-between gap-2 md:gap-3">
                        <div className="flex items-center gap-2 md:gap-3">
                          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-black text-accent md:h-10 md:w-10 md:text-sm">
                            {review.name.charAt(0)}
                          </span>
                          <div>
                            <p className="text-xs font-bold text-theme md:text-base">
                              {review.name}
                            </p>
                            <div className="mt-0.5 flex text-xs md:text-sm">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <span
                                  key={s}
                                  className={
                                    s <= review.rating
                                      ? "text-yellow-500"
                                      : "text-theme-muted"
                                  }
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <span className="text-[9px] text-theme-muted md:text-xs">
                          {review.date}
                        </span>
                      </div>

                      <p className="mt-2.5 text-xs leading-6 text-theme-muted md:mt-3 md:text-base md:leading-7">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ═══════ انیمیشن پرتاب به کوله ═══════ */}
      {flyingItems.map((item, index) => (
        <div
          key={index}
          className="pointer-events-none fixed z-[9999]"
          style={{
            left: item.x,
            top: item.y,
            ["--target-x" as any]: `${item.targetX - item.x}px`,
            ["--target-y" as any]: `${item.targetY - item.y}px`,
            animation: "flyToCartPage 0.8s cubic-bezier(0.5, -0.5, 1, 1) forwards",
          }}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent shadow-2xl shadow-accent/50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="white"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>
          </div>
        </div>
      ))}

      {/* Lightbox */}
      {lightboxOpen && (
        <ImageLightbox
          images={galleryImages}
          index={activeImageIndex}
          alt={product.name}
          onClose={() => setLightboxOpen(false)}
          onIndexChange={(i) => setActiveImageIndex(i)}
        />
      )}

      <style jsx global>{`
        @keyframes flyToCartPage {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          30% {
            transform: translate(-50%, -150%) scale(1.4);
            opacity: 1;
          }
          100% {
            transform: translate(
                calc(-50% + var(--target-x)),
                calc(-50% + var(--target-y))
              )
              scale(0.2);
            opacity: 0;
          }
        }

        .kaw-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .kaw-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .kaw-scrollbar::-webkit-scrollbar-thumb {
          background: var(--accent);
          border-radius: 3px;
        }
        .kaw-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--accent-hover);
        }
        .kaw-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: var(--accent) transparent;
        }
      `}</style>
    </div>
  );
}