"use client";

import { useEffect, useState } from "react";

export type PerformanceLevel = "high" | "medium" | "low";

export function useDevicePerformance() {
  const [level, setLevel] = useState<PerformanceLevel>("high");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // ─── چک ۱: کاربر reduced motion خواسته؟ ───
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      setLevel("low");
      return;
    }

    // ─── چک ۲: تعداد هسته‌های CPU ───
    const cores = navigator.hardwareConcurrency || 4;

    // ─── چک ۳: رم دستگاه (فقط در Chrome) ───
    const memory =
      (navigator as any).deviceMemory || 8; // GB

    // ─── چک ۴: موبایل؟ ───
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

    // ─── تصمیمگیری ───
    if (cores <= 2 || memory <= 2) {
      // خیلی ضعیف
      setLevel("low");
    } else if (cores <= 4 || memory <= 4 || isMobile) {
      // متوسط (موبایل یا لپ‌تاپ قدیمی)
      setLevel("medium");
    } else {
      // قوی
      setLevel("high");
    }
  }, []);

  return {
    level,
    mounted,
    isLowEnd: level === "low",
    isMedium: level === "medium",
    isHighEnd: level === "high",
  };
}