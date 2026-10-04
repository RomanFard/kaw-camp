"use client";

import {
  type GroupBy,
  type Metric,
  type RangeKey,
  GROUP_META,
  METRIC_LABELS,
  RANGE_LABELS,
} from "@/lib/analytics/helpers";

type Props = {
  range: RangeKey;
  groupBy: GroupBy;
  metric: Metric;
  onRangeChange: (r: RangeKey) => void;
  onGroupByChange: (g: GroupBy) => void;
  onMetricChange: (m: Metric) => void;
};

const RANGES: RangeKey[] = ["7d", "30d", "90d", "all"];
const GROUPS: GroupBy[] = [
  "date",
  "product",
  "city",
  "brand",
  "shipping",
  "payment",
  "discount",
];
const METRICS: Metric[] = ["revenue", "orders", "items"];

export default function AnalyticsFilters({
  range,
  groupBy,
  metric,
  onRangeChange,
  onGroupByChange,
  onMetricChange,
}: Props) {
  return (
    <div className="rounded-2xl border border-[#D4C5A0] bg-white p-5">
      <div className="grid gap-5 lg:grid-cols-3">
        {/* بازه زمانی */}
        <div>
          <p className="mb-2 text-xs font-bold text-gray-500">📆 بازه زمانی</p>
          <div className="flex flex-wrap gap-1.5">
            {RANGES.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => onRangeChange(r)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition ${
                  range === r
                    ? "border-amber-500 bg-amber-500 text-white shadow-sm"
                    : "border-[#D4C5A0] bg-white text-gray-600 hover:border-amber-400 hover:bg-amber-50"
                }`}
              >
                {RANGE_LABELS[r]}
              </button>
            ))}
          </div>
        </div>

        {/* گروه‌بندی */}
        <div>
          <p className="mb-2 text-xs font-bold text-gray-500">📊 گروه‌بندی</p>
          <div className="flex flex-wrap gap-1.5">
            {GROUPS.map((g) => {
              const meta = GROUP_META[g];
              return (
                <button
                  key={g}
                  type="button"
                  onClick={() => onGroupByChange(g)}
                  className={`rounded-lg border px-2.5 py-1.5 text-xs font-bold transition ${
                    groupBy === g
                      ? "border-amber-500 bg-amber-500 text-white shadow-sm"
                      : "border-[#D4C5A0] bg-white text-gray-600 hover:border-amber-400 hover:bg-amber-50"
                  }`}
                >
                  <span className="ml-1">{meta.icon}</span>
                  <span>{meta.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* متریک */}
        <div>
          <p className="mb-2 text-xs font-bold text-gray-500">🎯 شاخص</p>
          <div className="flex flex-wrap gap-1.5">
            {METRICS.map((m) => {
              const meta = METRIC_LABELS[m];
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => onMetricChange(m)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition ${
                    metric === m
                      ? "border-amber-500 bg-amber-500 text-white shadow-sm"
                      : "border-[#D4C5A0] bg-white text-gray-600 hover:border-amber-400 hover:bg-amber-50"
                  }`}
                >
                  <span className="ml-1">{meta.icon}</span>
                  <span>{meta.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}