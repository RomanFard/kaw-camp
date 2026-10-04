"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";

// ─── تایپ ───
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
  pending: "bg-amber-100 text-amber-700 border-amber-300",
  confirmed: "bg-blue-100 text-blue-700 border-blue-300",
  shipped: "bg-purple-100 text-purple-700 border-purple-300",
  delivered: "bg-green-100 text-green-700 border-green-300",
  cancelled: "bg-red-100 text-red-700 border-red-300",
};

export default function OrdersPage() {
  const supabase = createClient();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusKey>("all");

  // ─── لود ───
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

  // ─── شمارش هر وضعیت ───
  const counts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  // ─── فیلتر ───
  const filtered = orders.filter((o) => {
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    return (
      o.order_number.toLowerCase().includes(q) ||
      o.phone.includes(q) ||
      `${o.first_name} ${o.last_name}`.toLowerCase().includes(q)
    );
  });

  // ─── تغییر سریع وضعیت ───
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

  // ─── حذف ───
  async function handleDelete(id: string, num: string) {
    if (!confirm(`آیا از حذف سفارش "${num}" مطمئنی؟`)) return;
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) {
      alert("خطا: " + error.message);
      return;
    }
    loadOrders();
  }

  // ─── تاریخ ───
  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }

  return (
    <main className="min-h-screen bg-[#F7F1E3]">
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <a
            href="/admin"
            className="text-sm text-gray-500 hover:text-amber-600"
          >
            ← بازگشت به داشبورد
          </a>
          <h1 className="mt-2 text-3xl font-black text-gray-900">
            🛒 مدیریت سفارشات
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {orders.length.toLocaleString("fa-IR")} سفارش ثبت شده
          </p>
        </div>

        {/* کارت‌های آماری وضعیت */}
        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-6">
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
            const label =
              key === "all" ? "همه" : STATUS_LABELS[key as Order["status"]];
            return (
              <button
                key={key}
                type="button"
                onClick={() => setStatusFilter(key)}
                className={`rounded-xl border p-3 text-center transition ${
                  isActive
                    ? "border-amber-500 bg-amber-50 shadow-sm"
                    : "border-[#D4C5A0] bg-white hover:border-amber-400"
                }`}
              >
                <div className="text-2xl font-black text-gray-900">
                  {counts[key].toLocaleString("fa-IR")}
                </div>
                <div className="mt-1 text-[11px] font-bold text-gray-600">
                  {label}
                </div>
              </button>
            );
          })}
        </div>

        {/* جستجو */}
        <div className="mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 جستجو در شماره پیگیری، نام یا تلفن..."
            className="w-full max-w-md rounded-lg border border-[#D4C5A0] bg-white px-4 py-2.5 text-sm outline-none focus:border-amber-500"
          />
        </div>

        {/* خطا */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-700">
            ⚠️ {error}
          </div>
        )}

        {/* جدول */}
        <div className="overflow-hidden rounded-2xl border border-[#D4C5A0] bg-white">
          {loading ? (
            <div className="p-12 text-center text-gray-500">
              در حال بارگذاری...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              {search || statusFilter !== "all"
                ? "سفارشی با این فیلتر پیدا نشد"
                : "هنوز سفارشی ثبت نشده"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead className="border-b border-[#EDE4CE] bg-[#F7F1E3]/50">
                  <tr className="text-xs font-bold text-gray-600">
                    <th className="px-4 py-3">شماره پیگیری</th>
                    <th className="px-4 py-3">مشتری</th>
                    <th className="px-4 py-3">تلفن</th>
                    <th className="px-4 py-3">مبلغ</th>
                    <th className="px-4 py-3">وضعیت</th>
                    <th className="px-4 py-3">تاریخ</th>
                    <th className="px-4 py-3 text-left">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-[#EDE4CE] last:border-0 transition hover:bg-[#F7F1E3]/30"
                    >
                      <td className="px-4 py-3">
                        <span className="font-mono font-bold text-gray-900">
                          {order.order_number}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {order.first_name} {order.last_name}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-600" dir="ltr">
                        {order.phone}
                      </td>
                      <td className="px-4 py-3 font-bold">
                        {formatPrice(order.total)}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(
                              order.id,
                              e.target.value as Order["status"]
                            )
                          }
                          className={`cursor-pointer rounded-lg border px-2 py-1 text-xs font-bold outline-none ${
                            STATUS_COLORS[order.status]
                          }`}
                        >
                          {Object.entries(STATUS_LABELS).map(([k, v]) => (
                            <option key={k} value={k}>
                              {v}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-4 py-3 text-left">
                        <div className="flex justify-end gap-2">
                          <a
                            href={`/admin/orders/${order.id}`}
                            className="rounded-lg border border-blue-300 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
                          >
                            👁 مشاهده
                          </a>
                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(order.id, order.order_number)
                            }
                            className="rounded-lg border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 transition hover:bg-red-100"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}