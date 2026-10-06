"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function LoadingScreen() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (pathname !== "/") {
      setHidden(true);
      return;
    }
    setHidden(false);
    setFadeOut(false);
    setProgress(0);

    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      currentProgress += Math.random() * 15;
      if (currentProgress >= 90) {
        currentProgress = 90;
        clearInterval(progressInterval);
      }
      setProgress(currentProgress);
    }, 200);

    function handleLoad() {
      clearInterval(progressInterval);
      setProgress(100);
      setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => setHidden(true), 600);
      }, 300);
    }

    if (document.readyState === "complete") {
      handleLoad();
      return;
    }

    window.addEventListener("load", handleLoad);
    const fallback = setTimeout(handleLoad, 3000);

    return () => {
      window.removeEventListener("load", handleLoad);
      clearInterval(progressInterval);
      clearTimeout(fallback);
    };
  }, [pathname]);

  if (hidden) return null;

  const progressText = `${Math.round(progress).toLocaleString("fa-IR")}٪`;

  return (
    <div
      dir="rtl"
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-theme transition-all duration-600 ${
        fadeOut ? "opacity-0 scale-105" : "opacity-100 scale-100"
      }`}
      style={{
        transitionProperty: "opacity, transform",
        transitionDuration: "600ms",
      }}
    >
      {/* گرادیان accent گوشه */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -right-40 top-20 h-80 w-80 rounded-full blur-[120px]"
          style={{ backgroundColor: "var(--accent)", opacity: 0.1 }}
        />
        <div
          className="absolute -left-40 bottom-20 h-80 w-80 rounded-full blur-[120px]"
          style={{ backgroundColor: "var(--accent)", opacity: 0.05 }}
        />
      </div>

      {/* دایره + لوگو */}
      <div className="relative h-44 w-44 md:h-56 md:w-56">
        {/* هاله درخشان */}
        <div
          className="absolute inset-0 animate-pulse-slow rounded-full"
          style={{
            boxShadow: `0 0 80px 20px color-mix(in srgb, var(--accent) 20%, transparent), 0 0 140px 40px color-mix(in srgb, var(--accent) 8%, transparent)`,
          }}
        />

        {/* دایره زمینه */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full -rotate-90"
        >
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="var(--card-border)"
            strokeWidth="1.5"
          />
        </svg>

        {/* دایره progress */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full -rotate-90"
        >
          <defs>
            <linearGradient
              id="progressGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="1" />
            </linearGradient>
          </defs>
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="url(#progressGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{
              strokeDasharray: 289,
              strokeDashoffset: 289 - (progress / 100) * 289,
              transition: "stroke-dashoffset 300ms ease-out",
              filter: "drop-shadow(0 0 8px color-mix(in srgb, var(--accent) 60%, transparent))",
            }}
          />
        </svg>

        {/* نقطه درخشان */}
        <div
          className="absolute left-1/2 top-1/2 h-3 w-3 rounded-full"
          style={{
            backgroundColor: "var(--accent)",
            boxShadow: "0 0 16px 6px color-mix(in srgb, var(--accent) 80%, transparent)",
            transform: `rotate(${(progress / 100) * 360 - 90}deg) translateX(${progress * 0.46}px)`,
            transformOrigin: "0 0",
            transition: "transform 300ms ease-out",
          }}
        />

        {/* لوگو */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-pulse-slow">
            <Image
              src="/images/logo.png"
              alt="KAW CAMP"
              width={140}
              height={140}
              priority
              className="h-20 w-auto dark:brightness-0 dark:invert md:h-24"
            />
          </div>
        </div>
      </div>

      {/* درصد */}
      <div className="relative mt-8 flex flex-col items-center">
        <p className="text-3xl font-black text-accent md:text-4xl">
          {progressText}
        </p>
        <p
          className="mt-2 text-[10px] font-black uppercase tracking-[0.5em] text-theme-muted md:text-xs"
          dir="ltr"
        >
          LOADING
        </p>
      </div>

      {/* نوار پیشرفت */}
      <div className="mt-8 w-56 overflow-hidden rounded-full bg-theme-surface md:w-72">
        <div
          className="h-[3px] rounded-full bg-accent"
          style={{
            width: `${progress}%`,
            transition: "width 300ms ease-out",
            boxShadow: "0 0 10px color-mix(in srgb, var(--accent) 60%, transparent)",
          }}
        />
      </div>

      {/* برند پایین */}
      <p className="absolute bottom-8 text-[10px] font-black uppercase tracking-[0.3em] text-theme-muted">
        KAW CAMP © ۱۴۰۴
      </p>

      <style jsx global>{`
        @keyframes pulseSlow {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.04);
          }
        }

        .animate-pulse-slow {
          animation: pulseSlow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}