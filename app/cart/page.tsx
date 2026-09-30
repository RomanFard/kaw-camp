"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/components/context/CartContext";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } =
    useCart();

  const shipping = totalPrice > 2_000_000 || totalPrice === 0 ? 0 : 80_000;
  const finalPrice = totalPrice + shipping;

  return (
    <main className="min-h-screen bg-[#F7F1E3]">
      <Header />

      <div className="mx-auto max-w-[1600px] px-6 py-8">
        {/* مسیر ناوبری */}
        <nav className="mb-6 text-sm text-gray-500">
          <a href="/" className="hover:text-amber-600">خانه</a>
          <span className="mx-2">/</span>
          <span className="text-gray-800">سبد خرید</span>
        </nav>

        <h1 className="mb-6 text-2xl font-bold text-gray-900">
          سبد خرید
          {totalItems > 0 && (
            <span className="mr-3 text-base font-normal text-gray-500">
              ({totalItems} کالا)
            </span>
          )}
        </h1>

        {items.length === 0 ? (
          /* سبد خالی */
          <div className="rounded-2xl border border-[#E8DFC8] bg-white p-12 text-center">
            <p className="text-6xl">🛒</p>
            <p className="mt-4 text-lg font-bold text-gray-800">
              سبد خرید شما خالی است
            </p>
            <p className="mt-2 text-sm text-gray-500">
              برای شروع خرید، محصولات ما را مرور کنید.
            </p>
            <a
              href="/products"
              className="mt-6 inline-block rounded-lg bg-amber-500 px-6 py-3 text-base font-bold text-white transition hover:bg-amber-600"
            >
              مشاهده محصولات
            </a>
          </div>
        ) : (
          /* گرید: لیست آیتم‌ها + سایدبار */
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            {/* لیست آیتم‌ها */}
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 rounded-xl border border-[#E8DFC8] bg-white p-4"
                >
                  {/* تصویر */}
                  <a
                    href={"/product/" + item.id}
                    className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </a>

                  {/* اطلاعات */}
                  <div className="flex flex-1 flex-col">
                    <a
                      href={"/product/" + item.id}
                      className="text-sm font-bold text-gray-800 hover:text-amber-600 md:text-base"
                    >
                      {item.name}
                    </a>

                    <div className="mt-2 text-sm text-gray-500">
                      قیمت واحد: {formatPrice(item.price)}
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                      {/* تعداد */}
                      <div className="flex items-center gap-2 rounded-lg border border-[#E8DFC8] px-2 py-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="flex h-7 w-7 items-center justify-center rounded text-lg font-bold text-gray-600 transition hover:bg-gray-100"
                        >
                          −
                        </button>
                        <span className="min-w-[28px] text-center text-sm font-bold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="flex h-7 w-7 items-center justify-center rounded text-lg font-bold text-gray-600 transition hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>

                      {/* قیمت کل + حذف */}
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-bold text-gray-900 md:text-base">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          aria-label="حذف"
                          className="text-gray-400 transition hover:text-red-500"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="h-5 w-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* دکمه پاک کردن سبد */}
              <button
                type="button"
                onClick={clearCart}
                className="mt-3 text-sm text-red-500 hover:underline"
              >
                پاک کردن کل سبد
              </button>
            </div>

            {/* سایدبار - خلاصه سفارش */}
            <aside className="sticky top-4 h-fit rounded-xl border border-[#E8DFC8] bg-white p-6">
              <h2 className="mb-4 text-lg font-bold text-gray-800">
                خلاصه سفارش
              </h2>

              <div className="space-y-3 border-b border-[#EDE4CE] pb-4 text-sm">
                <div className="flex items-center justify-between text-gray-600">
                  <span>جمع کالاها</span>
                  <span className="font-bold text-gray-800">
                    {formatPrice(totalPrice)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-gray-600">
                  <span>هزینه ارسال</span>
                  <span
                    className={
                      shipping === 0 ? "font-bold text-green-600" : "font-bold text-gray-800"
                    }
                  >
                    {shipping === 0 ? "رایگان" : formatPrice(shipping)}
                  </span>
                </div>

                {shipping > 0 && (
                  <div className="rounded-lg bg-amber-50 p-2.5 text-xs text-amber-700">
                    🎁 با {formatPrice(2_000_000 - totalPrice)} خرید بیشتر، ارسال رایگان می‌شود
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-base font-bold text-gray-800">مبلغ قابل پرداخت</span>
                <span className="text-lg font-black text-gray-900">
                  {formatPrice(finalPrice)}
                </span>
              </div>

              <button
                type="button"
                className="mt-5 w-full rounded-lg bg-green-700 py-3 text-base font-bold text-white transition hover:bg-green-800"
              >
                ادامه فرآیند خرید
              </button>

              <a
                href="/products"
                className="mt-3 block text-center text-sm text-amber-600 hover:underline"
              >
                ← ادامه خرید
              </a>
            </aside>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}