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
    <section dir="rtl" className="w-full px-3 py-10 sm:px-6 md:px-7 md:py-14">
      <div className="bg-white px-6 py-10 md:px-10 md:py-12">
        <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2 md:gap-10">
          {/* ─── متن ─── */}
          <div className="text-right">
            <h2 className="text-lg font-black tracking-tight text-black md:text-xl lg:text-2xl">
              عضویت و دریافت ۱۵٪ تخفیف
            </h2>
            <p className="mt-3 max-w-md text-[13px] leading-6 text-black/70 md:text-[14px] md:leading-7">
              برای دریافت تخفیف‌های ویژه، نکات کمپینگ و جدیدترین اخبار فروشگاه،
              ایمیل خود را وارد کنید.
            </p>
          </div>

          {/* ─── فرم / پیام موفقیت ─── */}
          <div className="w-full">
            {submitted ? (
              <div className="flex items-center justify-center gap-3 border border-black/20 bg-white px-5 py-4 md:justify-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="h-5 w-5 text-black"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
                <p className="text-[13px] font-bold text-black md:text-[14px]">
                  با موفقیت عضو شدید!
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex w-full flex-col gap-2 sm:flex-row"
              >
                <input
                  type="email"
                  required
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="آدرس ایمیل..."
                  className="flex-1 rounded-none border border-black/20 bg-white px-4 py-3 text-[13px] text-black placeholder:text-black/40 outline-none transition focus:border-black md:text-[14px]"
                />
                <button
                  type="submit"
                  className="rounded-none bg-black px-6 py-3 text-[13px] font-bold text-white transition hover:bg-zinc-800 md:text-[14px]"
                >
                  عضویت
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}