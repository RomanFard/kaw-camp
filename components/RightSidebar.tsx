"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { megaMenu } from "@/lib/megaMenu";

export default function RightSidebar({
  forceOpen = false,
  onForceClose,
}: {
  forceOpen?: boolean;
  onForceClose?: () => void;
}) {
  const [isLocalExpanded, setIsLocalExpanded] = useState(false);
  const [activeKey, setActiveKey] = useState(megaMenu[0].key);

  const isExpanded = forceOpen || isLocalExpanded;

  const activeCategory =
    megaMenu.find((c) => c.key === activeKey) || megaMenu[0];

  // اگه forceOpen فعال شد، state محلی هم فعال بشه
  useEffect(() => {
    if (forceOpen) {
      setIsLocalExpanded(true);
    }
  }, [forceOpen]);

  function closeAll() {
    setIsLocalExpanded(false);
    if (onForceClose) onForceClose();
  }

  return (
    <div
      className="fixed right-0 top-40 z-[130] hidden md:block"
      onMouseLeave={closeAll}
    >
      <div className="relative flex items-start">
        {/* ─── نوار کناری ─── */}
        <div className="flex flex-col transition-all duration-300">
          {/* دکمه همبرگری */}
          <button
            type="button"
            onMouseEnter={() => setIsLocalExpanded(true)}
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

          {/* لیست دسته‌ها */}
          <div
            className={
              "mt-1 flex flex-col overflow-hidden rounded-l-2xl border border-r-0 border-[#E8DFC8] bg-white py-1 shadow-lg transition-all duration-300 " +
              (isExpanded ? "w-[220px]" : "w-12")
            }
          >
            {megaMenu.map((cat) => {
              const isActive = activeKey === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onMouseEnter={() => {
                    setActiveKey(cat.key);
                    setIsLocalExpanded(true);
                  }}
                  className={
                    "flex h-12 items-center gap-3 transition " +
                    (isExpanded ? "px-4" : "justify-center") +
                    (isActive ? " bg-amber-50" : " hover:bg-amber-50")
                  }
                >
                  <span className="relative flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#F7F1E3]">
                    <Image
                      src={cat.photo || cat.icon}
                      alt={cat.label}
                      width={32}
                      height={32}
                      className="h-full w-full object-cover"
                    />
                  </span>
                  {isExpanded && (
                    <>
                      <span className="flex-1 whitespace-nowrap text-right text-sm font-bold text-gray-800">
                        {cat.label}
                      </span>
                      <span
                        className={
                          "flex-shrink-0 text-base font-light " +
                          (isActive ? "text-amber-600" : "text-gray-300")
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

        {/* ─── پنل عکس بزرگ + زیردسته ─── */}
        {isExpanded && (
          <div
            className="absolute right-full top-0 mr-2 w-[700px] overflow-hidden rounded-2xl border border-[#E8DFC8] bg-white shadow-2xl"
            onMouseEnter={() => setIsLocalExpanded(true)}
          >
            <div className="flex">
              {/* عکس بزرگ (راست) */}
              <div className="flex w-[240px] flex-shrink-0 flex-col items-center bg-[#F7F1E3] p-3">
                <div className="relative aspect-square w-full overflow-hidden">
                  <Image
                    src={activeCategory.photo || activeCategory.icon}
                    alt={activeCategory.label}
                    fill
                    sizes="240px"
                    className="object-contain"
                  />
                </div>

                <a
                  href={`/products?cat=${activeCategory.key}`}
                  className="mt-4 w-full rounded-lg bg-amber-500 py-3 text-center text-sm font-bold text-white transition hover:bg-amber-600"
                >
                  مشاهده همه محصولات
                </a>
              </div>

              {/* لیست زیردسته‌ها (چپ) */}
              <div className="flex-1 p-6">
                <h3 className="mb-5 border-b border-[#EDE4CE] pb-3 text-xl font-black text-gray-900">
                  {activeCategory.label}
                </h3>

                <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                  {activeCategory.groups.map((group) => (
                    <div key={group.title}>
                      <h4 className="mb-3 text-sm font-bold text-amber-600">
                        {group.title}
                      </h4>
                      <ul className="space-y-2">
                        {group.items.map((item) => (
                          <li key={item.label}>
                            <a
                              href={item.href}
                              className="block text-sm text-gray-700 transition hover:text-amber-600"
                            >
                              {item.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* دکمه‌های ظرفیت چادر */}
                {activeCategory.key === "tent" && (
                  <div className="mt-5 border-t border-[#EDE4CE] pt-4">
                    <h4 className="mb-3 text-sm font-bold text-gray-700">
                      براساس ظرفیت:
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
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
                          className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[11px] font-semibold text-amber-700 transition hover:border-amber-400 hover:bg-amber-100"
                        >
                          {cap}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}