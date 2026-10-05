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
    <section className="relative py-16 md:py-24">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12 lg:px-20">
        {/* ═══ Header وسط‌چین ═══ */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#F59E0B]/30 bg-[#F59E0B]/5 px-4 py-1.5 backdrop-blur-sm">
            <span className="text-[11px] font-bold tracking-[0.15em] text-[#F59E0B] md:text-xs">
              OUR WORK
            </span>
          </div>

          <h2 className="text-2xl font-black tracking-tight text-white md:text-4xl lg:text-5xl">
            دسته‌بندی‌های <span className="text-[#F59E0B]">محبوب</span>
          </h2>

          <div className="mx-auto mt-4 h-[2px] w-16 bg-[#F59E0B]" />
        </div>

        {/* ═══ فیلترها ═══ */}
        <div className="mb-12 flex flex-wrap items-center justify-center gap-2">
          <a
            href="/products"
            className="rounded-full border border-[#F59E0B] bg-[#F59E0B] px-5 py-2 text-[11px] font-bold uppercase tracking-wider text-white shadow-lg shadow-[#F59E0B]/20 transition md:text-xs"
          >
            همه
          </a>
          {displayCategories.map((cat) => (
            <a
              key={cat.key}
              href={`/products?cat=${cat.key}`}
              className="rounded-full border border-zinc-800 bg-transparent px-5 py-2 text-[11px] font-bold uppercase tracking-wider text-zinc-400 transition hover:border-[#F59E0B]/50 hover:text-[#F59E0B] md:text-xs"
            >
              {cat.label}
            </a>
          ))}
        </div>

        {/* ═══ گرید ۳ ستونی ═══ */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-5">
          {displayCategories.map((cat) => {
            const imageSrc = `/images/categories/photos/${getPhotoName(cat.key)}.jpg`;

            return (
              <a
                key={cat.key}
                href={`/products?cat=${cat.key}`}
                className="group relative block aspect-[4/3] overflow-hidden rounded-lg bg-zinc-900 transition duration-500"
              >
                {/* ─── تصویر ─── */}
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
                        "fallback-emoji absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-zinc-800 to-zinc-900";
                      wrapper.innerHTML = `<span style="font-size: 4rem">${cat.emoji}</span>`;
                      parent.appendChild(wrapper);
                    }
                  }}
                  className="h-full w-full object-cover object-center transition duration-700 group-hover:scale-110"
                />

                {/* ─── Overlay تیره پیش‌فرض ─── */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent transition duration-500 group-hover:from-black/90 group-hover:via-black/60" />

                {/* ─── دایره نارنجی (فقط در hover ظاهر میشه - گوشه بالا-راست) ─── */}
                <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#F59E0B] opacity-0 transition duration-500 group-hover:opacity-100">
                  <div className="h-2 w-2 rounded-full bg-[#F59E0B]" />
                </div>

                {/* ─── محتوا (پایین) — فقط در hover ─── */}
                <div className="absolute bottom-0 right-0 left-0 p-5 md:p-6">
                  {/* خط نارنجی بالای متن */}
                  <div className="mb-3 h-[3px] w-0 bg-[#F59E0B] transition-all duration-500 group-hover:w-10" />

                  {/* عنوان */}
                  <h3 className="translate-y-2 text-base font-black text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 md:text-xl">
                    {cat.label}
                  </h3>

                  {/* زیرعنوان */}
                  <p className="mt-1 translate-y-2 text-[11px] font-bold text-[#F59E0B] opacity-0 transition-all duration-500 delay-75 group-hover:translate-y-0 group-hover:opacity-100 md:text-xs">
                    مشاهده محصولات
                  </p>
                </div>

                {/* ─── خط زیرین نارنجی ─── */}
                <div className="absolute bottom-0 right-0 left-0 h-[3px] w-0 bg-[#F59E0B] transition-all duration-500 group-hover:w-full" />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}