"use client";

import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

type NavItem = {
  id: string;
  label: string;
  icon: string;
  href: string;
  badge?: number;
};

// 🆕 «داشبورد» از این لیست حذف شد چون دکمه بالای منو هست
const NAV_ITEMS: NavItem[] = [
  { id: "products", label: "محصولات", icon: "📦", href: "/admin/products" },
  { id: "orders", label: "سفارشات", icon: "🛒", href: "/admin/orders" },
  { id: "discounts", label: "کدهای تخفیف", icon: "🎟️", href: "/admin/discounts" },
  { id: "accounting", label: "حسابداری", icon: "💰", href: "/admin/accounting" },
  { id: "categories", label: "دسته‌بندی‌ها", icon: "🖼️", href: "/admin/categories" },
  { id: "brands", label: "برندها", icon: "🏷️", href: "/admin/brands" },
  { id: "hero-slides", label: "بنر اصلی", icon: "🎬", href: "/admin/hero-slides" },
  { id: "category-showcase", label: "ویترین بلک داگ", icon: "🐕", href: "/admin/category-showcase" },
  { id: "black-dog-steps", label: "مراحل برپا کردن", icon: "🏕️", href: "/admin/black-dog-steps" },
  { id: "about", label: "درباره ما", icon: "📄", href: "/admin/about" },
  { id: "theme", label: "تنظیمات تم", icon: "🎨", href: "/admin/theme" },
];

export default function AdminSidebar({
  isMobileMenuOpen,
  onCloseMobileMenu,
}: {
  isMobileMenuOpen?: boolean;
  onCloseMobileMenu?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const [collapsed, setCollapsed] = useState(false);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  function isActive(href: string): boolean {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  const isOnDashboard = pathname === "/admin";

  return (
    <aside
      className={`fixed inset-y-0 right-0 z-50 flex flex-col border-l border-theme bg-theme-card transition-all duration-300 md:static md:translate-x-0 ${
        collapsed ? "md:w-20" : "md:w-64"
      } w-64 ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}`}
    >
      {/* ─── هدر سایدبار ─── */}
      <div className="flex h-16 items-center justify-between border-b border-theme px-4">
        <div className="flex items-center gap-3 overflow-hidden">
          {/* 🆕 لوگو → می‌ره به /admin */}
          <a
            href="/admin"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-sm font-black text-white transition hover:opacity-90"
            title="داشبورد ادمین"
          >
            KAW
          </a>
          {!collapsed && (
            <a
              href="/admin"
              className="truncate text-sm font-black text-theme transition hover:text-accent"
              title="داشبورد ادمین"
            >
              KAW CAMP Admin
            </a>
          )}
        </div>

        {/* دکمه بستن موبایل */}
        <button
          type="button"
          onClick={onCloseMobileMenu}
          className="rounded-lg p-1.5 text-theme-muted transition hover:bg-theme-surface hover:text-theme md:hidden"
          aria-label="بستن منو"
        >
          ✕
        </button>

        {/* دکمه collapse دسکتاپ */}
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="hidden rounded-lg p-1.5 text-theme-muted transition hover:bg-theme-surface hover:text-theme md:block"
          aria-label="جمع کردن منو"
        >
          {collapsed ? "◀" : "▶"}
        </button>
      </div>

      {/* ─── منوی اصلی ─── */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {/* 🆕 آیتم داشبورد — فقط اینجا، با highlight */}
        <a
          href="/admin"
          onClick={onCloseMobileMenu}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition ${
            isOnDashboard
              ? "bg-accent text-white shadow-sm"
              : "text-theme-muted hover:bg-theme-surface hover:text-theme"
          }`}
        >
          <span className="text-base">🎛️</span>
          {!collapsed && <span>داشبورد</span>}
        </a>

        {/* بقیه آیتم‌ها */}
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <a
              key={item.id}
              href={item.href}
              onClick={onCloseMobileMenu}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition ${
                active
                  ? "bg-accent text-white shadow-sm"
                  : "text-theme-muted hover:bg-theme-surface hover:text-theme"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && item.badge && item.badge > 0 && (
                <span className="mr-auto rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-black text-white">
                  {item.badge.toLocaleString("fa-IR")}
                </span>
              )}
            </a>
          );
        })}
      </nav>

      {/* ─── فوتر سایدبار ─── */}
      <div className="space-y-1 border-t border-theme p-3">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-bold text-theme-muted transition hover:bg-theme-surface hover:text-theme"
        >
          <span>🌐</span>
          {!collapsed && <span>مشاهده سایت</span>}
        </a>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-bold text-red-500 transition hover:bg-red-500/10"
        >
          <span>🚪</span>
          {!collapsed && <span>خروج از حساب</span>}
        </button>
      </div>
    </aside>
  );
}