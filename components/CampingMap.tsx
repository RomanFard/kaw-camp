"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useUserLocation } from "@/hooks/useUserLocation";
import LocationSelector from "@/components/LocationSelector";

// ─── داده‌های مکان‌های کمپینگ در ایران ──────────────────────────────
const CAMPING_SITES = [
  { name: "کویر مصر", lat: 32.4, lng: 54.6, type: "کویر" },
  { name: "دماوند (پلور)", lat: 35.846, lng: 52.06, type: "کوهستان" },
  { name: "جنگل النگدره", lat: 36.841, lng: 54.44, type: "جنگل" },
  { name: "ارسباران", lat: 38.6, lng: 47.0, type: "کوهستان" },
  { name: "علم‌کوه", lat: 36.378, lng: 50.964, type: "کوهستان" },
  { name: "کویر ورزنه", lat: 32.419, lng: 52.648, type: "کویر" },
  { name: "دریاچه ولشت", lat: 36.503, lng: 51.302, type: "دریاچه" },
  { name: "تالاب کانی‌برازان", lat: 37.0, lng: 45.5, type: "تالاب" },
  { name: "غار علیصدر", lat: 35.3, lng: 48.3, type: "غار" },
  { name: "جزیره هرمز", lat: 27.06, lng: 56.46, type: "ساحلی" },
  { name: "کلوت‌های شهداد", lat: 30.8, lng: 57.77, type: "کویر" },
  { name: "آبشار کفترلو", lat: 35.896, lng: 51.646, type: "آبشار" },
];

type WeatherData = {
  temp: number;
  weatherCode: number;
  windSpeed: number;
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
  51: "نم‌باران", 53: "باران سبک", 55: "باران",
  61: "باران سبک", 63: "باران", 65: "باران شدید",
  71: "برف سبک", 73: "برف", 75: "برف شدید",
  80: "رگبار سبک", 81: "رگبار", 82: "رگبار شدید",
  95: "رعد و برق", 96: "رعد و برق با تگرگ", 99: "رعد و برق شدید",
};

// ─── هوک آب‌وهوا ───────────────────────────────────────────────────
function useWeather(lat: number | null, lng: number | null) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lat === null || lng === null) {
      setWeather(null);
      return;
    }
    let cancelled = false;
    setLoading(true);

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
        if (!cancelled) setWeather(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchWeather();
    const interval = setInterval(fetchWeather, 600_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [lat, lng]);

  return { weather, loading };
}

// ─── کامپوننت اصلی ────────────────────────────────────────────────
export default function CampingMap() {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const clickMarkerRef = useRef<L.Marker | null>(null);
  const lineRef = useRef<L.Polyline | null>(null);
  const circleRef = useRef<L.Circle | null>(null);

  const { location: userLocation } = useUserLocation();

  // ✅ ref برای دسترسی به آخرین userLocation داخل event handler
  const userLocationRef = useRef(userLocation);

  const [clickedPoint, setClickedPoint] = useState<{ lat: number; lng: number } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

  const { weather: userWeather, loading: userLoading } = useWeather(
    userLocation?.lat ?? null,
    userLocation?.lng ?? null
  );
  const { weather: pointWeather, loading: pointLoading } = useWeather(
    clickedPoint?.lat ?? null,
    clickedPoint?.lng ?? null
  );

  // ✅ هر بار userLocation عوض شد، ref رو آپدیت کن
  useEffect(() => {
    userLocationRef.current = userLocation;
  }, [userLocation]);

  // ─── راه‌اندازی اولیه نقشه (فقط یک بار) ──────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const IRAN_BOUNDS: L.LatLngBoundsExpression = [
      [24.0, 44.0],
      [40.0, 64.0],
    ];

    const map = L.map(containerRef.current, {
      center: [32.4279, 53.688],
      zoom: 5,
      minZoom: 5,
      maxZoom: 13,
      maxBounds: IRAN_BOUNDS,
      maxBoundsViscosity: 0.8,
      scrollWheelZoom: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    // مارکرهای مکان‌های کمپینگ
    CAMPING_SITES.forEach((site) => {
      const icon = L.divIcon({
        className: "custom-camping-icon",
        html: `<div style="
          background: #FF6B4A;
          width: 28px;
          height: 28px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        "><span style="transform: rotate(45deg); font-size: 14px;">🏕️</span></div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
      });

      L.marker([site.lat, site.lng], { icon })
        .addTo(map)
        .bindPopup(
          `<div style="text-align:right; min-width:140px; font-family:inherit;">
            <b style="font-size:14px;">🏕️ ${site.name}</b><br/>
            <span style="color:#666; font-size:12px;">${site.type}</span>
          </div>`
        );
    });

    // ─── کلیک روی نقشه ─────────────────────────────────────────
    map.on("click", (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      setClickedPoint({ lat, lng });

      // حذف مارکر سبز قبلی
      if (clickMarkerRef.current) {
        map.removeLayer(clickMarkerRef.current);
      }

      // مارکر سبز جدید
      clickMarkerRef.current = L.marker([lat, lng], {
        icon: L.divIcon({
          className: "custom-click-icon",
          html: `<div style="
            background: #16A34A;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.4);
          "><span style="font-size:12px;">📍</span></div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        }),
      })
        .addTo(map)
        .bindPopup(`📍 موقعیت انتخابی شما`)
        .openPopup();

      // ✅ استفاده از ref به جای closure
      const currentUser = userLocationRef.current;
      if (currentUser) {
        const userLatLng = L.latLng(currentUser.lat, currentUser.lng);
        const clickLatLng = L.latLng(lat, lng);
        const dist = userLatLng.distanceTo(clickLatLng);
        setDistance(dist / 1000);

        // خط نارنجی خط‌چین
        if (lineRef.current) map.removeLayer(lineRef.current);
        lineRef.current = L.polyline([userLatLng, clickLatLng], {
          color: "#FF6B4A",
          weight: 3,
          dashArray: "8 8",
          opacity: 0.8,
        }).addTo(map);

        // دایره دور کاربر
        if (circleRef.current) map.removeLayer(circleRef.current);
        circleRef.current = L.circle(userLatLng, {
          radius: 500,
          color: "#1E40AF",
          fillColor: "#1E40AF",
          fillOpacity: 0.15,
          weight: 2,
        }).addTo(map);

        // زوم روی هر دو نقطه
        const bounds = L.latLngBounds([userLatLng, clickLatLng]);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
      } else {
        // اگه کاربر لوکیشن نداشت، فقط مارکر سبز بمونه
        setDistance(null);
      }
    });

    // اگه کاربر لوکیشن داشت، مارکر آبی اولیه
    if (userLocationRef.current) {
      addUserMarker(map, userLocationRef.current.lat, userLocationRef.current.lng);
    }

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── آپدیت مارکر آبی وقتی لوکیشن کاربر عوض می‌شه ──────────────
  useEffect(() => {
    if (!mapRef.current || !userLocation) return;
    addUserMarker(mapRef.current, userLocation.lat, userLocation.lng);
  }, [userLocation]);

  function addUserMarker(map: L.Map, lat: number, lng: number) {
    if (userMarkerRef.current) {
      map.removeLayer(userMarkerRef.current);
    }
    userMarkerRef.current = L.marker([lat, lng], {
      icon: L.divIcon({
        className: "custom-user-icon",
        html: `<div style="
          background: #1E40AF;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 4px solid white;
          box-shadow: 0 0 0 4px rgba(30,64,175,0.3);
        "></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      }),
    })
      .addTo(map)
      .bindPopup(`📍 موقعیت شما`);
  }

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16">
      <h2 className="mb-6 text-xl font-extrabold text-gray-900">
        🗺️ نقشه کمپینگ ایران
      </h2>

      <div className="mb-4">
        <LocationSelector />
      </div>

      <div className="mb-4 flex flex-wrap gap-4 text-xs text-gray-600">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-full bg-[#FF6B4A]" />
          مکان‌های کمپینگ
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-full bg-[#1E40AF]" />
          موقعیت شما
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-full bg-[#16A34A]" />
          موقعیت انتخابی
        </span>
      </div>

      <div
        ref={containerRef}
        className="w-full overflow-hidden rounded-2xl border border-[#E8DFC8]"
        style={{ height: "500px", minHeight: "500px" }}
      />

      {(userLocation || clickedPoint) && (
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <WeatherPanel
            title="📍 موقعیت شما"
            weather={userWeather}
            loading={userLoading}
            accent="blue"
            subtitle={userLocation?.city || ""}
          />

          {distance !== null && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-[#E8DFC8] bg-white p-5 text-center shadow-sm">
              <span className="text-3xl">📏</span>
              <span className="mt-2 text-2xl font-extrabold text-gray-900">
                {distance.toLocaleString("fa-IR", { maximumFractionDigits: 1 })}
                <span className="mr-1 text-sm font-medium text-gray-500">
                  کیلومتر
                </span>
              </span>
              <span className="mt-1 text-xs text-gray-500">
                فاصله مستقیم تا نقطه انتخابی
              </span>
            </div>
          )}

          <WeatherPanel
            title="🎯 موقعیت انتخابی"
            weather={pointWeather}
            loading={pointLoading}
            accent="green"
            subtitle=""
          />
        </div>
      )}

      {!clickedPoint && (
        <div className="mt-4 rounded-xl border border-dashed border-[#E8DFC8] bg-white/60 p-4 text-center text-sm text-gray-500">
          👆 روی هر نقطه از نقشه کلیک کنید تا آب‌وهوای آنجا را با موقعیت خودتان
          مقایسه کنید و فاصله را ببینید.
        </div>
      )}
    </section>
  );
}

function WeatherPanel({
  title,
  weather,
  loading,
  accent,
  subtitle,
}: {
  title: string;
  weather: WeatherData | null;
  loading: boolean;
  accent: "blue" | "green";
  subtitle?: string;
}) {
  const accentColor = accent === "blue" ? "border-blue-200" : "border-green-200";
  const bgColor = accent === "blue" ? "bg-blue-50/50" : "bg-green-50/50";

  if (loading) {
    return (
      <div className={`animate-pulse rounded-2xl border ${accentColor} ${bgColor} p-5`}>
        <div className="h-4 w-24 rounded bg-gray-200" />
        <div className="mt-3 h-10 w-16 rounded bg-gray-200" />
      </div>
    );
  }

  if (!weather) {
    return (
      <div className={`rounded-2xl border ${accentColor} ${bgColor} p-5 text-center text-sm text-gray-500`}>
        {title}
        <br />
        <span className="text-xs">در انتظار داده...</span>
      </div>
    );
  }

  const icon = WEATHER_ICONS[weather.weatherCode] ?? "🌡️";
  const label = WEATHER_LABELS[weather.weatherCode] ?? "";

  return (
    <div className={`rounded-2xl border ${accentColor} ${bgColor} p-5 shadow-sm`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-bold text-gray-900">{title}</p>
          {subtitle && (
            <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>
          )}
        </div>
        <span className="text-3xl">{icon}</span>
      </div>

      <div className="mt-3 flex items-end gap-2">
        <span className="text-3xl font-extrabold text-gray-900">
          {weather.temp.toLocaleString("fa-IR")}°
        </span>
        <span className="mb-1 text-sm text-gray-500">{label}</span>
      </div>

      <div className="mt-3 flex gap-4 border-t border-[#E8DFC8] pt-3 text-xs text-gray-600">
        <span>💧 {weather.humidity.toLocaleString("fa-IR")}٪</span>
        <span>💨 {weather.windSpeed.toLocaleString("fa-IR")} km/h</span>
      </div>
    </div>
  );
}