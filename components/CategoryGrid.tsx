import { megaMenu } from "@/lib/megaMenu";

export default function CategoryGrid() {
  return (
    <section className="mx-auto max-w-[1600px] px-4 py-8 md:px-6 md:py-10">
      {/* عنوان */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900 md:text-2xl">
          دسته‌بندی‌های محبوب
        </h2>
        <a
          href="/products"
          className="text-sm font-semibold text-amber-600 hover:underline md:text-base"
        >
          مشاهده همه ←
        </a>
      </div>

      {/* گرید */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5">
        {/* کارت «تمامی محصولات» */}
        <a
          href="/products"
          className="group flex flex-col items-center overflow-hidden rounded-2xl border-2 border-amber-500 bg-white transition hover:shadow-lg"
        >
          <div className="flex w-full items-center justify-center border-b border-[#D4C5A0] bg-[#F7F1E3] px-2 py-3">
            <span className="line-clamp-1 text-sm font-bold text-gray-800 md:text-base">
              تمامی محصولات
            </span>
          </div>
          <div className="flex w-full flex-1 items-center justify-center bg-white p-3 py-5 md:py-6">
            <img
              src="/images/logo.png"
              alt="تمامی محصولات"
              className="h-20 w-auto object-contain transition duration-300 group-hover:scale-110 md:h-24"
            />
          </div>
        </a>

        {/* ۹ دسته از megaMenu */}
        {megaMenu.map((cat) => (
          <a
            key={cat.key}
            href={`/products?cat=${cat.key}`}
            className="group flex flex-col items-center overflow-hidden rounded-2xl border border-[#D4C5A0] bg-white transition hover:border-amber-500 hover:shadow-lg"
          >
            {/* عنوان - همون سایز «تمامی محصولات» */}
            <div className="flex w-full items-center justify-center border-b border-[#D4C5A0] bg-[#F7F1E3] px-2 py-3">
              <span className="line-clamp-1 text-center text-sm font-bold text-gray-800 md:text-base">
                {cat.label}
              </span>
            </div>

            {/* تصویر SVG - بزرگتر */}
            <div className="flex w-full flex-1 items-center justify-center p-3 py-5 md:py-6">
              <img
                src={cat.icon}
                alt={cat.label}
                className="h-20 w-20 object-contain transition duration-300 group-hover:scale-110 md:h-24 md:w-24"
              />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}