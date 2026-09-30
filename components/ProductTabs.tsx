"use client";

import { useState } from "react";
import { Product } from "@/data/products";

const tabs = ["معرفی", "مشخصات", "پیشنهاد ما", "دیدگاه‌ها"];

export default function ProductTabs({ product }: { product: Product }) {
  const [active, setActive] = useState("معرفی");

  return (
    <div className="rounded-xl border border-[#E8DFC8] bg-white">
      {/* نوار تب‌ها */}
      <div className="flex border-b border-[#E8DFC8]">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setActive(t)}
            className={
              "flex-1 border-b-2 px-6 py-4 text-base font-bold transition " +
              (active === t
                ? "border-amber-500 text-amber-600"
                : "border-transparent text-gray-600 hover:text-amber-600")
            }
          >
            {t}
          </button>
        ))}
      </div>

      {/* محتوا */}
      <div className="p-6">
        {active === "معرفی" && (
          <div>
            <h3 className="mb-4 text-lg font-bold text-gray-800">
              توضیحات محصول
            </h3>
            <p className="leading-8 text-gray-700">{product.description}</p>

            <h4 className="mt-8 mb-4 text-base font-bold text-gray-800">
              ویژگی‌های کلیدی
            </h4>
            <ul className="space-y-3">
              {product.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-gray-700">
                  <span className="mt-1 text-amber-500">◆</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {active === "مشخصات" && (
          <div>
            <h3 className="mb-4 text-lg font-bold text-gray-800">
              مشخصات فنی
            </h3>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-[#EDE4CE]">
                  <td className="py-3 text-gray-500">دسته‌بندی</td>
                  <td className="py-3 text-gray-800">{product.category}</td>
                </tr>
                <tr className="border-b border-[#EDE4CE]">
                  <td className="py-3 text-gray-500">برند</td>
                  <td className="py-3 text-gray-800">
                    {product.brand || "KAW CAMP"}
                  </td>
                </tr>
                <tr className="border-b border-[#EDE4CE]">
                  <td className="py-3 text-gray-500">امتیاز</td>
                  <td className="py-3 text-gray-800">
                    {product.rating} از ۵
                  </td>
                </tr>
                <tr>
                  <td className="py-3 text-gray-500">موجودی</td>
                  <td className="py-3 text-gray-800">
                    {product.inStock ? "موجود" : "ناموجود"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {active === "پیشنهاد ما" && (
          <div className="text-center text-gray-500">
            <p className="text-4xl">🎯</p>
            <p className="mt-3">محصولات مشابه به‌زودی اینجا نمایش داده می‌شوند</p>
          </div>
        )}

        {active === "دیدگاه‌ها" && (
          <div className="text-center text-gray-500">
            <p className="text-4xl">💬</p>
            <p className="mt-3">
              {product.reviews} دیدگاه برای این محصول ثبت شده
            </p>
            <button
              type="button"
              className="mt-4 rounded-lg border border-amber-500 px-6 py-2 text-sm font-bold text-amber-600 hover:bg-amber-50"
            >
              ثبت دیدگاه
            </button>
          </div>
        )}
      </div>
    </div>
  );
}