import { categories } from "@/data/products";

export default function CategoryGrid() {
  return (
    <section className="mx-auto max-w-[1600px] px-6 py-10">
      <h2 className="mb-6 text-xl font-bold text-gray-800 md:text-2xl">
        دسته‌بندی محصولات
      </h2>

      <div className="grid grid-cols-4 gap-4 md:grid-cols-8">
        {categories.map((cat) => (
          <a
            key={cat.key}
            href={`/products?cat=${cat.key}`}
            className="flex flex-col items-center gap-2 rounded-xl border border-[#E8DFC8] bg-white p-4 transition hover:border-amber-500 hover:shadow-md"
          >
            <span className="text-3xl md:text-4xl">{cat.emoji}</span>
            <span className="text-center text-xs font-medium text-gray-700 md:text-sm">
              {cat.label}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}