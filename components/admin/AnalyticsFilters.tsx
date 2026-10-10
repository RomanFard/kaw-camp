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
const GROUPS: GroupBy[] = ["date", "product", "city", "brand"];
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
    <div className="rounded-2xl border border-theme bg-theme-card p-4 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        
        {/* بازه زمانی */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className="text-[11px] font-bold text-theme-muted ml-1">بازه:</span>
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => onRangeChange(r)}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                range === r
                  ? "bg-accent text-white"
                  : "bg-theme-surface text-theme-muted hover:text-theme"
              }`}
            >
              {RANGE_LABELS[r]}
            </button>
          ))}
        </div>

        {/* گروه‌بندی (فقط ۴ مورد کلیدی) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className="text-[11px] font-bold text-theme-muted ml-1">گروه:</span>
          {GROUPS.map((g) => {
            const meta = GROUP_META[g];
            return (
              <button
                key={g}
                type="button"
                onClick={() => onGroupByChange(g)}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition flex items-center gap-1 ${
                  groupBy === g
                    ? "bg-accent text-white"
                    : "bg-theme-surface text-theme-muted hover:text-theme"
                }`}
              >
                <span>{meta.icon}</span>
                <span>{meta.label}</span>
              </button>
            );
          })}
        </div>

        {/* شاخص */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold text-theme-muted ml-1">شاخص:</span>
          {METRICS.map((m) => {
            const meta = METRIC_LABELS[m];
            return (
              <button
                key={m}
                type="button"
                onClick={() => onMetricChange(m)}
                className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                  metric === m
                    ? "bg-accent text-white"
                    : "bg-theme-surface text-theme-muted hover:text-theme"
                }`}
              >
                {meta.label}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}