"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const faqs = [
  {
    category: "خرید و سفارش",
    icon: "🛒",
    items: [
      {
        q: "چطور می‌توانم سفارش ثبت کنم؟",
        a: "کافیست محصول مورد نظر را به سبد خرید اضافه کنید و پس از تکمیل سبد، روی دکمه «تسویه حساب» کلیک کنید. سپس اطلاعات خود را وارد کرده و پرداخت را انجام دهید.",
      },
      {
        q: "آیا می‌توانم سفارش خود را لغو کنم؟",
        a: "تا قبل از ارسال سفارش، امکان لغو وجود دارد. کافیست با پشتیبانی تماس بگیرید. پس از ارسال، لغو سفارش امکان‌پذیر نیست ولی می‌توانید از حق بازگشت کالا استفاده کنید.",
      },
      {
        q: "حداقل مبلغ سفارش چقدر است؟",
        a: "حداقل مبلغ سفارش ۱۰۰,۰۰۰ تومان است. برای خریدهای بالای ۲ میلیون تومان، ارسال رایگان می‌باشد.",
      },
    ],
  },
  {
    category: "ارسال و تحویل",
    icon: "🚚",
    items: [
      {
        q: "هزینه ارسال چقدر است؟",
        a: "هزینه ارسال ۸۰,۰۰۰ تومان است. برای سفارشات بالای ۲ میلیون تومان ارسال رایگان می‌باشد.",
      },
      {
        q: "چند روز طول می‌کشد سفارش به دستم برسد؟",
        a: "بسته به مقصد، بین ۳ تا ۷ روز کاری. برای شهرهای بزرگ معمولاً ۳ روز و برای شهرهای کوچک تا ۷ روز.",
      },
      {
        q: "آیا امکان تحویل حضوری وجود دارد؟",
        a: "بله، برای مشتریان بانه و اطراف، امکان تحویل حضوری در فروشگاه وجود دارد و هزینه ارسال محاسبه نمی‌شود.",
      },
    ],
  },
  {
    category: "پرداخت",
    icon: "💳",
    items: [
      {
        q: "چه روش‌های پرداختی وجود دارد؟",
        a: "پرداخت آنلاین از طریق درگاه‌های امن بانکی و همچنین پرداخت در محل (برای برخی شهرها).",
      },
      {
        q: "آیا پرداخت امن است؟",
        a: "بله، تمام پرداخت‌ها از طریق درگاه‌های مورد تایید شاپرک و با رمز پویا انجام می‌شود.",
      },
    ],
  },
  {
    category: "بازگشت و گارانتی",
    icon: "↩️",
    items: [
      {
        q: "چند روز فرصت بازگشت کالا دارم؟",
        a: "تا ۷ روز پس از دریافت کالا، در صورت عدم استفاده و سالم بودن بسته‌بندی، می‌توانید کالا را بازگردانید.",
      },
      {
        q: "هزینه ارسال بازگشت با کیست؟",
        a: "در صورت ایراد کالا یا ارسال اشتباه، هزینه بر عهده فروشگاه است. در صورت انصراف از خرید، هزینه بر عهده مشتری.",
      },
      {
        q: "گارانتی محصولات چقدر است؟",
        a: "بسته به نوع محصول متفاوت است. اکثر محصولات دارای گارانتی اصالت و سلامت کالا هستند. جزئیات در صفحه محصول درج شده است.",
      },
    ],
  },
  {
    category: "حساب کاربری",
    icon: "👤",
    items: [
      {
        q: "چطور می‌توانم ثبت‌نام کنم؟",
        a: "روی دکمه «ورود / ثبت‌نام» در بالای صفحه کلیک کنید و با شماره موبایل و رمز عبور، ثبت‌نام کنید.",
      },
      {
        q: "رمز عبورم را فراموش کرده‌ام، چه کنم؟",
        a: "در صفحه ورود، گزینه «ورود با کد یکبار مصرف» را انتخاب کنید. کد از طریق پیامک برای شما ارسال می‌شود.",
      },
    ],
  },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<string | null>("0-0");

  return (
    <main className="min-h-screen bg-theme">
      <Header />

      <div className="mx-auto max-w-[1600px] px-6 py-8">
        {/* مسیر ناوبری */}
        <nav className="mb-6 text-sm text-theme-muted">
          <a href="/" className="transition hover:text-accent">
            خانه
          </a>
          <span className="mx-2">/</span>
          <span className="text-theme">سوالات متداول</span>
        </nav>

        {/* هدر صفحه */}
        <div className="mb-8 rounded-2xl border border-theme bg-theme-card p-8 text-center md:p-12">
          <span className="inline-block rounded-full border border-accent/30 bg-accent/5 px-5 py-2 text-sm font-semibold text-accent">
            سوالات متداول
          </span>
          <h1 className="mt-5 text-2xl font-bold text-theme md:text-3xl">
            پاسخ سوالات پرتکرار شما
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-theme-muted">
            اگر سوالی دارید، ابتدا اینجا را بررسی کنید. اگر پاسخ سوال خود را
            پیدا نکردید، با ما تماس بگیرید.
          </p>
        </div>

        {/* بخش سوالات */}
        <div className="mx-auto max-w-4xl space-y-6">
          {faqs.map((group, gi) => (
            <div
              key={gi}
              className="overflow-hidden rounded-2xl border border-theme bg-theme-card"
            >
              {/* عنوان دسته */}
              <div className="flex items-center gap-3 border-b border-theme bg-theme-surface px-6 py-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-xl text-white">
                  {group.icon}
                </span>
                <h2 className="text-base font-bold text-theme">
                  {group.category}
                </h2>
              </div>

              {/* آیتم‌ها */}
              <div>
                {group.items.map((item, ii) => {
                  const key = `${gi}-${ii}`;
                  const isOpen = openIndex === key;

                  return (
                    <div
                      key={ii}
                      className="border-b border-theme last:border-0"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenIndex(isOpen ? null : key)}
                        className="flex w-full items-center justify-between gap-4 px-6 py-4 text-right transition hover:bg-theme-surface"
                      >
                        <span className="flex-1 text-sm font-bold text-theme md:text-base">
                          {item.q}
                        </span>
                        <span
                          className={
                            "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-base font-bold transition " +
                            (isOpen
                              ? "rotate-180 bg-accent text-white"
                              : "bg-theme-surface text-accent")
                          }
                        >
                          ⌄
                        </span>
                      </button>

                      {isOpen && (
                        <div className="border-t border-theme bg-theme-surface px-6 py-4">
                          <p className="text-sm leading-7 text-theme-muted">
                            {item.a}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* CTA تماس */}
        <div className="mx-auto mt-8 max-w-4xl rounded-2xl bg-accent p-8 text-center text-white">
          <h2 className="text-xl font-bold md:text-2xl">
            پاسخ سوال خود را پیدا نکردید؟
          </h2>
          <p className="mt-3 text-base text-white/90">
            تیم پشتیبانی ما آماده کمک به شماست
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href="/contact"
              className="rounded-lg bg-white px-6 py-3 text-sm font-bold text-accent transition hover:bg-white/90"
            >
              ارسال پیام
            </a>
            <a
              href="tel:09180540019"
              dir="ltr"
              className="rounded-lg border-2 border-white/60 bg-white/10 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/20"
            >
              ۰۹۱۸-۰۵۴-۰۰۱۹
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}