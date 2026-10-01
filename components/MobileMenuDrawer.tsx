"use client";

const menuItems = [
  { label: "کفش کوهنوردی", href: "/products?cat=shoes" },
  { label: "جوراب کوهنوردی", href: "/products?cat=socks" },
  { label: "گتر کوهنوردی", href: "/products?cat=gaiters" },
  { label: "ابزار فنی", href: "/products?cat=tools" },
  { label: "کیسه خواب", href: "/products?cat=sleep" },
  { label: "زیرانداز", href: "/products?cat=mattress" },
  { label: "لامپ و چراغ", href: "/products?cat=lighting" },
  { label: "چادر", href: "/products?cat=tent" },
  { label: "لیوان، قمقمه و فلاسک", href: "/products?cat=bottle" },
  { label: "لوازم پخت و پز", href: "/products?cat=cooking" },
  { label: "عینک اسپرت", href: "/products?cat=sunglasses" },
  { label: "ساعت ورزشی", href: "/products?cat=watch" },
  { label: "دوچرخه", href: "/products?cat=bicycle" },
  { label: "تماس با ما", href: "/contact" },
];

const userItems = [
  { label: "علاقه‌مندی", href: "/wishlist", icon: "heart" },
  { label: "مقایسه", href: "/compare", icon: "compare" },
  { label: "ورود / ثبت‌نام", href: "/login", icon: "user" },
];

function Icon({ name }: { name: string }) {
  if (name === "heart") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="h-5 w-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    );
  }
  if (name === "compare") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="h-5 w-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
        />
      </svg>
    );
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
      />
    </svg>
  );
}

export default function MobileMenuDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
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

      {/* Drawer */}
      <aside
        className={
          "fixed left-0 top-0 z-[210] h-screen w-[280px] max-w-[85vw] overflow-y-auto bg-white shadow-2xl transition-transform duration-300 md:hidden " +
          (isOpen ? "translate-x-0" : "-translate-x-full")
        }
        dir="rtl"
      >
        {/* هدر دراور */}
        <div className="flex items-center justify-between border-b border-[#EDE4CE] px-4 py-4">
          <span className="text-base font-black text-amber-600">کو کمپ</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن"
            className="flex h-8 w-8 items-center justify-center rounded-full text-xl font-light text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
          >
            ✕
          </button>
        </div>

        {/* آیتم‌های دسته‌بندی */}
        <ul>
          {menuItems.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                onClick={onClose}
                className="flex items-center justify-between border-b border-[#EDE4CE] px-4 py-3.5 text-sm font-semibold text-gray-800 transition hover:bg-[#F7F1E3]/50"
              >
                <span>{item.label}</span>
                <span className="text-gray-300">‹</span>
              </a>
            </li>
          ))}
        </ul>

        {/* خط جداکننده */}
        <div className="my-2 border-t-4 border-[#F7F1E3]"></div>

        {/* آیتم‌های کاربر */}
        <ul>
          {userItems.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                onClick={onClose}
                className="flex items-center justify-between border-b border-[#EDE4CE] px-4 py-3.5 text-sm font-semibold text-gray-800 transition hover:bg-[#F7F1E3]/50"
              >
                <span className="flex items-center gap-3">
                  <span className="text-gray-500">
                    <Icon name={item.icon} />
                  </span>
                  <span>{item.label}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>

        {/* فوتر دراور */}
        <div className="mt-4 border-t border-[#EDE4CE] px-4 py-4">
          <a
            href="/products"
            onClick={onClose}
            className="flex items-center justify-center gap-2 rounded-lg bg-amber-500 py-3 text-sm font-bold text-white transition hover:bg-amber-600"
          >
            <span>🏪</span>
            <span>فروشگاه</span>
          </a>
        </div>
      </aside>
    </>
  );
}