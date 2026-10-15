"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

const MIN_DURATION = 2000;

// مقصد پیش‌فرض اگر لوگوی هدر پیدا نشد
const TARGET_Y = 90;
const TARGET_WIDTH = 110;

type Dock = { x: number; y: number; scale: number };

export default function LoadingScreen() {
  const pathname = usePathname();
  const logoRef = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dock, setDock] = useState<Dock | null>(null);

  useEffect(() => {
    // 🆕 فقط توی صفحه اصلی و صفحه طراح نمایش بده
    if (pathname !== "/" && pathname !== "/designer") {
      setHidden(true);
      return;
    }
    setHidden(false);
    setFadeOut(false);
    setProgress(0);
    setDock(null);

    const startTime = Date.now();
    let finished = false;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      currentProgress += Math.random() * 15;
      if (currentProgress >= 90) {
        currentProgress = 90;
        clearInterval(progressInterval);
      }
      setProgress(currentProgress);
    }, 200);

    function startDock() {
      const el = logoRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();

      // لوگوی نمایان هدر (موبایل یا دسکتاپ)
      const target = Array.from(
        document.querySelectorAll("[data-header-logo]")
      )
        .map((n) => n.getBoundingClientRect())
        .find((r) => r.width > 0 && r.height > 0);

      const targetX = target
        ? target.left + target.width / 2
        : window.innerWidth / 2;
      const targetY = target ? target.top + target.height / 2 : TARGET_Y;
      const targetWidth = target ? target.width : TARGET_WIDTH;

      setDock({
        x: targetX - (rect.left + rect.width / 2),
        y: targetY - (rect.top + rect.height / 2),
        scale: targetWidth / rect.width,
      });
    }

    function finish() {
      if (finished) return;
      finished = true;
      clearInterval(progressInterval);
      setProgress(100);
      timeouts.push(
        setTimeout(() => {
          startDock();
          timeouts.push(
            setTimeout(() => {
              setFadeOut(true);
              timeouts.push(setTimeout(() => setHidden(true), 600));
            }, 1000)
          );
        }, 400)
      );
    }

    function handleLoad() {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, MIN_DURATION - elapsed);
      timeouts.push(setTimeout(finish, remaining));
    }

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      timeouts.push(setTimeout(handleLoad, 3000));
    }

    return () => {
      window.removeEventListener("load", handleLoad);
      clearInterval(progressInterval);
      timeouts.forEach(clearTimeout);
    };
  }, [pathname]);

  if (hidden) return null;

  // تاری: از ۳۰ پیکسل (شروع) تا ۰ (پایان)
  const blurPx = 30 * (1 - progress / 100);
  // سفیدی پس‌زمینه: از ۰.۸ تا ۰.۱
  const whiteAlpha = 0.8 - 0.7 * (progress / 100);

  return (
    <div
      dir="rtl"
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center ${
        dock ? "pointer-events-none" : ""
      }`}
    >
      {/* لایه پس‌زمینه: بعد از رسیدن به ۱۰۰٪ کامل محو می‌شود */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: `rgba(255, 255, 255, ${whiteAlpha})`,
          backdropFilter: `blur(${blurPx}px)`,
          WebkitBackdropFilter: `blur(${blurPx}px)`,
          opacity: dock ? 0 : 1,
          transition:
            "background-color 400ms ease-out, backdrop-filter 400ms ease-out, -webkit-backdrop-filter 400ms ease-out, opacity 800ms ease",
        }}
      />

      {/* لوگوی تصویری: بعد از ۱۰۰٪ کوچک می‌شود و روی لوگوی هدر می‌نشیند */}
      <div
        ref={logoRef}
        className="kaw-enter relative w-[260px] md:w-[420px]"
        style={{
          transform: dock
            ? `translate(${dock.x}px, ${dock.y}px) scale(${dock.scale})`
            : "none",
          opacity: fadeOut ? 0 : 1,
          transition:
            "transform 900ms cubic-bezier(0.65, 0, 0.35, 1), opacity 600ms ease",
        }}
      >
        {/* همان برش و نسبت لوگوی هدر (۱۱۰ در ۴۶) */}
        <div
          className="relative w-full overflow-hidden"
          style={{ aspectRatio: "110 / 46" }}
        >
          {/* لایه کم‌رنگ زیرین */}
          <div className="absolute inset-0">
            <Image
              src="/images/logo.png"
              alt=""
              width={300}
              height={300}
              priority
              className="absolute inset-x-0 bottom-0 h-auto w-full opacity-15 grayscale mix-blend-multiply"
            />
          </div>

          {/* لایه کامل که از چپ به راست پر می‌شود */}
          <div
            className="absolute inset-0"
            style={{
              clipPath: `inset(0 ${100 - progress}% 0 0)`,
              transition: "clip-path 300ms ease-out",
            }}
          >
            <Image
              src="/images/logo.png"
              alt="KAW CAMP"
              width={300}
              height={300}
              priority
              className="absolute inset-x-0 bottom-0 h-auto w-full grayscale contrast-125 mix-blend-multiply"
            />
          </div>
        </div>
      </div>

      {/* خط باریک پیشرفت زیر لوگو */}
      <div
        className="relative mt-6 h-px w-[260px] bg-black/15 md:w-[420px]"
        style={{
          opacity: dock ? 0 : 1,
          transition: "opacity 300ms ease",
        }}
      >
        <div
          className="mx-auto h-full bg-black"
          style={{
            width: `${progress}%`,
            transition: "width 300ms ease-out",
          }}
        />
      </div>

      <style jsx global>{`
        @keyframes kawEnter {
          from {
            opacity: 0;
            filter: blur(10px);
            margin-top: 24px;
          }
          to {
            opacity: 1;
            filter: blur(0);
            margin-top: 0;
          }
        }

        .kaw-enter {
          animation: kawEnter 900ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }
      `}</style>
    </div>
  );
}