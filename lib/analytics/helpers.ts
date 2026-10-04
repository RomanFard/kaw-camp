import { products as allProducts } from "@/data/products";

// ─── تایپها ───
export type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

export type Order = {
  id: string;
  order_number: string;
  first_name: string;
  last_name: string;
  phone: string;
  city: string | null;
  province: string | null;
  items: OrderItem[];
  subtotal: number;
  discount_amount: number;
  discount_code: string | null;
  shipping_cost: number;
  total: number;
  shipping_method: string;
  payment_method: string;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  created_at: string;
};

export type Metric = "revenue" | "orders" | "items";

export type GroupBy =
  | "date"
  | "product"
  | "city"
  | "brand"
  | "shipping"
  | "payment"
  | "discount";

export type RangeKey = "7d" | "30d" | "90d" | "all";

// ─── پیدا کردن برند محصول از id ───
export function getBrandFromProductId(id: string): string {
  const p = allProducts.find((x) => x.id === id);
  if (!p) return "نامشخص";
  return (p.brand as string) || "نامشخص";
}

// ─── فیلتر بازه زمانی ───
export function filterByRange(orders: Order[], range: RangeKey): Order[] {
  if (range === "all") return orders;

  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  cutoff.setHours(0, 0, 0, 0);

  return orders.filter((o) => new Date(o.created_at) >= cutoff);
}

// ─── متادیتای هر گروه ───
export const GROUP_META: Record<
  GroupBy,
  { label: string; icon: string; chart: "line" | "bar" | "pie" }
> = {
  date: { label: "تاریخ", icon: "📅", chart: "line" },
  product: { label: "محصول", icon: "📦", chart: "bar" },
  city: { label: "شهر", icon: "🏙️", chart: "bar" },
  brand: { label: "برند", icon: "🏷️", chart: "bar" },
  shipping: { label: "روش ارسال", icon: "🚚", chart: "pie" },
  payment: { label: "روش پرداخت", icon: "💳", chart: "pie" },
  discount: { label: "کد تخفیف", icon: "🎟️", chart: "bar" },
};

export const METRIC_LABELS: Record<Metric, { label: string; icon: string }> = {
  revenue: { label: "درآمد", icon: "💰" },
  orders: { label: "تعداد سفارش", icon: "📊" },
  items: { label: "تعداد کالا", icon: "📦" },
};

export const RANGE_LABELS: Record<RangeKey, string> = {
  "7d": "۷ روز اخیر",
  "30d": "۳۰ روز اخیر",
  "90d": "۹۰ روز اخیر",
  all: "همه",
};

export const SHIPPING_LABELS: Record<string, string> = {
  post: "پست پیشتاز",
  pickup: "تحویل حضوری",
};

export const PAYMENT_LABELS: Record<string, string> = {
  online: "پرداخت آنلاین",
  cash: "پرداخت در محل",
};

// ─── تایپ خروجی ───
export type GroupedData = {
  label: string;
  revenue: number;
  orders: number;
  items: number;
};

// ─── تابع اصلی گروهبندی ───
export function groupOrders(
  orders: Order[],
  groupBy: GroupBy
): GroupedData[] {
  // سفارشات لغوشده رو حساب نکن
  const valid = orders.filter((o) => o.status !== "cancelled");

  if (groupBy === "date") {
    return groupByDate(valid);
  }

  if (groupBy === "product") {
    return groupByProduct(valid);
  }

  if (groupBy === "brand") {
    return groupByBrand(valid);
  }

  // بقیه با کلید مستقیم روی سفارش
  return groupBySimpleKey(valid, groupBy);
}

// ─── گروهبندی بر اساس تاریخ ───
function groupByDate(orders: Order[]): GroupedData[] {
  // پیدا کردن قدیمیترین و جدیدترین
  if (orders.length === 0) return [];

  const dates = orders.map((o) => {
    const d = new Date(o.created_at);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
  const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));
  maxDate.setHours(0, 0, 0, 0);

  // ساخت نقشه روزها
  const dayMap: Record<string, GroupedData> = {};
  const cursor = new Date(minDate);
  while (cursor <= maxDate) {
    const key = cursor.toISOString().split("T")[0];
    dayMap[key] = {
      label: cursor.toLocaleDateString("fa-IR", {
        month: "2-digit",
        day: "2-digit",
      }),
      revenue: 0,
      orders: 0,
      items: 0,
    };
    cursor.setDate(cursor.getDate() + 1);
  }

  // پر کردن
  orders.forEach((o) => {
    const d = new Date(o.created_at);
    d.setHours(0, 0, 0, 0);
    const key = d.toISOString().split("T")[0];
    if (dayMap[key]) {
      dayMap[key].revenue += Number(o.total ?? 0);
      dayMap[key].orders += 1;
      dayMap[key].items += o.items.reduce((s, i) => s + i.quantity, 0);
    }
  });

  return Object.values(dayMap);
}

// ─── گروهبندی بر اساس محصول ───
function groupByProduct(orders: Order[]): GroupedData[] {
  const map: Record<string, GroupedData> = {};

  orders.forEach((o) => {
    o.items.forEach((item) => {
      if (!map[item.id]) {
        map[item.id] = {
          label: item.name,
          revenue: 0,
          orders: 0,
          items: 0,
        };
      }
      map[item.id].revenue += item.price * item.quantity;
      map[item.id].items += item.quantity;
      map[item.id].orders += 1;
    });
  });

  return Object.values(map).sort((a, b) => b.revenue - a.revenue);
}

// ─── گروهبندی بر اساس برند ───
function groupByBrand(orders: Order[]): GroupedData[] {
  const map: Record<string, GroupedData> = {};

  orders.forEach((o) => {
    const seenBrands = new Set<string>();
    o.items.forEach((item) => {
      const brand = getBrandFromProductId(item.id);
      if (!map[brand]) {
        map[brand] = {
          label: brand,
          revenue: 0,
          orders: 0,
          items: 0,
        };
      }
      map[brand].revenue += item.price * item.quantity;
      map[brand].items += item.quantity;
      if (!seenBrands.has(brand)) {
        map[brand].orders += 1;
        seenBrands.add(brand);
      }
    });
  });

  return Object.values(map).sort((a, b) => b.revenue - a.revenue);
}

// ─── گروهبندیهای ساده (city, shipping, payment, discount) ───
function groupBySimpleKey(
  orders: Order[],
  groupBy: "city" | "shipping" | "payment" | "discount"
): GroupedData[] {
  const map: Record<string, GroupedData> = {};

  function addTo(key: string, label: string, o: Order) {
    if (!map[key]) {
      map[key] = { label, revenue: 0, orders: 0, items: 0 };
    }
    map[key].revenue += Number(o.total ?? 0);
    map[key].orders += 1;
    map[key].items += o.items.reduce((s, i) => s + i.quantity, 0);
  }

  orders.forEach((o) => {
    if (groupBy === "city") {
      const c = o.city || "نامشخص";
      addTo(c, c, o);
    } else if (groupBy === "shipping") {
      const k = o.shipping_method || "نامشخص";
      addTo(k, SHIPPING_LABELS[k] ?? k, o);
    } else if (groupBy === "payment") {
      const k = o.payment_method || "نامشخص";
      addTo(k, PAYMENT_LABELS[k] ?? k, o);
    } else if (groupBy === "discount") {
      const k = o.discount_code || "بدون کد";
      addTo(k, k, o);
    }
  });

  return Object.values(map).sort((a, b) => b.revenue - a.revenue);
}