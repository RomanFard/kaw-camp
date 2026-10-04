"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";

type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type TopProduct = {
  id: string;
  name: string;
  quantity: number;
  revenue: number;
};

export default function TopProducts() {
  const supabase = createClient();
  const [products, setProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);

      const { data: orders, error } = await supabase
        .from("orders")
        .select("items, status")
        .neq("status", "cancelled");

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      const productMap: Record<string, TopProduct> = {};

      (orders ?? []).forEach((order) => {
        const items = (order.items ?? []) as OrderItem[];
        items.forEach((item) => {
          if (!productMap[item.id]) {
            productMap[item.id] = {
              id: item.id,
              name: item.name,
              quantity: 0,
              revenue: 0,
            };
          }
          productMap[item.id].quantity += item.quantity;
          productMap[item.id].revenue += item.price * item.quantity;
        });
      });

      const sorted = Object.values(productMap)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);

      setProducts(sorted);
      setLoading(false);
    }

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const maxQuantity =
    products.length > 0 ? products[0].quantity : 1;

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#D4C5A0] bg-white p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-5 w-40 rounded bg-gray-200" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 rounded bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#D4C5A0] bg-white p-6">
      <div className="mb-5">
        <h2 className="text-lg font-black text-gray-900">
          🏆 پرفروش‌ترین محصولات
        </h2>
        <p className="mt-1 text-xs text-gray-500">
          ۵ محصول برتر بر اساس تعداد فروش
        </p>
      </div>

      {products.length === 0 ? (
        <div className="py-12 text-center text-sm text-gray-400">
          هنوز فروشی ثبت نشده
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product, idx) => {
            const percent = (product.quantity / maxQuantity) * 100;
            const medals = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"];
            return (
              <div key={product.id}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-lg">{medals[idx]}</span>
                    <span className="truncate font-bold text-gray-900">
                      {product.name}
                    </span>
                  </div>
                  <div className="flex shrink-0 items-center gap-3 text-xs">
                    <span className="font-bold text-amber-700">
                      {product.quantity.toLocaleString("fa-IR")} فروش
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[#F7F1E3]">
                  <div
                    className="h-full rounded-full bg-gradient-to-l from-[#F59E0B] to-[#D97706] transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <div className="mt-1 text-left text-[11px] text-gray-500">
                  درآمد: {formatPrice(product.revenue)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}