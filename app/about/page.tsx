import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#F7F1E3]">
      <Header />

      <div className="mx-auto max-w-[1600px] px-6 py-8">
        {/* مسیر ناوبری */}
        <nav className="mb-6 text-sm text-gray-500">
          <a href="/" className="hover:text-amber-600">خانه</a>
          <span className="mx-2">/</span>
          <span className="text-gray-800">درباره ما</span>
        </nav>

        {/* بخش معرفی */}
        <section className="rounded-2xl border border-[#D4C5A0] bg-white p-8 md:p-12">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-block rounded-full bg-amber-50 px-5 py-2 text-sm font-semibold text-amber-600">
              درباره کو کمپ
            </span>
            <h1 className="mt-5 text-2xl font-bold leading-10 text-gray-900 md:text-3xl">
              داستان ما، عشق به طبیعت و کوهستان
            </h1>
            <p className="mt-5 text-base leading-8 text-gray-600">
              کو کمپ از سال ۱۴۰۰ با هدف ارائه بهترین تجهیزات کمپینگ و کوهنوردی
              به طبیعت‌دوستان ایرانی شروع به کار کرد. ما باور داریم که هر سفر
              به طبیعت، یک تجربه منحصربه‌فرد است و برای این تجربه، به تجهیزات
              باکیفیت و مطمئن نیاز دارید.
            </p>
          </div>
        </section>

        {/* آمار */}
        <section className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { number: "۱۰,۰۰۰+", label: "مشتری راضی" },
            { number: "۵۰۰+", label: "محصول متنوع" },
            { number: "۲۰+", label: "برند معتبر" },
            { number: "۳ سال", label: "سابقه فعالیت" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-[#D4C5A0] bg-white p-6 text-center"
            >
              <div className="text-2xl font-black text-amber-600 md:text-3xl">
                {stat.number}
              </div>
              <div className="mt-2 text-sm font-semibold text-gray-600">
                {stat.label}
              </div>
            </div>
          ))}
        </section>

        {/* چرا ما */}
        <section className="mt-8 rounded-2xl border border-[#D4C5A0] bg-white p-8 md:p-12">
          <h2 className="text-center text-xl font-bold text-gray-900 md:text-2xl">
            چرا کو کمپ؟
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: "🏔️",
                title: "تنوع بی‌نظیر",
                text: "از چادر و کوله‌پشتی تا کوچک‌ترین ابزار فنی، همه چیز در یک جا.",
              },
              {
                icon: "🛡️",
                title: "تضمین اصالت",
                text: "همه محصولات با گارانتی اصالت و سلامت کالا ارائه می‌شوند.",
              },
              {
                icon: "💬",
                title: "مشاوره تخصصی",
                text: "تیم ما آماده است تا قبل از خرید، بهترین انتخاب را به شما پیشنهاد دهد.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-[#D4C5A0] bg-[#F7F1E3]/30 p-6 text-center"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500 text-3xl">
                  {item.icon}
                </div>
                <h3 className="mt-4 text-base font-bold text-gray-800">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-gray-600">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ماموریت */}
        <section className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-[#D4C5A0] bg-white p-8">
            <h2 className="text-xl font-bold text-gray-900">ماموریت ما</h2>
            <p className="mt-4 text-base leading-8 text-gray-600">
              دسترسی آسان و مقرون‌به‌صرفه همه علاقه‌مندان به طبیعت به تجهیزات
              باکیفیت و استاندارد جهانی. ما می‌خواهیم هیچ‌کس به خاطر نداشتن
              تجهیزات مناسب، از تجربه کوهستان و کمپینگ محروم نشود.
            </p>
          </div>

          <div className="rounded-2xl border border-[#D4C5A0] bg-white p-8">
            <h2 className="text-xl font-bold text-gray-900">چشم‌انداز ما</h2>
            <p className="mt-4 text-base leading-8 text-gray-600">
              تبدیل شدن به بزرگ‌ترین مرجع تخصصی تجهیزات کوهنوردی و کمپینگ
              در غرب کشور و ارائه خدمات متمایز به مشتریان، با تکیه بر کیفیت،
              اعتماد و پشتیبانی حرفه‌ای.
            </p>
          </div>
        </section>

        {/* تماس / CTA */}
        <section className="mt-8 rounded-2xl bg-gradient-to-l from-amber-600 to-amber-500 p-8 text-center text-white md:p-12">
          <h2 className="text-2xl font-bold md:text-3xl">
            آماده شروع یک ماجراجویی هستید؟
          </h2>
          <p className="mt-4 text-base text-white/90 md:text-lg">
            همین حالا فروشگاه ما را مرور کنید یا با ما تماس بگیرید
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="/products"
              className="rounded-lg bg-white px-8 py-3 text-base font-bold text-amber-600 transition hover:bg-amber-50"
            >
              مشاهده محصولات
            </a>
            <a
              href="/contact"
              className="rounded-lg border-2 border-white/60 bg-white/10 px-8 py-3 text-base font-bold text-white transition hover:bg-white/20"
            >
              تماس با ما
            </a>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}