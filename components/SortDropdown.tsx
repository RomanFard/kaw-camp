"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function findScroller(): HTMLElement | null {
  if (typeof window === "undefined") return null;

  // اگه window خودش اسکرول داره
  if (
    document.documentElement.scrollHeight >
    window.innerHeight + 5
  ) {
    return document.documentElement;
  }

  // دنبال div هایی با overflow-y auto/scroll
  const all = document.querySelectorAll<HTMLElement>("*");
  for (const el of all) {
    const s = getComputedStyle(el);
    if (
      (s.overflowY === "auto" || s.overflowY === "scroll") &&
      el.scrollHeight > el.clientHeight + 5
    ) {
      return el;
    }
  }
  return null;
}

export default function ScrollToHash() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const cat = searchParams.get("cat");
  const sort = searchParams.get("sort");
  const search = searchParams.get("q");

  // غیرفعال کردن scroll restoration
  useEffect(() => {
    if (typeof window !== "undefined" && "scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hasFilter = cat || sort || search;
    if (!hasFilter) return;

    let cancelled = false;
    let attempts = 0;
    const MAX_ATTEMPTS = 40;

    function doScroll() {
      if (cancelled) return;

      const target = document.getElementById("products-list");

      if (!target) {
        attempts++;
        if (attempts < MAX_ATTEMPTS) {
          window.setTimeout(doScroll, 100);
        }
        return;
      }

      const scroller = findScroller();
      const isMobile = window.innerWidth < 768;
      const offset = isMobile ? 90 : 20;

      if (scroller && scroller !== document.documentElement) {
        // اسکرول روی div داخلی
        const targetRect = target.getBoundingClientRect();
        const scrollerRect = scroller.getBoundingClientRect();
        const top =
          targetRect.top -
          scrollerRect.top +
          scroller.scrollTop -
          offset;

        scroller.scrollTo({ top, behavior: "smooth" });
      } else {
        // اسکرول روی window
        const top =
          target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }

    window.setTimeout(doScroll, 200);

    return () => {
      cancelled = true;
    };
  }, [pathname, cat, sort, search]);

  return null;
}