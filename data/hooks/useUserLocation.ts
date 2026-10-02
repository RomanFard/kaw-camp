"use client";

import { useEffect, useState } from "react";

export type UserLocation = {
  lat: number;
  lng: number;
  city: string;
} | null;

export function useUserLocation() {
  const [location, setLocation] = useState<UserLocation>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = localStorage.getItem("user_location");
    if (cached) {
      setLocation(JSON.parse(cached));
      setLoading(false);
      return;
    }

    if (!navigator.geolocation) {
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
            `https://geocoding-api.open-meteo.com/v1/search?latitude=${lat}&longitude=${lng}&count=1&language=fa`
          );
          const data = await res.json();
          city = data?.results?.[0]?.name ?? "";
        } catch {}
        const loc = { lat, lng, city };
        setLocation(loc);
        localStorage.setItem("user_location", JSON.stringify(loc));
        setLoading(false);
      },
      () => {
        setError("دسترسی به موقعیت مکانی داده نشد");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  return { location, error, loading };
}