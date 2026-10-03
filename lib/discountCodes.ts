export type DiscountCode = {
  code: string;
  type: "percent" | "fixed";
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  description: string;
};

export const DISCOUNT_CODES: DiscountCode[] = [
  {
    code: "KAW10",
    type: "percent",
    value: 10,
    description: "۱۰٪ تخفیف روی کل سبد خرید",
  },
  {
    code: "KAW20",
    type: "percent",
    value: 20,
    maxDiscount: 200_000,
    minPurchase: 500_000,
    description: "۲۰٪ تخفیف (حداکثر ۲۰۰ هزار تومان، حداقل خرید ۵۰۰ هزار تومان)",
  },
  {
    code: "WELCOME50",
    type: "fixed",
    value: 50_000,
    minPurchase: 300_000,
    description: "۵۰ هزار تومان تخفیف (حداقل خرید ۳۰۰ هزار تومان)",
  },
];

export function findDiscountCode(code: string): DiscountCode | null {
  const normalized = code.trim().toUpperCase();
  return DISCOUNT_CODES.find((c) => c.code === normalized) ?? null;
}