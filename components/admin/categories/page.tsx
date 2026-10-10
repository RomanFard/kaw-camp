"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import PopularTab from "@/components/admin/categories/PopularTab";
import SpecialTab from "@/components/admin/categories/SpecialTab";
import MobileTab from "@/components/admin/categories/MobileTab";
import PhotosTab from "@/components/admin/categories/PhotosTab";

type Tab = "products" | "photos" | "special" | "popular" | "mobile";

export default function AdminCategoriesPage() {
  const [tab, setTab] = useState<Tab>("popular");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs: { key: Tab; label: string }[] = [
    { key: "popular", label: "🔥 محبوب" },
    { key: "special", label: "✨ ویژه" },
    { key: "mobile", label: "📱 موبایل" },
    { key: "photos", label: "🖼 عکس‌ها" },
    { key: "products", label: "📦 محصولات" },
  ];

  return (
    <div dir="rtl" className="flex min-h-screen bg-theme text-theme">
      {/* Backdrop موبایل */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
        />
      )}

      {/* سایدبار */}
      <AdminSidebar
        isMobileMenuOpen={isMobileMenuOpen}
        onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
      />

      {/* محتوای اصلی */}
      <main className="flex-1 overflow-x-hidden p-4 pb-12 sm:p-8">
        <div className="mx-auto max-w-7xl">
          {/* هدر */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-theme bg-theme-card text-theme transition hover:bg-theme-surface md:hidden"
                aria-label="باز کردن منو"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.2}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
                  />
                </svg>
              </button>

              <div>
                <h1 className="text-2xl font-black text-theme">
                  🗂 مدیریت دسته‌بندی‌ها
                </h1>
                <p className="mt-1 text-xs text-theme-muted">
                  مدیریت کامل دسته‌بندی‌های محبوب، ویژه، منوی موبایل و عکس‌ها
                </p>
              </div>
            </div>
          </div>

          {/* تب‌ها */}
          <div className="mb-6 flex flex-wrap gap-2 border-b border-theme pb-3">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={
                  "rounded-xl px-4 py-2 text-xs font-bold transition md:text-sm " +
                  (tab === t.key
                    ? "bg-accent text-white shadow-sm"
                    : "border border-theme bg-theme-card text-theme-muted hover:border-accent/50 hover:text-theme")
                }
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* محتوای تب */}
          <div className="rounded-2xl border border-theme bg-theme-card p-5 shadow-sm">
            {tab === "popular" && <PopularTab />}
            {tab === "special" && <SpecialTab />}
            {tab === "mobile" && <MobileTab />}
               {tab === "photos" && <PhotosTab />}
            {tab === "products" && (
              <div className="p-8 text-center">
                <p className="mb-4 text-xs text-theme-muted">
                  برای مدیریت محصولات به صفحه محصولات برو
                </p>
                <a
                  href="/admin/products"
                  className="inline-block rounded-xl bg-accent px-6 py-3 text-xs font-bold text-white shadow-sm transition hover:opacity-90"
                >
                  📦 رفتن به مدیریت محصولات
                </a>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}