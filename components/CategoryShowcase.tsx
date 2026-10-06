"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ReactNode } from "react";
import { getAppContent } from "@/lib/supabase/appContent";
import type { SpecialCategory } from "@/lib/contentTypes";

const iconCls = "h-6 w-6 md:h-8 md:w-8";

const DEFAULT_ICONS: Record<string, ReactNode> = {
  tent: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={iconCls}>
      <path d="M3.5 21L12 3l8.5 18" />
      <path d="M12 3v18" />
      <path d="M8 21l4-9 4 9" opacity={0.6} />
    </svg>
  ),
  sleepingBag: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={iconCls}>
      <rect x="5" y="4" width="14" height="17" rx="3" />
      <path d="M9 4v17M15 4v17" opacity={0.5} />
      <path d="M5 9h14M5 15h14" opacity={0.4} />
    </svg>
  ),
  backpack: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={iconCls}>
      <path d="M6 9V7a6 6 0 0 1 12 0v2" />
      <rect x="4" y="9" width="16" height="12" rx="2" />
      <path d="M9 9v12M15 9v12" />
      <path d="M9 14h6" />
    </svg>
  ),
  lighting: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={iconCls}>
      <path d="M9 3h6l-1 3h-4L9 3z" />
      <rect x="7" y="6" width="10" height="13" rx="2" />
      <path d="M7 11h10M7 15h10" opacity={0.5} />
      <path d="M10 19h4l.5 2h-5L10 19z" />
    </svg>
  ),
  cooking: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={iconCls}>
      <path d="M4 10h16v4a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6v-4z" />
      <path d="M2 10h20" />
      <path d="M10 7c0-1.5 1.5-1.5 1.5-3M14 7c0-1.5 1.5-1.5 1.5-3" opacity={0.7} />
    </svg>
  ),
  tools: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={iconCls}>
      <path d="M14.7 6.3l3 3-2 2-3-3 2-2z" />
      <path d="M13 10.5L4 19.5l1.5 1.5 9-9" />
      <path d="M5 5l3 3" opacity={0.6} />
    </svg>
  ),
};

const DEFAULT_ITEMS: SpecialCategory[] = [
  { key: "tent", label: "چادر و کمپینگ", subtitle: "چادر، برزنت، آفتابگیر", iconKey: "tent", href: "/products?cat=tent" },
  { key: "sleeping-bag", label: "کیسه خواب", subtitle: "سه فصل و زمستانی", iconKey: "sleepingBag", href: "/products?cat=sleep" },
  { key: "backpack", label: "کوله پشتی", subtitle: "کوهنوردی و سفر", iconKey: "backpack", href: "/products?cat=backpack" },
  { key: "lighting", label: "روشنایی و چراغ", subtitle: "فانوس، چراغ قوه، هدلامپ", iconKey: "lighting", href: "/products?cat=lighting" },
  { key: "cooking", label: "پخت و پز", subtitle: "اجاق، ظروف، قهوه‌ساز", iconKey: "cooking", href: "/products?cat=cooking" },
  { key: "tools", label: "ابزار و تجهیزات", subtitle: "ابزار، چاقو، چندکاره", iconKey: "tools", href: "/products?cat=tools" },
];

export default function CategoryShowcase() {
  const [items, setItems] = useState<SpecialCategory[]>(DEFAULT_ITEMS);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data = await getAppContent<SpecialCategory[]>("special_categories");
      if (!cancelled && data && data.length > 0) setItems(data);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section dir="rtl" className="py-12 md:py-24">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="flex justify-center">
          <span className="rounded-full border border-accent/40 bg-accent/5 px-5 py-1.5 text-xs font-bold uppercase tracking-wider text-accent">
            دسته‌بندی محصولات
          </span>
        </div>

        <h2 dir="rtl" className="mt-5 text-center text-3xl font-black md:text-5xl">
          دسته <span className="text-accent">بندی</span> ویژه
        </h2>

        <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-accent" />

        {/* موبایل: ۲ ردیفی افقی */}
        <div
          className="mt-10 -mx-4 overflow-x-auto px-4 pb-2 md:hidden"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="grid grid-flow-col grid-rows-2 gap-3">
            {items.map((cat) => (
              <Link
                key={cat.key}
                href={cat.href}
                className="group flex w-[104px] flex-col items-center rounded-2xl border border-theme bg-theme-card px-2 py-4 text-center transition active:scale-95"
              >
                <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-white shadow-md shadow-accent/30">
                  {DEFAULT_ICONS[cat.iconKey] ?? DEFAULT_ICONS.tent}
                </div>
                <span className="text-[10px] font-bold leading-tight text-theme">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* دسکتاپ: گرید */}
        <div className="mt-14 hidden grid-cols-1 gap-5 md:grid md:grid-cols-2 lg:grid-cols-3">
          {items.map((cat) => (
            <Link
              key={cat.key}
              href={cat.href}
              className="group relative flex flex-col items-center rounded-2xl border border-theme bg-theme-card px-6 py-9 text-center transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-xl hover:shadow-accent/10"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-accent text-white shadow-lg shadow-accent/30 transition-transform duration-300 group-hover:scale-110">
                {DEFAULT_ICONS[cat.iconKey] ?? DEFAULT_ICONS.tent}
              </div>
              <h3 className="text-base font-bold text-theme md:text-lg">
                {cat.label}
              </h3>
              <p className="mt-2 text-xs text-theme-muted md:text-sm">
                {cat.subtitle}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}