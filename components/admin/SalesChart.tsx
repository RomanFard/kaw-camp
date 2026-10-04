"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";

type DayData = {
  date: string;
  fullDate: string;
  revenue: number;
  orders: number;
};

export default function SalesChart() {
  const supabase = createClient();
  const [data, setData] = useState<DayData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
      sevenDaysAgo.setHours(0, 0, 0, 0);

      const { data: orders, error } = await supabase
        .from("orders")
        .select("total, created_at, status")
        .gte("created_at", sevenDaysAgo.toISOString())
        .neq("status", "cancelled");

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      const dayMap: Record<string, DayData> = {};
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        d.setHours(0, 0, 0, 0);

        const key = d.toISOString().split("T")[0];
        dayMap[key] = {
          date: d.toLocaleDateString("fa-IR", {
            month: "2-digit",
            day: "2-digit",
          }),
          fullDate: d.toLocaleDateString("fa-IR", {
            weekday: "long",
            month: "long",
            day: "numeric",
          }),
          revenue: 0,
          orders: 0,
        };
      }

      (orders ?? []).forEach((o) => {
        const d = new Date(o.created_at);
        d.setHours(0, 0, 0, 0);
        const key = d.toISOString().split("T")[0];

        if (dayMap[key]) {
          dayMap[key].revenue += Number(o.total ?? 0);
          dayMap[key].orders += 1;
        }
      });

      setData(Object.values(dayMap));
      setLoading(false);
    }

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalRevenue = data.reduce((s, d) => s + d.revenue, 0);
  const totalOrders = data.reduce((s, d) => s + d.orders, 0);

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#D4C5A0] bg-white p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-5 w-40 rounded bg-gray-200" />
          <div className="h-64 rounded bg-gray-100" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#D4C5A0] bg-white p-6">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h2 className="text-lg font-black text-gray-900">
            📈 فروش ۷ روز اخیر
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            {totalOrders.toLocaleString("fa-IR")} سفارش موفق
          </p>
        </div>
        <div className="text-left">
          <p className="text-[11px] font-bold text-gray-500">مجموع درآمد</p>
          <p className="text-lg font-black text-green-700">
            {formatPrice(totalRevenue)}
          </p>
        </div>
      </div>

      <div dir="ltr" className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#EDE4CE" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "#6B7280" }}
              axisLine={{ stroke: "#D4C5A0" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#6B7280" }}
              axisLine={{ stroke: "#D4C5A0" }}
              tickLine={false}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              width={40}
            />
            <Tooltip
              contentStyle={{
                direction: "rtl",
                fontFamily: "inherit",
                borderRadius: 12,
                border: "1px solid #D4C5A0",
                fontSize: 12,
              }}
              formatter={(value) => [
                formatPrice(Number(value ?? 0)),
                "درآمد",
              ]}
              labelFormatter={(label, payload) => {
                if (payload && payload[0]) {
                  const d = payload[0].payload as DayData;
                  return `${d.fullDate} (${d.orders.toLocaleString("fa-IR")} سفارش)`;
                }
                return label;
              }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#F59E0B"
              strokeWidth={3}
              dot={{ fill: "#F59E0B", r: 5, strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-500">
        <span className="inline-block h-2 w-4 rounded-full bg-[#F59E0B]" />
        <span>درآمد روزانه (تومان)</span>
      </div>
    </div>
  );
}