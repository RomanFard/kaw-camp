import Header from "@/components/Header";
import Footer from "@/components/Footer";

const steps = [
  {
    icon: "🛒",
    title: "ثبت سفارش",
    desc: "محصولات مورد نظر خود را به سبد خرید اضافه کرده و سفارش را ثبت کنید.",
  },
  {
    icon: "✅",
    title: "تایید سفارش",
    desc: "کارشناسان ما سفارش شما را بررسی و تایید می‌کنند.",
  },
  {
    icon: "📦",
    title: "بسته‌بندی",
    desc: "سفارش شما با دقت و در بسته‌بندی مقاوم آماده‌سازی می‌شود.",
  },
  {
    icon: "🚚",
    title: "ارسال",
    desc: "سفارش از طریق پست پیشتاز یا تیپاکس به آدرس شما ارسال می‌شود.",
  },
  {
    icon: "📍",
    title: "تحویل",
    desc: "سفارش با کد رهگیری پیامک شده، به دست شما می‌رسد.",
  },
];

const shippingMethods = [
  {
    name: "پست پیشتاز",
    icon: "📮",
    time: "۳ تا ۵ روز کاری",
    price: "۸۰,۰۰۰ تومان",
    coverage: "سراسر ایران",
    featured: true,
  },
  {
    name: "تیپاکس (پس‌کرایه)",
    icon: "🚚",
    time: "۲ تا ۴ روز کاری",
    price: "پرداخت در محل",
    coverage: "شهرهای بزرگ",
    featured: false,
  },
  {
    name: "تحویل حضوری",
    icon: "🏪",
    time: "همان روز",
    price: "رایگان",
    coverage: "بانه و اطراف",
    featured: false,
  },
];

export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-[#F7F1E3]">
      <Header />

      <div className="mx-auto max-w-[1600px] px-6 py-8">
        {/* مسیر ناوبری */}
        <nav className="mb-6 text-sm text-gray-500">
          <a href="/" className="hover:text-amber-600">خانه</a>
          <span className="mx-2">/</span>
          <span className="text-gray-800">رویه ارسال</span>
        </nav>

        {/* هدر */}
        <div className="mb-8 rounded-2xl border border-[#D4C5A0] bg-white p-8 text-center md:p-12">
          <span className="inline-block rounded-full bg-amber-50 px-5 py-2 text-sm font-semibold text-amber-600">
            رویه ارسال
          </span>
          <h1 className="mt-5 text-2xl font-bold text-gray-900 md:text-3xl">
            سفارش شما، چگونه به دستتان می‌رسد؟
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-gray-600">
            ما نهایت تلاش خود را می‌کنیم تا سفارش شما سریع، سالم و مطمئن به
            دستتان برسد.
          </p>
        </div>

        {/* مراحل ارسال */}
        <div className="mb-8 rounded-2xl border border-[#D4C5A0] bg-white p-6 md:p-8">
          <h2 className="mb-6 text-lg font-bold text-gray-800">
            مراحل ارسال سفارش
          </h2>

          <div className="grid gap-4 md:grid-cols-5">
            {steps.map((step, i) => (
              <div key={i} className="relative text-center">
                {/* خط اتصال */}
                {i < steps.length - 1 && (
                  <div className="absolute right-0 top-8 hidden h-0.5 w-1/2 translate-x-1/2 bg-[#E8DFC8] md:block"></div>
                )}

                <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500 text-3xl text-white shadow-md">
                  {step.icon}
                </div>

                <div className="mt-4">
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

        {/* روش‌های ارسال */}
        <div className="mb-8">
          <h2 className="mb-5 text-lg font-bold text-gray-800">
            روش‌های ارسال
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            {shippingMethods.map((method, i) => (
              <div
                key={i}
                className={
                  "relative rounded-2xl border bg-white p-6 transition " +
                  (method.featured
                    ? "border-amber-500 shadow-lg"
                    : "border-[#D4C5A0] hover:shadow-md")
                }
              >
                {method.featured && (
                  <span className="absolute right-4 top-4 rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white">
                    پرطرفدار
                  </span>
                )}

                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-3xl">
                  {method.icon}
                </div>

                <h3 className="text-base font-bold text-gray-800">
                  {method.name}
                </h3>

                <ul className="mt-4 space-y-2.5 text-sm">
                  <li className="flex items-center justify-between">
                    <span className="text-gray-500">زمان تحویل:</span>
                    <span className="font-semibold text-gray-800">
                      {method.time}
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-gray-500">هزینه:</span>
                    <span className="font-semibold text-gray-800">
                      {method.price}
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-gray-500">پوشش:</span>
                    <span className="font-semibold text-gray-800">
                      {method.coverage}
                    </span>
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* نکات مهم */}
        <div className="rounded-2xl border border-[#D4C5A0] bg-white p-6 md:p-8">
          <h2 className="mb-5 text-lg font-bold text-gray-800">
            نکات مهم درباره ارسال
          </h2>

          <ul className="grid gap-4 md:grid-cols-2">
            {[
              "ارسال رایگان برای سفارشات بالای ۲ میلیون تومان",
              "کد رهگیری مرسوله بلافاصله پس از ارسال پیامک می‌شود",
              "امکان تحویل به غیر از خود مشتری با ارائه کارت ملی وجود دارد",
              "در صورت عدم تحویل مرسوله، مبلغ به کیف پول شما بازگردانده می‌شود",
              "سفارشات ثبت‌شده پس از ساعت ۱۴، روز کاری بعد ارسال می‌شوند",
              "برای مشتریان بانه و اطراف، امکان تحویل حضوری فراهم است",
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

        {/* CTA */}
        <div className="mt-8 rounded-2xl border border-[#D4C5A0] bg-white p-8 text-center">
          <p className="text-base text-gray-600">
            سوالی درباره ارسال سفارش دارید؟
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <a
              href="/contact"
              className="rounded-lg bg-amber-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-amber-600"
            >
              تماس با ما
            </a>
            <a
              href="/faq"
              className="rounded-lg border border-[#D4C5A0] bg-white px-6 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
            >
              سوالات متداول
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}