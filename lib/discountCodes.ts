// ─── Type استفاده‌شده توی CartContext ───
export type DiscountCode = {
  code: string;
  type: "percent" | "fixed";
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  description: string;
};

// ─── Type ردیف Supabase ───
export type SupabaseDiscountCode = {
  id: string;
  code: string;
  type: "percent" | "fixed";
  value: number;
  min_purchase: number | null;
  max_discount: number | null;
  description: string | null;
  is_active: boolean;
  usage_limit: number | null;
  used_count: number;
  expires_at: string | null;
  created_at: string;
};

// ─── تبدیل ردیف Supabase → DiscountCode ───
export function toDiscountCode(row: SupabaseDiscountCode): DiscountCode {
  return {
    code: row.code,
    type: row.type,
    value: row.value,
    minPurchase: row.min_purchase ?? undefined,
    maxDiscount: row.max_discount ?? undefined,
    description: row.description ?? "",
  };
}