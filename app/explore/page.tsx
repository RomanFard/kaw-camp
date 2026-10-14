"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ExplorePage() {
  return (
    <main className="min-h-screen bg-theme">
      <Header />

      <section className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          {/* آیکون */}
          <div className="mb-8 flex justify-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-accent/10">
              <span className="text-5xl">🚙</span>
            </div>
          </div>

          {/* تیتر */}
          <h1 className="mb-4 text-4xl font-black leading-tight text-theme md:text-6xl">
            آفرود و تور
          </h1>

          <div className="mb-8 inline-flex items-center gap-2 rounded-full border-2 border-accent bg-accent/10 px-6 py-3">
            <span className="text-2xl">⏳</span>
            <span className="text-lg font-black text-accent">
              به زودی
            </span>
          </div>

          {/* توضیح */}
          <p className="mx-auto mb-10 max-w-lg text-base leading-7 text-theme-muted md:text-lg">
            به‌زودی می‌تونید تورهای آفرود، کوهنوردی و کمپینگ رو با لیدرهای
            حرفه‌ای و تجهیزات کامل از کاو کمپ رزرو کنید.
          </p>

          {/* CTA */}
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-4 text-base font-bold text-white shadow-lg transition hover:bg-accent-hover"
            >
              <span>🛍</span>
              <span>مشاهده محصولات</span>
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-theme bg-theme-card px-8 py-4 text-base font-bold text-theme transition hover:border-accent hover:text-accent"
            >
              <span>🏠</span>
              <span>بازگشت به خانه</span>
            </Link>
          </div>

          {/* پیام کوچیک */}
          <p className="mt-12 text-sm text-theme-muted">
            برای اطلاع از زمان راه‌اندازی، ما رو در{" "}
            <a
              href="https://www.instagram.com/kawcamp"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-accent underline underline-offset-4"
            >
              اینستاگرام
            </a>{" "}
            دنبال کنید.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}