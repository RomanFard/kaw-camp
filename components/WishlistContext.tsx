"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Product } from "@/data/products";

type WishlistItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  type: "product" | "tour";
};

type WishlistContextType = {
  items: WishlistItem[];
  addItem: (item: Product | any, type?: "product" | "tour") => void;
  removeItem: (id: string) => void;
  toggleItem: (item: Product | any, type?: "product" | "tour") => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
  totalItems: number;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // لود از localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("kaw-wishlist");
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Error loading wishlist:", e);
    }
    setIsLoaded(true);
  }, []);

  // ذخیره در localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("kaw-wishlist", JSON.stringify(items));
    }
  }, [items, isLoaded]);

  function addItem(item: Product | any, type: "product" | "tour" = "product") {
    setItems((prev) => {
      if (prev.find((i) => i.id === item.id)) {
        return prev;
      }
      return [
        ...prev,
        {
          id: item.id,
          name: item.name || item.title,
          price: item.price,
          image: item.image,
          category: item.category || item.type,
          type,
        },
      ];
    });
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function toggleItem(item: Product | any, type: "product" | "tour" = "product") {
    if (isInWishlist(item.id)) {
      removeItem(item.id);
    } else {
      addItem(item, type);
    }
  }

  function isInWishlist(id: string): boolean {
    return items.some((i) => i.id === id);
  }

  function clearWishlist() {
    setItems([]);
  }

  return (
    <WishlistContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        toggleItem,
        isInWishlist,
        clearWishlist,
        totalItems: items.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
}