"use client";

import { usePathname } from "next/navigation";
import { useCart } from "@/components/context/CartContext";

const navItems = [
  { label: "خانه", href: "/", icon: "home" },
  { label: "کوله من", href: "/cart", icon: "cart" },
  { label: "آفرود و تور", href: "/explore", icon: "compass" },
  { label: "تماس با ما", href: "/contact", icon: "chat" },
];

function BackpackIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M11 1h2a0.5 0.5 0 0 1 0 1h-2a0.5 0.5 0 0 1 0-1z" opacity="0.55" />
      <path d="M8.5 3C8.5 2.2 9.2 1.5 10 1.5h4c0.8 0 1.5 0.7 1.5 1.5V4h-7V3z" />
      <path d="M7 6.5C7 5.7 7.7 5 8.5 5h7c0.8 0 1.5 0.7 1.5 1.5V22c0 0.8-0.7 1.5-1.5 1.5h-7c-0.8 0-1.5-0.7-1.5-1.5V6.5z" />
      <ellipse cx="6.3" cy="14" rx="0.9" ry="3.5" />
      <ellipse cx="17.7" cy="14" rx="0.9" ry="3.5" />
      <rect x="11.05" y="6.5" width="0.55" height="15.5" rx="0.27" fill="#fff" opacity="0.9" />
      <rect x="12.4" y="6.5" width="0.55" height="15.5" rx="0.27" fill="#fff" opacity="0.9" />
      <rect x="11.5" y="1.7" width="1" height="3.3" rx="0.25" fill="#fff" opacity="0.55" />
    </svg>
  );
}

function Icon({ name, active }: { name: string; active: boolean }) {
  const cls = "h-6 w-6";

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

  if (name === "cart") {
    return <BackpackIcon className={cls} />;
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

  // chat
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

  if (pathname === "/checkout") return null;

  return (
    <nav
      dir="rtl"
      className="pb-safe fixed bottom-0 left-0 right-0 z-[150] border-t border-theme bg-theme-card shadow-[0_-4px_16px_rgba(0,0,0,0.25)] backdrop-blur-md md:hidden"
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
                {...(item.icon === "cart"
                  ? { "data-cart-icon-mobile": true }
                  : {})}
                className={
                  "relative flex flex-col items-center gap-1 px-1 py-2 transition " +
                  (isActive
                    ? "text-accent"
                    : "text-theme-muted hover:text-accent")
                }
              >
                {showBadge && (
                  <span className="absolute right-1/2 top-1 z-10 flex h-4 min-w-[16px] translate-x-[13px] items-center justify-center rounded-full bg-accent px-1 text-[9px] font-bold text-white shadow-md">
                    {totalItems}
                  </span>
                )}

                <Icon name={item.icon} active={isActive} />

                <span
                  className={
                    "whitespace-nowrap text-[9px] leading-tight " +
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
    </nav>
  );
}