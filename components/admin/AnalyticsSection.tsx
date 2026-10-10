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

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data } = await supabase.from("orders").select("*");
      setAllOrders((data ?? []) as Order[]);
      setLoading(false);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = filterByRange(allOrders, range);

  return (
    <div className="space-y-4">
      {/* هدر بسیار مینیمال */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-black text-theme flex items-center gap-1.5">
          <span>📈</span> آمار و عملکرد فروشگاه
        </h2>
        <span className="text-[11px] text-theme-muted">
          {filtered.length.toLocaleString("fa-IR")} سفارش
        </span>
      </div>

      {/* فیلترهای خلوت */}
      <AnalyticsFilters
        range={range}
        groupBy={groupBy}
        metric={metric}
        onRangeChange={setRange}
        onGroupByChange={setGroupBy}
        onMetricChange={setMetric}
      />

      {/* نمودار تمیز */}
      <DynamicChart
        orders={filtered}
        groupBy={groupBy}
        metric={metric}
        loading={loading}
      />
    </div>
  );
}