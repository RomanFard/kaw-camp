"use client";

import { useEffect, useState } from "react";

export type UserLocation = {
  lat: number;
  lng: number;
  city: string;
  source: "gps" | "manual";
} | null;

const STORAGE_KEY = "user_location";

// ═══════════════════════════════════════════════════════════════
// Global Store — همهٔ کامپوننت‌ها این state رو share می‌کنن
// ═══════════════════════════════════════════════════════════════
let globalLocation: UserLocation = null;
let initialized = false;

type Listener = () => void;
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((l) => l());
}

function persist(loc: UserLocation) {
  try {
    if (loc) localStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
  } catch {}
}

function loadFromStorage(): UserLocation {
  if (typeof window === "undefined") return null;
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    return cached ? (JSON.parse(cached) as UserLocation) : null;
  } catch {
    return null;
  }
}

function setGlobalLocation(loc: UserLocation) {
  globalLocation = loc;
  persist(loc);
  notify();
}

// ═══════════════════════════════════════════════════════════════
// هوک
// ═══════════════════════════════════════════════════════════════
export function useUserLocation() {
  const [location, setLocation] = useState<UserLocation>(globalLocation);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(!globalLocation && !initialized);

  // ─── subscribe به store مشترک ─────────────────────────────
  useEffect(() => {
    const listener: Listener = () => {
      setLocation(globalLocation);
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  // ─── مقداردهی اولیه (فقط یک بار در کل اپ) ─────────────────
  useEffect(() => {
    if (initialized) return;
    initialized = true;

    const cached = loadFromStorage();
    if (cached) {
      globalLocation = cached;
      setLocation(cached);
      notify();
      setLoading(false);
      return;
    }

    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setError("مرورگر شما از موقعیت‌یابی پشتیبانی نمی‌کند");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        let city = "";
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=fa&zoom=10`,
            { headers: { "User-Agent": "KawCamp/1.0" } }
          );
          const data = await res.json();
          city =
            data?.address?.city ||
            data?.address?.town ||
            data?.address?.state ||
            "";
        } catch {}

        setGlobalLocation({ lat, lng, city, source: "gps" });
        setLoading(false);
      },
      () => {
        setError("دسترسی به موقعیت مکانی داده نشد");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // ─── تابع refresh (آپدیت GPS) ──────────────────────────────
  const refresh = async () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setError("مرورگر شما از موقعیت‌یابی پشتیبانی نمی‌کند");
      return;
    }
    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        let city = "";
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=fa&zoom=10`,
            { headers: { "User-Agent": "KawCamp/1.0" } }
          );
          const data = await res.json();
          city =
            data?.address?.city ||
            data?.address?.town ||
            data?.address?.state ||
            "";
        } catch {}

        setGlobalLocation({ lat, lng, city, source: "gps" });
        setLoading(false);
      },
      () => {
        setError("دسترسی به موقعیت مکانی داده نشد");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // ─── تنظیم دستی ───────────────────────────────────────────
  const setManualLocation = (lat: number, lng: number, city: string) => {
    setGlobalLocation({ lat, lng, city, source: "manual" });
    setLoading(false);
  };

  return { location, error, loading, refresh, setManualLocation };
}