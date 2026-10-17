"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAppContent } from "@/lib/actions/appContent";
import {
  type CategoryGridFilter,
  type CategoryGridPhoto,
  normalizeGridPhoto,
} from "@/lib/contentTypes";

const DEFAULT_FILTERS: CategoryGridFilter[] = [
  {
    key: "tent",
    label: "چادر",
    photos: ["tent", "bottle", "cooking", "lighting"],
  },
  {
    key: "sleep",
    label: "کیسه خواب",
    photos: ["sleep", "mattress", "tent", "bottle"],
  },
  {
    key: "mattress",
    label: "زیرانداز",
    photos: ["mattress", "sleep", "tent", "backpack"],
  },
  {
    key: "backpack",
    label: "کوله پشتی",
    photos: ["backpack", "accessories", "bottle", "clothing"],
  },
];

const LABELS: Record<string, string> = {
  tent: "چادر و سایبان",
  sleep: "کیسه خواب",
  mattress: "زیرانداز",
  backpack: "کوله پشتی",
  clothing: "لباس کوهنوردی",
  boots: "کفش کوهنوردی",
  socks: "جوراب",
  gaiters: "گتر",
  tools: "ابزار و تجهیزات",
  lighting: "روشنایی و چراغ",
  bottle: "قمقمه و فلاسک",
  cooking: "پخت و پز",
  accessories: "لوازم جانبی",
};

const DESCRIPTIONS: Record<string, string> = {
  tent: "چادرهای چهارفصل، بادی و سافراری برای هر نوع کمپینگ",
  sleep: "کیسه خواب‌های پَری و الیافی با دمای راحتی متنوع",
  mattress: "زیراندازهای بادی، فومی و ایزوله برای خواب راحت",
  backpack: "کوله‌پشتی‌های ۳۰ تا ۸۰ لیتری حرفه‌ای",
  clothing: "لباس‌های ضدآب، پَر و تنفسی کوهنوردی",
  boots: "کفش‌های چرم، ضدآب و سبک کوهنوردی",
  socks: "جوراب‌های پشمی و ضدباکتری حرفه‌ای",
  gaiters: "گترهای ضدآب و ضدباد برای برف و باران",
  tools: "ابزار و تجهیزات ضروری کوهنوردی",
  lighting: "چراغ‌های LED، فانوس و هدلامپ",
  bottle: "قمقمه‌ها و فلاسک‌های عایق حرارتی",
  cooking: "لوازم پخت و پز سبک و کاربردی",
  accessories: "اکسسوری‌های کوهنوردی و کمپینگ",
};

export default function CategoryGrid() {
  const [filters, setFilters] = useState<CategoryGridFilter[]>(DEFAULT_FILTERS);
  const [activeKey, setActiveKey] = useState<string>(DEFAULT_FILTERS[0].key);

  useEffect(() => {
    (async () => {
      const data = await getAppContent<CategoryGridFilter[]>("category_grid");
      if (data && data.length > 0) setFilters(data);
    })();
  }, []);

  const activeFilter = filters.find((f) => f.key === activeKey) || filters[0];

  return (
    <section className="w-full px-3 py-10 sm:px-6 md:px-7 md:py-14">
      {/* تیتر */}
      <div className="mb-5 flex items-end justify-between md:mb-8">
        <h2 className="text-lg font-black tracking-tight text-theme md:text-xl lg:text-2xl">
          دسته‌بندی‌های محبوب
        </h2>

        <Link
          href={`/products?cat=${activeFilter.key}`}
          className="text-[12px] font-semibold text-theme-muted underline underline-offset-4 transition hover:text-theme md:text-[13px]"
        >
          مشاهده همه
        </Link>
      </div>

      {/* تب‌ها */}
      <div className="scrollbar-hide mb-5 flex flex-nowrap items-center gap-1 overflow-x-auto pb-1 md:mb-8 md:flex-wrap md:gap-2 md:pb-0">
        {filters.map((f) => {
          const isActive = activeKey === f.key;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setActiveKey(f.key)}
              className={
                "shrink-0 rounded-none border px-3 py-1.5 text-[11px] font-bold transition md:px-7 md:py-2.5 md:text-sm " +
                (isActive
                  ? "border-black text-black dark:border-white dark:text-white"
                  : "border-zinc-300 text-zinc-400 hover:border-zinc-500 hover:text-zinc-600 dark:border-zinc-700 dark:text-zinc-500 dark:hover:border-zinc-500 dark:hover:text-zinc-300")
              }
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* گرید کارت‌ها */}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-2.5">
        {activeFilter.photos.map((rawPhoto: string | CategoryGridPhoto, idx) => {
          const photo = normalizeGridPhoto(rawPhoto);
          const imageSrc = `/images/categories/photos/${photo.name}.jpg`;
          const label = photo.label || LABELS[photo.name] || photo.name;
          const description =
            photo.description ||
            DESCRIPTIONS[photo.name] ||
            "محصولات باکیفیت و حرفه‌ای کوهنوردی";
          // 🆕 اگه لینک اختصاصی داشت، از اون استفاده کن
          const href = photo.href || `/products?cat=${activeFilter.key}`;

          return (
            <Link
              key={`${activeFilter.key}-${idx}`}
              href={href}
              className="group block"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-theme-surface">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageSrc}
                  alt={label}
                  loading="lazy"
                  draggable={false}
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent && !parent.querySelector(".fallback-emoji")) {
                      const wrapper = document.createElement("div");
                      wrapper.className =
                        "fallback-emoji absolute inset-0 flex items-center justify-center bg-theme-surface";
                      wrapper.innerHTML = `<span style="font-size: 3rem">📦</span>`;
                      parent.appendChild(wrapper);
                    }
                  }}
                  className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>

              <div className="mt-3 md:mt-4">
                <h3 className="line-clamp-1 text-[14px] font-bold text-theme md:text-[15px]">
                  {label}
                </h3>
                <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-theme-muted md:text-[13px]">
                  {description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}