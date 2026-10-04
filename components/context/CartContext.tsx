"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Product } from "@/data/products";
import { createClient } from "@/lib/supabase/client";
import {
  toDiscountCode,
  type DiscountCode,
  type SupabaseDiscountCode,
} from "@/lib/discountCodes";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

export type ApplyResult =
  | { success: true }
  | { success: false; error: string };

type CartContextType = {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  // ─── تخفیف ───
  appliedCode: DiscountCode | null;
  discountAmount: number;
  totalAfterDiscount: number;
  applyCode: (code: string) => Promise<ApplyResult>;
  removeCode: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

function calcDiscount(total: number, code: DiscountCode | null): number {
  if (!code || total <= 0) return 0;
  if (code.minPurchase && total < code.minPurchase) return 0;

  if (code.type === "percent") {
    let d = Math.floor((total * code.value) / 100);
    if (code.maxDiscount) d = Math.min(d, code.maxDiscount);
    return d;
  }
  return Math.min(code.value, total);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCode, setAppliedCode] = useState<DiscountCode | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const supabase = createClient();

  // ─── لود از localStorage + بازاعتبارسنجی با Supabase ───
  useEffect(() => {
    async function load() {
      try {
        const savedCart = localStorage.getItem("kaw-cart");
        if (savedCart) setItems(JSON.parse(savedCart));

        const savedCodeStr = localStorage.getItem("kaw-discount");
        if (savedCodeStr) {
          const code = JSON.parse(savedCodeStr) as string;

          // fetch fresh from Supabase
          const { data, error } = await supabase
            .from("discount_codes")
            .select("*")
            .eq("code", code)
            .eq("is_active", true)
            .maybeSingle();

          if (!error && data) {
            // چک انقضا
            const expired =
              data.expires_at && new Date(data.expires_at) < new Date();
            // چک سقف استفاده
            const usedUp =
              data.usage_limit !== null &&
              data.used_count >= data.usage_limit;

            if (!expired && !usedUp) {
              setAppliedCode(toDiscountCode(data as SupabaseDiscountCode));
            } else {
              localStorage.removeItem("kaw-discount");
            }
          } else {
            // کد پاک شده یا غیرفعال شده
            localStorage.removeItem("kaw-discount");
          }
        }
      } catch (e) {
        console.error("Error loading cart:", e);
      }
      setIsLoaded(true);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── ذخیره در localStorage ───
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("kaw-cart", JSON.stringify(items));
  }, [items, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    if (appliedCode) {
      localStorage.setItem("kaw-discount", JSON.stringify(appliedCode.code));
    } else {
      localStorage.removeItem("kaw-discount");
    }
  }, [appliedCode, isLoaded]);

  // ─── عملیات سبد ───
  function addItem(product: Product, quantity = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity,
        },
      ];
    });
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function updateQuantity(id: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  }

  function clearCart() {
    setItems([]);
    setAppliedCode(null);
  }

  // ─── محاسبه ───
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );
  const discountAmount = calcDiscount(totalPrice, appliedCode);
  const totalAfterDiscount = Math.max(0, totalPrice - discountAmount);

  // ─── کد تخفیف (async) ───
  async function applyCode(code: string): Promise<ApplyResult> {
    const trimmed = code.trim().toUpperCase();

    if (!trimmed) {
      return { success: false, error: "کد تخفیف را وارد کنید" };
    }

    if (totalPrice === 0) {
      return { success: false, error: "سبد خرید شما خالی است" };
    }

    // Fetch از Supabase
    const { data, error } = await supabase
      .from("discount_codes")
      .select("*")
      .eq("code", trimmed)
      .eq("is_active", true)
      .maybeSingle();

    if (error || !data) {
      return { success: false, error: "کد تخفیف نامعتبر است" };
    }

    // چک انقضا
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return { success: false, error: "این کد منقضی شده است" };
    }

    // چک سقف استفاده
    if (data.usage_limit !== null && data.used_count >= data.usage_limit) {
      return { success: false, error: "ظرفیت استفاده از این کد پر شده است" };
    }

    // چک حداقل خرید
    if (data.min_purchase && totalPrice < data.min_purchase) {
      return {
        success: false,
        error: `حداقل خرید برای این کد ${data.min_purchase.toLocaleString(
          "fa-IR"
        )} تومان است`,
      };
    }

    setAppliedCode(toDiscountCode(data as SupabaseDiscountCode));
    return { success: true };
  }

  function removeCode() {
    setAppliedCode(null);
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        appliedCode,
        discountAmount,
        totalAfterDiscount,
        applyCode,
        removeCode,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}