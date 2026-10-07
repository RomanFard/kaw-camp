"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TeamSection from "@/components/TeamSection";
import AboutSection from "@/components/AboutSection";

function MissionVisionTabs() {
  const [tab, setTab] = useState<"mission" | "vision">("mission");

  return (
    <>
      <div className="mb-6 flex justify-center gap-3">
        <button
          type="button"
          onClick={() => setTab("mission")}
          className={
            "rounded-full border px-6 py-2.5 text-sm font-bold transition md:text-base " +
            (tab === "mission"
              ? "border-accent bg-accent text-white shadow-lg shadow-accent/20"
              : "border-theme bg-transparent text-theme-muted hover:border-accent/50 hover:text-accent")
          }
        >
          🎯 ماموریت ما
        </button>

        <button
          type="button"
          onClick={() => setTab("vision")}
          className={
            "rounded-full border px-6 py-2.5 text-sm font-bold transition md:text-base " +
            (tab === "vision"
              ? "border-accent bg-accent text-white shadow-lg shadow-accent/20"
              : "border-theme bg-transparent text-theme-muted hover:border-accent/50 hover:text-accent")
          }
        >
          🔭 چشم‌انداز ما
        </button>
      </div>

      {tab === "mission" ? (
        <div className="text-center md:text-right">
          <h2 className="mb-4 text-xl font-black text-theme md:text-2xl">
            ماموریت ما
          </h2>
          <p className="text-base leading-8 text-theme-muted">
            دسترسی آسان و مقرون‌به‌صرفه همه علاقه‌مندان به طبیعت به تجهیزات
            باکیفیت و استاندارد جهانی. ما می‌خواهیم هیچ‌کس به خاطر نداشتن
            تجهیزات مناسب، از تجربه کوهستان و کمپینگ محروم نشود.
          </p>
        </div>
      ) : (
        <div className="text-center md:text-right">
          <h2 className="mb-4 text-xl font-black text-theme md:text-2xl">
            چشم‌انداز ما
          </h2>
          <p className="text-base leading-8 text-theme-muted">
            تبدیل شدن به بزرگ‌ترین مرجع تخصصی تجهیزات کوهنوردی و کمپینگ
            در غرب کشور و ارائه خدمات متمایز به مشتریان، با تکیه بر کیفیت،
            اعتماد و پشتیبانی حرفه‌ای.
          </p>
        </div>
      )}
    </>
  );
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-theme">
      <Header />

      <div className="mx-auto max-w-[1400px] px-6 py-8 md:px-12 lg:px-16">
        {/* مسیر ناوبری */}
        <nav className="mb-6 text-sm text-theme-muted">
          <a href="/" className="transition hover:text-accent">
            خانه
          </a>
          <span className="mx-2">/</span>
          <span className="text-theme">درباره ما</span>
        </nav>
      </div>

      {/* AboutSection */}
      <AboutSection />

      <div className="mx-auto max-w-[1400px] px-6 py-8 md:px-12 lg:px-16">
        {/* آمار */}
        <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { number: "۱۰,۰۰۰+", label: "مشتری راضی" },
            { number: "۵۰۰+", label: "محصول متنوع" },
            { number: "۲۰+", label: "برند معتبر" },
            { number: "۳ سال", label: "سابقه فعالیت" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-theme bg-theme-card p-6 text-center"
            >
              <div className="text-2xl font-black text-accent md:text-3xl">
                {stat.number}
              </div>
              <div className="mt-2 text-sm font-semibold text-theme-muted">
                {stat.label}
              </div>
            </div>
          ))}
        </section>

        {/* چرا ما */}
        <section className="mt-8 rounded-2xl border border-theme bg-theme-card p-6 md:p-12">
          <h2 className="text-center text-xl font-bold text-theme md:text-2xl">
            چرا کاو کمپ؟
          </h2>

          {/* موبایل: آکاردئون */}
          <div className="mt-6 space-y-2 md:hidden">
            {[
              {
                icon: "🏔️",
                title: "تنوع بی‌نظیر",
                text: "از چادر و کوله‌پشتی تا کوچک‌ترین ابزار فنی، همه چیز در یک جا.",
              },
              {
                icon: "🛡️",
                title: "تضمین اصالت",
                text: "همه محصولات با گارانتی اصالت و سلامت کالا ارائه می‌شوند.",
              },
              {
                icon: "💬",
                title: "مشاوره تخصصی",
                text: "تیم ما آماده است تا قبل از خرید، بهترین انتخاب را به شما پیشنهاد دهد.",
              },
            ].map((item) => (
              <details
                key={item.title}
                className="group overflow-hidden rounded-xl border border-theme bg-theme-surface"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-accent text-lg">
                      {item.icon}
                    </span>
                    <span className="text-sm font-bold text-theme">
                      {item.title}
                    </span>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.2}
                    stroke="currentColor"
                    className="h-4 w-4 flex-shrink-0 text-theme-muted transition-transform duration-300 group-open:rotate-180"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </summary>
                <div className="border-t border-theme px-4 py-3 text-sm leading-7 text-theme-muted">
                  {item.text}
                </div>
              </details>
            ))}
          </div>

          {/* دسکتاپ */}
          <div className="mt-8 hidden gap-6 md:grid md:grid-cols-3">
            {[
              {
                icon: "🏔️",
                title: "تنوع بی‌نظیر",
                text: "از چادر و کوله‌پشتی تا کوچک‌ترین ابزار فنی، همه چیز در یک جا.",
              },
              {
                icon: "🛡️",
                title: "تضمین اصالت",
                text: "همه محصولات با گارانتی اصالت و سلامت کالا ارائه می‌شوند.",
              },
              {
                icon: "💬",
                title: "مشاوره تخصصی",
                text: "تیم ما آماده است تا قبل از خرید، بهترین انتخاب را به شما پیشنهاد دهد.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-theme bg-theme-surface p-6 text-center"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent text-3xl">
                  {item.icon}
                </div>
                <h3 className="mt-4 text-base font-bold text-theme">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-theme-muted">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ماموریت و چشم‌انداز — تب */}
        <section className="mt-8 rounded-2xl border border-theme bg-theme-card p-6 md:p-10">
          <MissionVisionTabs />
        </section>
      </div>

      {/* اعضای تیم */}
      <TeamSection />

      {/* CTA */}
      <div className="mx-auto max-w-[1400px] px-6 py-8 md:px-12 lg:px-16">
        <section className="rounded-2xl bg-accent p-8 text-center text-white md:p-12">
          <h2 className="text-2xl font-bold md:text-3xl">
            آماده شروع یک ماجراجویی هستید؟
          </h2>
          <p className="mt-4 text-base text-white/90 md:text-lg">
            همین حالا فروشگاه ما را مرور کنید یا با ما تماس بگیرید
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="/products"
              className="rounded-lg bg-white px-8 py-3 text-base font-bold text-accent transition hover:bg-white/90"
            >
              مشاهده محصولات
            </a>
            <a
              href="/contact"
              className="rounded-lg border-2 border-white/60 bg-white/10 px-8 py-3 text-base font-bold text-white transition hover:bg-white/20"
            >
              تماس با ما
            </a>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}