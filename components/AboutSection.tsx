"use client";

import { useEffect, useState } from "react";
import {
  getAboutSection,
  type AboutSection as AboutData,
} from "@/lib/supabase/aboutSection";

const FALLBACK: AboutData = {
  id: "fallback",
  badge: "از سال ۱۳۸۹",
  title_line1: "ساخته شده با",
  title_line2: "عشق به طبیعت",
  paragraph_1:
    "بیش از یک دهه است که KAW CAMP مقصد اصلی کوهنوردان، طبیعت‌گردان و ماجراجویان ایران است.",
  paragraph_2:
    "تیم ما متشکل از کوهنوردان و طبیعت‌دوستان واقعی است که خودشان هر محصول را تست می‌کنند.",
  image: "https://picsum.photos/seed/kawcamp-about/700/800",
  stat_1_value: "۱۵",
  stat_1_label: "سال تجربه",
  stat_2_value: "۳۲۰۰",
  stat_2_label: "مشتری راضی",
  stat_3_value: "۵۰۰",
  stat_3_label: "محصول متنوع",
  primary_label: "درباره ما",
  primary_href: "/about",
  secondary_label: "تماس با ما",
  secondary_href: "/contact",
};

export default function AboutSection() {
  const [data, setData] = useState<AboutData>(FALLBACK);

  useEffect(() => {
    async function load() {
      const result = await getAboutSection();
      if (result) setData(result);
    }
    load();
  }, []);

  const stats = [
    { value: data.stat_1_value, label: data.stat_1_label },
    { value: data.stat_2_value, label: data.stat_2_label },
    { value: data.stat_3_value, label: data.stat_3_label },
  ];

  return (
    <section dir="rtl" className="relative overflow-hidden py-12 md:py-16">
      {/* گرادیان‌های سبز پس‌زمینه */}
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute -right-40 top-10 h-64 w-64 rounded-full bg-accent/20 blur-[100px]" />
        <div className="absolute -left-40 bottom-10 h-64 w-64 rounded-full bg-accent/10 blur-[100px]" />
      </div>

      <div className="relative mx-auto w-full max-w-[1400px] px-6 md:px-12 lg:px-16">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* ستون راست: متن */}
          <div className="flex flex-col justify-center">
            {data.badge && (
              <div className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-accent/30 bg-accent/5 px-3.5 py-1.5 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                <span className="text-[11px] font-bold tracking-wider text-accent md:text-xs">
                  {data.badge}
                </span>
              </div>
            )}

            <h2 className="mb-4 text-2xl font-black leading-tight text-theme md:text-3xl lg:text-4xl">
              {data.title_line1}
              <br />
              <span className="text-accent">{data.title_line2}</span>
            </h2>

            <div className="mb-5 h-[3px] w-14 rounded-full bg-accent" />

            <div className="space-y-3 text-xs leading-6 text-theme-muted md:text-sm md:leading-7">
              {data.paragraph_1 && <p>{data.paragraph_1}</p>}
              {data.paragraph_2 && <p>{data.paragraph_2}</p>}
            </div>

            {/* آمار */}
            <div className="mt-6 grid grid-cols-3 gap-2.5 md:gap-3.5">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-xl border border-theme bg-theme-card p-3 text-center transition hover:border-accent/50 md:p-4"
                >
                  <div className="relative flex items-baseline justify-center gap-0.5">
                    <span className="text-xl font-black text-accent md:text-2xl lg:text-3xl">
                      {stat.value}
                    </span>
                    <span className="text-sm font-black text-accent md:text-base">
                      +
                    </span>
                  </div>
                  <div className="relative mt-1 text-[10px] font-bold text-theme-muted md:text-xs">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-2.5">
              {data.primary_label && data.primary_href && (
                <a
                  href={data.primary_href}
                  className="group inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-xs font-bold text-white shadow-lg shadow-accent/20 transition hover:bg-accent-hover md:text-sm"
                >
                  <span>{data.primary_label}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="h-3.5 w-3.5 transition group-hover:-translate-x-1"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                    />
                  </svg>
                </a>
              )}
              {data.secondary_label && data.secondary_href && (
                <a
                  href={data.secondary_href}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-theme px-4 py-2 text-xs font-bold text-theme transition hover:border-accent hover:text-accent md:text-sm"
                >
                  {data.secondary_label}
                </a>
              )}
            </div>
          </div>

          {/* ستون چپ: تصویر */}
          <div className="relative h-full min-h-[400px]">
            <div className="absolute inset-0 overflow-hidden rounded-xl shadow-2xl shadow-black/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.image}
                alt="KAW CAMP"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}