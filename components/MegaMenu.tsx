"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { megaMenu } from "@/lib/megaMenu";

export default function MegaMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeKey, setActiveKey] = useState(megaMenu[0].key);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const activeCategory =
    megaMenu.find((c) => c.key === activeKey) || megaMenu[0];

  return (
    <div className="relative" ref={ref}>
      {/* دکمه اصلی */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center gap-3 bg-amber-500 px-6 py-5 text-lg font-bold text-white transition hover:bg-amber-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
          />
        </svg>
        <span>دسته‌بندی کالاها</span>
      </button>

      {/* مگا منو */}
      {isOpen && (
        <div
          className="absolute right-0 top-full z-[100] w-[900px] border border-t-0 border-[#D4C5A0] bg-white shadow-2xl"
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="grid grid-cols-[240px_1fr]">
            {/* ستون راست: دسته‌های اصلی */}
            <ul className="border-l border-[#EDE4CE] bg-[#F7F1E3]/30 py-2">
              {megaMenu.map((cat) => {
                const isActive = cat.key === activeKey;
                return (
                  <li key={cat.key}>
                    <button
                      type="button"
                      onMouseEnter={() => setActiveKey(cat.key)}
                      onClick={() => setActiveKey(cat.key)}
                      className={
                        "flex w-full items-center justify-between px-4 py-3 text-right text-sm font-bold transition " +
                        (isActive
                          ? "bg-white text-amber-600"
                          : "text-gray-700 hover:bg-white hover:text-amber-600")
                      }
                    >
                      <span className="flex items-center gap-3">
                        <span className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center">
                          <Image
                            src={cat.icon}
                            alt={cat.label}
                            width={40}
                            height={40}
                            className="h-8 w-8 object-contain"
                          />
                        </span>
                        <span>{cat.label}</span>
                      </span>
                      <span className="text-lg text-gray-400">›</span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* ستون چپ: زیردسته‌ها */}
            <div className="p-6">
              <div className="mb-4 flex items-center gap-3 border-b border-[#EDE4CE] pb-3">
                <Image
                  src={activeCategory.icon}
                  alt={activeCategory.label}
                  width={60}
                  height={60}
                  className="h-10 w-10 object-contain"
                />
                <h3 className="text-base font-bold text-gray-900">
                  {activeCategory.label}
                </h3>
              </div>

              <div className="grid grid-cols-3 gap-6">
                {activeCategory.groups.map((group) => (
                  <div key={group.title}>
                    <h4 className="mb-3 text-xs font-bold text-gray-500">
                      {group.title}
                    </h4>
                    <ul className="space-y-2">
                      {group.items.map((item) => (
                        <li key={item.label}>
                          <a
                            href={item.href}
                            onClick={() => setIsOpen(false)}
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}