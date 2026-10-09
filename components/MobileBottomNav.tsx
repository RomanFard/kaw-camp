"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/context/CartContext";

// مدت زمان آتش و دود بعد از اضافه شدن محصول (میلی‌ثانیه)
const BURN_MS = 4500;

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

/* افکت آتش و دود که روی کوله نمایش داده می‌شود */
function FireSmokeEffect() {
  return (
    <span className="pointer-events-none absolute inset-0" aria-hidden="true">
      {/* شعله‌ها */}
      <span className="kaw-flame" style={{ left: "18%", animationDelay: "0ms" }} />
      <span className="kaw-flame" style={{ left: "44%", animationDelay: "120ms", height: 14 }} />
      <span className="kaw-flame" style={{ left: "70%", animationDelay: "240ms" }} />

      {/* دود */}
      <span
        className="kaw-smoke"
        style={{ left: "20%", animationDelay: "150ms", ["--dx" as string]: "-8px" }}
      />
      <span
        className="kaw-smoke"
        style={{ left: "45%", animationDelay: "350ms", ["--dx" as string]: "4px" }}
      />
      <span
        className="kaw-smoke"
        style={{ left: "68%", animationDelay: "550ms", ["--dx" as string]: "10px" }}
      />
    </span>
  );
}

function Icon({
  name,
  active,
  burning = false,
  lit = false,
}: {
  name: string;
  active: boolean;
  burning?: boolean;
  lit?: boolean;
}) {
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
    return (
      <span className="relative inline-block h-6 w-6">
        <span
          className={
            "inline-block " +
            (burning ? "kaw-glow kaw-pop" : lit ? "kaw-ember" : "")
          }
        >
          <BackpackIcon className={cls} />
        </span>
        {burning && <FireSmokeEffect />}
      </span>
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

  // وقتی محصول جدید به کوله اضافه شود، افکت آتش و دود فعال می‌شود
  const [burning, setBurning] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const prevTotal = useRef(totalItems);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    if (totalItems > prevTotal.current) {
      setBurstKey((k) => k + 1); // برای شروع دوباره انیمیشن
      setBurning(true);
      timer = setTimeout(() => setBurning(false), BURN_MS);
    }

    prevTotal.current = totalItems;

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [totalItems]);

  if (pathname === "/checkout") return null;

  return (
    <nav
      dir="rtl"
      className="pb-safe fixed bottom-0 left-0 right-0 z-[150] border-t border-theme bg-theme-card shadow-[0_-4px_16px_rgba(0,0,0,0.25)] backdrop-blur-md md:hidden"
    >
      <style>{`
        .kaw-flame {
          position: absolute;
          bottom: 6px;
          width: 6px;
          height: 10px;
          border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
          background: linear-gradient(to top, #ef4444, #f59e0b 55%, #fde047);
          opacity: 0;
          transform-origin: center bottom;
          animation: kaw-flame 0.9s ease-out infinite;
        }
        .kaw-smoke {
          position: absolute;
          top: -2px;
          width: 9px;
          height: 9px;
          border-radius: 9999px;
          background: rgba(180, 180, 180, 0.65);
          filter: blur(2px);
          opacity: 0;
          animation: kaw-smoke 1.5s ease-out infinite;
        }
        .kaw-glow {
          animation: kaw-glow 1.2s ease-in-out infinite;
        }
        .kaw-pop {
          animation: kaw-glow 1.2s ease-in-out infinite, kaw-pop 0.45s ease-out 1;
        }
        .kaw-ember {
          animation: kaw-ember 2.5s ease-in-out infinite;
        }
        @keyframes kaw-flame {
          0%   { transform: translateY(0) scale(1, 1);      opacity: 0; }
          20%  { opacity: 1; }
          100% { transform: translateY(-16px) scale(0.3, 1.5); opacity: 0; }
        }
        @keyframes kaw-smoke {
          0%   { transform: translate(0, 0) scale(0.4); opacity: 0; }
          25%  { opacity: 0.7; }
          100% { transform: translate(var(--dx, 0), -34px) scale(1.9); opacity: 0; }
        }
        @keyframes kaw-glow {
          0%, 100% { filter: drop-shadow(0 0 4px rgba(255, 120, 0, 0.6)); }
          50%      { filter: drop-shadow(0 0 10px rgba(255, 120, 0, 1)); }
        }
        @keyframes kaw-ember {
          0%, 100% { filter: drop-shadow(0 0 2px rgba(255, 120, 0, 0.45)); }
          50%      { filter: drop-shadow(0 0 5px rgba(255, 120, 0, 0.75)); }
        }
        @keyframes kaw-pop {
          0%   { transform: scale(1); }
          35%  { transform: scale(1.25); }
          100% { transform: scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .kaw-flame, .kaw-smoke, .kaw-pop, .kaw-glow, .kaw-ember { animation: none; }
        }
      `}</style>

      <ul className="mx-auto flex max-w-[600px] items-stretch justify-between px-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          const showBadge = item.icon === "cart" && totalItems > 0;
          const isCart = item.icon === "cart";

          return (
            <li key={item.label} className="flex-1">
              <a
                href={item.href}
                {...(isCart ? { "data-cart-icon-mobile": true } : {})}
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

                <Icon
                  key={isCart ? burstKey : undefined}
                  name={item.icon}
                  active={isActive}
                  burning={isCart && burning}
                  lit={isCart && totalItems > 0}
                />

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