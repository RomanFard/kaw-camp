import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { products } from "@/data/products";

function getCategoryEmoji(cat: string) {
  const map: Record<string, string> = {
    tent: "⛺", sleep: "🛏️", mattress: "🟦", backpack: "🎒",
    clothing: "🧥", shoes: "🥾", socks: "🧦", gaiters: "🦵",
    tools: "🧰", lighting: "🔦", bottle: "🥤", cooking: "🍳",
    sunglasses: "🕶️", watch: "⌚", bicycle: "🚲", accessories: "🎁",
  };
  return map[cat] || "📦";
}

export default function ExplorePage() {
  const items = products.slice(0, 16);

  return (
    <main className="min-h-screen bg-[#F7F1E3]">
      <Header />

      <div className="mx-auto max-w-[1600px] px-3 py-4 md:px-6 md:py-6">
        <div className="grid grid-cols-3 gap-1 md:gap-2">
          {items.map((product, index) => {
            const pattern = index % 6;
            let colSpan = "col-span-1";
            let aspect = "aspect-square";

            if (pattern === 0) {
              colSpan = "col-span-2";
              aspect = "aspect-[4/3]";
            } else if (pattern === 3) {
              colSpan = "col-span-1 row-span-2";
              aspect = "aspect-[3/4]";
            }

            return (
              <a
                key={product.id}
                href={`/product/${product.id}`}
                className={
                  "group relative overflow-hidden rounded-sm bg-gradient-to-br from-[#F7F1E3] to-[#EFE7D2] md:rounded-lg " +
                  colSpan
                }
              >
                <div className={"flex w-full items-center justify-center " + aspect}>
                  <span className="text-5xl transition duration-500 group-hover:scale-110 md:text-6xl">
                    {getCategoryEmoji(product.category)}
                  </span>

                  {/* Overlay روی هاور */}
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-transparent to-transparent p-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:p-3">
                    <span className="line-clamp-2 text-xs font-bold text-white md:text-sm">
                      {product.name}
                    </span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      <Footer />
    </main>
  );
}