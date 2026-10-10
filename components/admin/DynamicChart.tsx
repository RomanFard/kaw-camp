"use client";

import { useMemo } from "react";
import { useTheme } from "next-themes";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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
} from "@/lib/analytics/helpers";

type Props = {
  orders: Order[];
  groupBy: GroupBy;
  metric: Metric;
  loading: boolean;
};

export default function DynamicChart({ orders, groupBy, metric, loading }: Props) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const grouped = useMemo(() => groupOrders(orders, groupBy), [orders, groupBy]);
  const chartType = GROUP_META[groupBy].chart;
  const metricLabel = METRIC_LABELS[metric].label;
  const groupLabel = GROUP_META[groupBy].label;

  const total = useMemo(
    () => grouped.reduce((s, d) => s + d[metric], 0),
    [grouped, metric]
  );

  const gridColor = isDark ? "#27272A" : "#F3F4F6";
  const tickColor = isDark ? "#A1A1AA" : "#6B7280";

  function formatValue(val: number) {
    if (metric === "revenue") return formatPrice(val);
    return `${val.toLocaleString("fa-IR")} عدد`;
  }

  if (loading) {
    return <div className="h-72 rounded-2xl bg-theme-surface animate-pulse" />;
  }

  if (grouped.length === 0) {
    return (
      <div className="rounded-2xl border border-theme bg-theme-card p-8 text-center text-xs text-theme-muted">
        داده‌ای برای نمایش وجود ندارد
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-theme bg-theme-card p-5 shadow-sm space-y-4">
      {/* هدر ساده */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black text-theme">
            {GROUP_META[groupBy].icon} روند {groupLabel}
          </h3>
          <p className="text-[11px] text-theme-muted mt-0.5">شاخص: {metricLabel}</p>
        </div>
        <div className="text-left">
          <span className="text-[10px] text-theme-muted block">مجموع بازه</span>
          <span className="text-sm font-black text-accent">{formatValue(total)}</span>
        </div>
      </div>

      {/* چارت خلوت */}
      <div dir="ltr" className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "line" ? (
            <LineChart data={grouped} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: tickColor }} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: tickColor }} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: isDark ? "#111" : "#fff",
                  border: "1px solid var(--border-theme)",
                  borderRadius: 10,
                  fontSize: 11,
                  direction: "rtl",
                }}
                formatter={(val) => [formatValue(Number(val ?? 0)), metricLabel]}
              />
              <Line type="monotone" dataKey={metric} stroke="var(--accent)" strokeWidth={2.5} dot={false} />
            </LineChart>
          ) : (
            <BarChart data={grouped} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: tickColor }} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: tickColor }} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: isDark ? "#111" : "#fff",
                  border: "1px solid var(--border-theme)",
                  borderRadius: 10,
                  fontSize: 11,
                  direction: "rtl",
                }}
                formatter={(val) => [formatValue(Number(val ?? 0)), metricLabel]}
              />
              <Bar dataKey={metric} fill="var(--accent)" radius={[6, 6, 0, 0]} maxBarSize={40} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}