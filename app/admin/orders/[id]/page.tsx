"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { formatPrice } from "@/lib/utils";

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
  address?: string | null;
  postal_code?: string | null;
  note?: string | null;
  items: OrderItem[];
  subtotal: number;
  discount_amount: number;
  shipping_cost: number;
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  created_at: string;
  discount_code?: string | null;
};

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

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const supabase = createClient();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  async function loadOrder() {
    setLoading(true);
    setError("");
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      setError("خطا در بارگذاری سفارش: " + error.message);
    } else if (!data) {
      setError("سفارش پیدا نشد");
    } else {
      setOrder(data as Order);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (id) loadOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function handleCopy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  async function handleStatusChange(newStatus: Order["status"]) {
    if (!order) return;
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", order.id);

    if (error) {
      alert("خطا: " + error.message);
      return;
    }
    setOrder({ ...order, status: newStatus });
  }

  async function handleDelete() {
    if (!order) return;
    if (!confirm(`آیا از حذف سفارش "${order.order_number}" مطمئنی؟`)) return;

    const { error } = await supabase
      .from("orders")
      .delete()
      .eq("id", order.id);

    if (error) {
      alert("خطا: " + error.message);
      return;
    }
    router.push("/admin/orders");
  }

  function handlePrint() {
    window.print();
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div dir="rtl" className="flex min-h-screen bg-theme text-theme">
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden print:hidden"
        />
      )}

      <div className="print:hidden">
        <AdminSidebar
          isMobileMenuOpen={isMobileMenuOpen}
          onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
        />
      </div>

      <main className="flex-1 overflow-x-hidden p-4 pb-12 sm:p-8 print:p-0">
        <div className="mx-auto max-w-5xl space-y-6">
          {/* هدر */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
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
                <a
                  href="/admin/orders"
                  className="text-xs font-bold text-theme-muted transition hover:text-accent"
                >
                  ← بازگشت به سفارشات
                </a>
                <h1 className="mt-1 text-xl font-black text-theme sm:text-2xl">
                  🧾 جزئیات سفارش
                </h1>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="rounded-xl border border-theme bg-theme-card px-4 py-2.5 text-xs font-bold text-theme transition hover:border-accent"
              >
                🖨️ چاپ فاکتور
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs font-bold text-red-500 transition hover:bg-red-500/20"
              >
                🗑️ حذف
              </button>
            </div>
          </div>

          {/* خطا */}
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-bold text-red-500">
              ⚠️ {error}
            </div>
          )}

          {/* لودینگ */}
          {loading ? (
            <div className="rounded-2xl border border-theme bg-theme-card p-12 text-center text-xs text-theme-muted">
              در حال بارگذاری...
            </div>
          ) : !order ? null : (
            <>
              {/* شماره + وضعیت */}
              <div className="rounded-2xl border border-theme bg-theme-card p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-theme-muted">
                      شماره پیگیری
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <h2 className="font-mono text-2xl font-black text-theme">
                        {order.order_number}
                      </h2>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(order.order_number, "order_number")
                        }
                        className="rounded-lg border border-theme bg-theme-surface px-2 py-1 text-[10px] font-bold text-theme-muted transition hover:border-accent hover:text-accent print:hidden"
                      >
                        {copied === "order_number" ? "✓ کپی شد" : "📋 کپی"}
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-theme-muted">
                      ثبت: {formatDate(order.created_at)}
                    </p>
                  </div>

                  <div className="flex flex-col items-start gap-2 sm:items-end">
                    <p className="text-[11px] font-bold text-theme-muted">
                      وضعیت سفارش
                    </p>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(e.target.value as Order["status"])
                      }
                      className={`cursor-pointer rounded-xl border px-4 py-2 text-sm font-bold outline-none transition ${
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
                  </div>
                </div>
              </div>

              {/* اطلاعات مشتری + آدرس */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-theme bg-theme-card p-5">
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-black text-theme">
                    👤 مشتری
                  </h3>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-theme-muted">نام:</span>
                      <span className="font-bold text-theme">
                        {order.first_name} {order.last_name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-theme-muted">تلفن:</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(order.phone, "phone")}
                        className="font-mono font-bold text-theme transition hover:text-accent"
                      >
                        {order.phone}
                        {copied === "phone" && (
                          <span className="mr-1 text-[9px] text-green-500">
                            ✓
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-theme bg-theme-card p-5">
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-black text-theme">
                    📍 آدرس ارسال
                  </h3>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-theme-muted">استان:</span>
                      <span className="font-bold text-theme">
                        {order.province || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-theme-muted">شهر:</span>
                      <span className="font-bold text-theme">
                        {order.city || "—"}
                      </span>
                    </div>
                    {order.address && (
                      <div className="flex flex-col gap-1 border-t border-theme pt-2">
                        <span className="text-theme-muted">نشانی:</span>
                        <span className="font-bold leading-6 text-theme">
                          {order.address}
                        </span>
                      </div>
                    )}
                    {order.postal_code && (
                      <div className="flex justify-between">
                        <span className="text-theme-muted">کد پستی:</span>
                        <span className="font-mono font-bold text-theme">
                          {order.postal_code}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* اقلام سفارش */}
              <div className="rounded-2xl border border-theme bg-theme-card p-5">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-black text-theme">
                  📦 اقلام سفارش
                  <span className="rounded-full bg-theme-surface px-2 py-0.5 text-[10px] font-bold text-theme-muted">
                    {(order.items ?? []).length.toLocaleString("fa-IR")} قلم
                  </span>
                </h3>

                <div className="overflow-hidden rounded-xl border border-theme">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-theme-surface font-bold text-theme-muted">
                      <tr>
                        <th className="px-3 py-2.5">تصویر</th>
                        <th className="px-3 py-2.5">نام کالا</th>
                        <th className="px-3 py-2.5">قیمت واحد</th>
                        <th className="px-3 py-2.5">تعداد</th>
                        <th className="px-3 py-2.5">جمع</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-theme">
                      {(order.items ?? []).map((item, i) => (
                        <tr key={`${item.id}-${i}`}>
                          <td className="px-3 py-2.5">
                            <div className="h-10 w-10 overflow-hidden rounded-lg border border-theme bg-theme-surface">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={item.image || "/images/placeholder.jpg"}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          </td>
                          <td className="px-3 py-2.5 font-bold text-theme">
                            {item.name}
                          </td>
                          <td className="px-3 py-2.5 text-theme-muted">
                            {formatPrice(item.price)}
                          </td>
                          <td className="px-3 py-2.5 font-bold text-theme">
                            {item.quantity.toLocaleString("fa-IR")}
                          </td>
                          <td className="px-3 py-2.5 font-bold text-theme">
                            {formatPrice(item.price * item.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* خلاصه مالی */}
              <div className="rounded-2xl border border-theme bg-theme-card p-5">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-black text-theme">
                  💰 خلاصه مالی
                </h3>
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-theme-muted">جمع کالاها:</span>
                    <span className="font-bold text-theme">
                      {formatPrice(order.subtotal)}
                    </span>
                  </div>

                  {order.discount_amount > 0 && (
                    <div className="flex justify-between text-green-500">
                      <span>
                        تخفیف
                        {order.discount_code && (
                          <span className="mr-2 font-mono text-[10px] opacity-70">
                            ({order.discount_code})
                          </span>
                        )}
                        :
                      </span>
                      <span className="font-bold">
                        − {formatPrice(order.discount_amount)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-theme-muted">هزینه ارسال:</span>
                    <span className="font-bold text-theme">
                      {order.shipping_cost > 0
                        ? formatPrice(order.shipping_cost)
                        : "رایگان"}
                    </span>
                  </div>

                  <div className="mt-3 flex justify-between border-t border-theme pt-3 text-base">
                    <span className="font-black text-theme">مبلغ نهایی:</span>
                    <span className="font-black text-accent">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* یادداشت مشتری */}
              {order.note && (
                <div className="rounded-2xl border border-accent/30 bg-accent/5 p-5">
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-black text-accent">
                    📝 یادداشت مشتری
                  </h3>
                  <p className="text-xs leading-6 text-theme">
                    {order.note}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}