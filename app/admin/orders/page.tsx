"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { formatPrice } from "@/lib/utils";

// ─── تایپ‌ها ───
type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

type Order = {
  id: string;
  order_number: string;
  first_name: string;
  last_name: string;
  phone: string;
  province: string | null;
  city: string | null;
  items: OrderItem[];
  subtotal: number;
  discount_amount: number;
  shipping_cost: number;
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  created_at: string;
};

type StatusKey = Order["status"] | "all";

const STATUS_LABELS: Record<Order["status"], string> = {
  pending: "در انتظار تأیید",
  confirmed: "تأیید شده",
  shipped: "ارسال شده",
  delivered: "تحویل داده شده",
  cancelled: "لغو شده",
};

const STATUS_COLORS: Record<Order["status"], string> = {
  pending: "border-amber-500/40 bg-amber-500/10 text-amber-500",
  confirmed: "border-blue-500/40 bg-blue-500/10 text-blue-500",
  shipped: "border-purple-500/40 bg-purple-500/10 text-purple-500",
  delivered: "border-green-500/40 bg-green-500/10 text-green-500",
  cancelled: "border-red-500/40 bg-red-500/10 text-red-500",
};

export default function OrdersPage() {
  const supabase = createClient();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusKey>("all");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  async function loadOrders() {
    setLoading(true);
    setError("");
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setError("خطا در بارگذاری سفارشات: " + error.message);
    } else {
      setOrders((data ?? []) as Order[]);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // شمارش تعداد سفارشات هر وضعیت
  const counts = useMemo(() => {
    return {
      all: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      confirmed: orders.filter((o) => o.status === "confirmed").length,
      shipped: orders.filter((o) => o.status === "shipped").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
    };
  }, [orders]);

  // فیلتر سفارشات
  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter !== "all" && o.status !== statusFilter) return false;
      if (!search.trim()) return true;
      const q = search.trim().toLowerCase();
      return (
        o.order_number.toLowerCase().includes(q) ||
        o.phone.includes(q) ||
        `${o.first_name} ${o.last_name}`.toLowerCase().includes(q)
      );
    });
  }, [orders, statusFilter, search]);

  // مجموع مبلغ سفارش‌های فیلترشده
  const totalRevenue = useMemo(() => {
    return filtered
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.total, 0);
  }, [filtered]);

  async function handleStatusChange(id: string, newStatus: Order["status"]) {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      alert("خطا: " + error.message);
      return;
    }
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
  }

  async function handleDelete(id: string, num: string) {
    if (!confirm(`آیا از حذف سفارش "${num}" مطمئنی؟`)) return;
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) {
      alert("خطا: " + error.message);
      return;
    }
    loadOrders();
  }

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }

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
          
          {/* هدر اصلی */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-theme bg-theme-card text-theme md:hidden"
              >
                ☰
              </button>
              <div>
                <h1 className="text-xl font-black text-theme">
                  🛒 مدیریت سفارشات
                </h1>
                <p className="mt-0.5 text-xs text-theme-muted">
                  {orders.length.toLocaleString("fa-IR")} سفارش ثبت شده • کل کارکرد: {formatPrice(totalRevenue)}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={loadOrders}
              disabled={loading}
              className="rounded-xl border border-theme bg-theme-card px-4 py-2 text-xs font-bold text-theme-muted transition hover:text-theme disabled:opacity-50"
            >
              🔄 بروزرسانی
            </button>
          </div>

          {/* نوار تب‌های فیلتر وضعیت (خلوت و مینیمال) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {(
              [
                "all",
                "pending",
                "confirmed",
                "shipped",
                "delivered",
                "cancelled",
              ] as StatusKey[]
            ).map((key) => {
              const isActive = statusFilter === key;
              const label = key === "all" ? "همه" : STATUS_LABELS[key as Order["status"]];
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setStatusFilter(key)}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition whitespace-nowrap ${
                    isActive
                      ? "border-accent bg-accent text-white shadow-sm"
                      : "border-theme bg-theme-card text-theme-muted hover:text-theme"
                  }`}
                >
                  <span>{label}</span>
                  <span className={`rounded-md px-1.5 py-0.5 text-[10px] ${isActive ? "bg-white/20 text-white" : "bg-theme-surface text-theme"}`}>
                    {counts[key].toLocaleString("fa-IR")}
                  </span>
                </button>
              );
            })}
          </div>

          {/* نوار جستجو */}
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 جستجو در شماره پیگیری، نام یا تلفن..."
              className="w-full max-w-md rounded-xl border border-theme bg-theme-card px-4 py-2.5 text-xs text-theme outline-none transition placeholder:text-theme-muted focus:border-accent"
            />
          </div>

          {/* نمایش خطا */}
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs font-bold text-red-500">
              ⚠️ {error}
            </div>
          )}

          {/* جدول سفارشات */}
          <div className="overflow-hidden rounded-2xl border border-theme bg-theme-card shadow-sm">
            {loading ? (
              <div className="p-12 text-center text-xs text-theme-muted">
                در حال بارگذاری سفارشات...
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center text-xs text-theme-muted">
                {search || statusFilter !== "all"
                  ? "سفارشی با این فیلتر پیدا نشد"
                  : "هنوز سفارشی ثبت نشده است"}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="border-b border-theme bg-theme-surface font-bold text-theme-muted">
                    <tr>
                      <th className="px-4 py-3">شماره پیگیری</th>
                      <th className="px-4 py-3">مشتری</th>
                      <th className="px-4 py-3">اقلام</th>
                      <th className="px-4 py-3">مبلغ کل</th>
                      <th className="px-4 py-3">وضعیت</th>
                      <th className="px-4 py-3">تاریخ</th>
                      <th className="px-4 py-3 text-left">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-theme">
                    {filtered.map((order) => {
                      const itemCount = (order.items ?? []).reduce((s, i) => s + (i.quantity || 1), 0);
                      return (
                        <tr
                          key={order.id}
                          className="transition hover:bg-theme-surface/40"
                        >
                          {/* شماره پیگیری با دکمه کپی */}
                          <td className="px-4 py-3 font-mono font-bold text-theme">
                            <button
                              type="button"
                              onClick={() => handleCopy(order.order_number)}
                              className="group flex items-center gap-1 hover:text-accent"
                              title="کپی شماره پیگیری"
                            >
                              <span>{order.order_number}</span>
                              <span className="text-[10px] opacity-0 transition group-hover:opacity-100">
                                {copiedText === order.order_number ? "✓" : "📋"}
                              </span>
                            </button>
                          </td>

                          {/* اطلاعات مشتری و تلفن */}
                          <td className="px-4 py-3">
                            <p className="font-bold text-theme">
                              {order.first_name} {order.last_name}
                            </p>
                            <button
                              type="button"
                              onClick={() => handleCopy(order.phone)}
                              className="text-[10px] font-mono text-theme-muted hover:text-accent"
                            >
                              {order.phone}
                            </button>
                          </td>

                          {/* اقلام سفارش (خلاصه) */}
                          <td className="px-4 py-3 text-theme-muted">
                            <span className="font-bold text-theme">{itemCount} کالا</span>
                            <span className="block text-[10px] truncate max-w-[140px]">
                              {(order.items ?? []).map((i) => i.name).join("، ")}
                            </span>
                          </td>

                          {/* مبلغ کل */}
                          <td className="px-4 py-3 font-bold text-theme">
                            {formatPrice(order.total)}
                          </td>

                          {/* تغییر وضعیت سفارش */}
                          <td className="px-4 py-3">
                            <select
                              value={order.status}
                              onChange={(e) =>
                                handleStatusChange(
                                  order.id,
                                  e.target.value as Order["status"]
                                )
                              }
                              className={`cursor-pointer rounded-lg border px-2 py-1 text-[11px] font-bold outline-none transition ${
                                STATUS_COLORS[order.status]
                              }`}
                            >
                              {Object.entries(STATUS_LABELS).map(([k, v]) => (
                                <option
                                  key={k}
                                  value={k}
                                  className="bg-theme-card text-theme"
                                >
                                  {v}
                                </option>
                              ))}
                            </select>
                          </td>

                          {/* تاریخ */}
                          <td className="px-4 py-3 text-theme-muted">
                            {formatDate(order.created_at)}
                          </td>

                          {/* دکمه‌های عملیات */}
                          <td className="px-4 py-3 text-left">
                            <div className="flex justify-end gap-1.5">
                              <a
                                href={`/admin/orders/${order.id}`}
                                className="rounded-lg border border-theme bg-theme-surface px-2.5 py-1.5 font-bold text-theme transition hover:border-accent"
                                title="مشاهده فاکتور و جزئیات"
                              >
                                👁
                              </a>
                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(order.id, order.order_number)
                                }
                                className="rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1.5 font-bold text-red-500 transition hover:bg-red-500/20"
                                title="حذف سفارش"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}