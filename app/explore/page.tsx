import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { products } from "@/data/products";
import { getProductImages } from "@/lib/productImages";

export default function ExplorePage() {
  const items = products.slice(0, 16);

  return (
    <main className="min-h-screen bg-[#F7F1E3]">
      <Header />

      <div className="mx-auto max-w-[1600px] px-2 py-3 md:px-6 md:py-6">
        {/* گرید ساده */}
        <div className="grid grid-cols-3 gap-1.5 md:grid-cols-4 md:gap-3 lg:grid-cols-5">
          {items.map((product, index) => {
            const isFeatured = index === 0;

            // عکس‌های دسته‌بندی
            const images = getProductImages(product.category, product.id);

            // اگه عکس لوکال داره، اول اون
            const image =
              product.image && product.image.startsWith("/")
                ? product.image
                : images[index % images.length];

            return (
              <a
                key={product.id}
                href={`/product/${product.id}`}
                className={
                  "group relative overflow-hidden rounded-md bg-[#EFE7D2] md:rounded-lg " +
                  (isFeatured ? "col-span-2 row-span-2" : "aspect-square")
                }
              >
                <img
                  src={image}
                  alt={product.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                {/* Gradient bottom + title */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-2 pt-6">
                  <span className="line-clamp-2 text-[10px] font-bold leading-4 text-white md:text-xs">
                    {product.name}
                  </span>
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