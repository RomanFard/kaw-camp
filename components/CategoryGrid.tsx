"use client";

import { categories } from "@/data/products";

function getPhotoName(key: string): string {
  const map: Record<string, string> = {
    tent: "tent",
    sleep: "sleep",
    mattress: "mattress",
    backpack: "backpack",
    clothing: "clothing",
    shoes: "boots",
    socks: "socks",
    gaiters: "gaiters",
    tools: "tools",
    lighting: "lighting",
    bottle: "bottle",
    cooking: "cooking",
    sunglasses: "sunglasses",
    watch: "watch",
    bicycle: "bicycle",
    accessories: "accessories",
  };
  return map[key] || key;
}

export default function CategoryGrid() {
  const displayCategories = categories.slice(0, 6);

  return (
    <section className="relative py-12 md:py-16">
      <div className="mx-auto max-w-[1300px] px-6 md:px-10">
        {/* Header وسط‌چین */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#FF6B4A]/30 bg-[#FF6B4A]/5 px-3.5 py-1.5 backdrop-blur-sm">
            <span className="text-[11px] font-bold tracking-[0.15em] text-[#FF6B4A] md:text-xs">
              OUR WORK
            </span>
          </div>

          <h2 className="text-2xl font-black tracking-tight text-white md:text-3xl lg:text-4xl">
            دسته‌بندی‌های <span className="text-[#FF6B4A]">محبوب</span>
          </h2>

          <div className="mx-auto mt-4 h-[3px] w-14 rounded-full bg-[#FF6B4A]" />
        </div>

        {/* فیلترها */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
          <a
            href="/products"
            className="rounded-full border border-[#FF6B4A] bg-[#FF6B4A] px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-lg shadow-[#FF6B4A]/20 transition md:text-xs"
          >
            همه
          </a>
          {displayCategories.map((cat) => (
            <a
              key={cat.key}
              href={`/products?cat=${cat.key}`}
              className="rounded-full border border-zinc-800 bg-transparent px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-400 transition hover:border-[#FF6B4A]/50 hover:text-[#FF6B4A] md:text-xs"
            >
              {cat.label}
            </a>
          ))}
        </div>

        {/* گرید ۳ ستونی */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-4">
          {displayCategories.map((cat) => {
            const imageSrc = `/images/categories/photos/${getPhotoName(cat.key)}.jpg`;

            return (
              <a
                key={cat.key}
                href={`/products?cat=${cat.key}`}
                className="group relative block aspect-[4/3] overflow-hidden rounded-lg bg-zinc-900 transition duration-500"
              >
                {/* تصویر */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageSrc}
                  alt={cat.label}
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent && !parent.querySelector(".fallback-emoji")) {
                      const wrapper = document.createElement("div");
                      wrapper.className =
                        "fallback-emoji absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-zinc-800 to-zinc-900";
                      wrapper.innerHTML = `<span style="font-size: 3rem">${cat.emoji}</span>`;
                      parent.appendChild(wrapper);
                    }
                  }}
                  className="h-full w-full object-cover object-center transition duration-700 group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent transition duration-500 group-hover:from-black/90 group-hover:via-black/60" />

                {/* دایره نارنجی گوشه */}
                <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#FF6B4A] opacity-0 transition duration-500 group-hover:opacity-100">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#FF6B4A]" />
                </div>

                {/* محتوا (پایین) */}
                <div className="absolute bottom-0 right-0 left-0 p-4">
                  <div className="mb-2.5 h-[3px] w-0 bg-[#FF6B4A] transition-all duration-500 group-hover:w-8" />

                  <h3 className="translate-y-2 text-sm font-black text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 md:text-base">
                    {cat.label}
                  </h3>

                  <p className="mt-0.5 translate-y-2 text-[10px] font-bold text-[#FF6B4A] opacity-0 transition-all duration-500 delay-75 group-hover:translate-y-0 group-hover:opacity-100 md:text-[11px]">
                    مشاهده محصولات
                  </p>
                </div>

                {/* خط زیرین نارنجی */}
                <div className="absolute bottom-0 right-0 left-0 h-[3px] w-0 bg-[#FF6B4A] transition-all duration-500 group-hover:w-full" />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}