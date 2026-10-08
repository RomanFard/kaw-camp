import Header from "@/components/Header";
import Footer from "@/components/Footer";

const warrantyTypes = [
  {
    icon: "✅",
    title: "ضمانت اصالت کالا",
    duration: "برای همه محصولات",
    desc: "تمامی محصولات کاو کمپ دارای ضمانت اصالت و سلامت فیزیکی هستند. کالا دقیقاً مطابق تصاویر و توضیحات مندرج در سایت به شما تحویل داده می‌شود.",
  },
  {
    icon: "🔍",
    title: "کنترل کیفیت پیش از ارسال",
    duration: "قبل از ارسال",
    desc: "پیش از ارسال، تیم کنترل کیفیت کاو کمپ محصول را بررسی می‌کند تا از سلامت فیزیکی و عملکرد صحیح آن اطمینان حاصل شود.",
  },
  {
    icon: "📅",
    title: "مهلت تست ۳ روزه",
    duration: "۳ روز پس از دریافت",
    desc: "پس از دریافت کالا، تا ۳ روز فرصت دارید محصول را بررسی کنید. در صورت وجود ایراد یا مشکل، امکان مرجوعی و تعویض کالا وجود دارد.",
  },
];

const notCovered = [
  "آسیب‌های ناشی از استفاده نادرست یا سهل‌انگاری مشتری",
  "خرابی‌های ناشی از حوادث طبیعی (آتش، سیل، زلزله)",
  "تغییرات ظاهری ناشی از استفاده معمول (خط و خش)",
  "باز کردن یا تعمیر توسط افراد غیرمجاز",
  "استفاده در شرایط خارج از محدوده تعیین‌شده توسط سازنده",
  "کالاهای مصرفی مانند باتری، فیلتر و لامپ",
];

const steps = [
  {
    num: "۱",
    title: "ثبت درخواست",
    desc: "با پشتیبانی کاو کمپ تماس بگیرید و مشکل را توضیح دهید.",
  },
  {
    num: "۲",
    title: "بررسی کارشناس",
    desc: "کارشناس ما مشکل را بررسی و راه‌حل مناسب ارائه می‌دهد.",
  },
  {
    num: "۳",
    title: "ارسال یا مراجعه",
    desc: "در صورت نیاز، کالا را برای بررسی ارسال یا حضوری مراجعه کنید.",
  },
  {
    num: "۴",
    title: "تعویض یا بازگشت وجه",
    desc: "پس از تایید مشکل، کالا تعویض یا مبلغ طبق توافق بازگردانده می‌شود.",
  },
];

export default function WarrantyPage() {
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
          <span className="text-theme">گارانتی</span>
        </nav>

        {/* هدر صفحه */}
        <div className="mb-8 rounded-2xl border border-theme bg-theme-card p-8 text-center md:p-12">
          <span className="inline-block rounded-full border border-accent/30 bg-accent/5 px-5 py-2 text-sm font-semibold text-accent">
            ضمانت و خدمات پس از فروش
          </span>
          <h1 className="mt-5 text-2xl font-bold text-theme md:text-3xl">
            خیالتان از خرید راحت باشد
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-theme-muted">
            تمام محصولات کاو کمپ دارای ضمانت اصالت و سلامت کالا هستند. در صورت
            بروز مشکل، تیم پشتیبانی ما در کنار شماست.
          </p>
        </div>

        {/* انواع ضمانت */}
        <div className="mb-8">
          <h2 className="mb-5 text-lg font-bold text-theme">انواع ضمانت</h2>

          <div className="grid gap-4 md:grid-cols-3">
            {warrantyTypes.map((w, i) => (
              <div
                key={i}
                className="rounded-2xl border border-theme bg-theme-card p-6 transition hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-3xl">
                    {w.icon}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-theme">
                      {w.title}
                    </h3>
                    <span className="text-xs font-semibold text-accent">
                      {w.duration}
                    </span>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-theme-muted">
                  {w.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* مراحل استفاده از ضمانت */}
        <div className="mb-8 rounded-2xl border border-theme bg-theme-card p-6 md:p-8">
          <h2 className="mb-6 text-lg font-bold text-theme">
            مراحل استفاده از ضمانت
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

        {/* مواردی که گارانتی را باطل می‌کند */}
        <div className="mb-8 rounded-2xl border border-theme bg-theme-card p-6 md:p-8">
          <h2 className="mb-5 flex items-center gap-3 text-lg font-bold text-theme">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 text-xl">
              ❌
            </span>
            مواردی که گارانتی را باطل می‌کند
          </h2>

          <ul className="grid gap-3 md:grid-cols-2">
            {notCovered.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/5 p-4"
              >
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  ✕
                </span>
                <span className="text-sm leading-6 text-theme-muted">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* نکته مهم */}
        <div className="mb-8 rounded-2xl border border-accent/30 bg-accent/5 p-6 md:p-8">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-accent text-2xl text-white">
              💡
            </span>
            <div>
              <h3 className="text-base font-bold text-accent">نکته مهم</h3>
              <p className="mt-2 text-sm leading-7 text-theme">
                برای استفاده از ضمانت، حتماً فاکتور خرید و بسته‌بندی اصلی کالا
                را نگه دارید. بدون این موارد، امکان بررسی ضمانت وجود ندارد.
                هزینه‌های بازگشت کالا طبق توافق طرفین محاسبه خواهد شد.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl bg-accent p-8 text-center text-white">
          <h2 className="text-xl font-bold md:text-2xl">مشکل یا سوالی دارید؟</h2>
          <p className="mt-3 text-base text-white/90">
            کارشناسان پشتیبانی کاو کمپ آماده کمک به شماست
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href="/contact"
              className="rounded-lg bg-white px-6 py-3 text-sm font-bold text-accent transition hover:bg-white/90"
            >
              تماس با ما
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