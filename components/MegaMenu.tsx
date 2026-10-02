"use client";

import Image from "next/image";
import { megaMenu } from "@/lib/megaMenu";

export default function MegaMenu({
  isOpen,
  onClose,
  activeKey,
  onActiveKeyChange,
}: {
  isOpen: boolean;
  onClose: () => void;
  activeKey: string;
  onActiveKeyChange: (key: string) => void;
}) {
  const activeCategory =
    megaMenu.find((c) => c.key === activeKey) || megaMenu[0];

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={
          "fixed inset-0 z-[200] bg-black/50 transition-opacity duration-300 " +
          (isOpen ? "visible opacity-100" : "invisible opacity-0")
        }
      />

      {/* دراور از راست */}
      <aside
        className={
          "fixed right-0 top-0 z-[210] h-screen w-[1100px] max-w-[95vw] overflow-hidden bg-white shadow-2xl transition-transform duration-300 ease-out " +
          (isOpen ? "translate-x-0" : "translate-x-full")
        }
        dir="rtl"
      >
        {/* هدر */}
        <div className="flex items-center justify-between border-b border-[#E8DFC8] bg-[#F7F1E3] px-6 py-4">
          <span className="text-lg font-black text-amber-600">
            دسته‌بندی محصولات
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن"
            className="flex h-9 w-9 items-center justify-center rounded-full text-2xl font-light text-gray-600 transition hover:bg-white"
          >
            ✕
          </button>
        </div>

        {/* محتوا: دو ستونه */}
        <div className="flex h-[calc(100vh-73px)]">
          {/* ستون راست: دسته‌های اصلی */}
          <div className="w-[260px] flex-shrink-0 overflow-y-auto border-l border-[#EDE4CE] bg-[#F7F1E3]/30 py-2">
            {megaMenu.map((cat) => {
              const isActive = cat.key === activeKey;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onMouseEnter={() => onActiveKeyChange(cat.key)}
                  onClick={() => onActiveKeyChange(cat.key)}
                  className={
                    "flex w-full items-center justify-between px-5 py-3.5 text-right text-sm font-bold transition " +
                    (isActive
                      ? "bg-white text-amber-600"
                      : "text-gray-700 hover:bg-white hover:text-amber-600")
                  }
                >
                  <span className="flex items-center gap-3">
                    <span className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center">
                      <Image
                        src={cat.icon}
                        alt={cat.label}
                        width={40}
                        height={40}
                        className="h-9 w-9 object-contain"
                      />
                    </span>
                    <span>{cat.label}</span>
                  </span>
                  <span className="text-lg text-gray-400">‹</span>
                </button>
              );
            })}
          </div>

          {/* ستون چپ: محتوای دسته فعال */}
          <div className="flex-1 overflow-y-auto bg-white p-8">
            <div className="flex gap-8">
              {/* تصویر بزرگ (راست) */}
              <div className="flex w-[260px] flex-shrink-0 flex-col items-center">
                <div className="relative h-[260px] w-full overflow-hidden rounded-2xl border border-[#E8DFC8] bg-[#F7F1E3]">
                  <Image
                    src={activeCategory.photo || activeCategory.icon}
                    alt={activeCategory.label}
                    fill
                    sizes="260px"
                    className="object-contain p-4"
                  />
                </div>

                {/* لینک مشاهده همه */}
                <a
                  href={`/products?cat=${activeCategory.key}`}
                  onClick={onClose}
                  className="mt-4 w-full rounded-lg bg-amber-500 py-3 text-center text-sm font-bold text-white transition hover:bg-amber-600"
                >
                  مشاهده همه محصولات
                </a>
              </div>

              {/* لیست زیردسته‌ها (چپ) */}
              <div className="flex-1">
                <h3 className="mb-5 border-b border-[#EDE4CE] pb-3 text-xl font-black text-gray-900">
                  {activeCategory.label}
                </h3>

                <div className="grid grid-cols-3 gap-x-6 gap-y-5">
                  {activeCategory.groups.map((group) => (
                    <div key={group.title}>
                      <h4 className="mb-3 text-sm font-bold text-amber-600">
                        {group.title}
                      </h4>
                      <ul className="space-y-2.5">
                        {group.items.map((item) => (
                          <li key={item.label}>
                            <a
                              href={item.href}
                              onClick={onClose}
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
                  <div className="mt-6 border-t border-[#EDE4CE] pt-5">
                    <h4 className="mb-3 text-sm font-bold text-gray-700">
                      براساس ظرفیت:
                    </h4>
                    <div className="flex flex-wrap gap-2">
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
                          className="rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-xs font-semibold text-amber-700 transition hover:border-amber-400 hover:bg-amber-100"
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
        </div>
      </aside>
    </>
  );
}