"use client";

import { usePathname } from "next/navigation";
import { useCart } from "@/components/context/CartContext";

const navItems = [
  { label: "خانه", href: "/", icon: "home" },
  { label: "دسته‌بندی", href: "/products", icon: "grid" },
  { label: "سبد خرید", href: "/cart", icon: "cart" },
  { label: "اکسپلور", href: "/explore", icon: "compass" },
  { label: "پشتیبانی", href: "/contact", icon: "chat" },
];

function Icon({ name, active }: { name: string; active: boolean }) {
  const cls = "h-7 w-7";

  if (name === "home") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill={active ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        strokeWidth={1.8}
        stroke="currentColor"
        className={cls}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
        />
      </svg>
    );
  }
  if (name === "grid") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.8}
        stroke="currentColor"
        className={cls}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
        />
      </svg>
    );
  }
  if (name === "cart") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.8}
        stroke="currentColor"
        className={cls}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
        />
      </svg>
    );
  }
  if (name === "compass") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.8}
        stroke="currentColor"
        className={cls}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 21a9 9 0 100-18 9 9 0 000 18z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 8.25l-2.25 5.25-5.25 2.25 2.25-5.25 5.25-2.25z"
        />
      </svg>
    );
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
      className={cls}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
      />
    </svg>
  );
}

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { totalItems } = useCart();

  

  return (
    <nav
      dir="rtl"
      className="fixed bottom-0 left-0 right-0 z-[150] border-t border-[#E8DFC8] bg-white shadow-[0_-4px_16px_rgba(0,0,0,0.1)] md:hidden"
    >
      <ul className="mx-auto flex max-w-[600px] items-stretch justify-between px-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          const showBadge = item.icon === "cart" && totalItems > 0;

          return (
            <li key={item.label} className="flex-1">
              <a
                href={item.href}
                className={
                  "relative flex flex-col items-center gap-1.5 px-1 py-3 transition " +
                  (isActive
                    ? "text-amber-600"
                    : "text-gray-500 hover:text-amber-600")
                }
              >
                {/* Badge فقط برای سبد خرید */}
                {showBadge && (
                  <span className="absolute right-1/2 top-2 z-10 flex h-5 min-w-[20px] translate-x-[15px] items-center justify-center rounded-full bg-amber-500 px-1 text-[11px] font-bold text-white shadow-md">
                    {totalItems}
                  </span>
                )}

                <Icon name={item.icon} active={isActive} />

                <span
                  className={
                    "text-xs leading-tight " +
                    (isActive ? "font-bold" : "font-semibold")
                  }
                >
                  {item.label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>

      <div className="h-1.5"></div>
    </nav>
  );
}