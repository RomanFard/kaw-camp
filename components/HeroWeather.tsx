"use client";

import { useEffect, useState } from "react";
import { useUserLocation } from "@/hooks/useUserLocation";

type WeatherData = {
  temp: number;
  weatherCode: number;
  windSpeed: number;
};

const WEATHER_ICONS: Record<number, string> = {
  0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️",
  45: "🌫️", 48: "🌫️",
  51: "🌦️", 53: "🌦️", 55: "🌧️",
  61: "🌧️", 63: "🌧️", 65: "🌧️",
  71: "❄️", 73: "❄️", 75: "❄️",
  80: "🌧️", 81: "🌧️", 82: "🌧️",
  95: "⛈️", 96: "⛈️", 99: "⛈️",
};

const WEATHER_LABELS: Record<number, string> = {
  0: "صاف", 1: "عمدتاً صاف", 2: "نیمه ابری", 3: "ابری",
  45: "مه", 48: "مه یخ‌زده",
  51: "نم‌نم باران", 53: "باران سبک", 55: "باران",
  61: "باران سبک", 63: "باران", 65: "باران شدید",
  71: "برف سبک", 73: "برف", 75: "برف شدید",
  80: "رگبار سبک", 81: "رگبار", 82: "رگبار شدید",
  95: "رعد و برق", 96: "رعد و برق با تگرگ", 99: "رعد و برق شدید",
};

export default function HeroWeather() {
  const {
    location,
    loading: locationLoading,
    error: locationError,
  } = useUserLocation();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  useEffect(() => {
    if (!location) return;

    let cancelled = false;
    setWeatherLoading(true);

    async function fetchWeather() {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${location!.lat}&longitude=${location!.lng}` +
            `&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto`
        );
        const data = await res.json();
        if (cancelled) return;
        setWeather({
          temp: Math.round(data.current.temperature_2m),
          weatherCode: data.current.weather_code,
          windSpeed: Math.round(data.current.wind_speed_10m),
        });
      } catch {
        // ignore
      } finally {
        if (!cancelled) setWeatherLoading(false);
      }
    }

    fetchWeather();
    const interval = setInterval(fetchWeather, 600_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [location]);

  /* ========== حالت‌ها ========== */
  const baseClass =
    "inline-flex flex-wrap items-center justify-center gap-3 rounded-full bg-white/20 px-4 py-2 text-sm font-bold backdrop-blur";

  // در حال گرفتن موقعیت
  if (locationLoading) {
    return (
      <div className={baseClass}>
        <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
        در حال یافتن موقعیت شما...
      </div>
    );
  }

  // موقعیت داده نشده
  if (locationError || !location) {
    return (
      <div className={baseClass}>
        <span>📍</span>
        برای نمایش آب‌وهوا، موقعیت مکانی را فعال کنید
      </div>
    );
  }

  // در حال لود آب‌وهوا
  if (weatherLoading || !weather) {
    return (
      <div className={baseClass}>
        <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
        در حال دریافت آب‌وهوا...
      </div>
    );
  }

  // نمایش آب‌وهوا
  const icon = WEATHER_ICONS[weather.weatherCode] ?? "🌡️";
  const label = WEATHER_LABELS[weather.weatherCode] ?? "";

  return (
    <div className={baseClass}>
      <span className="text-lg">{icon}</span>
      <span>{weather.temp.toLocaleString("fa-IR")}°</span>
      <span className="text-white/80">{label}</span>

      <span className="h-4 w-px bg-white/30" />

      <span className="text-xs">📍 {location.city || "موقعیت شما"}</span>

      <span className="h-4 w-px bg-white/30" />

      <span className="text-xs">
        💨 {weather.windSpeed.toLocaleString("fa-IR")} km/h
      </span>
    </div>
  );
}