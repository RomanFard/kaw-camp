import Header from "@/components/Header";
import Footer from "@/components/Footer";

const conditions = [
  {
    icon: "⏱️",
    title: "مهلت ۲ روزه",
    desc: "حداکثر تا ۲ روز پس از دریافت سفارش، موضوع را به پشتیبانی اطلاع دهید.",
  },
  {
    icon: "⚠️",
    title: "موارد پذیرش",
    desc: "ایراد فنی، آسیب‌دیدگی در حمل‌ونقل یا مغایرت کالا با سفارش ثبت‌شده.",
  },
  {
    icon: "📦",
    title: "شرایط کالا",
    desc: "کالا باید در شرایط اولیه، همراه با بسته‌بندی و متعلقات کامل باشد.",
  },
  {
    icon: "🔍",
    title: "بررسی کارشناسان",
    desc: "درخواست شما در سریع‌ترین زمان ممکن توسط کارشناسان بررسی می‌شود.",
  },
];

const steps = [
  {
    num: "۱",
    title: "اطلاع به پشتیبانی",
    desc: "حداکثر تا ۲ روز پس از دریافت سفارش، موضوع را به تیم پشتیبانی اطلاع دهید.",
  },
  {
    num: "۲",
    title: "بررسی درخواست",
    desc: "درخواست شما در سریع‌ترین زمان ممکن بررسی و تأیید می‌شود.",
  },
  {
    num: "۳",
    title: "بازگرداندن کالا",
    desc: "کالا را در شرایط اولیه، همراه با بسته‌بندی و متعلقات کامل بازگردانید.",
  },
  {
    num: "۴",
    title: "بازگشت وجه یا تعویض",
    desc: "پس از تأیید کارشناسان، مبلغ در کوتاه‌ترین زمان بازگردانده یا کالا تعویض می‌شود.",
  },
];

export default function ReturnsPage() {
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
          <span className="text-theme">بازگشت کالا</span>
        </nav>

        {/* هدر صفحه */}
        <div className="mb-8 rounded-2xl border border-theme bg-theme-card p-8 text-center md:p-12">
          <span className="inline-block rounded-full border border-accent/30 bg-accent/5 px-5 py-2 text-sm font-semibold text-accent">
            رویه بازگشت کالا
          </span>
          <h1 className="mt-5 text-2xl font-bold text-theme md:text-3xl">
            شرایط و مقررات بازگرداندن کالا
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-theme-muted">
            رضایت و آرامش خاطر مشتریان برای ما اهمیت زیادی دارد، به همین دلیل
            در صورت وجود ایراد فنی، آسیب‌دیدگی در حمل‌ونقل یا مغایرت کالا با
            سفارش ثبت‌شده، امکان بررسی و استرداد کالا فراهم است.
          </p>
        </div>

        {/* شرایط بازگشت */}
        <div className="mb-8">
          <h2 className="mb-5 text-lg font-bold text-theme">
            شرایط بازگشت کالا
          </h2>

          <div className="grid gap-4 md:grid-cols-4">
            {conditions.map((cond, i) => (
              <div
                key={i}
                className="rounded-2xl border border-theme bg-theme-card p-6 text-center transition hover:shadow-md"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-3xl">
                  {cond.icon}
                </div>
                <h3 className="mt-4 text-base font-bold text-theme">
                  {cond.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-theme-muted">
                  {cond.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* مراحل بازگشت */}
        <div className="mb-8 rounded-2xl border border-theme bg-theme-card p-6 md:p-8">
          <h2 className="mb-6 text-lg font-bold text-theme">
            مراحل بازگشت کالا
          </h2>

          <div className="grid gap-6 md:grid-cols-4">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                {i < steps.length - 1 && (
                  <div className="absolute right-0 top-7 hidden h-0.5 w-1/2 translate-x-1/2 bg-theme md:block"></div>
                )}

                <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent text-xl font-black text-white shadow-md">
                  {step.num}
                </div>

                <div className="mt-4 text-center">
                  <div className="text-sm font-bold text-theme">
                    {step.title}
                  </div>
                  <p className="mt-2 text-xs leading-6 text-theme-muted">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* متن کامل */}
        <div className="mb-8 rounded-2xl border border-theme bg-theme-card p-6 md:p-8">
          <h2 className="mb-5 text-lg font-bold text-theme">توضیحات کامل</h2>

          <div className="space-y-4 text-sm leading-8 text-theme-muted md:text-base md:leading-9">
            <p>
              رضایت و آرامش خاطر مشتریان برای ما اهمیت زیادی دارد، به همین
              دلیل در صورت وجود ایراد فنی، آسیب‌دیدگی در حمل‌ونقل یا مغایرت
              کالا با سفارش ثبت‌شده، امکان بررسی و استرداد کالا فراهم است.
              کافی است حداکثر تا ۲ روز پس از دریافت سفارش، موضوع را به تیم
              پشتیبانی اطلاع دهید تا درخواست شما در سریع‌ترین زمان ممکن بررسی
              شود. کالا باید در شرایط اولیه، همراه با بسته‌بندی و متعلقات کامل
              بازگردانده شود.
            </p>

            <p>
              ما تلاش می‌کنیم فرآیند بازگشت کالا تا حد امکان ساده، شفاف و
              بدون دغدغه باشد. پس از تأیید کارشناسان، مبلغ پرداختی در
              کوتاه‌ترین زمان به حساب مشتری بازگردانده خواهد شد یا در صورت
              تمایل، کالا تعویض می‌شود. هدف ما ایجاد تجربه‌ای مطمئن و
              رضایت‌بخش از خرید تجهیزات کمپینگ و سفر برای شماست.
            </p>
          </div>
        </div>

        {/* هشدار */}
        <div className="mb-8 rounded-2xl border border-accent/30 bg-accent/5 p-6 md:p-8">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-accent text-2xl text-white">
              ⚠️
            </span>
            <div>
              <h3 className="text-base font-bold text-accent">توجه مهم</h3>
              <p className="mt-2 text-sm leading-7 text-theme">
                پیش از ارسال کالا، حتماً با پشتیبانی تماس بگیرید و موضوع را
                اطلاع دهید. کالا باید در شرایط اولیه، همراه با بسته‌بندی و
                متعلقات کامل بازگردانده شود.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl bg-zinc-900 p-8 text-center text-white">
          <h2 className="text-xl font-bold md:text-2xl">
            نیاز به راهنمایی دارید؟
          </h2>
          <p className="mt-3 text-base text-zinc-300">
            کارشناسان ما آماده پاسخگویی به شما هستند
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href="/contact"
              className="rounded-lg bg-white px-6 py-3 text-sm font-bold text-zinc-900 transition hover:bg-zinc-100"
            >
              تماس با ما
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