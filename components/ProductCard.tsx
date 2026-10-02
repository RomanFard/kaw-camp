import { Product } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { getProductImage } from "@/lib/productImages";

export default function ProductCard({ product }: { product: Product }) {
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  // اگه عکس لوکال داره، ازش استفاده کن، وگرنه از عکس دسته‌بندی
  const image =
    product.image && product.image.startsWith("/")
      ? product.image
      : getProductImage(product.category, product.id);

  return (
    <a
      href={`/product/${product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-[#D4C5A0] bg-white transition hover:border-amber-400 hover:shadow-lg"
    >
      {/* تصویر */}
      <div className="relative block aspect-square overflow-hidden bg-[#F7F1E3]">
        <img
          src={image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {discount > 0 && (
          <span className="absolute right-3 top-3 z-10 rounded-md bg-amber-500 px-2 py-1 text-xs font-bold text-white shadow">
            {discount}٪ تخفیف
          </span>
        )}

        {!product.inStock && (
          <span className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 text-lg font-bold text-white">
            ناموجود
          </span>
        )}

        {product.inStock && product.rating >= 4.7 && (
          <span className="absolute left-3 top-3 z-10 rounded-md bg-amber-500 px-2 py-1 text-xs font-bold text-white shadow">
            ویژه
          </span>
        )}
      </div>

      {/* اطلاعات */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 min-h-[3rem] text-sm font-bold text-gray-800 transition group-hover:text-amber-600">
          {product.name}
        </h3>

        <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
          <span className="text-amber-500">★★★★★</span>
          <span className="font-semibold text-gray-700">{product.rating}</span>
          <span>({product.reviews} نظر)</span>
        </div>

        <div className="mt-auto pt-4">
          {product.oldPrice && (
            <div className="text-xs text-gray-400 line-through">
              {formatPrice(product.oldPrice)}
            </div>
          )}
          <div className="text-base font-bold text-gray-900">
            {formatPrice(product.price)}
          </div>
        </div>
      </div>
    </a>
  );
}