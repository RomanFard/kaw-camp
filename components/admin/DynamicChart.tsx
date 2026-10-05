"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatPrice } from "@/lib/utils";
import {
  groupOrders,
  GROUP_META,
  METRIC_LABELS,
  type Order,
  type GroupBy,
  type Metric,
  type GroupedData,
} from "@/lib/analytics/helpers";

// ─── رنگ‌های چارت ───
const COLORS = [
  "#6ECB9E",
  "#1E40AF",
  "#16A34A",
  "#DC2626",
  "#7C3AED",
  "#0891B2",
  "#5AB88A",
  "#059669",
  "#DB2777",
  "#4F46E5",
];

type Props = {
  orders: Order[];
  groupBy: GroupBy;
  metric: Metric;
  loading: boolean;
};

export default function DynamicChart({
  orders,
  groupBy,
  metric,
  loading,
}: Props) {
  const grouped = useMemo(
    () => groupOrders(orders, groupBy),
    [orders, groupBy]
  );

  const chartType = GROUP_META[groupBy].chart;
  const metricLabel = METRIC_LABELS[metric].label;
  const groupLabel = GROUP_META[groupBy].label;

  // ─── مجموع کل برای نمایش ───
  const total = useMemo(
    () => grouped.reduce((s, d) => s + d[metric], 0),
    [grouped, metric]
  );

  // ─── فرمت کردن مقدار ───
  function formatValue(value: number): string {
    if (metric === "revenue") return formatPrice(value);
    return `${value.toLocaleString("fa-IR")} ${
      metric === "orders" ? "سفارش" : "کالا"
    }`;
  }

  // ─── نام کوتاه برای نمودار ───
  function shortLabel(label: string, max = 20): string {
    if (label.length <= max) return label;
    return label.slice(0, max) + "…";
  }

  // ─── حالت خالی ───
  if (loading) {
    return (
      <div className="rounded-2xl border border-[#D4C5A0] bg-white p-6">
        <div className="mb-5 flex items-center justify-between">
          <div className="h-5 w-40 animate-pulse rounded bg-gray-200" />
          <div className="h-6 w-24 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="h-80 animate-pulse rounded bg-gray-100" />
      </div>
    );
  }

  if (grouped.length === 0) {
    return (
      <div className="rounded-2xl border border-[#D4C5A0] bg-white p-6">
        <div className="mb-4">
          <h2 className="text-lg font-black text-gray-900">
            {GROUP_META[groupBy].icon} تحلیل {groupLabel}
          </h2>
        </div>
        <div className="flex h-72 items-center justify-center text-sm text-gray-400">
          داده‌ای برای نمایش وجود ندارد
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#D4C5A0] bg-white p-6">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-gray-900">
            {GROUP_META[groupBy].icon} تحلیل {groupLabel}
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            {grouped.length.toLocaleString("fa-IR")} دسته • شاخص: {metricLabel}
          </p>
        </div>
        <div className="text-left">
          <p className="text-[11px] font-bold text-gray-500">مجموع</p>
          <p className="text-lg font-black text-amber-700">
            {formatValue(total)}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div dir="ltr" className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "line" ? (
            <LineChart
              data={grouped}
              margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#EDE4CE" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "#6B7280" }}
                axisLine={{ stroke: "#D4C5A0" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#6B7280" }}
                axisLine={{ stroke: "#D4C5A0" }}
                tickLine={false}
                tickFormatter={(v) =>
                  metric === "revenue"
                    ? `${(v / 1000).toFixed(0)}k`
                    : String(v)
                }
                width={50}
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
                  formatValue(Number(value ?? 0)),
                  metricLabel,
                ]}
              />
              <Line
                type="monotone"
                dataKey={metric}
                stroke="#6ECB9E"
                strokeWidth={3}
                dot={{
                  fill: "#6ECB9E",
                  r: 5,
                  strokeWidth: 2,
                  stroke: "#fff",
                }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          ) : chartType === "bar" ? (
            <BarChart
              data={grouped}
              margin={{ top: 10, right: 10, left: 10, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#EDE4CE" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: "#6B7280" }}
                axisLine={{ stroke: "#D4C5A0" }}
                tickLine={false}
                angle={-35}
                textAnchor="end"
                height={70}
                interval={0}
                tickFormatter={(v) => shortLabel(String(v), 18)}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#6B7280" }}
                axisLine={{ stroke: "#D4C5A0" }}
                tickLine={false}
                tickFormatter={(v) =>
                  metric === "revenue"
                    ? `${(v / 1000).toFixed(0)}k`
                    : String(v)
                }
                width={50}
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
                  formatValue(Number(value ?? 0)),
                  metricLabel,
                ]}
                cursor={{ fill: "#F7F1E3" }}
              />
              <Bar dataKey={metric} radius={[8, 8, 0, 0]} maxBarSize={60}>
                {grouped.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <PieChart>
              <Tooltip
                contentStyle={{
                  direction: "rtl",
                  fontFamily: "inherit",
                  borderRadius: 12,
                  border: "1px solid #D4C5A0",
                  fontSize: 12,
                }}
                formatter={(value, name) => [
                  formatValue(Number(value ?? 0)),
                  String(name),
                ]}
              />
              <Legend
                wrapperStyle={{
                  direction: "rtl",
                  fontFamily: "inherit",
                  fontSize: 12,
                }}
              />
              <Pie
                data={grouped.filter((d) => d[metric] > 0)}
                dataKey={metric}
                nameKey="label"
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={50}
                paddingAngle={2}
                label={(entry: unknown) => {
                  const e = entry as GroupedData;
                  const percent = total > 0 ? (e[metric] / total) * 100 : 0;
                  return `${e.label} (${percent.toFixed(0)}٪)`;
                }}
                labelLine={{ stroke: "#D4C5A0" }}
              >
                {grouped
                  .filter((d) => d[metric] > 0)
                  .map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
              </Pie>
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* جدول جمع‌بندی زیر نمودار */}
      {grouped.length > 0 && (
        <div className="mt-6 overflow-hidden rounded-xl border border-[#EDE4CE]">
          <table className="w-full text-right text-xs">
            <thead className="bg-[#F7F1E3]/50">
              <tr className="font-bold text-gray-600">
                <th className="px-3 py-2">{groupLabel}</th>
                <th className="px-3 py-2">درآمد</th>
                <th className="px-3 py-2">سفارش</th>
                <th className="px-3 py-2">کالا</th>
              </tr>
            </thead>
            <tbody>
              {grouped.slice(0, 10).map((row, i) => (
                <tr
                  key={i}
                  className="border-t border-[#EDE4CE] transition hover:bg-[#F7F1E3]/30"
                >
                  <td className="px-3 py-2 font-bold text-gray-800">
                    {row.label}
                  </td>
                  <td className="px-3 py-2 text-gray-700">
                    {formatPrice(row.revenue)}
                  </td>
                  <td className="px-3 py-2 text-gray-700">
                    {row.orders.toLocaleString("fa-IR")}
                  </td>
                  <td className="px-3 py-2 text-gray-700">
                    {row.items.toLocaleString("fa-IR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {grouped.length > 10 && (
            <p className="bg-[#F7F1E3]/30 px-3 py-2 text-center text-[11px] text-gray-500">
              و {grouped.length - 10} دسته دیگر...
            </p>
          )}
        </div>
      )}
    </div>
  );
}
