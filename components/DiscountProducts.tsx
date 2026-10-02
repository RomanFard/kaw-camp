import { products } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { getProductImage } from "@/lib/productImages";

export default function DiscountProducts() {
  const discounted = products.filter((p) => p.oldPrice).slice(0, 6);

  return (
    <section className="mx-auto max-w-[1600px] px-6 py-10">
      {/* هدر بخش */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-xl text-white">
            🔥
          </span>
          <div>
            <h2 className="text-xl font-bold text-gray-900 md:text-2xl">
              تخفیف‌های ویژه
            </h2>
            <p className="text-sm text-gray-500">
              فرصت محدود — همین حالا خرید کنید
            </p>
          </div>
        </div>
        <a
          href="/products?sort=cheap"
          className="text-sm font-semibold text-amber-600 hover:underline md:text-base"
        >
          مشاهده همه ←
        </a>
      </div>

      {/* گرید */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {discounted.map((product) => {
          const discount = product.oldPrice
            ? Math.round(
                ((product.oldPrice - product.price) / product.oldPrice) * 100
              )
            : 0;

          // اگه عکس لوکال داره، ازش استفاده کن، وگرنه از عکس دسته‌بندی
          const image =
            product.image && product.image.startsWith("/")
              ? product.image
              : getProductImage(product.category, product.id);

          return (
            <a
              key={product.id}
              href={`/product/${product.id}`}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-[#D4C5A0] bg-white transition hover:border-amber-500 hover:shadow-lg"
            >
              {/* تصویر */}
              <div className="relative aspect-square overflow-hidden bg-[#F7F1E3]">
                <img
                  src={image}
                  alt={product.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />

                {/* دایره درصد تخفیف */}
                {discount > 0 && (
                  <div className="absolute right-2 top-2 flex h-12 w-12 flex-col items-center justify-center rounded-full bg-amber-500 text-white shadow-lg">
                    <span className="text-sm font-black leading-none">
                      {discount}٪
                    </span>
                    <span className="text-[9px] leading-tight">تخفیف</span>
                  </div>
                )}

                {!product.inStock && (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/60 text-sm font-bold text-white">
                    ناموجود
                  </span>
                )}
              </div>

              {/* اطلاعات */}
              <div className="flex flex-1 flex-col p-3">
                <h3 className="line-clamp-2 min-h-[2.5rem] text-xs font-bold text-gray-800 transition group-hover:text-amber-600">
                  {product.name}
                </h3>

                {/* قیمت */}
                <div className="mt-auto pt-3">
                  {product.oldPrice && (
                    <div className="text-xs text-gray-400 line-through">
                      {formatPrice(product.oldPrice)}
                    </div>
                  )}
                  <div className="mt-0.5 text-sm font-black text-gray-900">
                    {formatPrice(product.price)}
                  </div>
                </div>

                {/* دکمه */}
                <button
                  disabled={!product.inStock}
                  className="mt-3 w-full rounded-lg bg-amber-500 py-2 text-xs font-bold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  {product.inStock ? "مشاهده و خرید" : "ناموجود"}
                </button>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}