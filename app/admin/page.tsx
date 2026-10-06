"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useProducts } from "@/components/context/ProductsContext";
import AnalyticsSection from "@/components/admin/AnalyticsSection";

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

  useEffect(() => {
    async function loadStats() {
      setLoading(true);

      const { data, error } = await supabase
        .from("discount_codes")
        .select("id, code, type, value, is_active, used_count")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading stats:", error);
      } else {
        const all = data ?? [];
        setStats({
          total: all.length,
          active: all.filter((c) => c.is_active).length,
          recent: all.slice(0, 5),
        });
      }

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

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  const statCards = [
    {
      title: "محصولات",
      value: products.length.toLocaleString("fa-IR"),
      icon: "📦",
      color: "from-blue-400 to-blue-600",
      href: "/admin/products",
      note: "فعال در فروشگاه",
    },
    {
      title: "کدهای تخفیف",
      value: stats.total.toLocaleString("fa-IR"),
      icon: "🎟️",
      color: "from-amber-400 to-amber-600",
      href: "/admin/discounts",
      note: `${stats.active.toLocaleString("fa-IR")} کد فعال`,
    },
    {
      title: "سفارشات",
      value: orderCount.toLocaleString("fa-IR"),
      icon: "🛒",
      color: "from-green-400 to-green-600",
      href: "/admin/orders",
      note: `${pendingCount.toLocaleString("fa-IR")} در انتظار تأیید`,
    },
    {
      title: "کاربران",
      value: "—",
      icon: "👥",
      color: "from-gray-300 to-gray-400",
      href: "#",
      note: "به‌زودی فعال می‌شود",
      disabled: true,
    },
  ];

  const quickLinks = [
    {
      title: "تنظیمات تم",
      icon: "🎨",
      href: "/admin/theme",
      description: "رنگ اصلی و بک‌گراند لایو",
      active: true,
    },
    {
      title: "کدهای تخفیف",
      icon: "🎟️",
      href: "/admin/discounts",
      description: "افزودن، ویرایش و مدیریت کدها",
      active: true,
    },
    {
      title: "بنر اصلی",
      icon: "🎬",
      href: "/admin/hero-slides",
      description: "مدیریت اسلایدهای صفحه اصلی",
      active: true,
    },
    {
      title: "بخش درباره ما",
      icon: "📄",
      href: "/admin/about",
      description: "ویرایش متن و تصویر بخش درباره ما",
      active: true,
    },
    {
      title: "برندها",
      icon: "🏷️",
      href: "/admin/brands",
      description: "مدیریت برندهای نمایش داده شده",
      active: true,
    },
    {
      title: "دسته‌بندی‌ها",
      icon: "🖼️",
      href: "/admin/categories",
      description: "مدیریت تصاویر دسته‌بندی‌ها",
      active: true,
    },
    {
      title: "محصولات",
      icon: "📦",
      href: "/admin/products",
      description: "افزودن، ویرایش و حذف محصولات",
      active: true,
    },
    {
      title: "سفارشات",
      icon: "🛒",
      href: "/admin/orders",
      description: "مدیریت و پیگیری سفارشات",
      active: true,
    },
    {
      title: "مقالات",
      icon: "📝",
      href: "#",
      description: "به‌زودی...",
      active: false,
    },
  ];

  return (
    <main className="min-h-screen bg-[#F7F1E3]">
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-black text-gray-900">
              🎛️ پنل مدیریت KAW CAMP
            </h1>
            <p className="mt-1 text-sm text-gray-500">نمای کلی فروشگاه</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="/admin/theme"
              className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-amber-600"
            >
              🎨 تنظیمات تم
            </a>
            <a
              href="/admin/hero-slides"
              className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-amber-600"
            >
              🎬 مدیریت بنر
            </a>
            <a
              href="/admin/about"
              className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-amber-600"
            >
              📄 درباره ما
            </a>
            <a
              href="/admin/products"
              className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-amber-600"
            >
              📦 محصولات
            </a>
            <a
              href="/admin/discounts"
              className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-amber-600"
            >
              🎟️ کدهای تخفیف
            </a>
            <a
              href="/admin/orders"
              className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-amber-600"
            >
              🛒 سفارشات
            </a>
            <a
              href="/admin/brands"
              className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-amber-600"
            >
              🏷️ برندها
            </a>
            <a
              href="/admin/categories"
              className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-amber-600"
            >
              🖼️ دسته‌بندی‌ها
            </a>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-100"
            >
              🚪 خروج
            </button>
          </div>
        </div>

        {/* کارت‌های آماری */}
        <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => {
            const isDisabled = card.disabled;
            const content = (
              <div
                className={`group relative overflow-hidden rounded-2xl border border-[#D4C5A0] bg-white p-5 transition ${
                  isDisabled
                    ? "cursor-not-allowed opacity-60"
                    : "hover:-translate-y-1 hover:border-amber-500 hover:shadow-lg"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${card.color} text-2xl shadow-sm`}
                  >
                    {card.icon}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-xs font-bold text-gray-500">
                    {card.title}
                  </p>
                  <p className="mt-1 text-3xl font-black text-gray-900">
                    {loading || productsLoading ? "..." : card.value}
                  </p>
                  <p className="mt-1 text-[11px] text-gray-400">{card.note}</p>
                </div>
              </div>
            );

            return isDisabled ? (
              <div key={card.title}>{content}</div>
            ) : (
              <a key={card.title} href={card.href}>
                {content}
              </a>
            );
          })}
        </div>

        {/* بخش تحلیل پیشرفته */}
        <div className="mb-8">
          <AnalyticsSection />
        </div>

        {/* کدهای اخیر + دسترسی سریع */}
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* کدهای تخفیف اخیر */}
          <div className="rounded-2xl border border-[#D4C5A0] bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-black text-gray-900">
                🎟️ آخرین کدهای تخفیف
              </h2>
              <a
                href="/admin/discounts"
                className="text-xs font-bold text-amber-600 hover:underline"
              >
                مشاهده همه →
              </a>
            </div>

            {loading ? (
              <div className="py-8 text-center text-sm text-gray-400">
                در حال بارگذاری...
              </div>
            ) : stats.recent.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-400">
                هنوز کدی ثبت نشده
              </div>
            ) : (
              <div className="space-y-2">
                {stats.recent.map((code) => (
                  <div
                    key={code.id}
                    className="flex items-center justify-between rounded-lg border border-[#EDE4CE] bg-[#F7F1E3]/30 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-2 w-2 rounded-full ${
                          code.is_active ? "bg-green-500" : "bg-gray-300"
                        }`}
                      />
                      <span className="font-mono font-bold text-gray-900">
                        {code.code}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <span className="font-bold">
                        {code.type === "percent"
                          ? `${code.value.toLocaleString("fa-IR")}٪`
                          : `${code.value.toLocaleString("fa-IR")} تومان`}
                      </span>
                      <span className="text-gray-400">
                        {code.used_count.toLocaleString("fa-IR")} استفاده
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* دسترسی سریع */}
          <div className="rounded-2xl border border-[#D4C5A0] bg-white p-6">
            <h2 className="mb-4 text-lg font-black text-gray-900">
              🔗 دسترسی سریع
            </h2>

            <div className="space-y-2">
              {quickLinks.map((link) => {
                const content = (
                  <div
                    className={`flex items-start gap-3 rounded-lg border p-3 transition ${
                      link.active
                        ? "border-[#EDE4CE] bg-[#F7F1E3]/30 hover:border-amber-400 hover:bg-amber-50"
                        : "cursor-not-allowed border-[#EDE4CE] bg-gray-50 opacity-60"
                    }`}
                  >
                    <span className="text-2xl">{link.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900">
                        {link.title}
                      </p>
                      <p className="mt-0.5 text-[11px] text-gray-500">
                        {link.description}
                      </p>
                    </div>
                    {link.active && (
                      <span className="text-lg text-gray-300 group-hover:text-amber-600">
                        →
                      </span>
                    )}
                  </div>
                );

                return link.active ? (
                  <a key={link.title} href={link.href} className="block">
                    {content}
                  </a>
                ) : (
                  <div key={link.title}>{content}</div>
                );
              })}
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-gray-400">
          KAW CAMP Admin Panel — v1.0
        </p>
      </div>
    </main>
  );
}