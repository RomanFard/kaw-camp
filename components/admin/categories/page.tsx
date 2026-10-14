"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import UnifiedTab from "@/components/admin/categories/UnifiedTab";
import GridTab from "@/components/admin/categories/GridTab";
import LinksTab from "@/components/admin/categories/LinksTab";

type Tab = "unified" | "grid" | "links";

export default function AdminCategoriesPage() {
  const [tab, setTab] = useState<Tab>("unified");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs: { key: Tab; label: string; hint?: string }[] = [
    { key: "unified", label: "🎯 یکپارچه", hint: "منبع اصلی محصولات" },
    { key: "grid", label: "🖼 گرید عکس", hint: "دسته‌بندی‌های محبوب" },
    { key: "links", label: "🔗 لینک‌ها", hint: "پایین صفحه اصلی" },
  ];

  return (
    <div dir="rtl" className="flex min-h-screen bg-theme text-theme">
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
        />
      )}

      <AdminSidebar
        isMobileMenuOpen={isMobileMenuOpen}
        onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
      />

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
                  منبع واحد همه‌ی بخش‌های سایت
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
                title={t.hint}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* محتوا */}
          <div className="rounded-2xl border border-theme bg-theme-card p-5 shadow-sm">
            {tab === "unified" && <UnifiedTab />}
            {tab === "grid" && <GridTab />}
            {tab === "links" && <LinksTab />}
          </div>
        </div>
      </main>
    </div>
  );
}