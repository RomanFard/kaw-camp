"use client";

import { useEffect, useState } from "react";

type WeatherData = {
  temp: number;
  windSpeed: number;
  weatherCode: number;
  humidity: number;
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

function getWeatherInfo(code: number) {
  return {
    icon: WEATHER_ICONS[code] ?? "🌡️",
    label: WEATHER_LABELS[code] ?? "نامشخص",
  };
}

export default function WeatherCard({
  lat,
  lng,
  title,
  subtitle,
}: {
  lat: number;
  lng: number;
  title: string;
  subtitle?: string;
}) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchWeather() {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}` +
            `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code` +
            `&timezone=auto`
        );
        const data = await res.json();
        if (cancelled) return;

        setWeather({
          temp: Math.round(data.current.temperature_2m),
          windSpeed: Math.round(data.current.wind_speed_10m),
          weatherCode: data.current.weather_code,
          humidity: data.current.relative_humidity_2m,
        });
      } catch {
        if (!cancelled) setError(true);
      }
    }

    fetchWeather();
    const interval = setInterval(fetchWeather, 600_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [lat, lng]);

  if (error) {
    return (
      <div className="rounded-2xl border border-[#E8DFC8] bg-white p-4 text-center text-sm text-gray-500">
        خطا در دریافت آب‌وهوا
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="animate-pulse rounded-2xl border border-[#E8DFC8] bg-white p-4">
        <div className="h-4 w-24 rounded bg-gray-200" />
        <div className="mt-3 h-10 w-20 rounded bg-gray-200" />
        <div className="mt-2 h-3 w-32 rounded bg-gray-200" />
      </div>
    );
  }

  const info = getWeatherInfo(weather.weatherCode);

  return (
    <div className="rounded-2xl border border-[#E8DFC8] bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-bold text-gray-900">{title}</p>
          {subtitle && (
            <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>
          )}
        </div>
        <span className="text-3xl">{info.icon}</span>
      </div>

      <div className="mt-3 flex items-end gap-2">
        <span className="text-3xl font-extrabold text-gray-900">
          {weather.temp.toLocaleString("fa-IR")}°
        </span>
        <span className="mb-1 text-sm text-gray-500">{info.label}</span>
      </div>

      <div className="mt-3 flex gap-4 border-t border-[#E8DFC8] pt-3 text-xs text-gray-600">
        <span>💧 {weather.humidity.toLocaleString("fa-IR")}٪</span>
        <span>💨 {weather.windSpeed.toLocaleString("fa-IR")} km/h</span>
      </div>
    </div>
  );
}