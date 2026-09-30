import Header from "@/components/Header";
import Footer from "@/components/Footer";

const exploreItems = [
  { productId: "1",  title: "چادر کوهنوردی",      image: "https://picsum.photos/seed/ex1/600/420",  height: 420 },
  { productId: "2",  title: "کوله‌پشتی حرفه‌ای",   image: "https://picsum.photos/seed/ex2/600/340",  height: 340 },
  { productId: "3",  title: "کیسه‌خواب پَر",       image: "https://picsum.photos/seed/ex3/600/300",  height: 300 },
  { productId: "4",  title: "اجاق گاز کمپینگ",    image: "https://picsum.photos/seed/ex4/600/520",  height: 520 },
  { productId: "5",  title: "فانوس LED",          image: "https://picsum.photos/seed/ex5/600/280",  height: 280 },
  { productId: "6",  title: "قمقمه استیل",        image: "https://picsum.photos/seed/ex6/600/320",  height: 320 },
  { productId: "7",  title: "تشک بادی",            image: "https://picsum.photos/seed/ex7/600/360",  height: 360 },
  { productId: "8",  title: "عصای کوهنوردی",       image: "https://picsum.photos/seed/ex8/600/400",  height: 400 },
  { productId: "9",  title: "کاپشن پَر",           image: "https://picsum.photos/seed/ex9/600/460",  height: 460 },
  { productId: "10", title: "شلوار کوهنوردی",     image: "https://picsum.photos/seed/ex10/600/340", height: 340 },
  { productId: "11", title: "دستکش ضدآب",          image: "https://picsum.photos/seed/ex11/600/380", height: 380 },
  { productId: "12", title: "عینک آفتابی",         image: "https://picsum.photos/seed/ex12/600/340", height: 340 },
  { productId: "13", title: "ساعت GPS",             image: "https://picsum.photos/seed/ex13/600/400", height: 400 },
  { productId: "14", title: "کلاه کوهنوردی",       image: "https://picsum.photos/seed/ex14/600/300", height: 300 },
  { productId: "15", title: "کفش کوهنوردی",        image: "https://picsum.photos/seed/ex15/600/480", height: 480 },
  { productId: "16", title: "جوراب پشمی",          image: "https://picsum.photos/seed/ex16/600/300", height: 300 },
];

export default function ExplorePage() {
  return (
    <main className="min-h-screen bg-[#F7F1E3]">
      <Header />

      <div className="mx-auto max-w-[1600px] px-6 py-6">
        {/* گالری ماسونری */}
        <div className="columns-2 gap-4 md:columns-3 lg:columns-4 xl:columns-5">
          {exploreItems.map((item, index) => (
            <a
              key={index}
              href={`/product/${item.productId}`}
              className="group relative mb-4 block overflow-hidden rounded-xl"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                style={{ height: `${item.height}px` }}
              />

              {/* Overlay روی هاور */}
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <h3 className="line-clamp-2 text-sm font-bold text-white md:text-base">
                  {item.title}
                </h3>
              </div>
            </a>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}