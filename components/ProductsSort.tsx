"use client";

import { useRouter } from "next/navigation";

const sortOptions = [
  { value: "popular", label: "مرتب‌سازی بر اساس محبوبیت" },
  { value: "newest", label: "مرتب‌سازی بر اساس جدیدترین" },
  { value: "cheap", label: "مرتب‌سازی بر اساس ارزان‌ترین" },
  { value: "expensive", label: "مرتب‌سازی بر اساس گران‌ترین" },
  { value: "discount", label: "مرتب‌سازی بر اساس تخفیف‌دار" },
];

export default function ProductsSort({
  cat,
  sort,
}: {
  cat?: string;
  sort?: string;
}) {
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams();
    if (cat) params.set("cat", cat);
    params.set("sort", e.target.value);
    router.push("/products?" + params.toString());
  }

  return (
    <select
      value={sort || "popular"}
      onChange={handleChange}
      className="rounded-lg border border-[#E8DFC8] bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 outline-none transition focus:border-amber-500 md:text-sm"
    >
      {sortOptions.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}