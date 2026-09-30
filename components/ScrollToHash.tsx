"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function ScrollToHash() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const cat = searchParams.get("cat");

  useEffect(() => {
    // فقط در موبایل و وقتی cat داریم
    if (typeof window === "undefined") return;
    if (window.innerWidth >= 768) return;
    if (!cat) return;

    const timer = setTimeout(() => {
      const el = document.getElementById("products-list");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [pathname, cat]);

  return null;
}