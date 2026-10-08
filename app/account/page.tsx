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

  const inputCls =
    "w-full rounded-lg border border-theme bg-theme-surface px-4 py-2.5 text-sm outline-none transition focus:border-accent";

  return (
    <main className="min-h-screen bg-theme">
      <Header />

      <div className="mx-auto max-w-[1600px] px-6 py-8">
        {/* مسیر ناوبری */}
        <nav className="mb-6 text-sm text-theme-muted">
          <a href="/" className="transition hover:text-accent">
            خانه
          </a>
          <span className="mx-2">/</span>
          <span className="text-theme">حساب کاربری</span>
        </nav>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* سایدبار */}
          <aside className="space-y-4">
            {/* کارت کاربر */}
            <div className="rounded-2xl border border-theme bg-theme-card p-6 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent text-4xl text-white">
                👤
              </div>
              <h3 className="mt-4 text-base font-bold text-theme">
                علی محمدی
              </h3>
              <p className="mt-1 text-sm text-theme-muted" dir="ltr">
                09123456789
              </p>
            </div>

            {/* منو */}
            <div className="rounded-2xl border border-theme bg-theme-card p-2">
              {menuItems.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActive(item.key)}
                  className={
                    "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-right text-sm font-semibold transition " +
                    (active === item.key
                      ? "bg-accent/10 text-accent"
                      : "text-theme-muted hover:bg-theme-surface")
                  }
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}

              <div className="my-2 border-t border-theme"></div>

              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-right text-sm font-semibold text-red-500 transition hover:bg-red-500/10"
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
                      className="rounded-2xl border border-theme bg-theme-card p-5"
                    >
                      <span className="text-3xl">{stat.icon}</span>
                      <div className="mt-3 text-2xl font-black text-accent">
                        {stat.value}
                      </div>
                      <div className="mt-1 text-sm font-semibold text-theme-muted">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* آخرین سفارش‌ها */}
                <div className="rounded-2xl border border-theme bg-theme-card p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-theme">
                      آخرین سفارش‌ها
                    </h2>
                    <button
                      type="button"
                      onClick={() => setActive("orders")}
                      className="text-sm font-semibold text-accent hover:underline"
                    >
                      مشاهده همه ←
                    </button>
                  </div>

                  <div className="space-y-3">
                    {mockOrders.slice(0, 2).map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between rounded-lg border border-theme bg-theme-surface p-4"
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-xl">
                            📦
                          </span>
                          <div>
                            <div className="text-sm font-bold text-theme">
                              سفارش {order.id}
                            </div>
                            <div className="text-xs text-theme-muted">
                              {order.date}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm font-bold text-theme">
                          {formatPrice(order.total)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* پروفایل کامل */}
                <div className="rounded-2xl border border-theme bg-theme-card p-6">
                  <h2 className="mb-5 text-lg font-bold text-theme">
                    اطلاعات حساب
                  </h2>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-theme-muted">
                        نام و نام خانوادگی
                      </label>
                      <input
                        type="text"
                        defaultValue="علی محمدی"
                        className={inputCls}
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-theme-muted">
                        شماره موبایل
                      </label>
                      <input
                        type="tel"
                        dir="ltr"
                        defaultValue="09123456789"
                        className={`${inputCls} text-right`}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-1.5 block text-sm font-semibold text-theme-muted">
                        ایمیل
                      </label>
                      <input
                        type="email"
                        dir="ltr"
                        placeholder="example@email.com"
                        className={`${inputCls} text-right`}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    className="mt-5 rounded-lg bg-accent px-6 py-3 text-sm font-bold text-white transition hover:bg-accent-hover"
                  >
                    ذخیره تغییرات
                  </button>
                </div>
              </div>
            )}

            {/* سفارش‌ها */}
            {active === "orders" && (
              <div className="rounded-2xl border border-theme bg-theme-card p-6">
                <h2 className="mb-5 text-lg font-bold text-theme">
                  سفارش‌های من
                </h2>

                <div className="space-y-4">
                  {mockOrders.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-xl border border-theme p-5 transition hover:shadow-md"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-theme pb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-theme">
                            سفارش {order.id}
                          </span>
                          <span
                            className={
                              "rounded-full px-3 py-1 text-xs font-bold " +
                              (order.statusColor === "green"
                                ? "bg-green-500/10 text-green-500"
                                : order.statusColor === "amber"
                                ? "bg-accent/10 text-accent"
                                : "bg-blue-500/10 text-blue-500")
                            }
                          >
                            {order.status}
                          </span>
                        </div>
                        <span className="text-xs text-theme-muted">
                          {order.date}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <div className="text-sm text-theme-muted">
                          {order.items} محصول
                        </div>
                        <div className="text-base font-bold text-theme">
                          {formatPrice(order.total)}
                        </div>
                        <button
                          type="button"
                          className="rounded-lg border border-accent px-4 py-2 text-sm font-bold text-accent transition hover:bg-accent/10"
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
              <div className="rounded-2xl border border-theme bg-theme-card p-6">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-theme">
                    آدرس‌های من
                  </h2>
                  <button
                    type="button"
                    className="rounded-lg bg-accent px-4 py-2 text-sm font-bold text-white transition hover:bg-accent-hover"
                  >
                    + افزودن آدرس
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    {
                      title: "خانه",
                      address:
                        "کردستان - بانه - کوچه پاساژ نور - پاساژ ارغوانی - بلوک ۲",
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
                          ? "border-accent bg-accent/5"
                          : "border-theme")
                      }
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-theme">
                          {addr.title}
                        </h3>
                        {addr.isDefault && (
                          <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-white">
                            پیش‌فرض
                          </span>
                        )}
                      </div>
                      <p className="mt-3 text-sm leading-7 text-theme-muted">
                        {addr.address}
                      </p>
                      <p className="mt-2 text-sm text-theme-muted" dir="ltr">
                        {addr.phone}
                      </p>
                      <div className="mt-4 flex gap-2">
                        <button
                          type="button"
                          className="text-sm font-semibold text-accent hover:underline"
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
              <div className="rounded-2xl border border-theme bg-theme-card p-6">
                <h2 className="mb-5 text-lg font-bold text-theme">
                  علاقه‌مندی‌های من
                </h2>

                <div className="rounded-xl border-2 border-dashed border-theme bg-theme-surface p-12 text-center">
                  <p className="text-5xl">❤️</p>
                  <p className="mt-4 text-base font-bold text-theme">
                    هنوز محصولی به علاقه‌مندی‌ها اضافه نکرده‌اید
                  </p>
                  <a
                    href="/products"
                    className="mt-5 inline-block rounded-lg bg-accent px-6 py-3 text-sm font-bold text-white transition hover:bg-accent-hover"
                  >
                    مشاهده محصولات
                  </a>
                </div>
              </div>
            )}

            {/* پروفایل */}
            {active === "profile" && (
              <div className="rounded-2xl border border-theme bg-theme-card p-6">
                <h2 className="mb-5 text-lg font-bold text-theme">
                  اطلاعات حساب
                </h2>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-theme-muted">
                      نام و نام خانوادگی
                    </label>
                    <input
                      type="text"
                      defaultValue="علی محمدی"
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-theme-muted">
                      شماره موبایل
                    </label>
                    <input
                      type="tel"
                      dir="ltr"
                      defaultValue="09123456789"
                      className={`${inputCls} text-right`}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-1.5 block text-sm font-semibold text-theme-muted">
                      ایمیل
                    </label>
                    <input
                      type="email"
                      dir="ltr"
                      placeholder="example@email.com"
                      className={`${inputCls} text-right`}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-1.5 block text-sm font-semibold text-theme-muted">
                      رمز عبور جدید (اختیاری)
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className={inputCls}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-5 rounded-lg bg-accent px-6 py-3 text-sm font-bold text-white transition hover:bg-accent-hover"
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