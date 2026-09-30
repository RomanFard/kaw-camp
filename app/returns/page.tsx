import Header from "@/components/Header";
import Footer from "@/components/Footer";

const conditions = [
  {
    icon: "📅",
    title: "مهلت ۷ روزه",
    desc: "تا ۷ روز پس از دریافت کالا، فرصت بازگشت دارید.",
  },
  {
    icon: "📦",
    title: "بسته‌بندی سالم",
    desc: "کالا باید در بسته‌بندی اصلی و بدون آسیب باشد.",
  },
  {
    icon: "🔒",
    title: "استفاده نشده",
    desc: "کالا نباید استفاده شده یا شسته شده باشد.",
  },
  {
    icon: "🧾",
    title: "فاکتور خرید",
    desc: "ارائه فاکتور خرید الزامی است.",
  },
];

const steps = [
  {
    num: "۱",
    title: "تماس با پشتیبانی",
    desc: "با شماره ۰۹۱۸-۰۵۴-۰۰۱۹ تماس بگیرید یا از طریق فرم تماس، درخواست بازگشت ثبت کنید.",
  },
  {
    num: "۲",
    title: "تایید درخواست",
    desc: "پس از بررسی، درخواست شما تایید و کد مرجوعی صادر می‌شود.",
  },
  {
    num: "۳",
    title: "ارسال کالا",
    desc: "کالا را در بسته‌بندی مناسب، به آدرس فروشگاه ارسال کنید.",
  },
  {
    num: "۴",
    title: "بازگشت وجه",
    desc: "پس از بررسی و تایید کالا، مبلغ ظرف ۳ روز کاری بازگردانده می‌شود.",
  },
];

export default function ReturnsPage() {
  return (
    <main className="min-h-screen bg-[#F7F1E3]">
      <Header />

      <div className="mx-auto max-w-[1600px] px-6 py-8">
        {/* مسیر ناوبری */}
        <nav className="mb-6 text-sm text-gray-500">
          <a href="/" className="hover:text-amber-600">خانه</a>
          <span className="mx-2">/</span>
          <span className="text-gray-800">بازگشت کالا</span>
        </nav>

        {/* هدر صفحه */}
        <div className="mb-8 rounded-2xl border border-[#E8DFC8] bg-white p-8 text-center md:p-12">
          <span className="inline-block rounded-full bg-amber-50 px-5 py-2 text-sm font-semibold text-amber-600">
            رویه بازگشت کالا
          </span>
          <h1 className="mt-5 text-2xl font-bold text-gray-900 md:text-3xl">
            شرایط بازگشت کالا در کو کمپ
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-gray-600">
            رضایت شما برای ما اولویت دارد. اگر از خرید خود راضی نیستید،
            می‌توانید طبق شرایط زیر کالا را بازگردانید.
          </p>
        </div>

        {/* شرایط بازگشت */}
        <div className="mb-8">
          <h2 className="mb-5 text-lg font-bold text-gray-800">
            شرایط بازگشت کالا
          </h2>

          <div className="grid gap-4 md:grid-cols-4">
            {conditions.map((cond, i) => (
              <div
                key={i}
                className="rounded-2xl border border-[#E8DFC8] bg-white p-6 text-center transition hover:shadow-md"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-3xl">
                  {cond.icon}
                </div>
                <h3 className="mt-4 text-base font-bold text-gray-800">
                  {cond.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-gray-600">
                  {cond.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* مراحل بازگشت */}
        <div className="mb-8 rounded-2xl border border-[#E8DFC8] bg-white p-6 md:p-8">
          <h2 className="mb-6 text-lg font-bold text-gray-800">
            مراحل بازگشت کالا
          </h2>

          <div className="grid gap-6 md:grid-cols-4">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                {/* خط اتصال */}
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

        {/* نکات مهم */}
        <div className="mb-8 rounded-2xl border border-[#E8DFC8] bg-white p-6 md:p-8">
          <h2 className="mb-5 text-lg font-bold text-gray-800">
            نکات مهم
          </h2>

          <ul className="grid gap-4 md:grid-cols-2">
            {[
              "کالاهای زیر نباید بازگشت داده شوند: محصولات بهداشتی باز شده، کالاهای سفارشی‌سازی شده و اقلام حراج نهایی",
              "هزینه ارسال بازگشت در صورت ایراد کالا، بر عهده فروشگاه است",
              "در صورت انصراف از خرید، هزینه ارسال بازگشت بر عهده مشتری است",
              "کالاهایی که آسیب دیده یا استفاده شده باشند، بازگشت داده نمی‌شوند",
              "پس از تایید کارشناسان، مبلغ ظرف ۳ روز کاری به حساب شما واریز می‌شود",
              "امکان تعویض کالا با کالای دیگر نیز وجود دارد",
            ].map((note, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-lg border border-[#EDE4CE] bg-[#F7F1E3]/30 p-4"
              >
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-500 text-xs text-white">
                  ✓
                </span>
                <span className="text-sm leading-6 text-gray-700">{note}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* هشدار */}
        <div className="mb-8 rounded-2xl border-2 border-amber-200 bg-amber-50 p-6 md:p-8">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-amber-500 text-2xl text-white">
              ⚠️
            </span>
            <div>
              <h3 className="text-base font-bold text-amber-800">
                توجه مهم
              </h3>
              <p className="mt-2 text-sm leading-7 text-amber-700">
                پیش از ارسال کالا، حتماً با پشتیبانی تماس بگیرید و کد مرجوعی
                دریافت کنید. کالاهای ارسال شده بدون کد مرجوعی، پذیرفته
                نمی‌شوند.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl bg-gradient-to-l from-amber-600 to-amber-500 p-8 text-center text-white">
          <h2 className="text-xl font-bold md:text-2xl">
            نیاز به راهنمایی دارید؟
          </h2>
          <p className="mt-3 text-base text-white/90">
            کارشناسان ما آماده پاسخگویی به شما هستند
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