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
      {/* کادر تمام‌عرض — در لایت سفید، در دارک مشکی */}
      <div className="relative w-full bg-theme py-12 md:py-16">
        <div className="relative mx-auto max-w-[1400px] px-6 md:px-12 lg:px-16">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-3.5 py-1.5 backdrop-blur-sm">
              <span className="text-[11px] font-bold tracking-[0.15em] text-accent md:text-xs">
                OUR WORK
              </span>
            </div>

            <h2 className="text-2xl font-black tracking-tight text-theme md:text-3xl lg:text-4xl">
              دسته‌بندی‌های <span className="text-accent">محبوب</span>
            </h2>

            <div className="mx-auto mt-4 h-[3px] w-14 rounded-full bg-accent" />
          </div>

          {/* فیلترها */}
          <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
            <a
              href="/products"
              className="rounded-full border border-accent bg-accent px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-lg shadow-accent/20 transition md:text-xs"
            >
              همه
            </a>
            {displayCategories.map((cat) => (
              <a
                key={cat.key}
                href={`/products?cat=${cat.key}`}
                className="rounded-full border border-theme bg-transparent px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-theme-muted transition hover:border-accent/50 hover:text-accent md:text-xs"
              >
                {cat.label}
              </a>
            ))}
          </div>

          {/* گرید */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-4">
            {displayCategories.map((cat) => {
              const imageSrc = `/images/categories/photos/${getPhotoName(cat.key)}.jpg`;

              return (
                <a
                  key={cat.key}
                  href={`/products?cat=${cat.key}`}
                  className="group relative block aspect-[4/3] overflow-hidden rounded-lg bg-theme-card transition duration-500"
                >
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
                          "fallback-emoji absolute inset-0 flex flex-col items-center justify-center gap-2 bg-theme-surface";
                        wrapper.innerHTML = `<span style="font-size: 3rem">${cat.emoji}</span>`;
                        parent.appendChild(wrapper);
                      }
                    }}
                    className="h-full w-full object-cover object-center transition duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition duration-500 group-hover:from-black/90 group-hover:via-black/60" />

                  <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full border-2 border-accent opacity-0 transition duration-500 group-hover:opacity-100">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                  </div>

                  <div className="absolute bottom-0 right-0 left-0 p-4">
                    <div className="mb-2.5 h-[3px] w-0 bg-accent transition-all duration-500 group-hover:w-8" />

                    <h3 className="translate-y-2 text-sm font-black text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 md:text-base">
                      {cat.label}
                    </h3>

                    <p className="mt-0.5 translate-y-2 text-[10px] font-bold text-accent opacity-0 transition-all duration-500 delay-75 group-hover:translate-y-0 group-hover:opacity-100 md:text-[11px]">
                      مشاهده محصولات
                    </p>
                  </div>

                  <div className="absolute bottom-0 right-0 left-0 h-[3px] w-0 bg-accent transition-all duration-500 group-hover:w-full" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}