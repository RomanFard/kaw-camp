"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Product } from "@/data/products";
import {
  findDiscountCode,
  type DiscountCode,
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
  applyCode: (code: string) => ApplyResult;
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

  // ─── لود از localStorage ───
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("kaw-cart");
      if (savedCart) setItems(JSON.parse(savedCart));

      const savedCode = localStorage.getItem("kaw-discount");
      if (savedCode) {
        const codeStr = JSON.parse(savedCode) as string;
        const found = findDiscountCode(codeStr);
        if (found) setAppliedCode(found);
      }
    } catch (e) {
      console.error("Error loading cart:", e);
    }
    setIsLoaded(true);
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

  // ─── کد تخفیف ───
  function applyCode(code: string): ApplyResult {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      return { success: false, error: "کد تخفیف را وارد کنید" };
    }

    const found = findDiscountCode(trimmed);
    if (!found) {
      return { success: false, error: "کد تخفیف نامعتبر است" };
    }

    if (totalPrice === 0) {
      return { success: false, error: "سبد خرید شما خالی است" };
    }

    if (found.minPurchase && totalPrice < found.minPurchase) {
      return {
        success: false,
        error: `حداقل خرید برای این کد ${found.minPurchase.toLocaleString(
          "fa-IR"
        )} تومان است`,
      };
    }

    setAppliedCode(found);
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