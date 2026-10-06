"use client";

import { useState } from "react";
import PopularTab from "@/components/admin/categories/PopularTab";
import SpecialTab from "@/components/admin/categories/SpecialTab";
import MobileTab from "@/components/admin/categories/MobileTab";

type Tab = "products" | "photos" | "special" | "popular" | "mobile";

export default function AdminCategoriesPage() {
  const [tab, setTab] = useState<Tab>("popular");

  const tabs: { key: Tab; label: string }[] = [
    { key: "popular", label: "🔥 محبوب" },
    { key: "special", label: "⭐ ویژه" },
    { key: "mobile", label: "📱 موبایل" },
    { key: "photos", label: "🖼 عکس‌ها" },
    { key: "products", label: "📦 محصولات" },
  ];

  return (
    <main className="min-h-screen bg-[#F7F1E3]">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="mb-6">
          <a
            href="/admin"
            className="text-sm text-gray-500 hover:text-amber-600"
          >
            ← بازگشت به داشبورد
          </a>
          <h1 className="mt-2 text-3xl font-black text-gray-900">
            🗂 مدیریت دسته‌بندی‌ها
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            مدیریت کامل دسته‌بندی‌های محبوب، ویژه، منوی موبایل و عکس‌ها
          </p>
        </div>

        {/* تب‌ها */}
        <div className="mb-6 flex flex-wrap gap-2 border-b border-[#D4C5A0] pb-3">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={
                "rounded-lg px-4 py-2 text-sm font-bold transition " +
                (tab === t.key
                  ? "bg-[#E84C4C] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100")
              }
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* محتوای تب */}
        <div className="rounded-2xl border border-[#D4C5A0] bg-white p-5">
          {tab === "popular" && <PopularTab />}
          {tab === "special" && <SpecialTab />}
          {tab === "mobile" && <MobileTab />}
          {tab === "photos" && (
            <div className="p-8 text-center text-gray-400">
              محتوای صفحه عکس‌ها اینجا قرار می‌گیره — کد فعلی `page.tsx` رو داخل این تب پیست کن
            </div>
          )}
          {tab === "products" && (
            <div className="p-8 text-center">
              <p className="mb-4 text-gray-500">
                برای مدیریت محصولات به صفحه محصولات برو
              </p>
              <a
                href="/admin/products"
                className="rounded-lg bg-[#E84C4C] px-6 py-3 text-sm font-bold text-white"
              >
                📦 رفتن به مدیریت محصولات
              </a>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}