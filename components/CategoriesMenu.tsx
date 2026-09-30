"use client";

import { useState } from "react";

const menuItems = [
  { label: "لباس کوهنوردی",       href: "/products?cat=clothing" },
  { label: "کوله پشتی کوهنوردی",  href: "/products?cat=backpack" },
  { label: "کفش کوهنوردی",        href: "/products?cat=shoes" },
  { label: "جوراب کوهنوردی",      href: "/products?cat=socks" },
  { label: "گتر کوهنوردی",        href: "/products?cat=gaiters" },
  { label: "ابزار فنی",           href: "/products?cat=tools" },
  { label: "کیسه خواب",           href: "/products?cat=sleep" },
  { label: "زیرانداز",            href: "/products?cat=mattress" },
  { label: "لامپ و چراغ",         href: "/products?cat=lighting" },
  { label: "چادر",                href: "/products?cat=tent" },
  { label: "لیوان، قمقمه و فلاسک", href: "/products?cat=bottle" },
  { label: "لوازم پخت و پز",      href: "/products?cat=cooking" },
  { label: "عینک اسپرت",          href: "/products?cat=sunglasses" },
  { label: "ساعت ورزشی",          href: "/products?cat=watch" },
  { label: "دوچرخه",              href: "/products?cat=bicycle" },
  { label: "تماس با ما",          href: "/contact" },
];

export default function CategoriesMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* دکمه اصلی */}
      <button
        type="button"
        className="flex items-center gap-3 bg-amber-500 px-8 py-5 text-lg font-bold text-white transition hover:bg-amber-600"
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
        <span>مرور دسته‌ها</span>
      </button>

      {/* منوی کشویی */}
      <div
        className={
          "absolute right-0 top-full z-50 w-72 origin-top border border-t-0 border-[#E8DFC8] bg-white shadow-xl transition-all duration-300 ease-out " +
          (isOpen
            ? "visible scale-y-100 opacity-100"
            : "invisible scale-y-95 opacity-0")
        }
      >
        {/* آیتم هدر */}
        <div className="border-b border-[#EDE4CE] px-5 py-3 text-base font-bold text-gray-900">
          لوازم کمپینگ و کوهنوردی
        </div>

        <ul className="py-2">
          {menuItems.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="block px-5 py-2.5 text-base font-semibold text-gray-700 transition hover:bg-amber-50 hover:text-amber-600"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}