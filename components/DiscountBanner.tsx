export default function DiscountBanner() {
  return (
    <section className="mx-auto max-w-[1600px] px-6 py-10">
      <div className="grid gap-4 md:grid-cols-2">
        <a
          href="/products?cat=tent"
          className="flex items-center justify-between overflow-hidden rounded-2xl bg-gradient-to-l from-red-600 to-red-500 px-6 py-8 text-white transition hover:shadow-lg"
        >
          <div>
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs">
              پیشنهاد ویژه
            </span>
            <h3 className="mt-3 text-xl font-bold md:text-2xl">
              چادرهای کمپینگ
            </h3>
            <p className="mt-1 text-sm text-white/90">
              تا ۲۵٪ تخفیف روی مدل‌های منتخب
            </p>
            <span className="mt-4 inline-block text-sm font-bold">
              خرید کن ←
            </span>
          </div>
          <span className="text-7xl md:text-8xl">⛺</span>
        </a>

        <a
          href="/products?cat=clothing"
          className="flex items-center justify-between overflow-hidden rounded-2xl bg-gradient-to-l from-blue-700 to-blue-500 px-6 py-8 text-white transition hover:shadow-lg"
        >
          <div>
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs">
              فصل سرد
            </span>
            <h3 className="mt-3 text-xl font-bold md:text-2xl">
              لباس کوهنوردی زمستانی
            </h3>
            <p className="mt-1 text-sm text-white/90">گرم، سبک و ضدآب</p>
            <span className="mt-4 inline-block text-sm font-bold">
              مشاهده ←
            </span>
          </div>
          <span className="text-7xl md:text-8xl">🧥</span>
        </a>
      </div>
    </section>
  );
}