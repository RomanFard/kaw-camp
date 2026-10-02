"use client";

import { useState } from "react";
import { useUserLocation } from "@/hooks/useUserLocation";

type SearchResult = {
  lat: string;
  lon: string;
  display_name: string;
  name?: string;
};

export default function LocationSelector() {
  const { location, loading, error, refresh, setManualLocation } =
    useUserLocation();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&accept-language=fa&limit=5&countrycodes=ir`,
        { headers: { "User-Agent": "KawCamp/1.0" } }
      );
      const data: SearchResult[] = await res.json();
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }

  function pickResult(r: SearchResult) {
    setManualLocation(
      parseFloat(r.lat),
      parseFloat(r.lon),
      r.name || r.display_name.split(",")[0]
    );
    setOpen(false);
    setQuery("");
    setResults([]);
  }

  return (
    <div className="rounded-2xl border border-[#E8DFC8] bg-white p-4 shadow-sm">
      {/* نمایش موقعیت فعلی */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${
              location
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            📍
          </div>
          <div>
            <p className="text-xs text-gray-500">موقعیت فعلی</p>
            <p className="text-sm font-bold text-gray-900">
              {loading
                ? "در حال یافتن..."
                : location?.city
                ? `${location.city}`
                : "نامشخص"}
            </p>
            {location?.source === "manual" && (
              <p className="text-[10px] text-amber-600">انتخاب دستی</p>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={refresh}
            disabled={loading}
            className="rounded-xl border border-[#E8DFC8] bg-white px-3 py-2 text-xs font-bold text-gray-700 transition hover:border-[#F59E0B] hover:text-amber-600 disabled:opacity-50"
            title="آپدیت موقعیت GPS"
          >
            🔄 آپدیت موقعیت
          </button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="rounded-xl bg-[#F59E0B] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#D97706]"
          >
            🔍 جستجوی شهر
          </button>
        </div>
      </div>

      {error && !location && (
        <p className="mt-3 text-xs text-red-600">
          ⚠️ {error} — می‌تونی شهر رو دستی جستجو کنی
        </p>
      )}

      {/* پنل جستجو */}
      {open && (
        <div className="mt-4 border-t border-[#E8DFC8] pt-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="مثلاً: تهران، اصفهان، کرج..."
              className="flex-1 rounded-xl border border-[#E8DFC8] bg-[#F7F1E3] px-4 py-2.5 text-sm outline-none focus:border-[#F59E0B]"
            />
            <button
              type="submit"
              disabled={searching}
              className="rounded-xl bg-[#1E40AF] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-900 disabled:opacity-50"
            >
              {searching ? "..." : "جستجو"}
            </button>
          </form>

          {/* نتایج */}
          {results.length > 0 && (
            <ul className="mt-3 space-y-1.5">
              {results.map((r) => (
                <li key={`${r.lat}-${r.lon}`}>
                  <button
                    type="button"
                    onClick={() => pickResult(r)}
                    className="w-full rounded-xl border border-[#E8DFC8] bg-white px-3 py-2 text-right text-xs text-gray-700 transition hover:border-[#F59E0B] hover:bg-amber-50"
                  >
                    📍 {r.display_name}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {!searching && query && results.length === 0 && (
            <p className="mt-3 text-center text-xs text-gray-500">
              نتیجه‌ای پیدا نشد
            </p>
          )}
        </div>
      )}
    </div>
  );
}