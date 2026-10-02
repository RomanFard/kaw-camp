"use client";

import { useState, useEffect } from "react";

const slides = [
  {
    id: 1,
    badge: "فروشگاه تخصصی تجهیزات کوهنوردی و کمپینگ",
    title: "تجربه صعود حرفه‌ای با بهترین تجهیزات",
    subtitle:
      "ارائه تخصصی‌ترین لوازم کوهنوردی، کوله‌های فنی و تجهیزات کمپینگ",
   bg: "https://picsum.photos/1920/800?random=1",
    buttons: [
      { label: "لوازم کوهنوردی", href: "/products?cat=tools" },
      { label: "کوله پشتی", href: "/products?cat=backpack" },
      { label: "کفش کوهنوردی", href: "/products?cat=clothing" },
      { label: "تجهیزات پخت‌وپز", href: "/products?cat=cooking" },
    ],
  },
  {
    id: 2,
    badge: "چادرهای چهارفصل حرفه‌ای",
    title: "کمپینگ در دل طبیعت با خیال راحت",
    subtitle: "چادرهای ضدآب و مقاوم در برابر باد — مناسب ارتفاعات بالا",
    bg: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1920&q=80",
    buttons: [
      { label: "چادر کوهنوردی", href: "/products?cat=tent" },
      { label: "کیسه خواب", href: "/products?cat=sleep" },
      { label: "زیرانداز", href: "/products?cat=sleep" },
      { label: "لوازم کمپینگ", href: "/products" },
    ],
  },
  {
    id: 3,
    badge: "فصل سرد نزدیک است",
    title: "لباس‌های فنی زمستانی",
    subtitle: "گرم، سبک و ضدآب — آماده برای سرما و برف",
    bg: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1920&q=80",
    buttons: [
      { label: "کاپشن پَری", href: "/products?cat=clothing" },
      { label: "شلوار کوهنوردی", href: "/products?cat=clothing" },
      { label: "دستکش", href: "/products?cat=clothing" },
      { label: "کلاه", href: "/products?cat=clothing" },
    ],
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="mx-auto max-w-[1600px] px-6 pt-6">
      <div className="relative overflow-hidden rounded-2xl">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={
              i === current
                ? "opacity-100 transition-opacity duration-700"
                : "absolute inset-0 opacity-0 transition-opacity duration-700"
            }
          >
            <div
              className="relative flex min-h-[500px] items-center justify-center bg-cover bg-center px-6 py-20 text-center text-white md:min-h-[550px]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.55)), url(" +
                  slide.bg +
                  ")",
              }}
            >
              <div className="max-w-4xl">
                <span className="inline-block rounded-lg border border-white/50 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white backdrop-blur-md md:text-base">
                  {slide.badge}
                </span>

                <h2 className="mt-8 text-3xl font-bold leading-tight text-white md:text-5xl md:leading-tight">
                  {slide.title}
                </h2>

                <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/90 md:text-lg md:leading-8">
                  {slide.subtitle}
                </p>

                <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                  {slide.buttons.map((btn) => (
                    <a
                      key={btn.label}
                      href={btn.href}
                      className="rounded-lg border-2 border-white/60 bg-white/5 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:border-white hover:bg-white hover:text-gray-900 md:text-base"
                    >
                      {btn.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={"اسلاید " + (i + 1)}
              className={
                i === current
                  ? "h-2 w-8 rounded-full bg-amber-500 transition-all"
                  : "h-2 w-2 rounded-full bg-white/60 transition-all"
              }
            />
          ))}
        </div>
      </div>

      <div className="mt-4 w-full border-b border-[#D4C5A0] bg-white">
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-3 px-6 py-4 text-center">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 md:text-base">
            <span className="text-amber-500">◆</span>
            <span>ارسال به سراسر ایران</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 md:text-base">
            <span className="text-amber-500">◆</span>
            <span>ضمانت بازگشت کالا</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 md:text-base">
            <span className="text-amber-500">◆</span>
            <span>مشاوره تخصصی خرید</span>
          </div>
        </div>
      </div>
    </section>
  );
}