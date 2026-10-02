"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WeatherCard from "@/components/WeatherCard";
import HeroWeather from "@/components/HeroWeather";
import CampingMap from "@/components/CampingMap";
import { useUserLocation } from "@/hooks/useUserLocation";
import { tours, tourTypeLabels, type Tour, type TourType } from "@/data/tours";
import LocationSelector from "@/components/LocationSelector";

// نقشه باید فقط client-side لود بشه
const RouteMap = dynamic(() => import("@/components/RouteMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[400px] items-center justify-center rounded-2xl border border-[#E8DFC8] bg-white text-sm text-gray-500">
      در حال بارگذاری نقشه...
    </div>
  ),
});

type Filter = "all" | TourType;

const FILTERS: { key: Filter; label: string; icon: string }[] = [
  { key: "all", label: "همه تورها", icon: "🎒" },
  { key: "off-road", label: "آفرود", icon: "🚙" },
  { key: "hiking", label: "کوهنوردی", icon: "🏔️" },
  { key: "camping", label: "کمپینگ", icon: "🏕️" },
];

const DIFFICULTY_STYLES: Record<string, string> = {
  "آسان": "bg-green-100 text-green-700",
  "متوسط": "bg-amber-100 text-amber-700",
  "سخت": "bg-red-100 text-red-700",
};

function formatPrice(value: number) {
  return value.toLocaleString("fa-IR");
}

/* ============================================================
   کارت تور
   ============================================================ */
function TourCard({ tour, onBook }: { tour: Tour; onBook: (t: Tour) => void }) {
  const discount = tour.oldPrice
    ? Math.round((1 - tour.price / tour.oldPrice) * 100)
    : 0;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-[#E8DFC8] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-52 w-full overflow-hidden bg-[#E8DFC8]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={tour.image}
          alt={tour.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute right-3 top-3 rounded-full bg-[#F59E0B] px-3 py-1 text-xs font-bold text-white shadow">
          {tourTypeLabels[tour.type]}
        </span>
        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white shadow">
            {discount.toLocaleString("fa-IR")}٪ تخفیف
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-bold text-gray-900">{tour.title}</h3>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${
              DIFFICULTY_STYLES[tour.difficulty]
            }`}
          >
            {tour.difficulty}
          </span>
        </div>

        <p className="line-clamp-2 text-sm leading-6 text-gray-500">
          {tour.description}
        </p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-600">
          <span>📍 {tour.location}</span>
          <span>⏱ {tour.duration}</span>
          <span>👥 ظرفیت {tour.capacity.toLocaleString("fa-IR")} نفر</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span className="text-amber-500">★</span>
          <span className="font-bold text-gray-900">
            {tour.rating.toLocaleString("fa-IR")}
          </span>
          <span>({tour.reviews.toLocaleString("fa-IR")} نظر)</span>
        </div>

        <div className="mt-auto flex items-end justify-between border-t border-[#E8DFC8] pt-3">
          <div className="flex flex-col">
            {tour.oldPrice && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(tour.oldPrice)}
              </span>
            )}
            <span className="text-lg font-extrabold text-gray-900">
              {formatPrice(tour.price)}
              <span className="mr-1 text-xs font-medium text-gray-500">
                تومان
              </span>
            </span>
          </div>
          <button
            type="button"
            onClick={() => onBook(tour)}
            className="rounded-xl bg-[#F59E0B] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#D97706]"
          >
            رزرو تور
          </button>
        </div>
      </div>
    </article>
  );
}

/* ============================================================
   بخش آب‌وهوا و نقشه
   ============================================================ */
function WeatherRouteSection({ tours }: { tours: Tour[] }) {
  const { location: userLocation, loading: userLoading } = useUserLocation();
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [tourCoords, setTourCoords] = useState<{ lat: number; lng: number } | null>(null);

  // ✅ استفاده مستقیم از مختصات ذخیره‌شده در دیتای تور
  useEffect(() => {
    if (!selectedTour) {
      setTourCoords(null);
      return;
    }
    setTourCoords({ lat: selectedTour.lat, lng: selectedTour.lng });
  }, [selectedTour]);

  return (
<section className="mx-auto max-w-6xl px-4 pb-16">
  <h2 className="mb-6 text-xl font-extrabold text-gray-900">
    🌤️ آب‌وهوای زنده و مسیر سفر
  </h2>

  {/* 👇 انتخاب موقعیت */}
  <div className="mb-6">
    <LocationSelector />
  </div>

  {/* انتخاب تور */}
  <div className="mb-6">
        <label className="mb-2 block text-sm font-bold text-gray-700">
          تور موردنظر را انتخاب کنید:
        </label>
        <select
          value={selectedTour?.id ?? ""}
          onChange={(e) => {
            const t = tours.find((x) => x.id === e.target.value) ?? null;
            setSelectedTour(t);
          }}
          className="w-full max-w-md rounded-xl border border-[#E8DFC8] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#F59E0B]"
        >
          <option value="">— انتخاب تور —</option>
          {tours.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title} ({t.location})
            </option>
          ))}
        </select>
      </div>

      {!selectedTour ? (
        <div className="rounded-2xl border border-dashed border-[#E8DFC8] bg-white/60 p-8 text-center text-sm text-gray-500">
          یک تور انتخاب کنید تا آب‌وهوا و مسیر سفر نمایش داده شود.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* ستون آب‌وهوا */}
          <div className="flex flex-col gap-4">
            {userLoading && (
              <div className="animate-pulse rounded-2xl border border-[#E8DFC8] bg-white p-4">
                <div className="h-4 w-32 rounded bg-gray-200" />
                <div className="mt-3 h-10 w-20 rounded bg-gray-200" />
                <div className="mt-2 h-3 w-40 rounded bg-gray-200" />
              </div>
            )}

            {!userLoading && userLocation && (
              <WeatherCard
                lat={userLocation.lat}
                lng={userLocation.lng}
                title="📍 موقعیت فعلی شما"
                subtitle={userLocation.city || "موقعیت شما"}
              />
            )}

            {!userLoading && !userLocation && (
              <div className="rounded-2xl border border-[#E8DFC8] bg-white p-4 text-center text-sm text-gray-500">
                برای مشاهده آب‌وهوای موقعیت خود، دسترسی به موقعیت مکانی را
                فعال کنید
              </div>
            )}

            {tourCoords && (
              <WeatherCard
                lat={tourCoords.lat}
                lng={tourCoords.lng}
                title={`🏁 ${selectedTour.title}`}
                subtitle={selectedTour.location}
              />
            )}
          </div>

          {/* ستون نقشه */}
          <div>
            {userLocation && tourCoords ? (
              <RouteMap
                from={{
                  lat: userLocation.lat,
                  lng: userLocation.lng,
                  label: userLocation.city || "موقعیت شما",
                }}
                to={{
                  lat: tourCoords.lat,
                  lng: tourCoords.lng,
                  label: selectedTour.location,
                }}
              />
            ) : (
              <div className="flex h-[400px] items-center justify-center rounded-2xl border border-[#E8DFC8] bg-white text-sm text-gray-500">
                {!userLocation
                  ? "در انتظار دسترسی به موقعیت مکانی..."
                  : "در حال بارگذاری مختصات مقصد..."}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

/* ============================================================
   صفحه اصلی
   ============================================================ */
export default function ExplorePage() {
  const searchParams = useSearchParams();
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedTourId, setSelectedTourId] = useState<string>(
    tours[0]?.id ?? ""
  );
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    people: "1",
  });

  // خواندن فیلتر از URL
  useEffect(() => {
    const t = searchParams.get("type") as TourType | null;
    if (t && ["off-road", "hiking", "camping"].includes(t)) setFilter(t);
  }, [searchParams]);

  const filteredTours = useMemo(
    () => (filter === "all" ? tours : tours.filter((t) => t.type === filter)),
    [filter]
  );

  const handleBook = (tour: Tour) => {
    setSelectedTourId(tour.id);
    setSubmitted(false);
    document
      .getElementById("booking")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-[#F7F1E3]">
      <Header />

      {/* ==================== Hero ==================== */}
      <section className="bg-gradient-to-l from-[#F59E0B] to-[#D97706] text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-16 text-center md:py-24">
          
          {/* 🌤️ نوار آب‌وهوای لایو */}
          <HeroWeather />

          <span className="rounded-full bg-white/20 px-4 py-1 text-sm font-bold">
            🚙 آفرود و تور
          </span>
          <h1 className="text-3xl font-extrabold leading-tight md:text-5xl">
            ماجراجویی بعدی‌ات را با ما تجربه کن
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-white/90 md:text-base">
            تورهای آفرود، کوهنوردی و کمپینگ با لیدرهای حرفه‌ای، تجهیزات کامل و
            ایمنی تضمین‌شده.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-0 z-20 border-b border-[#E8DFC8] bg-[#F7F1E3]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-4">
          {FILTERS.map((f) => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition ${
                  active
                    ? "border-[#F59E0B] bg-[#F59E0B] text-white"
                    : "border-[#E8DFC8] bg-white text-gray-700 hover:border-[#F59E0B]"
                }`}
              >
                <span>{f.icon}</span>
                <span>{f.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        {filteredTours.length === 0 ? (
          <p className="py-16 text-center text-gray-500">
            توری در این دسته پیدا نشد.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTours.map((tour) => (
              <TourCard key={tour.id} tour={tour} onBook={handleBook} />
            ))}
          </div>
        )}
      </section>

      {/* Booking form */}
      <section id="booking" className="mx-auto max-w-3xl px-4 pb-16">
        <div className="rounded-3xl border border-[#E8DFC8] bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-xl font-extrabold text-gray-900">
            📝 فرم رزرو تور
          </h2>

          {submitted ? (
            <div className="mt-6 rounded-2xl bg-green-50 p-6 text-center">
              <p className="text-lg font-bold text-green-700">
                ✅ درخواستت ثبت شد!
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-4 rounded-xl bg-[#F59E0B] px-5 py-2 text-sm font-bold text-white"
              >
                ثبت درخواست جدید
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  required
                  placeholder="نام و نام خانوادگی"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="rounded-xl border border-[#E8DFC8] bg-[#F7F1E3] px-4 py-2.5 text-sm outline-none focus:border-[#F59E0B]"
                />
                <input
                  required
                  placeholder="شماره تماس"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="rounded-xl border border-[#E8DFC8] bg-[#F7F1E3] px-4 py-2.5 text-sm outline-none focus:border-[#F59E0B]"
                />
              </div>

              <select
                value={selectedTourId}
                onChange={(e) => setSelectedTourId(e.target.value)}
                className="rounded-xl border border-[#E8DFC8] bg-[#F7F1E3] px-4 py-2.5 text-sm outline-none focus:border-[#F59E0B]"
              >
                {tours.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title} — {formatPrice(t.price)} تومان
                  </option>
                ))}
              </select>

              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  required
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="rounded-xl border border-[#E8DFC8] bg-[#F7F1E3] px-4 py-2.5 text-sm outline-none focus:border-[#F59E0B]"
                />
                <input
                  required
                  type="number"
                  min={1}
                  max={20}
                  value={form.people}
                  onChange={(e) => setForm({ ...form, people: e.target.value })}
                  className="rounded-xl border border-[#E8DFC8] bg-[#F7F1E3] px-4 py-2.5 text-sm outline-none focus:border-[#F59E0B]"
                />
              </div>

              <button
                type="submit"
                className="mt-2 rounded-xl bg-[#1E40AF] px-6 py-3 text-sm font-bold text-white hover:bg-blue-900"
              >
                ثبت درخواست رزرو
              </button>
            </form>
          )}
        </div>
      </section>

{/* ===== بخش آب‌وهوا و نقشه ===== */}
<WeatherRouteSection tours={tours} />

{/* ===== نقشه کمپینگ ایران ===== */}
<CampingMap />

<Footer />
    </main>
  );
}