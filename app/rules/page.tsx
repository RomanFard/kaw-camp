import Header from "@/components/Header";
import Footer from "@/components/Footer";

const rules = [
  {
    icon: "📋",
    title: "ثبت سفارش",
    items: [
      "سفارشات پس از ثبت، توسط کارشناسان ما بررسی و تایید می‌شوند.",
      "در صورت ناموجود بودن کالا، با شما تماس گرفته خواهد شد.",
      "قیمت‌های درج شده در سایت، به‌روز و نهایی هستند.",
      "پس از تایید سفارش، امکان لغو وجود ندارد.",
    ],
  },
  {
    icon: "💳",
    title: "پرداخت",
    items: [
      "پرداخت به صورت آنلاین از طریق درگاه‌های امن بانکی انجام می‌شود.",
      "امکان پرداخت در محل برای برخی شهرها فراهم است.",
      "در صورت عدم پرداخت، سفارش به صورت خودکار لغو می‌شود.",
      "فاکتور رسمی به همراه سفارش ارسال می‌گردد.",
    ],
  },
  {
    icon: "🚚",
    title: "ارسال",
    items: [
      "ارسال به سراسر ایران با پست پیشتاز و تیپاکس انجام می‌شود.",
      "زمان تحویل بین ۳ تا ۷ روز کاری بسته به مقصد متغیر است.",
      "هزینه ارسال برای خریدهای بالای ۲ میلیون تومان رایگان است.",
      "پس از ارسال، کد رهگیری برای شما پیامک می‌شود.",
    ],
  },
  {
    icon: "↩️",
    title: "بازگشت کالا",
    items: [
      "کالاهای خریداری شده تا ۷ روز پس از دریافت قابل بازگشت هستند.",
      "کالا باید در بسته‌بندی اصلی و بدون استفاده باشد.",
      "هزینه ارسال بازگشت در صورت ایراد کالا، بر عهده فروشگاه است.",
      "پس از بررسی، مبلغ ظرف ۳ روز کاری بازگردانده می‌شود.",
    ],
  },
  {
    icon: "🛡️",
    title: "گارانتی",
    items: [
      "تمام محصولات دارای گارانتی اصالت و سلامت کالا هستند.",
      "گارانتی محصولات بر اساس نوع کالا متفاوت است.",
      "استفاده نادرست، باعث ابطال گارانتی می‌شود.",
      "برای استفاده از گارانتی، فاکتور خرید الزامی است.",
    ],
  },
  {
    icon: "🔒",
    title: "حریم خصوصی",
    items: [
      "اطلاعات شما به هیچ عنوان در اختیار شخص ثالث قرار نمی‌گیرد.",
      "شماره تماس و ایمیل شما فقط برای اطلاع‌رسانی سفارشات استفاده می‌شود.",
      "ارتباط ما با شما از طریق شماره‌های رسمی فروشگاه انجام می‌شود.",
    ],
  },
];

export default function RulesPage() {
  return (
    <main className="min-h-screen bg-[#F7F1E3]">
      <Header />

      <div className="mx-auto max-w-[1600px] px-6 py-8">
        {/* مسیر ناوبری */}
        <nav className="mb-6 text-sm text-gray-500">
          <a href="/" className="hover:text-amber-600">خانه</a>
          <span className="mx-2">/</span>
          <span className="text-gray-800">قوانین و مقررات</span>
        </nav>

        {/* هدر صفحه */}
        <div className="mb-8 rounded-2xl border border-[#D4C5A0] bg-white p-8 text-center md:p-12">
          <span className="inline-block rounded-full bg-amber-50 px-5 py-2 text-sm font-semibold text-amber-600">
            قوانین و مقررات
          </span>
          <h1 className="mt-5 text-2xl font-bold text-gray-900 md:text-3xl">
            شرایط استفاده از خدمات کاو کمپ
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-gray-600">
            لطفاً قبل از خرید، قوانین و مقررات فروشگاه را مطالعه فرمایید. استفاده
            از خدمات کاو کمپ به معنای پذیرش این قوانین است.
          </p>
        </div>

        {/* لیست قوانین */}
        <div className="grid gap-6 md:grid-cols-2">
          {rules.map((rule) => (
            <div
              key={rule.title}
              className="rounded-2xl border border-[#D4C5A0] bg-white p-6 transition hover:shadow-md"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-2xl">
                  {rule.icon}
                </span>
                <h2 className="text-lg font-bold text-gray-800">
                  {rule.title}
                </h2>
              </div>

              <ul className="space-y-3">
                {rule.items.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm leading-7 text-gray-600"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA پایین */}
        <div className="mt-8 rounded-2xl border border-[#D4C5A0] bg-white p-8 text-center">
          <p className="text-base text-gray-600">
            سوال یا ابهامی دارید؟ با ما تماس بگیرید.
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