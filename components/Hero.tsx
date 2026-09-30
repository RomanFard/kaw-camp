export default function Hero() {
  return (
    <section className="relative bg-gradient-to-l from-green-800 to-green-600 text-white">
      <div className="mx-auto flex mx-auto max-w-[1600px] flex-col items-center gap-6 px-4 py-16 text-center md:py-24">
        <span className="rounded-full bg-white/20 px-4 py-1 text-sm backdrop-blur">
          🏔️ فصل جدید کمپینگ شروع شد
        </span>

        <h1 className="text-3xl font-bold leading-tight md:text-5xl">
          تجهیزات حرفه‌ای کمپینگ و کوهنوردی
        </h1>

        <p className="max-w-2xl text-base text-green-50 md:text-lg">
          از چادر و کوله‌پشتی تا اجاق و فانوس — هرچی برای سفر به طبیعت لازم داری،
          اینجاست. کیفیت تضمینی، ارسال سریع.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="/products"
            className="rounded-lg bg-white px-6 py-3 font-bold text-green-700 shadow hover:bg-green-50"
          >
            مشاهده محصولات
          </a>
          <a
            href="/deals"
            className="rounded-lg border border-white/40 px-6 py-3 font-bold hover:bg-white/10"
          >
            تخفیف‌های ویژه
          </a>
        </div>
      </div>
    </section>
  );
}