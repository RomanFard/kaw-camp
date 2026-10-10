"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function ScrollToHash() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const cat = searchParams.get("cat");
  const sort = searchParams.get("sort");
  const search = searchParams.get("q");

  useEffect(() => {
    const hasFilter = cat || sort || search;
    if (!hasFilter) return;

    let cancelled = false;
    let attempts = 0;

    function tryScroll() {
      if (cancelled) return;

      const el = document.getElementById("products-list");
      console.log("🔍 Attempt", attempts, "| found:", !!el);

      if (el) {
        const isMobile = window.innerWidth < 768;
        const offset = isMobile ? 90 : 20;
        const targetY =
          el.getBoundingClientRect().top + window.scrollY - offset;

        console.log("📏 targetY:", targetY, "| scrollY before:", window.scrollY);

        // خاموش کردن smooth موقتاً
        const html = document.documentElement;
        html.style.scrollBehavior = "auto";
        window.scrollTo(0, targetY);
        console.log("✅ scrollY after:", window.scrollY);

        setTimeout(() => {
          html.style.scrollBehavior = "";
        }, 300);
        return;
      }

      attempts++;
      if (attempts < 30) {
        setTimeout(tryScroll, 100);
      }
    }

    setTimeout(tryScroll, 300);

    return () => {
      cancelled = true;
    };
  }, [pathname, cat, sort, search]);

  return null;
}