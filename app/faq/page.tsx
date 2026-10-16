"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const faqs = [
  {
    q: "چطور مطمئن شوم چادر یا تجهیزات کمپینگ مناسب نیاز من هستند؟",
    a: "برای انتخاب صحیح، باید به تعداد نفرات، فصل استفاده، نوع سفر (کمپینگ خانوادگی، طبیعت‌گردی، آفرود، کوهنوردی و…) و شرایط آب‌وهوایی توجه کنید. در توضیحات هر محصول مشخصات کامل درج شده و در صورت نیاز می‌توانید از مشاوره تخصصی فروشگاه استفاده کنید.",
  },
  {
    q: "آیا محصولات اصل هستند؟",
    a: "بله، تمامی کالاهای فروشگاه با ضمانت اصالت ارائه می‌شوند و برند، مدل و مشخصات فنی هر محصول به‌صورت شفاف ذکر شده است.",
  },
  {
    q: "ارسال سفارش‌ها چقدر زمان می‌برد؟",
    a: "زمان ارسال بسته به شهر مقصد متفاوت است، اما معمولاً سفارش‌ها بین ۳ تا ۶ روز کاری تحویل داده می‌شوند. سفارش‌ها در سریع‌ترین زمان ممکن پردازش و ارسال خواهند شد.",
  },
  {
    q: "آیا امکان تحویل یک روزه وجود دارد؟",
    a: "بسته به شهر مقصد و شرکت حمل‌ونقل، امکان پرداخت یک روزه برای برخی سفارش‌ها فعال است. اما برای این مورد حتماً قبل از ثبت سفارش با پشتیبانی به شماره تماس ۰۹۱۸-۵۴۶-۲۵۲۶ تماس حاصل فرمایید.",
  },
  {
    q: "اگر محصولی مشکل داشت یا مناسب نبود، امکان مرجوعی وجود دارد؟",
    a: "بله، در صورت وجود ایراد فنی یا مغایرت کالا با سفارش، امکان بازگشت کالا طبق شرایط و قوانین فروشگاه وجود دارد.",
  },
  {
    q: "تفاوت چادرهای اتوماتیک، عصایی و بادی چیست؟",
    a: "چادرهای اتوماتیک سریع‌تر نصب می‌شوند، چادرهای عصایی معمولاً سبک‌تر و حرفه‌ای‌تر هستند و چادرهای بادی فضای بزرگ‌تر و راحتی بیشتری برای کمپ‌های خانوادگی فراهم می‌کنند.",
  },
  {
    q: "چه تجهیزاتی برای شروع کمپینگ لازم است؟",
    a: "برای شروع، معمولاً چادر، زیرانداز یا تشک، کیسه خواب، چراغ کمپ، صندلی و تجهیزات پخت‌وپز ضروری‌ترین اقلام هستند. انتخاب تجهیزات به نوع سفر و مدت اقامت بستگی دارد.",
  },
  {
    q: "آیا محصولات دارای گارانتی هستند؟",
    a: "خیر، کالاها به دلیل وارداتی بودن دارای گارانتی شرکتی نیستند اما فروشگاه سلامت و اصالت کالاها را ضمانت می‌کند.",
  },
  {
    q: "چگونه سایز مناسب کیسه خواب یا چادر را انتخاب کنم؟",
    a: "ابعاد دقیق محصولات در توضیحات هر کالا درج شده است. پیشنهاد می‌شود همیشه چادری با ظرفیت بیشتر از تعداد نفرات واقعی انتخاب کنید تا فضای راحت‌تری داشته باشید.",
  },
  {
    q: "آیا امکان مشاوره قبل از خرید وجود دارد؟",
    a: "بله، تیم پشتیبانی فروشگاه آماده راهنمایی برای انتخاب بهترین تجهیزات متناسب با بودجه، نوع سفر و نیاز شماست.",
  },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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
          <span className="inline-block rounded-full border border-theme bg-theme-surface px-5 py-2 text-sm font-semibold text-theme">
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

        {/* لیست سوالات */}
        <div className="mx-auto max-w-4xl">
          <div className="overflow-hidden rounded-2xl border border-theme bg-theme-card">
            {/* هدر کارت */}
            <div className="flex items-center gap-3 border-b border-theme bg-theme-surface px-6 py-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-xl text-white">
                ❓
              </span>
              <h2 className="text-base font-bold text-theme">
                پرسش‌های متداول
              </h2>
            </div>

            {/* آیتم‌ها */}
            <div>
              {faqs.map((item, i) => {
                const isOpen = openIndex === i;

                return (
                  <div
                    key={i}
                    className="border-b border-theme last:border-0"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      className="flex w-full items-center justify-between gap-4 px-6 py-4 text-right transition hover:bg-theme-surface"
                    >
                      <span className="flex flex-1 items-start gap-3">
                        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-theme-surface text-xs font-black text-theme-muted">
                          {i + 1}
                        </span>
                        <span className="flex-1 text-sm font-bold text-theme md:text-base">
                          {item.q}
                        </span>
                      </span>
                      <span
                        className={
                          "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-base font-bold transition " +
                          (isOpen
                            ? "rotate-180 bg-zinc-900 text-white"
                            : "bg-theme-surface text-theme-muted")
                        }
                      >
                        ⌄
                      </span>
                    </button>

                    {isOpen && (
                      <div className="border-t border-theme bg-theme-surface px-6 py-4 pr-16">
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
        </div>

        {/* CTA تماس */}
        <div className="mx-auto mt-8 max-w-4xl rounded-2xl bg-zinc-900 p-8 text-center text-white">
          <h2 className="text-xl font-bold md:text-2xl">
            پاسخ سوال خود را پیدا نکردید؟
          </h2>
          <p className="mt-3 text-base text-zinc-300">
            تیم پشتیبانی ما آماده کمک به شماست
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href="/contact"
              className="rounded-lg bg-white px-6 py-3 text-sm font-bold text-zinc-900 transition hover:bg-zinc-100"
            >
              ارسال پیام
            </a>
            <a
              href="tel:09180540019"
              dir="ltr"
              className="rounded-lg border-2 border-white/40 bg-transparent px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
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