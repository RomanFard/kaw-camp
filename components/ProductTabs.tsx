"use client";

import { useState } from "react";
import { Product } from "@/data/products";

const tabs = ["معرفی", "مشخصات", "دیدگاه‌ها", "پیشنهاد ما"];

export default function ProductTabs({ product }: { product: Product }) {
  const [active, setActive] = useState(0);

  return (
    <div className="rounded-xl border border-[#E8DFC8] bg-white">
      {/* نوار تب‌ها */}
      <div className="flex overflow-x-auto border-b border-[#E8DFC8]">
        {tabs.map((t, i) => (
          <button
            key={t}
            type="button"
            onClick={() => setActive(i)}
            className={
              "flex flex-shrink-0 items-center gap-2 px-4 py-4 text-sm font-bold transition md:px-6 " +
              (i === active
                ? "border-b-2 border-amber-500 text-amber-600"
                : "border-b-2 border-transparent text-gray-600 hover:text-amber-600")
            }
          >
            <span>{["📝", "📋", "💬", "🎯"][i]}</span>
            <span>{t}</span>
          </button>
        ))}
      </div>

      {/* تب ۱: معرفی */}
      {active === 0 && (
        <div className="p-4 md:p-6">
          <h2 className="mb-2 text-base font-bold text-gray-800">
            توضیحات محصول
          </h2>
          <p className="mb-4 break-words text-sm text-gray-400" dir="ltr">
            {product.englishName || product.slug}
          </p>
          <p className="break-words text-sm leading-8 text-gray-700 md:text-base">
            {product.description}
          </p>

          <h3 className="mt-8 mb-4 text-base font-bold text-gray-800">
            ویژگی‌های کلیدی
          </h3>
          <ul className="space-y-3">
            {product.features.map((f) => (
              <li
                key={f}
                className="flex items-start gap-2 text-sm text-gray-700"
              >
                <span className="mt-0.5 text-amber-500">◆</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* تب ۲: مشخصات */}
      {active === 1 && (
        <div className="p-4 md:p-6">
          <h2 className="mb-4 text-base font-bold text-gray-800">
            مشخصات فنی
          </h2>
          <table className="w-full table-fixed text-sm">
            <tbody>
              <tr className="border-b border-[#EDE4CE]">
                <td className="break-words py-3 text-gray-500">برند</td>
                <td className="py-3 font-semibold text-gray-800">
                  {product.brand || "کو کمپ"}
                </td>
              </tr>
              <tr className="border-b border-[#EDE4CE]">
                <td className="py-3 text-gray-500">نام انگلیسی</td>
                <td className="py-3 font-semibold text-gray-800" dir="ltr">
                  {product.englishName || product.slug}
                </td>
              </tr>
              <tr className="border-b border-[#EDE4CE]">
                <td className="py-3 text-gray-500">دسته‌بندی</td>
                <td className="py-3 font-semibold text-gray-800">
                  {product.category}
                </td>
              </tr>
              <tr className="border-b border-[#EDE4CE]">
                <td className="py-3 text-gray-500">امتیاز</td>
                <td className="py-3 font-semibold text-gray-800">
                  {product.rating} از ۵
                </td>
              </tr>
              <tr className="border-b border-[#EDE4CE]">
                <td className="py-3 text-gray-500">تعداد نظرات</td>
                <td className="py-3 font-semibold text-gray-800">
                  {product.reviews} نظر
                </td>
              </tr>
              <tr>
                <td className="py-3 text-gray-500">وضعیت موجودی</td>
                <td className="py-3 font-semibold text-green-600">
                  {product.inStock ? "موجود در انبار" : "ناموجود"}
                </td>
              </tr>
            </tbody>
          </table>

          <h3 className="mt-6 mb-4 text-base font-bold text-gray-800">
            ویژگی‌ها
          </h3>
          <ul className="space-y-2">
            {product.features.map((f) => (
              <li
                key={f}
                className="flex items-start gap-2 text-sm text-gray-700"
              >
                <span className="mt-0.5 text-amber-500">✓</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* تب ۳: دیدگاه‌ها */}
      {active === 2 && (
        <div className="p-4 md:p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-800">
              دیدگاه کاربران
            </h2>
            <span className="text-sm text-gray-500">
              {product.reviews} دیدگاه
            </span>
          </div>

          <div className="rounded-xl border-2 border-dashed border-[#E8DFC8] bg-[#F7F1E3]/30 p-8 text-center">
            <p className="text-5xl">💬</p>
            <p className="mt-4 text-base font-bold text-gray-700">
              هنوز دیدگاهی ثبت نشده
            </p>
            <p className="mt-2 text-sm text-gray-500">
              اولین نفری باشید که نظر خود را ثبت می‌کند
            </p>
            <button
              type="button"
              className="mt-5 rounded-lg bg-amber-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-amber-600"
            >
              ثبت دیدگاه
            </button>
          </div>
        </div>
      )}

      {/* تب ۴: پیشنهاد ما */}
      {active === 3 && (
        <div className="p-4 md:p-6">
          <h2 className="mb-4 text-base font-bold text-gray-800">
            پیشنهاد ما به شما
          </h2>
          <div className="rounded-xl border-2 border-dashed border-[#E8DFC8] bg-[#F7F1E3]/30 p-8 text-center">
            <p className="text-5xl">🎯</p>
            <p className="mt-4 text-base font-bold text-gray-700">
              به‌زودی محصولات مشابه اینجا نمایش داده می‌شود
            </p>
            <p className="mt-2 text-sm text-gray-500">
              ما در حال آماده‌سازی پیشنهادات ویژه برای شما هستیم
            </p>
            <a
              href="/products"
              className="mt-5 inline-block rounded-lg bg-amber-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-amber-600"
            >
              مشاهده همه محصولات
            </a>
          </div>
        </div>
      )}
    </div>
  );
}