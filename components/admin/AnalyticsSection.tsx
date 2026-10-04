"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import AnalyticsFilters from "./AnalyticsFilters";
import DynamicChart from "./DynamicChart";
import {
  filterByRange,
  type Order,
  type GroupBy,
  type Metric,
  type RangeKey,
} from "@/lib/analytics/helpers";

export default function AnalyticsSection() {
  const supabase = createClient();

  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [range, setRange] = useState<RangeKey>("30d");
  const [groupBy, setGroupBy] = useState<GroupBy>("date");
  const [metric, setMetric] = useState<Metric>("revenue");

  // ─── لود همه سفارشات ───
  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading orders for analytics:", error);
      } else {
        setAllOrders((data ?? []) as Order[]);
      }
      setLoading(false);
    }

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── فیلتر بر اساس بازه ───
  const filtered = filterByRange(allOrders, range);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-gray-900">
            📊 داشبورد تحلیلی
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            تحلیل پیشرفته فروش بر اساس فیلترهای دلخواه
          </p>
        </div>
        <div className="text-left text-xs text-gray-500">
          {filtered.length.toLocaleString("fa-IR")} سفارش در بازه انتخابی
        </div>
      </div>

      {/* فیلترها */}
      <AnalyticsFilters
        range={range}
        groupBy={groupBy}
        metric={metric}
        onRangeChange={setRange}
        onGroupByChange={setGroupBy}
        onMetricChange={setMetric}
      />

      {/* نمودار */}
      <DynamicChart
        orders={filtered}
        groupBy={groupBy}
        metric={metric}
        loading={loading}
      />
    </div>
  );
}