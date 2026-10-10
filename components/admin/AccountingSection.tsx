"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";

type Order = {
  id: string;
  order_number: string;
  first_name: string;
  last_name: string;
  total: number;
  subtotal?: number;
  discount_amount?: number;
  shipping_cost?: number;
  status: string;
  created_at: string;
};

export default function AccountingSection() {
  const supabase = createClient();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<"all" | "30d" | "7d">("30d");

  useEffect(() => {
    async function loadAccountingData() {
      setLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select(
          "id, order_number, first_name, last_name, total, subtotal, discount_amount, shipping_cost, status, created_at"
        )
        .order("created_at", { ascending: false });

      if (!error && data) {
        setOrders(data as Order[]);
      }
      setLoading(false);
    }

    loadAccountingData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredOrders = useMemo(() => {
    let list = orders.filter((o) => o.status !== "cancelled");

    if (timeFilter === "7d") {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      list = list.filter((o) => new Date(o.created_at) >= d);
    } else if (timeFilter === "30d") {
      const d = new Date();
      d.setDate(d.getDate() - 30);
      list = list.filter((o) => new Date(o.created_at) >= d);
    }
    return list;
  }, [orders, timeFilter]);

  const stats = useMemo(() => {
    const grossRevenue = filteredOrders.reduce(
      (sum, o) => sum + (o.total || 0),
      0
    );
    const totalDiscounts = filteredOrders.reduce(
      (sum, o) => sum + (o.discount_amount || 0),
      0
    );
    const totalShipping = filteredOrders.reduce(
      (sum, o) => sum + (o.shipping_cost || 0),
      0
    );
    const successfulOrdersCount = filteredOrders.length;
    const netRevenue = grossRevenue - totalDiscounts - totalShipping;

    return {
      grossRevenue,
      totalDiscounts,
      totalShipping,
      successfulOrdersCount,
      netRevenue,
    };
  }, [filteredOrders]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-theme bg-theme-card p-8 text-center text-xs text-theme-muted">
        در حال محاسبه گزارش‌های مالی...
      </div>
    );
  }

  return (
    <div dir="rtl" className="space-y-6">
      {/* هدر + فیلتر بازه */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-base font-black text-theme">
            <span>💰</span> حسابداری و گردش مالی
          </h2>
          <p className="mt-0.5 text-xs text-theme-muted">
            گزارش درآمدها، تخفیف‌های اعمال شده و هزینه‌های ارسال
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-xl border border-theme bg-theme-card p-1">
          {[
            { id: "7d", label: "۷ روز گذشته" },
            { id: "30d", label: "۳۰ روز گذشته" },
            { id: "all", label: "همه دوره‌ها" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTimeFilter(tab.id as any)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                timeFilter === tab.id
                  ? "bg-accent text-white shadow-sm"
                  : "text-theme-muted hover:text-theme"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ۴ کارت مالی */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-theme bg-theme-card p-4 shadow-sm">
          <span className="text-xs font-bold text-theme-muted">
            مجموع فروش (ناخالص)
          </span>
          <p className="mt-2 text-lg font-black text-theme">
            {formatPrice(stats.grossRevenue)}
          </p>
          <span className="mt-1 block text-[10px] text-theme-muted">
            از {stats.successfulOrdersCount.toLocaleString("fa-IR")} سفارش موفق
          </span>
        </div>

        <div className="rounded-2xl border border-theme bg-theme-card p-4 shadow-sm">
          <span className="text-xs font-bold text-theme-muted">
            درآمد خالص
          </span>
          <p className="mt-2 text-lg font-black text-emerald-500">
            {formatPrice(stats.netRevenue)}
          </p>
          <span className="mt-1 block text-[10px] text-theme-muted">
            بدون تخفیف و ارسال
          </span>
        </div>

        <div className="rounded-2xl border border-theme bg-theme-card p-4 shadow-sm">
          <span className="text-xs font-bold text-theme-muted">
            تخفیف‌های داده شده
          </span>
          <p className="mt-2 text-lg font-black text-amber-500">
            {formatPrice(stats.totalDiscounts)}
          </p>
          <span className="mt-1 block text-[10px] text-theme-muted">
            از طریق کدهای تخفیف
          </span>
        </div>

        <div className="rounded-2xl border border-theme bg-theme-card p-4 shadow-sm">
          <span className="text-xs font-bold text-theme-muted">
            مجموع هزینه ارسال
          </span>
          <p className="mt-2 text-lg font-black text-theme">
            {formatPrice(stats.totalShipping)}
          </p>
          <span className="mt-1 block text-[10px] text-theme-muted">
            هزینه پست/پیک دریافتی
          </span>
        </div>
      </div>

      {/* جدول تراکنش‌ها */}
      <div className="overflow-hidden rounded-2xl border border-theme bg-theme-card shadow-sm">
        <div className="border-b border-theme bg-theme-surface px-4 py-3">
          <h3 className="text-xs font-bold text-theme">
            آخرین تراکنش‌های مالی ثبت‌شده
          </h3>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="p-8 text-center text-xs text-theme-muted">
            تراکنشی در این بازه زمانی یافت نشد.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="border-b border-theme font-bold text-theme-muted">
                <tr>
                  <th className="px-4 py-3">شماره پیگیری</th>
                  <th className="px-4 py-3">مشتری</th>
                  <th className="px-4 py-3">مبلغ کل پرداختی</th>
                  <th className="px-4 py-3">تخفیف</th>
                  <th className="px-4 py-3">هزینه ارسال</th>
                  <th className="px-4 py-3">تاریخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme">
                {filteredOrders.slice(0, 10).map((order) => (
                  <tr
                    key={order.id}
                    className="transition hover:bg-theme-surface/40"
                  >
                    <td className="px-4 py-2.5 font-mono font-bold text-theme">
                      {order.order_number}
                    </td>
                    <td className="px-4 py-2.5 text-theme">
                      {order.first_name} {order.last_name}
                    </td>
                    <td className="px-4 py-2.5 font-bold text-emerald-500">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-4 py-2.5 text-amber-500">
                      {order.discount_amount
                        ? formatPrice(order.discount_amount)
                        : "—"}
                    </td>
                    <td className="px-4 py-2.5 text-theme-muted">
                      {order.shipping_cost
                        ? formatPrice(order.shipping_cost)
                        : "رایگان"}
                    </td>
                    <td className="px-4 py-2.5 text-theme-muted">
                      {new Date(order.created_at).toLocaleDateString("fa-IR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}