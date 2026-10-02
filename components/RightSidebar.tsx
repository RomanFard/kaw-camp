"use client";

import { useState } from "react";
import Image from "next/image";
import { megaMenu } from "@/lib/megaMenu";

export default function RightSidebar({
  onOpenMegaMenu,
}: {
  onOpenMegaMenu: (categoryKey?: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [clickedKey, setClickedKey] = useState<string | null>(null);

  const clickedCategory = clickedKey
    ? megaMenu.find((c) => c.key === clickedKey)
    : null;

  return (
    <div
      className="fixed right-0 top-40 z-[130] hidden md:block"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => {
        setIsExpanded(false);
        setClickedKey(null);
      }}
    >
      <div className="relative flex items-start">
        {/* ─────── نوار کناری (با گسترش) ─────── */}
        <div className="flex flex-col transition-all duration-300">
          {/* دکمه همبرگری */}
          <button
            type="button"
            onClick={() => onOpenMegaMenu()}
            aria-label="منوی اصلی"
            className={
              "flex h-12 items-center gap-3 rounded-l-full bg-amber-500 text-white shadow-lg transition-all duration-300 hover:bg-amber-600 " +
              (isExpanded ? "w-[220px] px-4" : "w-12 justify-center")
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="h-6 w-6 flex-shrink-0"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
              />
            </svg>
            {isExpanded && (
              <span className="whitespace-nowrap text-sm font-black">
                دسته‌بندی محصولات
              </span>
            )}
          </button>

          {/* لیست آیکون‌ها (با گسترش) */}
<div
  className={
    "mt-1 flex flex-col overflow-hidden rounded-l-2xl border border-r-0 border-[#E8DFC8] bg-white py-1 shadow-lg transition-all duration-300 " +
    (isExpanded ? "w-[220px]" : "w-12")
  }
>
  {megaMenu.map((cat) => {
    const isClicked = clickedKey === cat.key;
    return (
      <button
        key={cat.key}
        type="button"
        onClick={() =>
          setClickedKey(isClicked ? null : cat.key)
        }
        className={
          "flex h-12 items-center gap-3 transition " +
          (isExpanded ? "px-4" : "justify-center") +
          (isClicked ? " bg-amber-50" : " hover:bg-amber-50")
        }
      >
        <Image
          src={cat.icon}
          alt={cat.label}
          width={32}
          height={32}
          className="h-7 w-7 flex-shrink-0 object-contain"
        />

        {isExpanded && (
          <>
            {/* اسم دسته */}
            <span className="flex-1 whitespace-nowrap text-right text-sm font-bold text-gray-800">
              {cat.label}
            </span>

            {/* فلش اشاره از راست به چپ */}
<span
  className={
    "flex-shrink-0 text-base font-light transition " +
    (isClicked ? "text-amber-600" : "text-gray-300")
  }
>
  ›
</span>
          </>
        )}
      </button>
    );
  })}
</div>
        </div>

        {/* ─────── پنل زیردسته‌ها (فقط با کلیک) ─────── */}
        {clickedCategory && isExpanded && (
          <div className="absolute right-full top-14 mr-2 w-[240px] rounded-2xl border border-[#E8DFC8] bg-white py-3 shadow-2xl">
            {/* عنوان */}
            <div className="border-b border-[#EDE4CE] px-4 pb-2.5">
              <h4 className="text-sm font-black text-amber-600">
                {clickedCategory.label}
              </h4>
            </div>

            {/* آیتم‌ها */}
            <ul className="max-h-[320px] overflow-y-auto px-4 py-2">
              {clickedCategory.groups
                .flatMap((g) => g.items)
                .map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="block py-1.5 text-xs text-gray-700 transition hover:text-amber-600"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
            </ul>

            {/* دکمه مشاهده همه */}
            <div className="border-t border-[#EDE4CE] px-4 pt-2.5">
              <button
                type="button"
                onClick={() => onOpenMegaMenu(clickedCategory.key)}
                className="w-full rounded-lg bg-amber-500 py-2 text-[11px] font-bold text-white transition hover:bg-amber-600"
              >
                مشاهده همه ←
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}