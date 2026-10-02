"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { formatPrice } from "@/lib/utils";

const menuItems = [
  { key: "dashboard", label: "داشبورد", icon: "📊" },
  { key: "orders", label: "سفارش‌های من", icon: "📦" },
  { key: "addresses", label: "آدرس‌ها", icon: "📍" },
  { key: "favorites", label: "علاقه‌مندی‌ها", icon: "❤️" },
  { key: "profile", label: "اطلاعات حساب", icon: "👤" },
];

const mockOrders = [
  {
    id: "KC-14040101",
    date: "۱۰ مهر ۱۴۰۴",
    status: "تحویل شده",
    statusColor: "green",
    total: 4_820_000,
    items: 2,
  },
  {
    id: "KC-14040802",
    date: "۲ آبان ۱۴۰۴",
    status: "در حال ارسال",
    statusColor: "amber",
    total: 1_900_000,
    items: 1,
  },
  {
    id: "KC-14041203",
    date: "۱۵ آبان ۱۴۰۴",
    status: "در حال پردازش",
    statusColor: "blue",
    total: 8_280_000,
    items: 1,
  },
];

export default function AccountPage() {
  const [active, setActive] = useState("dashboard");

  return (
    <main className="min-h-screen bg-[#F7F1E3]">
      <Header />

      <div className="mx-auto max-w-[1600px] px-6 py-8">
        {/* مسیر ناوبری */}
        <nav className="mb-6 text-sm text-gray-500">
          <a href="/" className="hover:text-amber-600">خانه</a>
          <span className="mx-2">/</span>
          <span className="text-gray-800">حساب کاربری</span>
        </nav>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* سایدبار */}
          <aside className="space-y-4">
            {/* کارت کاربر */}
            <div className="rounded-2xl border border-[#D4C5A0] bg-white p-6 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-500 text-4xl text-white">
                👤
              </div>
              <h3 className="mt-4 text-base font-bold text-gray-800">
                علی محمدی
              </h3>
              <p className="mt-1 text-sm text-gray-500" dir="ltr">
                09123456789
              </p>
            </div>

            {/* منو */}
            <div className="rounded-2xl border border-[#D4C5A0] bg-white p-2">
              {menuItems.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActive(item.key)}
                  className={
                    "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-right text-sm font-semibold transition " +
                    (active === item.key
                      ? "bg-amber-50 text-amber-600"
                      : "text-gray-700 hover:bg-[#F7F1E3]/50")
                  }
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}

              <div className="my-2 border-t border-[#EDE4CE]"></div>

              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-right text-sm font-semibold text-red-500 transition hover:bg-red-50"
              >
                <span className="text-xl">🚪</span>
                <span>خروج از حساب</span>
              </button>
            </div>
          </aside>

          {/* محتوای اصلی */}
          <div>
            {/* داشبورد */}
            {active === "dashboard" && (
              <div className="space-y-6">
                {/* کارت‌های آمار */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {[
                    { icon: "📦", label: "سفارش‌ها", value: "۳" },
                    { icon: "❤️", label: "علاقه‌مندی‌ها", value: "۱۲" },
                    { icon: "📍", label: "آدرس‌ها", value: "۲" },
                    { icon: "💬", label: "دیدگاه‌ها", value: "۵" },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-[#D4C5A0] bg-white p-5"
                    >
                      <span className="text-3xl">{stat.icon}</span>
                      <div className="mt-3 text-2xl font-black text-amber-600">
                        {stat.value}
                      </div>
                      <div className="mt-1 text-sm font-semibold text-gray-600">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* آخرین سفارش‌ها */}
                <div className="rounded-2xl border border-[#D4C5A0] bg-white p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-800">
                      آخرین سفارش‌ها
                    </h2>
                    <button
                      type="button"
                      onClick={() => setActive("orders")}
                      className="text-sm font-semibold text-amber-600 hover:underline"
                    >
                      مشاهده همه ←
                    </button>
                  </div>

                  <div className="space-y-3">
                    {mockOrders.slice(0, 2).map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between rounded-lg border border-[#EDE4CE] bg-[#F7F1E3]/30 p-4"
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-xl">
                            📦
                          </span>
                          <div>
                            <div className="text-sm font-bold text-gray-800">
                              سفارش {order.id}
                            </div>
                            <div className="text-xs text-gray-500">
                              {order.date}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm font-bold text-gray-900">
                          {formatPrice(order.total)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* پروفایل کامل */}
                <div className="rounded-2xl border border-[#D4C5A0] bg-white p-6">
                  <h2 className="mb-5 text-lg font-bold text-gray-800">
                    اطلاعات حساب
                  </h2>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                        نام و نام خانوادگی
                      </label>
                      <input
                        type="text"
                        defaultValue="علی محمدی"
                        className="w-full rounded-lg border border-[#D4C5A0] bg-[#F7F1E3]/30 px-4 py-2.5 text-sm outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                        شماره موبایل
                      </label>
                      <input
                        type="tel"
                        dir="ltr"
                        defaultValue="09123456789"
                        className="w-full rounded-lg border border-[#D4C5A0] bg-[#F7F1E3]/30 px-4 py-2.5 text-right text-sm outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                        ایمیل
                      </label>
                      <input
                        type="email"
                        dir="ltr"
                        placeholder="example@email.com"
                        className="w-full rounded-lg border border-[#D4C5A0] bg-[#F7F1E3]/30 px-4 py-2.5 text-right text-sm outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    className="mt-5 rounded-lg bg-amber-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-amber-600"
                  >
                    ذخیره تغییرات
                  </button>
                </div>
              </div>
            )}

            {/* سفارش‌ها */}
            {active === "orders" && (
              <div className="rounded-2xl border border-[#D4C5A0] bg-white p-6">
                <h2 className="mb-5 text-lg font-bold text-gray-800">
                  سفارش‌های من
                </h2>

                <div className="space-y-4">
                  {mockOrders.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-xl border border-[#EDE4CE] p-5 transition hover:shadow-md"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EDE4CE] pb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-gray-800">
                            سفارش {order.id}
                          </span>
                          <span
                            className={
                              "rounded-full px-3 py-1 text-xs font-bold " +
                              (order.statusColor === "green"
                                ? "bg-green-100 text-green-700"
                                : order.statusColor === "amber"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-blue-100 text-blue-700")
                            }
                          >
                            {order.status}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {order.date}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <div className="text-sm text-gray-600">
                          {order.items} محصول
                        </div>
                        <div className="text-base font-bold text-gray-900">
                          {formatPrice(order.total)}
                        </div>
                        <button
                          type="button"
                          className="rounded-lg border border-amber-500 px-4 py-2 text-sm font-bold text-amber-600 transition hover:bg-amber-50"
                        >
                          جزئیات سفارش
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* آدرس‌ها */}
            {active === "addresses" && (
              <div className="rounded-2xl border border-[#D4C5A0] bg-white p-6">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-800">
                    آدرس‌های من
                  </h2>
                  <button
                    type="button"
                    className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-amber-600"
                  >
                    + افزودن آدرس
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    {
                      title: "خانه",
                      address: "کردستان - بانه - کوچه پاساژ نور - پاساژ ارغوانی - بلوک ۲",
                      phone: "09180540019",
                      isDefault: true,
                    },
                    {
                      title: "محل کار",
                      address: "تهران - خیابان ولیعصر - پلاک ۱۲۳ - طبقه ۴",
                      phone: "09123456789",
                      isDefault: false,
                    },
                  ].map((addr, i) => (
                    <div
                      key={i}
                      className={
                        "rounded-xl border p-5 " +
                        (addr.isDefault
                          ? "border-amber-500 bg-amber-50/30"
                          : "border-[#EDE4CE]")
                      }
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-gray-800">
                          {addr.title}
                        </h3>
                        {addr.isDefault && (
                          <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white">
                            پیش‌فرض
                          </span>
                        )}
                      </div>
                      <p className="mt-3 text-sm leading-7 text-gray-600">
                        {addr.address}
                      </p>
                      <p className="mt-2 text-sm text-gray-500" dir="ltr">
                        {addr.phone}
                      </p>
                      <div className="mt-4 flex gap-2">
                        <button
                          type="button"
                          className="text-sm font-semibold text-amber-600 hover:underline"
                        >
                          ویرایش
                        </button>
                        <button
                          type="button"
                          className="text-sm font-semibold text-red-500 hover:underline"
                        >
                          حذف
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* علاقه‌مندی‌ها */}
            {active === "favorites" && (
              <div className="rounded-2xl border border-[#D4C5A0] bg-white p-6">
                <h2 className="mb-5 text-lg font-bold text-gray-800">
                  علاقه‌مندی‌های من
                </h2>

                <div className="rounded-xl border-2 border-dashed border-[#D4C5A0] bg-[#F7F1E3]/30 p-12 text-center">
                  <p className="text-5xl">❤️</p>
                  <p className="mt-4 text-base font-bold text-gray-700">
                    هنوز محصولی به علاقه‌مندی‌ها اضافه نکرده‌اید
                  </p>
                  <a
                    href="/products"
                    className="mt-5 inline-block rounded-lg bg-amber-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-amber-600"
                  >
                    مشاهده محصولات
                  </a>
                </div>
              </div>
            )}

            {/* پروفایل */}
            {active === "profile" && (
              <div className="rounded-2xl border border-[#D4C5A0] bg-white p-6">
                <h2 className="mb-5 text-lg font-bold text-gray-800">
                  اطلاعات حساب
                </h2>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                      نام و نام خانوادگی
                    </label>
                    <input
                      type="text"
                      defaultValue="علی محمدی"
                      className="w-full rounded-lg border border-[#D4C5A0] bg-[#F7F1E3]/30 px-4 py-2.5 text-sm outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                      شماره موبایل
                    </label>
                    <input
                      type="tel"
                      dir="ltr"
                      defaultValue="09123456789"
                      className="w-full rounded-lg border border-[#D4C5A0] bg-[#F7F1E3]/30 px-4 py-2.5 text-right text-sm outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                      ایمیل
                    </label>
                    <input
                      type="email"
                      dir="ltr"
                      placeholder="example@email.com"
                      className="w-full rounded-lg border border-[#D4C5A0] bg-[#F7F1E3]/30 px-4 py-2.5 text-right text-sm outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                      رمز عبور جدید (اختیاری)
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full rounded-lg border border-[#D4C5A0] bg-[#F7F1E3]/30 px-4 py-2.5 text-sm outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-5 rounded-lg bg-amber-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-amber-600"
                >
                  ذخیره تغییرات
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}