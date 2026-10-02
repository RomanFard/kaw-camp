"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useWishlist } from "@/components/context/WishlistContext";
import { formatPrice } from "@/lib/utils";

export default function WishlistPage() {
  const { items, removeItem, clearWishlist, totalItems } = useWishlist();

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F7F1E3]">
      <Header />

      <div className="mx-auto max-w-[1600px] px-4 py-6 md:px-6 md:py-8">
        {/* مسیر ناوبری */}
        <nav className="mb-5 text-xs text-gray-500 md:text-sm">
          <a href="/" className="hover:text-amber-600">خانه</a>
          <span className="mx-2">/</span>
          <span className="text-gray-800">علاقه‌مندی‌ها</span>
        </nav>

        {/* عنوان */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-black text-gray-900 md:text-3xl">
            علاقه‌مندی‌های من
            {totalItems > 0 && (
              <span className="mr-3 text-base font-normal text-gray-500 md:text-lg">
                ({totalItems} مورد)
              </span>
            )}
          </h1>

          {items.length > 0 && (
            <button
              type="button"
              onClick={clearWishlist}
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100 md:text-sm"
            >
              پاک کردن همه
            </button>
          )}
        </div>

        {/* محتوا */}
        {items.length === 0 ? (
          /* حالت خالی */
          <div className="rounded-2xl border border-[#E8DFC8] bg-white p-8 text-center md:p-12">
            <p className="text-6xl">💔</p>
            <p className="mt-4 text-lg font-bold text-gray-800 md:text-xl">
              هنوز چیزی به علاقه‌مندی‌ها اضافه نکردی
            </p>
            <p className="mt-2 text-sm text-gray-500">
              محصولات و تورهای مورد علاقه‌ات رو با کلیک روی قلب ذخیره کن
            </p>
            <a
              href="/products"
              className="mt-6 inline-block rounded-lg bg-amber-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-amber-600"
            >
              مشاهده محصولات
            </a>
          </div>
        ) : (
          /* گرید */
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-5">
            {items.map((item) => (
              <div
                key={item.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#E8DFC8] bg-white transition hover:border-amber-500 hover:shadow-lg"
              >
                {/* دکمه حذف */}
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  aria-label="حذف"
                  className="absolute left-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-[#E8DFC8] bg-white text-gray-400 shadow-sm transition hover:border-red-500 hover:text-red-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                <a
                  href={
                    item.type === "tour"
                      ? `/explore/${item.id}`
                      : `/product/${item.id}`
                  }
                  className="flex flex-1 flex-col"
                >
                  {/* تصویر */}
                  <div className="relative aspect-square overflow-hidden bg-white">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-contain p-3 transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* اطلاعات */}
                  <div className="flex flex-1 flex-col p-3">
                    <h3 className="line-clamp-2 min-h-[2.5rem] text-xs font-bold leading-6 text-gray-800 transition group-hover:text-amber-600 md:text-sm">
                      {item.name}
                    </h3>

                    {/* قیمت */}
                    <div className="mt-auto pt-3">
                      <div className="text-sm font-black text-gray-900 md:text-base">
                        {formatPrice(item.price)}
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}