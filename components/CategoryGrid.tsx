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
        {megaMenu.map((cat) => (
          <a
            key={cat.key}
            href={`/products?cat=${cat.key}`}
            className="group flex flex-col items-center overflow-hidden rounded-2xl border border-[#E8DFC8] bg-white transition hover:border-amber-500 hover:shadow-lg"
          >
            {/* عنوان */}
            <div className="flex w-full items-center justify-center border-b border-[#E8DFC8] bg-[#F7F1E3] px-2 py-3">
              <span className="line-clamp-1 text-center text-sm font-bold text-gray-800 md:text-base">
                {cat.label}
              </span>
            </div>

            {/* تصویر بزرگ */}
            <div className="relative flex w-full flex-1 items-center justify-center overflow-hidden bg-white">
              <div className="aspect-square w-full">
                <img
                  src={cat.photo || cat.icon}
                  alt={cat.label}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
                />
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}