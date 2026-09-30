const categoriesWithImages = [
  {
    key: "all",
    label: "تمامی محصولات",
    image: "/images/logo.png",
    isLogo: true,
  },
  {
    key: "watch",
    label: "ساعت ورزشی",
    image: "https://picsum.photos/seed/cat-watch/400/300",
  },
  {
    key: "mattress",
    label: "زیرانداز",
    image: "https://picsum.photos/seed/cat-mattress/400/300",
  },
  {
    key: "bicycle",
    label: "دوچرخه",
    image: "https://picsum.photos/seed/cat-bicycle/400/300",
  },
  {
    key: "clothing",
    label: "دستکش کوهنوردی",
    image: "https://picsum.photos/seed/cat-gloves/400/300",
  },
  {
    key: "tent",
    label: "چادر کوهنوردی",
    image: "https://picsum.photos/seed/cat-tent/400/300",
  },
  {
    key: "sleep",
    label: "بالش کوهنوردی",
    image: "https://picsum.photos/seed/cat-pillow/400/300",
  },
  {
    key: "accessories",
    label: "لوازم کمپینگ و کوهنوردی",
    image: "https://picsum.photos/seed/cat-accessories/400/300",
  },
  {
    key: "clothing",
    label: "لباس کوهنوردی",
    image: "https://picsum.photos/seed/cat-clothing/400/300",
  },
  {
    key: "gaiters",
    label: "گتر کوهنوردی",
    image: "https://picsum.photos/seed/cat-gaiters/400/300",
  },
  {
    key: "sleep",
    label: "کیسه خواب",
    image: "https://picsum.photos/seed/cat-sleep/400/300",
  },
  {
    key: "backpack",
    label: "کوله پشتی کوهنوردی",
    image: "https://picsum.photos/seed/cat-backpack/400/300",
  },
  {
    key: "shoes",
    label: "کفش کوهنوردی",
    image: "https://picsum.photos/seed/cat-shoes/400/300",
  },
  {
    key: "sunglasses",
    label: "عینک اسپرت",
    image: "https://picsum.photos/seed/cat-sunglasses/400/300",
  },
];

export default function CategoryGrid() {
  return (
    <section className="mx-auto max-w-[1600px] px-6 py-10">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
        {categoriesWithImages.map((cat, i) => {
          // کارت «تمامی محصولات»
          if (cat.isLogo) {
            return (
              <a
                key={i}
                href="/products"
                className="group overflow-hidden rounded-2xl border-2 border-amber-500 bg-white transition hover:shadow-lg"
              >
                <div className="border-b border-[#E8DFC8] bg-[#F7F1E3]/40 px-3 py-2.5 text-center">
                  <span className="text-sm font-bold text-gray-800 md:text-base">
                    {cat.label}
                  </span>
                </div>
                <div className="flex h-28 items-center justify-center bg-white p-3 md:h-32">
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="h-full w-auto object-contain transition group-hover:scale-105"
                  />
                </div>
              </a>
            );
          }

          // کارت‌های معمولی
          return (
            <a
              key={i}
              href={`/products?cat=${cat.key}`}
              className="group overflow-hidden rounded-2xl border border-[#E8DFC8] bg-white transition hover:border-amber-500 hover:shadow-lg"
            >
              <div className="border-b border-[#E8DFC8] bg-[#F7F1E3]/40 px-3 py-2.5 text-center">
                <span className="line-clamp-1 text-sm font-bold text-gray-800 md:text-base">
                  {cat.label}
                </span>
              </div>
              <div className="relative h-28 overflow-hidden bg-gray-100 md:h-32">
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}