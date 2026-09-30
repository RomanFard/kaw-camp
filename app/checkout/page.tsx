"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/components/context/CartContext";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const { items, totalPrice, totalItems } = useCart();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    province: "",
    city: "",
    address: "",
    postalCode: "",
    note: "",
  });
  const [shipping, setShipping] = useState("post");
  const [payment, setPayment] = useState("online");

  const shippingCost = shipping === "post" ? 80000 : 0;
  const finalPrice = totalPrice + shippingCost;

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <main className="min-h-screen bg-[#F7F1E3]">
      <Header />

      <div className="mx-auto max-w-[1600px] px-6 py-8">
        {/* مسیر ناوبری */}
        <nav className="mb-6 text-sm text-gray-500">
          <a href="/" className="hover:text-amber-600">خانه</a>
          <span className="mx-2">/</span>
          <a href="/cart" className="hover:text-amber-600">سبد خرید</a>
          <span className="mx-2">/</span>
          <span className="text-gray-800">تسویه حساب</span>
        </nav>

        <h1 className="mb-6 text-2xl font-bold text-gray-900">
          تسویه حساب
        </h1>

        {items.length === 0 ? (
          /* سبد خالی */
          <div className="rounded-2xl border border-[#E8DFC8] bg-white p-12 text-center">
            <p className="text-6xl">🛒</p>
            <p className="mt-4 text-lg font-bold text-gray-800">
              سبد خرید شما خالی است
            </p>
            <p className="mt-2 text-sm text-gray-500">
              برای تسویه حساب ابتدا محصولی به سبد اضافه کنید.
            </p>
            <a
              href="/products"
              className="mt-6 inline-block rounded-lg bg-amber-500 px-6 py-3 text-base font-bold text-white transition hover:bg-amber-600"
            >
              مشاهده محصولات
            </a>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
            {/* فرم - سمت راست */}
            <div className="space-y-4">
              {/* اطلاعات گیرنده */}
              <div className="rounded-xl border border-[#E8DFC8] bg-white p-6">
                <h2 className="mb-5 text-lg font-bold text-gray-800">
                  اطلاعات گیرنده
                </h2>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                      نام
                    </label>
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={(e) => updateField("firstName", e.target.value)}
                      className="w-full rounded-lg border border-[#E8DFC8] bg-[#F7F1E3]/30 px-4 py-2.5 text-sm outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                      نام خانوادگی
                    </label>
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={(e) => updateField("lastName", e.target.value)}
                      className="w-full rounded-lg border border-[#E8DFC8] bg-[#F7F1E3]/30 px-4 py-2.5 text-sm outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                      شماره تماس
                    </label>
                    <input
                      type="tel"
                      dir="ltr"
                      value={form.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      className="w-full rounded-lg border border-[#E8DFC8] bg-[#F7F1E3]/30 px-4 py-2.5 text-right text-sm outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                      ایمیل (اختیاری)
                    </label>
                    <input
                      type="email"
                      dir="ltr"
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      className="w-full rounded-lg border border-[#E8DFC8] bg-[#F7F1E3]/30 px-4 py-2.5 text-right text-sm outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* آدرس */}
              <div className="rounded-xl border border-[#E8DFC8] bg-white p-6">
                <h2 className="mb-5 text-lg font-bold text-gray-800">
                  آدرس تحویل
                </h2>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                      استان
                    </label>
                    <input
                      type="text"
                      value={form.province}
                      onChange={(e) => updateField("province", e.target.value)}
                      className="w-full rounded-lg border border-[#E8DFC8] bg-[#F7F1E3]/30 px-4 py-2.5 text-sm outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                      شهر
                    </label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      className="w-full rounded-lg border border-[#E8DFC8] bg-[#F7F1E3]/30 px-4 py-2.5 text-sm outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                      آدرس کامل
                    </label>
                    <textarea
                      rows={3}
                      value={form.address}
                      onChange={(e) => updateField("address", e.target.value)}
                      className="w-full resize-none rounded-lg border border-[#E8DFC8] bg-[#F7F1E3]/30 px-4 py-2.5 text-sm outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                      کد پستی
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={form.postalCode}
                      onChange={(e) => updateField("postalCode", e.target.value)}
                      className="w-full rounded-lg border border-[#E8DFC8] bg-[#F7F1E3]/30 px-4 py-2.5 text-right text-sm outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* روش ارسال */}
              <div className="rounded-xl border border-[#E8DFC8] bg-white p-6">
                <h2 className="mb-5 text-lg font-bold text-gray-800">
                  روش ارسال
                </h2>

                <div className="space-y-3">
                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-[#E8DFC8] p-4 transition hover:bg-[#F7F1E3]/30">
                    <input
                      type="radio"
                      name="shipping"
                      value="post"
                      checked={shipping === "post"}
                      onChange={() => setShipping("post")}
                      className="h-4 w-4 accent-amber-500"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-bold text-gray-800">
                        پست پیشتاز
                      </div>
                      <div className="text-xs text-gray-500">
                        ۳ تا ۵ روز کاری
                      </div>
                    </div>
                    <div className="text-sm font-bold text-gray-900">
                      ۸۰,۰۰۰ تومان
                    </div>
                  </label>

                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-[#E8DFC8] p-4 transition hover:bg-[#F7F1E3]/30">
                    <input
                      type="radio"
                      name="shipping"
                      value="pickup"
                      checked={shipping === "pickup"}
                      onChange={() => setShipping("pickup")}
                      className="h-4 w-4 accent-amber-500"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-bold text-gray-800">
                        تحویل حضوری
                      </div>
                      <div className="text-xs text-gray-500">
                        مراجعه به فروشگاه در بانه
                      </div>
                    </div>
                    <div className="text-sm font-bold text-green-600">
                      رایگان
                    </div>
                  </label>
                </div>
              </div>

              {/* روش پرداخت */}
              <div className="rounded-xl border border-[#E8DFC8] bg-white p-6">
                <h2 className="mb-5 text-lg font-bold text-gray-800">
                  روش پرداخت
                </h2>

                <div className="space-y-3">
                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-[#E8DFC8] p-4 transition hover:bg-[#F7F1E3]/30">
                    <input
                      type="radio"
                      name="payment"
                      value="online"
                      checked={payment === "online"}
                      onChange={() => setPayment("online")}
                      className="h-4 w-4 accent-amber-500"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-bold text-gray-800">
                        پرداخت آنلاین
                      </div>
                      <div className="text-xs text-gray-500">
                        درگاه پرداخت امن
                      </div>
                    </div>
                    <span className="text-xl">💳</span>
                  </label>

                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-[#E8DFC8] p-4 transition hover:bg-[#F7F1E3]/30">
                    <input
                      type="radio"
                      name="payment"
                      value="cash"
                      checked={payment === "cash"}
                      onChange={() => setPayment("cash")}
                      className="h-4 w-4 accent-amber-500"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-bold text-gray-800">
                        پرداخت در محل
                      </div>
                      <div className="text-xs text-gray-500">
                        هنگام تحویل کالا
                      </div>
                    </div>
                    <span className="text-xl">💵</span>
                  </label>
                </div>
              </div>

              {/* توضیحات */}
              <div className="rounded-xl border border-[#E8DFC8] bg-white p-6">
                <h2 className="mb-3 text-lg font-bold text-gray-800">
                  توضیحات سفارش (اختیاری)
                </h2>
                <textarea
                  rows={3}
                  value={form.note}
                  onChange={(e) => updateField("note", e.target.value)}
                  placeholder="مثلاً: لطفاً قبل از ارسال تماس بگیرید"
                  className="w-full resize-none rounded-lg border border-[#E8DFC8] bg-[#F7F1E3]/30 px-4 py-2.5 text-sm outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* خلاصه سفارش - سمت چپ */}
            <aside className="sticky top-4 h-fit space-y-4">
              {/* لیست محصولات */}
              <div className="rounded-xl border border-[#E8DFC8] bg-white p-5">
                <h2 className="mb-4 border-b border-[#EDE4CE] pb-3 text-lg font-bold text-gray-800">
                  سفارش شما ({totalItems} کالا)
                </h2>

                <div className="max-h-[280px] space-y-3 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border border-[#EDE4CE] bg-gray-50">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="line-clamp-1 text-xs font-semibold text-gray-800">
                          {item.name}
                        </div>
                        <div className="mt-1 flex items-center justify-between text-xs">
                          <span className="text-gray-500">
                            {item.quantity} عدد
                          </span>
                          <span className="font-bold text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* جمع کل */}
              <div className="rounded-xl border border-[#E8DFC8] bg-white p-5">
                <div className="space-y-3 border-b border-[#EDE4CE] pb-4 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>جمع کالاها</span>
                    <span className="font-bold text-gray-800">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>هزینه ارسال</span>
                    <span
                      className={
                        shippingCost === 0
                          ? "font-bold text-green-600"
                          : "font-bold text-gray-800"
                      }
                    >
                      {shippingCost === 0 ? "رایگان" : formatPrice(shippingCost)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-base font-bold text-gray-800">
                    مبلغ قابل پرداخت
                  </span>
                  <span className="text-lg font-black text-gray-900">
                    {formatPrice(finalPrice)}
                  </span>
                </div>

                <button
                  type="button"
                  className="mt-5 w-full rounded-lg bg-green-700 py-3 text-base font-bold text-white transition hover:bg-green-800"
                >
                  ثبت نهایی سفارش
                </button>

                <p className="mt-3 text-center text-xs text-gray-500">
                  با ثبت سفارش، <a href="/rules" className="text-amber-600 hover:underline">قوانین و مقررات</a> را می‌پذیرید.
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}