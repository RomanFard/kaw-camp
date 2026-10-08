"use client";

import { useState } from "react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setEmail("");
    }, 3000);
  }

  return (
    <section dir="rtl" className="overflow-hidden py-12 md:py-16">
      {/* ═══ کادر تمام‌عرض — از لبه تا لبه ═══ */}
      <div className="relative w-full overflow-hidden bg-theme-card px-6 py-14 text-center md:py-20">
        {/* گرادیان پس‌زمینه */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute -right-32 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full blur-[120px]"
            style={{ backgroundColor: "var(--accent)", opacity: 0.15 }}
          />
          <div
            className="absolute -left-32 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full blur-[120px]"
            style={{ backgroundColor: "var(--accent)", opacity: 0.1 }}
          />
        </div>

        {/* محتوا */}
        <div className="relative z-10 mx-auto max-w-[1400px] px-4 md:px-12 lg:px-16">
          <h2 className="text-3xl font-black tracking-tight md:text-4xl lg:text-5xl">
            <span className="text-theme">در جریان </span>
            <span className="text-accent">باش</span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm text-theme-muted md:text-base">
            برای دریافت تخفیف‌های ویژه، نکات کمپینگ و جدیدترین اخبار فروشگاه
            مشترک شوید.
          </p>

          {submitted ? (
            <div className="mx-auto mt-8 flex max-w-md items-center justify-center gap-3 rounded-2xl border border-accent/30 bg-accent/5 px-6 py-4">
              <span className="text-2xl">✅</span>
              <p className="text-sm font-bold text-accent md:text-base">
                با موفقیت عضو شدید!
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                required
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="آدرس ایمیل خود را وارد کنید..."
                className="w-full flex-1 rounded-full border border-theme bg-theme-surface px-5 py-3.5 text-sm text-theme outline-none transition focus:border-accent"
              />
              <button
                type="submit"
                className="w-full rounded-full bg-accent px-8 py-3.5 text-sm font-bold text-white transition hover:bg-accent-hover sm:w-auto"
              >
                عضویت
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}