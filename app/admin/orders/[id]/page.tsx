"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/components/context/ToastContext";

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
  email: string | null;
  province: string | null;
  city: string | null;
  address: string | null;
  postal_code: string | null;
  items: OrderItem[];
  subtotal: number;
  discount_amount: number;
  discount_code: string | null;
  shipping_cost: number;
  total: number;
  shipping_method: string;
  payment_method: string;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  note: string | null;
  created_at: string;
};

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

const SHIPPING_LABELS: Record<string, string> = {
  post: "پست پیشتاز",
  pickup: "تحویل حضوری",
};

const PAYMENT_LABELS: Record<string, string> = {
  online: "پرداخت آنلاین",
  cash: "پرداخت در محل",
};

export default function OrderDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const supabase = createClient();
  const toast = useToast();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

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

  async function handleStatusChange(newStatus: Order["status"]) {
    if (!order) return;
    setUpdatingStatus(true);

    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", order.id);

    if (error) {
      toast.error("خطا: " + error.message);
    } else {
      setOrder({ ...order, status: newStatus });
      toast.success("وضعیت سفارش بروزرسانی شد");
    }
    setUpdatingStatus(false);
  }

  async function handleDelete() {
    if (!order) return;
    if (
      !confirm(
        `آیا از حذف سفارش "${order.order_number}" مطمئنی؟ این عمل قابل بازگشت نیست.`
      )
    )
      return;

    const { error } = await supabase
      .from("orders")
      .delete()
      .eq("id", order.id);

    if (error) {
      toast.error("خطا: " + error.message);
      return;
    }
    toast.success(`سفارش «${order.order_number}» حذف شد`);
    setTimeout(() => {
      window.location.href = "/admin/orders";
    }, 500);
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

  // ─── حالت لودینگ ───
  if (loading) {
    return (
      <main className="min-h-screen bg-[#F7F1E3] p-8">
        <div className="mx-auto max-w-5xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-64 rounded bg-gray-200" />
            <div className="h-64 rounded-2xl bg-gray-200" />
          </div>
        </div>
      </main>
    );
  }

  // ─── حالت خطا ───
  if (error || !order) {
    return (
      <main className="min-h-screen bg-[#F7F1E3] p-8">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="text-4xl">❌</p>
            <p className="mt-3 text-lg font-bold text-red-700">
              {error || "سفارش پیدا نشد"}
            </p>
            <a
              href="/admin/orders"
              className="mt-5 inline-block rounded-lg bg-amber-500 px-5 py-2 text-sm font-bold text-white"
            >
              بازگشت به لیست
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F1E3]">
      <div className="mx-auto max-w-5xl px-6 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <a
              href="/admin/orders"
              className="text-sm text-gray-500 hover:text-amber-600"
            >
              ← بازگشت به لیست سفارشات
            </a>
            <h1 className="mt-2 flex items-center gap-3 text-3xl font-black text-gray-900">
              <span className="font-mono">{order.order_number}</span>
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {formatDate(order.created_at)}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-lg border border-[#D4C5A0] bg-white px-4 py-2 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
            >
              🖨️ پرینت
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-100"
            >
              🗑️ حذف
            </button>
          </div>
        </div>

        {/* وضعیت */}
        <div className="mb-6 rounded-2xl border border-[#D4C5A0] bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-gray-500">وضعیت سفارش</p>
              <div className="mt-2 flex items-center gap-2">
                <span
                  className={`rounded-lg border px-3 py-1 text-sm font-bold ${
                    STATUS_COLORS[order.status]
                  }`}
                >
                  {STATUS_LABELS[order.status]}
                </span>
                {updatingStatus && (
                  <span className="text-xs text-gray-400">
                    در حال بروزرسانی...
                  </span>
                )}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-bold text-gray-500">تغییر سریع</p>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(STATUS_LABELS) as Order["status"][]).map(
                  (status) => (
                    <button
                      key={status}
                      type="button"
                      disabled={order.status === status || updatingStatus}
                      onClick={() => handleStatusChange(status)}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-40 ${
                        order.status === status
                          ? STATUS_COLORS[status]
                          : "border-[#D4C5A0] bg-white text-gray-600 hover:border-amber-400 hover:bg-amber-50"
                      }`}
                    >
                      {STATUS_LABELS[status]}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* اطلاعات مشتری */}
          <div className="rounded-2xl border border-[#D4C5A0] bg-white p-6">
            <h2 className="mb-4 text-lg font-black text-gray-900">
              👤 اطلاعات مشتری
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-[#EDE4CE] pb-2">
                <span className="text-gray-500">نام</span>
                <span className="font-bold text-gray-900">
                  {order.first_name} {order.last_name}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#EDE4CE] pb-2">
                <span className="text-gray-500">تلفن</span>
                <span className="font-mono font-bold text-gray-900" dir="ltr">
                  {order.phone}
                </span>
              </div>
              {order.email && (
                <div className="flex justify-between border-b border-[#EDE4CE] pb-2">
                  <span className="text-gray-500">ایمیل</span>
                  <span className="font-mono text-xs text-gray-900" dir="ltr">
                    {order.email}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* آدرس */}
          <div className="rounded-2xl border border-[#D4C5A0] bg-white p-6">
            <h2 className="mb-4 text-lg font-black text-gray-900">
              🏠 آدرس تحویل
            </h2>
            <div className="space-y-3 text-sm">
              {order.province && (
                <div className="flex justify-between border-b border-[#EDE4CE] pb-2">
                  <span className="text-gray-500">استان</span>
                  <span className="font-bold text-gray-900">
                    {order.province}
                  </span>
                </div>
              )}
              {order.city && (
                <div className="flex justify-between border-b border-[#EDE4CE] pb-2">
                  <span className="text-gray-500">شهر</span>
                  <span className="font-bold text-gray-900">{order.city}</span>
                </div>
              )}
              {order.postal_code && (
                <div className="flex justify-between border-b border-[#EDE4CE] pb-2">
                  <span className="text-gray-500">کد پستی</span>
                  <span className="font-mono text-gray-900" dir="ltr">
                    {order.postal_code}
                  </span>
                </div>
              )}
              {order.address && (
                <div>
                  <span className="text-gray-500">آدرس کامل</span>
                  <p className="mt-1 rounded-lg bg-[#F7F1E3]/50 p-3 text-sm text-gray-800">
                    {order.address}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* روش ارسال و پرداخت */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-[#D4C5A0] bg-white p-6">
            <h2 className="mb-4 text-lg font-black text-gray-900">
              🚚 روش ارسال
            </h2>
            <p className="text-sm text-gray-700">
              {SHIPPING_LABELS[order.shipping_method] ?? order.shipping_method}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              هزینه:{" "}
              {order.shipping_cost === 0
                ? "رایگان"
                : formatPrice(order.shipping_cost)}
            </p>
          </div>

          <div className="rounded-2xl border border-[#D4C5A0] bg-white p-6">
            <h2 className="mb-4 text-lg font-black text-gray-900">
              💳 روش پرداخت
            </h2>
            <p className="text-sm text-gray-700">
              {PAYMENT_LABELS[order.payment_method] ?? order.payment_method}
            </p>
          </div>
        </div>

        {/* اقلام */}
        <div className="mt-6 rounded-2xl border border-[#D4C5A0] bg-white p-6">
          <h2 className="mb-4 text-lg font-black text-gray-900">
            📦 اقلام سفارش ({order.items.length.toLocaleString("fa-IR")} قلم)
          </h2>

          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 border-b border-[#EDE4CE] pb-3 last:border-0"
              >
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-[#EDE4CE] bg-gray-50">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-2xl">
                      📦
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">{item.name}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {item.quantity.toLocaleString("fa-IR")} ×{" "}
                    {formatPrice(item.price)}
                  </p>
                </div>
                <div className="text-sm font-black text-gray-900">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* خلاصه مالی */}
        <div className="mt-6 rounded-2xl border border-[#D4C5A0] bg-white p-6">
          <h2 className="mb-4 text-lg font-black text-gray-900">
            💰 خلاصه مالی
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">جمع کالاها</span>
              <span className="font-bold text-gray-900">
                {formatPrice(order.subtotal)}
              </span>
            </div>

            {order.discount_amount > 0 && (
              <div className="flex justify-between text-green-700">
                <span>
                  تخفیف {order.discount_code && `(${order.discount_code})`}
                </span>
                <span className="font-bold">
                  − {formatPrice(order.discount_amount)}
                </span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-gray-500">هزینه ارسال</span>
              <span
                className={
                  order.shipping_cost === 0
                    ? "font-bold text-green-600"
                    : "font-bold text-gray-900"
                }
              >
                {order.shipping_cost === 0
                  ? "رایگان"
                  : formatPrice(order.shipping_cost)}
              </span>
            </div>

            <div className="mt-3 flex justify-between border-t border-[#EDE4CE] pt-3">
              <span className="text-base font-black text-gray-900">
                مبلغ کل
              </span>
              <span className="text-lg font-black text-amber-700">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>
        </div>

        {/* یادداشت */}
        {order.note && (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <h2 className="mb-2 text-sm font-black text-amber-800">
              📝 یادداشت مشتری
            </h2>
            <p className="text-sm text-amber-900">{order.note}</p>
          </div>
        )}
      </div>
    </main>
  );
}