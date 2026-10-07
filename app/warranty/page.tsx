import Header from "@/components/Header";
import Footer from "@/components/Footer";

const warrantyTypes = [
  {
    icon: "✅",
    title: "گارانتی اصالت کالا",
    duration: "برای همه محصولات",
    desc: "همه محصولات کاو کمپ دارای گارانتی اصالت و سلامت فیزیکی هستند. کالا دقیقاً همان چیزی است که در سایت توصیف شده.",
    color: "green",
  },
  {
    icon: "🛡️",
    title: "گارانتی شرکتی",
    duration: "۶ تا ۲۴ ماه",
    desc: "برخی محصولات دارای گارانتی رسمی شرکت واردکننده یا تولیدکننده هستند که مدت آن در صفحه محصول درج شده است.",
    color: "blue",
  },
  {
    icon: "🔧",
    title: "گارانتی تعمیر",
    duration: "متغیر",
    desc: "برای محصولات فنی مانند اجاق‌ها، چراغ‌ها و ساعت‌ها، امکان تعمیر رایگان در دوره گارانتی وجود دارد.",
    color: "amber",
  },
];

const notCovered = [
  "آسیب‌های ناشی از استفاده نادرست یا سهل‌انگاری",
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
    desc: "با پشتیبانی تماس بگیرید و مشکل را توضیح دهید.",
  },
  {
    num: "۲",
    title: "بررسی کارشناس",
    desc: "کارشناس ما مشکل را بررسی و راه‌حل ارائه می‌دهد.",
  },
  {
    num: "۳",
    title: "ارسال یا مراجعه",
    desc: "در صورت نیاز، کالا را برای بررسی ارسال کنید.",
  },
  {
    num: "۴",
    title: "تعمیر یا تعویض",
    desc: "پس از تایید، کالا تعمیر، تعویض یا مبلغ بازگردانده می‌شود.",
  },
];

export default function WarrantyPage() {
  return (
    <main className="min-h-screen bg-[#F7F1E3]">
      <Header />

      <div className="mx-auto max-w-[1600px] px-6 py-8">
        {/* مسیر ناوبری */}
        <nav className="mb-6 text-sm text-gray-500">
          <a href="/" className="hover:text-amber-600">خانه</a>
          <span className="mx-2">/</span>
          <span className="text-gray-800">گارانتی</span>
        </nav>

        {/* هدر صفحه */}
        <div className="mb-8 rounded-2xl border border-[#D4C5A0] bg-white p-8 text-center md:p-12">
          <span className="inline-block rounded-full bg-amber-50 px-5 py-2 text-sm font-semibold text-amber-600">
            گارانتی و خدمات پس از فروش
          </span>
          <h1 className="mt-5 text-2xl font-bold text-gray-900 md:text-3xl">
            خیالتان از خرید راحت باشد
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-gray-600">
            تمام محصولات کاو کمپ دارای گارانتی اصالت و سلامت کالا هستند. در صورت
            بروز مشکل، تیم پشتیبانی ما در کنار شماست.
          </p>
        </div>

        {/* انواع گارانتی */}
        <div className="mb-8">
          <h2 className="mb-5 text-lg font-bold text-gray-800">
            انواع گارانتی
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            {warrantyTypes.map((w, i) => (
              <div
                key={i}
                className="rounded-2xl border border-[#D4C5A0] bg-white p-6 transition hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-3xl">
                    {w.icon}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-gray-800">
                      {w.title}
                    </h3>
                    <span className="text-xs font-semibold text-amber-600">
                      {w.duration}
                    </span>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-gray-600">
                  {w.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* مراحل استفاده از گارانتی */}
        <div className="mb-8 rounded-2xl border border-[#D4C5A0] bg-white p-6 md:p-8">
          <h2 className="mb-6 text-lg font-bold text-gray-800">
            مراحل استفاده از گارانتی
          </h2>

          <div className="grid gap-6 md:grid-cols-4">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                {i < steps.length - 1 && (
                  <div className="absolute right-0 top-7 hidden h-0.5 w-1/2 translate-x-1/2 bg-[#E8DFC8] md:block"></div>
                )}

                <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 text-xl font-black text-white shadow-md">
                  {step.num}
                </div>

                <div className="mt-4 text-center">
                  <div className="text-sm font-bold text-gray-800">
                    {step.title}
                  </div>
                  <p className="mt-2 text-xs leading-6 text-gray-600">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* مواردی که گارانتی را باطل می‌کند */}
        <div className="mb-8 rounded-2xl border border-[#D4C5A0] bg-white p-6 md:p-8">
          <h2 className="mb-5 flex items-center gap-3 text-lg font-bold text-gray-800">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-xl">
              ❌
            </span>
            مواردی که گارانتی را باطل می‌کند
          </h2>

          <ul className="grid gap-3 md:grid-cols-2">
            {notCovered.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-lg border border-red-100 bg-red-50/50 p-4"
              >
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  ✕
                </span>
                <span className="text-sm leading-6 text-gray-700">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* هشدار */}
        <div className="mb-8 rounded-2xl border-2 border-amber-200 bg-amber-50 p-6 md:p-8">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-amber-500 text-2xl text-white">
              💡
            </span>
            <div>
              <h3 className="text-base font-bold text-amber-800">
                نکته مهم
              </h3>
              <p className="mt-2 text-sm leading-7 text-amber-700">
                برای استفاده از گارانتی، حتماً فاکتور خرید و بسته‌بندی اصلی کالا
                را نگه دارید. بدون این موارد، امکان بررسی گارانتی وجود ندارد.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl bg-gradient-to-l from-amber-600 to-amber-500 p-8 text-center text-white">
          <h2 className="text-xl font-bold md:text-2xl">
            مشکل یا سوالی دارید؟
          </h2>
          <p className="mt-3 text-base text-white/90">
            کارشناسان گارانتی ما آماده کمک به شماست
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href="/contact"
              className="rounded-lg bg-white px-6 py-3 text-sm font-bold text-amber-600 transition hover:bg-amber-50"
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