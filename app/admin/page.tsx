"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useProducts } from "@/components/context/ProductsContext";
import AnalyticsSection from "@/components/admin/AnalyticsSection";
import AccountingSection from "@/components/admin/AccountingSection";
import AdminSidebar from "@/components/admin/AdminSidebar";

type DiscountStats = {
  total: number;
  active: number;
  recent: {
    id: string;
    code: string;
    type: "percent" | "fixed";
    value: number;
    is_active: boolean;
    used_count: number;
  }[];
};

type QuickLinkItem = {
  id: string;
  title: string;
  icon: string;
  href: string;
  description: string;
  active: boolean;
  badge?: string | number;
  category: "shop" | "cms" | "marketing" | "system";
};

export default function AdminPage() {
  const router = useRouter();
  const supabase = createClient();
  const { products, loading: productsLoading } = useProducts();

  const [stats, setStats] = useState<DiscountStats>({
    total: 0,
    active: 0,
    recent: [],
  });
  const [orderCount, setOrderCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "all" | "shop" | "cms" | "marketing"
  >("all");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);

      const { data: discountData } = await supabase
        .from("discount_codes")
        .select("id, code, type, value, is_active, used_count")
        .order("created_at", { ascending: false });

      const all = discountData ?? [];
      setStats({
        total: all.length,
        active: all.filter((c) => c.is_active).length,
        recent: all.slice(0, 5),
      });

      const { data: orders } = await supabase.from("orders").select("status");
      if (orders) {
        setOrderCount(orders.length);
        setPendingCount(orders.filter((o) => o.status === "pending").length);
      }

      setLoading(false);
    }

    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const quickLinks: QuickLinkItem[] = useMemo(
    () => [
      {
        id: "products",
        title: "محصولات",
        icon: "📦",
        href: "/admin/products",
        description: "مدیریت موجودی، قیمت و مشخصات کالاها",
        active: true,
        category: "shop",
      },
      {
        id: "orders",
        title: "سفارشات",
        icon: "🛒",
        href: "/admin/orders",
        description: "بررسی سفارش‌های جدید و پیگیری ارسال",
        active: true,
        badge: pendingCount > 0 ? `${pendingCount} جدید` : undefined,
        category: "shop",
      },
      {
        id: "categories",
        title: "دسته‌بندی‌ها",
        icon: "🖼️",
        href: "/admin/categories",
        description: "مدیریت تصاویر و آیکون دسته‌بندی‌ها",
        active: true,
        category: "shop",
      },
      {
        id: "brands",
        title: "برندها",
        icon: "🏷️",
        href: "/admin/brands",
        description: "لوگو و اسامی برندهای کمپینگ",
        active: true,
        category: "shop",
      },
      {
        id: "hero",
        title: "بنر اصلی (Hero)",
        icon: "🎬",
        href: "/admin/hero-slides",
        description: "ویرایش اسلایدر بالای صفحه اصلی",
        active: true,
        category: "cms",
      },
      {
        id: "category-showcase",
        title: "ویترین محصولات",
        icon: "🐕",
        href: "/admin/category-showcase",
        description: "تنظیم کاروسل ۳بعدی محصولات",
        active: true,
        category: "cms",
      },
      {
        id: "black-dog-steps",
        title: "مراحل برپا کردن",
        icon: "🏕️",
        href: "/admin/black-dog-steps",
        description: "ویرایش ویدیوها و راهنمای کمپ",
        active: true,
        category: "cms",
      },
      {
        id: "about",
        title: "درباره ما",
        icon: "📄",
        href: "/admin/about",
        description: "ویرایش داستان برند و تصاویر",
        active: true,
        category: "cms",
      },
      {
        id: "discounts",
        title: "کدهای تخفیف",
        icon: "🎟️",
        href: "/admin/discounts",
        description: "تعریف کوپن تخفیف درصدی و عددی",
        active: true,
        category: "marketing",
      },
      {
        id: "theme",
        title: "تنظیمات تم",
        icon: "🎨",
        href: "/admin/theme",
        description: "تغییر رنگ اصلی و ظاهر سایت",
        active: true,
        category: "system",
      },
    ],
    [pendingCount]
  );

  const filteredLinks = useMemo(() => {
    return quickLinks.filter((item) => {
      const matchesTab = activeTab === "all" || item.category === activeTab;
      const matchesSearch =
        item.title.includes(searchQuery) ||
        item.description.includes(searchQuery);
      return matchesTab && matchesSearch;
    });
  }, [quickLinks, activeTab, searchQuery]);

  const statCards = [
    {
      title: "محصولات فعال",
      value: products.length.toLocaleString("fa-IR"),
      icon: "📦",
      href: "/admin/products",
    },
    {
      title: "کدهای تخفیف",
      value: stats.total.toLocaleString("fa-IR"),
      icon: "🎟️",
      href: "/admin/discounts",
    },
    {
      title: "سفارشات کل",
      value: orderCount.toLocaleString("fa-IR"),
      icon: "🛒",
      href: "/admin/orders",
      badge: pendingCount > 0 ? `${pendingCount} جدید` : undefined,
    },
    {
      title: "پایگاه داده",
      value: "پایدار",
      icon: "⚡",
      href: "#analytics",
    },
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
        <div className="mx-auto max-w-7xl space-y-6">
          {/* هدر */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
                  🎛️ مرکز مدیریت فروشگاه
                </h1>
                <p className="mt-1 text-xs text-theme-muted">
                  مدیریت محصولات، سفارش‌ها، بنرها و ظاهر لایو سایت
                </p>
              </div>
            </div>

            <input
              type="text"
              placeholder="جستجو در بخش‌ها..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-xs rounded-xl border border-theme bg-theme-card px-3.5 py-2 text-xs text-theme outline-none transition placeholder:text-theme-muted focus:border-accent"
            />
          </div>

          {/* کارت‌های KPI */}
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {statCards.map((card, i) => (
              <a
                key={i}
                href={card.href}
                className="group rounded-2xl border border-theme bg-theme-card p-4 transition hover:border-accent hover:shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-theme-muted">
                    {card.title}
                  </span>
                  <span className="text-lg">{card.icon}</span>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-xl font-black text-theme">
                    {loading || productsLoading ? "..." : card.value}
                  </span>
                  {card.badge && (
                    <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[9px] font-bold text-red-500">
                      {card.badge}
                    </span>
                  )}
                </div>
              </a>
            ))}
          </section>

          {/* آنالیتیکس */}
          <section id="analytics">
            <AnalyticsSection />
          </section>
                    {/* 🆕 حسابداری */}
          <section id="accounting">
            <AccountingSection />
          </section>

          {/* ابزارها و کدهای اخیر */}
          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-1 overflow-x-auto pb-1">
                  {[
                    { id: "all", label: "همه" },
                    { id: "shop", label: "🛒 فروشگاه" },
                    { id: "cms", label: "🎨 محتوا" },
                    { id: "marketing", label: "🎟️ مارکتینگ" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                        activeTab === tab.id
                          ? "bg-accent text-white"
                          : "border border-theme bg-theme-card text-theme-muted hover:text-theme"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {filteredLinks.length === 0 ? (
                <div className="rounded-2xl border border-theme bg-theme-card p-8 text-center text-xs text-theme-muted">
                  موردی یافت نشد
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {filteredLinks.map((item) => (
                    <a
                      key={item.id}
                      href={item.active ? item.href : "#"}
                      className={`group flex items-start gap-3 rounded-2xl border p-3.5 transition ${
                        item.active
                          ? "border-theme bg-theme-card hover:border-accent hover:shadow-sm"
                          : "cursor-not-allowed border-theme bg-theme-surface/30 opacity-40"
                      }`}
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-theme-surface text-base">
                        {item.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-xs font-bold text-theme group-hover:text-accent">
                            {item.title}
                          </p>
                          {item.badge && (
                            <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[9px] font-bold text-red-500">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 line-clamp-1 text-[11px] text-theme-muted">
                          {item.description}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* تخفیف‌های اخیر */}
            <div className="space-y-3 rounded-2xl border border-theme bg-theme-card p-4">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-1.5 text-xs font-black text-theme">
                  <span>🎟️</span> تخفیف‌های اخیر
                </h3>
                <a
                  href="/admin/discounts"
                  className="text-[11px] font-bold text-accent hover:underline"
                >
                  همه ←
                </a>
              </div>

              {loading ? (
                <div className="py-6 text-center text-xs text-theme-muted">
                  بارگذاری...
                </div>
              ) : stats.recent.length === 0 ? (
                <div className="py-6 text-center text-xs text-theme-muted">
                  کدی ثبت نشده
                </div>
              ) : (
                <div className="space-y-2">
                  {stats.recent.map((code) => (
                    <div
                      key={code.id}
                      className="flex items-center justify-between rounded-xl border border-theme bg-theme-surface/50 px-3 py-2"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            code.is_active ? "bg-green-500" : "bg-zinc-400"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => handleCopyCode(code.code)}
                          className="font-mono text-xs font-bold text-theme transition hover:text-accent"
                        >
                          {code.code}
                          {copiedCode === code.code && (
                            <span className="mr-1 text-[9px] text-green-500">
                              کپی شد!
                            </span>
                          )}
                        </button>
                      </div>
                      <div className="text-left text-xs font-bold text-theme">
                        {code.type === "percent"
                          ? `${code.value}٪`
                          : `${code.value} ت`}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}