"use client";

import { useState } from "react";
import Image from "next/image";
import { megaMenu } from "@/lib/megaMenu";

export default function MobileMenuDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [activeKey, setActiveKey] = useState(megaMenu[0].key);

  const activeCategory =
    megaMenu.find((c) => c.key === activeKey) || megaMenu[0];

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={
          "fixed inset-0 z-[200] bg-black/50 transition-opacity duration-300 md:hidden " +
          (isOpen ? "visible opacity-100" : "invisible opacity-0")
        }
      />

      {/* Drawer - تمام صفحه */}
      <aside
        className={
          "fixed inset-0 z-[210] flex h-screen w-screen flex-col bg-white transition-transform duration-300 md:hidden " +
          (isOpen ? "translate-x-0" : "translate-x-full")
        }
        dir="rtl"
      >
{/* هدر بالا */}
<div className="flex flex-shrink-0 items-center justify-between border-b border-[#EDE4CE] bg-white px-3 py-2.5">
  <span className="w-8"></span>
  <span className="text-sm font-black text-amber-600">
    دسته‌بندی کالاها
  </span>
  <button
    type="button"
    onClick={onClose}
    aria-label="بستن"
    className="flex h-8 w-8 items-center justify-center rounded-full text-xl font-light text-gray-700 transition hover:bg-gray-100"
  >
    ✕
  </button>
</div>

        {/* بدنه: دو ستونه */}
        <div className="flex flex-1 overflow-hidden">
{/* ستون راست: دسته‌های اصلی */}
<div className="w-[100px] flex-shrink-0 overflow-y-auto border-l border-[#EDE4CE] bg-[#F7F1E3]/30">
  {megaMenu.map((cat) => {
    const isActive = cat.key === activeKey;
    return (
      <button
        key={cat.key}
        type="button"
        onClick={() => setActiveKey(cat.key)}
        className={
          "flex w-full flex-col items-center gap-1 border-b border-[#EDE4CE] px-1 py-2 text-center transition " +
          (isActive
            ? "bg-white text-amber-600"
            : "text-gray-700 hover:bg-white")
        }
      >
        {/* تصویر متعادل */}
        <span className="relative flex h-11 w-11 items-center justify-center">
          <Image
            src={cat.icon}
            alt={cat.label}
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
          />
        </span>
        <span
          className={
            "text-[10px] leading-tight " +
            (isActive ? "font-bold" : "font-semibold")
          }
        >
          {cat.label}
        </span>
      </button>
    );
  })}
</div>

          {/* ستون چپ: زیردسته‌ها */}
          <div className="flex-1 overflow-y-auto bg-white px-3 py-3">
            {/* لینک همه محصولات */}
<a
  href={`/products?cat=${activeCategory.key}`}
  onClick={onClose}
  className="mb-3 flex items-center justify-between border-b border-[#EDE4CE] pb-2 text-xs font-bold text-amber-600"
>
  <span>همه محصولات {activeCategory.label}</span>
  <span className="text-base">›</span>
</a>

            {/* گروه‌ها */}
            {activeCategory.groups.map((group, gi) => (
              <div key={gi} className="mb-4 last:mb-0">
                {/* عنوان گروه */}
                <h4 className="mb-2 text-xs font-bold text-gray-800">
                  {group.title}
                </h4>

                {/* آیتم‌های گروه */}
                <ul className="space-y-1.5">
                  {group.items.map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        onClick={onClose}
                        className="block border-r-2 border-[#D4C5A0] py-0.5 pr-2.5 text-xs text-gray-700 transition hover:border-amber-500 hover:text-amber-600"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>

 {/* اگه گروه "ظرفیت" بود، دکمه‌های نارنجی */}
{group.title.includes("ظرفیت") && (
  <div className="mt-2.5 flex flex-wrap gap-1.5">
    {[
      "چادر ۱ نفره",
      "چادر ۲ نفره",
      "چادر ۳ نفره",
      "چادر ۴ نفره",
      "چادر ۶ تا ۸ نفره",
      "چادر ۱۰ نفره و بالاتر",
    ].map((cap) => (
      <a
        key={cap}
        href={`/products?cat=tent&capacity=${cap}`}
        onClick={onClose}
        className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[11px] font-semibold text-amber-700 transition hover:border-amber-400 hover:bg-amber-100"
      >
        {cap}
      </a>
    ))}
  </div>
)}
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}