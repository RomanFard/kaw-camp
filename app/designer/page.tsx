"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/* رنگ‌ها: ثابت و مستقل از تم سایت */
const ACCENT = "#5b47d9"; // دکمه‌های اصلی
const SOFT = "#b9afff"; // متن رنگی روی زمینه‌ی تیره

/* ---------- آیکون‌ها ---------- */
const Icon = ({ children }: { children: ReactNode }) => (
  <svg
    viewBox="0 0 24 24"
    className="h-6 w-6"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const icons = {
  store: (
    <Icon>
      <path d="M3 9l1.5-5h15L21 9" />
      <path d="M4 9v11h16V9" />
      <path d="M9 20v-6h6v6" />
    </Icon>
  ),
  responsive: (
    <Icon>
      <rect x="3" y="4" width="13" height="10" rx="1.5" />
      <rect x="14" y="9" width="7" height="11" rx="1.5" />
    </Icon>
  ),
  speed: (
    <Icon>
      <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
    </Icon>
  ),
  mail: (
    <Icon>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </Icon>
  ),
  code: (
    <Icon>
      <path d="M8 8l-4 4 4 4" />
      <path d="M16 8l4 4-4 4" />
      <path d="M13.5 5l-3 14" />
    </Icon>
  ),
  link: (
    <Icon>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 11v5" />
      <path d="M8 8v.01" />
      <path d="M12 16v-5" />
      <path d="M12 13c0-1.5 1-2 2-2s2 .7 2 2v3" />
    </Icon>
  ),
  check: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12l5 5 9-10" />
    </svg>
  ),
  arrow: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 12H5" />
      <path d="M11 6l-6 6 6 6" />
    </svg>
  ),
};

/* ---------- داده‌ها ---------- */
const navItems = [
  { id: "features", label: "خدمات" },
  { id: "steps", label: "روند کار" },
  { id: "audience", label: "مناسب چه کسانی" },
  { id: "skills", label: "مهارت‌ها" },
  { id: "faq", label: "سؤالات متداول" },
];

const prompts = [
  "برای نمونه‌کارهای طراحی‌ام یک سایت بساز",
  "یک فروشگاه آنلاین با پنل مدیریت می‌خواهم",
  "سایت فعلی‌ام را مدرن بازطراحی کن",
];

const chips = ["بازطراحی با ظاهری تازه", "ساخت فروشگاه آنلاین", "ساخت وب‌اپلیکیشن"];

const showcaseTabs = [
  { id: "apps", label: "وب‌اپ‌ها", caption: "از سامانه‌ی رزرو تا ابزارهای کاربردی؛ وب‌اپ‌هایی که کاربرها از استفاده‌شان لذت می‌برند." },
  { id: "sites", label: "سایت‌ها", caption: "سایت معرفی کسب‌وکار با ظاهری تمیز، سریع و قابل اعتماد." },
  { id: "stores", label: "فروشگاه‌ها", caption: "فروشگاه آنلاین با پنل مدیریت، سبد خرید و اتصال به درگاه پرداخت." },
  { id: "dash", label: "داشبوردها", caption: "گزارش‌ها و داده‌های کسب‌وکارت در یک نگاه، با نمودارهای روشن." },
  { id: "portfolio", label: "نمونه‌کارها", caption: "صفحه‌ی شخصی که فقط روی کار خودت تمرکز دارد." },
];

const features = [
  {
    icon: icons.store,
    title: "فروشگاه آماده‌ی فروش، از همان روز اول",
    desc: "سایت فروشگاهی با پنل مدیریت کامل، مدیریت محصولات و سفارش‌ها و اتصال به درگاه پرداخت؛ بدون اینکه خودت درگیر جزئیات فنی شوی.",
    points: ["پنل مدیریت ساده", "اتصال به درگاه پرداخت", "مدیریت محصول و سفارش"],
  },
  {
    icon: icons.responsive,
    title: "روی هر صفحه‌ای عالی دیده می‌شود",
    desc: "طراحی واکنش‌گرا که روی موبایل، تبلت و دسکتاپ بی‌نقص کار می‌کند و تجربه‌ی یکدستی به مشتری‌هایت می‌دهد.",
    points: ["موبایل‌محور", "رابط کاربری تمیز", "تجربه‌ی کاربری روان"],
  },
  {
    icon: icons.speed,
    title: "سریع و قابل پیدا شدن در گوگل",
    desc: "بهینه‌سازی سرعت و سئوی فنی تا سایتت زود لود شود و راحت‌تر توسط موتورهای جستجو ایندکس شود.",
    points: ["امتیاز سبز PageSpeed", "ساختار سئو‌پسند", "ایندکس سریع‌تر"],
  },
];

const steps = [
  { title: "گفتگو درباره‌ی پروژه", desc: "هدف، مخاطب و نیازهای سایتت را با هم مشخص می‌کنیم." },
  { title: "طراحی رابط کاربری", desc: "نمونه‌ی بصری را آماده می‌کنم تا قبل از کدنویسی ببینی و نظر بدهی." },
  { title: "توسعه و پیاده‌سازی", desc: "طرح تأییدشده را با کدی تمیز، سریع و قابل نگهداری می‌سازم." },
  { title: "تست و انتشار", desc: "سایت روی دستگاه‌های مختلف بررسی می‌شود و بعد منتشر می‌شود." },
  { title: "پشتیبانی بعد از تحویل", desc: "اگر مشکلی پیش آمد یا چیزی خواستی اضافه کنی، در کنارت هستم." },
];

const audiences = [
  {
    id: "shops",
    label: "فروشگاه‌ها",
    title: "برای کسی که می‌خواهد آنلاین بفروشد",
    points: ["فروشگاه با پنل مدیریت و درگاه پرداخت", "صفحه‌ی محصول سریع و جذاب", "ساختار آماده برای سئو"],
  },
  {
    id: "business",
    label: "کسب‌وکارها",
    title: "برای شرکت‌ها و خدمات حرفه‌ای",
    points: ["سایت معرفی با ظاهر مینیمال و مطمئن", "فرم تماس و صفحات خدمات", "قابل توسعه با رشد کسب‌وکار"],
  },
  {
    id: "personal",
    label: "افراد",
    title: "برای نمونه‌کار و صفحه‌ی شخصی",
    points: ["پورتفولیوی تمیز و متمرکز روی کار شما", "طراحی اختصاصی، نه قالب آماده", "راه‌اندازی سریع و ساده"],
  },
];

const skillGroups = [
  { title: "فرانت‌اند", items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Responsive Design"] },
  { title: "بک‌اند و داده", items: ["Supabase", "Node.js", "Performance Optimization"] },
  { title: "طراحی", items: ["UI/UX Design", "Figma"] },
];

const faqs = [
  { q: "برای شروع همکاری چه چیزی لازم است؟", a: "فقط یک توضیح ساده از ایده یا کسب‌وکارت. بقیه‌ی مراحل، از طراحی تا انتشار، را با هم جلو می‌بریم." },
  { q: "سایت روی موبایل هم درست نمایش داده می‌شود؟", a: "بله. همه‌ی طراحی‌ها واکنش‌گرا هستند و روی موبایل، تبلت و دسکتاپ بررسی می‌شوند." },
  { q: "می‌توانم بعداً به سایت امکانات اضافه کنم؟", a: "بله. کد تمیز و ساختارمند نوشته می‌شود تا اضافه کردن صفحه یا قابلیت جدید راحت باشد." },
  { q: "سایت فروشگاهی درگاه پرداخت دارد؟", a: "بله. فروشگاه‌ها با پنل مدیریت و اتصال به درگاه پرداخت تحویل داده می‌شوند." },
  { q: "سرعت و سئو هم در کار لحاظ می‌شود؟", a: "بله. سرعت لود و ساختار سئوی فنی از ابتدا در طراحی و توسعه در نظر گرفته می‌شود." },
];

/* ---------- دکمه‌ی گرد ---------- */
const PillButton = ({
  href,
  children,
  variant = "primary",
  external = false,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  external?: boolean;
}) => (
  <a
    href={href}
    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    className={
      variant === "primary"
        ? "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-black text-white transition hover:brightness-110 hover:shadow-[0_0_0_4px_rgba(91,71,217,0.3)]"
        : "inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-sm font-bold text-white transition hover:border-white hover:bg-white/10"
    }
    style={variant === "primary" ? { backgroundColor: ACCENT } : undefined}
  >
    {children}
  </a>
);

/* ---------- پیش‌نمایش‌های شبیه‌سازی‌شده (فقط شکل و رنگ) ---------- */
const Bar = ({ w, c = "bg-black/15", h = "h-2" }: { w: string; c?: string; h?: string }) => (
  <div className={`${h} rounded-full ${c}`} style={{ width: w }} />
);

const Photo = ({ from, to, className = "" }: { from: string; to: string; className?: string }) => (
  <div className={`rounded-lg ${className}`} style={{ background: `linear-gradient(135deg, ${from}, ${to})` }} />
);

const MockShell = ({ children }: { children: ReactNode }) => (
  <div dir="ltr" className="h-full w-full overflow-hidden bg-[#f3efe9] p-3 sm:p-4">
    {children}
  </div>
);

const MockDashboard = () => (
  <MockShell>
    <div className="flex h-full gap-3">
      <div className="flex w-8 flex-col items-center gap-3 rounded-xl bg-[#111] py-3">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="h-3 w-3 rounded-sm bg-white/50" />
        ))}
      </div>
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1.5">
            <Bar w="90px" c="bg-black/70" h="h-3" />
            <Bar w="140px" />
          </div>
          <Bar w="90px" c="bg-white" h="h-5" />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="space-y-2 rounded-lg bg-white p-2.5">
              <Bar w="50%" />
              <Bar w="35%" c="bg-black/70" h="h-3" />
            </div>
          ))}
        </div>
        <div className="grid min-h-0 flex-1 grid-cols-[1.7fr_1fr] gap-2">
          <div className="rounded-lg bg-white p-3">
            <Bar w="30%" c="bg-black/70" h="h-3" />
            <svg viewBox="0 0 200 70" className="mt-2 h-[70%] w-full" fill="none" preserveAspectRatio="none">
              <path d="M0 60 C 20 70, 30 30, 55 38 S 90 62, 110 40 S 150 20, 170 26 S 190 10, 200 8" stroke="#3fb68b" strokeWidth="2.5" />
            </svg>
          </div>
          <div className="flex items-center justify-center rounded-lg bg-[#111] p-3">
            <svg viewBox="0 0 100 100" className="h-full max-h-28">
              <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="9" />
              <circle cx="50" cy="50" r="38" fill="none" stroke="#3fb68b" strokeWidth="9" strokeLinecap="round" strokeDasharray="223 239" transform="rotate(-90 50 50)" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </MockShell>
);

const MockStore = () => (
  <MockShell>
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <Bar w="70px" c="bg-black/70" h="h-3" />
        <div className="flex gap-2">
          <Bar w="30px" />
          <Bar w="30px" />
          <Bar w="30px" />
        </div>
        <Bar w="24px" c="bg-black/70" h="h-4" />
      </div>
      <Photo from="#f4b183" to="#e8806a" className="h-[34%]" />
      <div className="grid flex-1 grid-cols-4 gap-2">
        {[
          ["#cfe3d4", "#8fbf9f"],
          ["#f2d9a6", "#e1b35f"],
          ["#d3d9f0", "#8f9be0"],
          ["#f3c9d3", "#e58aa0"],
        ].map(([a, b], i) => (
          <div key={i} className="flex flex-col gap-1.5 rounded-lg bg-white p-2">
            <Photo from={a} to={b} className="flex-1" />
            <Bar w="80%" />
            <Bar w="40%" c="bg-black/70" />
          </div>
        ))}
      </div>
    </div>
  </MockShell>
);

const MockSite = () => (
  <MockShell>
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#111] text-[9px] font-black text-white">RF</span>
        <div className="flex gap-2">
          <Bar w="28px" />
          <Bar w="28px" />
          <Bar w="28px" />
        </div>
      </div>
      <div className="grid flex-1 grid-cols-2 items-center gap-4">
        <div className="space-y-3">
          <Bar w="95%" c="bg-black/80" h="h-4" />
          <Bar w="70%" c="bg-black/80" h="h-4" />
          <Bar w="85%" />
          <Bar w="60%" />
          <div className="h-6 w-20 rounded-full" style={{ backgroundColor: ACCENT }} />
        </div>
        <Photo from="#cdd5f7" to="#8c7be8" className="h-full" />
      </div>
    </div>
  </MockShell>
);

const MockApp = () => (
  <MockShell>
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2">
        <Bar w="80px" c="bg-black/70" h="h-3" />
        <Bar w="60px" c="bg-[#5b47d9]" h="h-4" />
      </div>
      <div className="grid flex-1 grid-cols-3 gap-2">
        {[3, 2, 3].map((n, col) => (
          <div key={col} className="space-y-2 rounded-lg bg-black/5 p-2">
            <Bar w="50%" c="bg-black/50" />
            {Array.from({ length: n }).map((_, i) => (
              <div key={i} className="space-y-1.5 rounded-md bg-white p-2">
                <Bar w="85%" />
                <Bar w="50%" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  </MockShell>
);

const MockPortfolio = () => (
  <MockShell>
    <div className="flex h-full flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="font-serif text-lg font-black italic">RF</span>
        <Bar w="60px" />
      </div>
      <div className="grid flex-1 grid-cols-[1.2fr_1fr] gap-2">
        <Photo from="#d9c7b0" to="#a98f74" className="h-full" />
        <div className="grid grid-rows-2 gap-2">
          <Photo from="#f6c9a0" to="#e58d5b" />
          <Photo from="#bcd0e8" to="#6f93c4" />
        </div>
      </div>
      <p className="font-serif text-3xl font-black italic leading-none sm:text-5xl">Portfolio</p>
    </div>
  </MockShell>
);

const mocks: Record<string, ReactNode> = {
  apps: <MockApp />,
  sites: <MockSite />,
  stores: <MockStore />,
  dash: <MockDashboard />,
  portfolio: <MockPortfolio />,
};

export default function DesignerPage() {
  const [tab, setTab] = useState("dash");
  const [audience, setAudience] = useState(audiences[0].id);
  const [typed, setTyped] = useState("");

  const activeTab = showcaseTabs.find((t) => t.id === tab) ?? showcaseTabs[0];
  const activeAudience = audiences.find((a) => a.id === audience) ?? audiences[0];

  /* افکت تایپ در کادر پرامپت */
  useEffect(() => {
    let p = 0;
    let c = 0;
    let deleting = false;
    let t: ReturnType<typeof setTimeout>;

    const tick = () => {
      const full = prompts[p];
      if (!deleting) {
        c++;
        setTyped(full.slice(0, c));
        if (c === full.length) {
          deleting = true;
          t = setTimeout(tick, 1600);
          return;
        }
        t = setTimeout(tick, 70);
      } else {
        c--;
        setTyped(full.slice(0, c));
        if (c === 0) {
          deleting = false;
          p = (p + 1) % prompts.length;
          t = setTimeout(tick, 400);
          return;
        }
        t = setTimeout(tick, 30);
      }
    };

    t = setTimeout(tick, 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="min-h-screen bg-white text-[#111]">
      <Header />

      {/* ---------- نوار بالای صفحه ---------- */}
      <div className="sticky top-0 z-40 border-b border-black/5 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-[1500px] items-center gap-2 px-4 py-2.5 md:px-8">
          <Link href="/" className="whitespace-nowrap px-2 text-base font-black">
            Roman Fard
          </Link>
          <span className="mx-1 hidden h-6 w-px bg-black/15 sm:block" />
          <nav aria-label="بخش‌های صفحه" className="flex min-w-0 flex-1 gap-1 overflow-x-auto">
            {navItems.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-[#333] transition hover:bg-black/5"
              >
                {n.label}
              </a>
            ))}
          </nav>
          <a
            href="#contact"
            className="whitespace-nowrap rounded-lg px-5 py-2.5 text-sm font-black text-white transition hover:brightness-110"
            style={{ backgroundColor: ACCENT }}
          >
            شروع پروژه
          </a>
        </div>
      </div>

      {/* ---------- بخش اصلی (هیرو) ---------- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#5f5c96] via-[#9e9cc8] to-[#ececf6] pb-16 pt-14 text-white md:pt-20">
        <div className="mx-auto max-w-[900px] px-6 text-center">
          <p className="text-sm font-bold text-white/80">
            <Link href="/" className="transition hover:text-white">
              خانه
            </Link>
            <span className="mx-2">/</span>
            طراح سایت
          </p>
          <h1 className="mt-5 text-4xl font-black leading-[1.4] md:text-6xl md:leading-[1.35]">
            ایده‌ات را بگو، سایتش را من می‌سازم
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-9 text-white/85 md:text-lg">
            طراح سایت کاو کمپ؛ متخصص طراحی رابط کاربری، تجربه کاربری و توسعه‌ی
            وب‌اپلیکیشن‌های مدرن.
          </p>

          {/* کادر پرامپت */}
          <div className="mx-auto mt-9 flex max-w-[820px] items-center gap-3 rounded-full border-2 border-[#9fd6ff] bg-white py-2 pe-2 ps-7 shadow-[0_0_0_4px_rgba(255,255,255,0.35),0_0_46px_rgba(110,190,255,0.65)]">
            <p className="flex-1 truncate text-start text-base text-[#111] md:text-lg" aria-live="off">
              {typed}
              <span className="ms-0.5 inline-block h-5 w-0.5 translate-y-1 animate-pulse bg-[#111]" />
            </p>
            <a
              href="#contact"
              className="whitespace-nowrap rounded-full px-6 py-3 text-sm font-black text-white transition hover:brightness-110"
              style={{ backgroundColor: ACCENT }}
            >
              شروع پروژه
            </a>
          </div>

          {/* پیشنهادهای سریع */}
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {chips.map((c) => (
              <a
                key={c}
                href="#contact"
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-[#4b4a85]/60 px-4 py-2 text-[13px] font-bold text-white backdrop-blur transition hover:bg-[#4b4a85]"
              >
                {c}
                {icons.arrow}
              </a>
            ))}
          </div>
        </div>

        {/* صحنه‌ی نمایش */}
        <div className="relative mx-auto mt-14 h-[260px] max-w-[1500px] sm:h-[380px] md:h-[470px]">
          {/* کارت چپ */}
          <div className="absolute -left-[14%] top-[10%] hidden w-[40%] -rotate-6 overflow-hidden rounded-[28px] border-4 border-white/50 bg-white shadow-2xl sm:block">
            <div className="aspect-[16/10]">
              <MockPortfolio />
            </div>
          </div>
          {/* کارت راست */}
          <div className="absolute -right-[14%] top-[8%] hidden w-[40%] rotate-6 overflow-hidden rounded-[28px] border-4 border-white/50 bg-white shadow-2xl sm:block">
            <div className="aspect-[16/10]">
              <MockSite />
            </div>
          </div>
          {/* کارت مرکزی */}
          <div className="absolute left-1/2 top-0 w-[90%] -translate-x-1/2 overflow-hidden rounded-[28px] border-4 border-white/60 bg-white shadow-[0_30px_80px_rgba(40,30,100,0.35)] sm:w-[58%]">
            <div key={tab} className="aspect-[16/10]">
              {mocks[tab]}
            </div>
          </div>
        </div>

        {/* تب‌ها */}
        <div className="mx-auto mt-6 max-w-full px-4">
          <div
            role="tablist"
            className="mx-auto flex w-fit max-w-full gap-1 overflow-x-auto rounded-full bg-white/70 p-1.5 shadow-sm backdrop-blur"
          >
            {showcaseTabs.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={`whitespace-nowrap rounded-full px-6 py-3 text-sm font-black transition md:px-8 ${
                  tab === t.id ? "bg-[#111] text-white" : "text-[#222] hover:bg-black/5"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-center text-base leading-8 text-[#333]">
            {activeTab.caption}
          </p>
          <div className="mt-6 text-center">
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-black text-white transition hover:brightness-110"
              style={{ backgroundColor: ACCENT }}
            >
              شروع پروژه
            </a>
          </div>
        </div>
      </section>

      {/* ---------- خدمات ---------- */}
      <section id="features" className="scroll-mt-16 px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1180px]">
          <h2 className="mx-auto max-w-2xl text-center text-3xl font-black leading-[1.5] md:text-5xl md:leading-[1.4]">
            از ایده تا سایت کامل، بدون دردسر
          </h2>

          <div className="mt-16 space-y-20 md:space-y-28">
            {features.map((f, i) => (
              <div
                key={f.title}
                className={`grid items-center gap-10 md:grid-cols-2 md:gap-16 ${
                  i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div>
                  <div
                    className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl text-white"
                    style={{ backgroundColor: ACCENT }}
                  >
                    {f.icon}
                  </div>
                  <h3 className="text-2xl font-black leading-[1.6] md:text-3xl">{f.title}</h3>
                  <p className="mt-4 text-base leading-9 text-[#555]">{f.desc}</p>
                  <ul className="mt-6 space-y-3">
                    {f.points.map((p) => (
                      <li key={p} className="flex items-center gap-3 text-sm font-bold">
                        <span
                          className="flex h-6 w-6 items-center justify-center rounded-full text-white"
                          style={{ backgroundColor: ACCENT }}
                        >
                          {icons.check}
                        </span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#5f5c96] to-[#2d2a5c] p-8 md:p-10">
                  <div className="relative space-y-3" dir="ltr">
                    {f.points.map((p, idx) => (
                      <div
                        key={p}
                        className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur"
                        style={{ marginInlineStart: `${idx * 18}px` }}
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#2d2a5c]">
                          {f.icon}
                        </span>
                        <div className="flex-1 space-y-2">
                          <div className="h-2.5 w-2/3 rounded-full bg-white/80" />
                          <div className="h-2 w-1/2 rounded-full bg-white/30" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- روند کار ---------- */}
      <section id="steps" className="scroll-mt-16 bg-[#f5f5fa] px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-[1180px] gap-14 lg:grid-cols-[1fr_1.2fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <h2 className="text-3xl font-black leading-[1.5] md:text-5xl md:leading-[1.4]">
              چطور سایتت ساخته می‌شود
            </h2>
            <p className="mt-5 max-w-md text-base leading-9 text-[#555]">
              چه فروشگاه بخواهی، چه سایت شرکتی یا نمونه‌کار شخصی، مسیر کار روشن و
              قدم‌به‌قدم است.
            </p>
          </div>

          <ol className="space-y-4">
            {steps.map((s, i) => (
              <li key={s.title} className="flex gap-5 rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md">
                <span
                  className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-base font-black text-white"
                  style={{ backgroundColor: ACCENT }}
                >
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-lg font-black">{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-8 text-[#555]">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- مناسب چه کسانی ---------- */}
      <section id="audience" className="scroll-mt-16 px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1180px]">
          <h2 className="text-center text-3xl font-black leading-[1.5] md:text-5xl md:leading-[1.4]">
            برای هر نوع پروژه‌ای
          </h2>

          <div
            role="tablist"
            className="mx-auto mt-10 flex w-fit max-w-full gap-1 overflow-x-auto rounded-full bg-[#f0f0f6] p-1.5"
          >
            {audiences.map((a) => (
              <button
                key={a.id}
                role="tab"
                aria-selected={audience === a.id}
                onClick={() => setAudience(a.id)}
                className={`whitespace-nowrap rounded-full px-6 py-2.5 text-sm font-black transition ${
                  audience === a.id ? "bg-[#111] text-white" : "text-[#444] hover:text-[#111]"
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>

          <div className="mx-auto mt-10 max-w-3xl rounded-3xl bg-gradient-to-br from-[#5f5c96] to-[#2d2a5c] p-8 text-white md:p-12">
            <h3 className="text-2xl font-black leading-[1.6] md:text-3xl">{activeAudience.title}</h3>
            <ul className="mt-6 space-y-4">
              {activeAudience.points.map((p) => (
                <li key={p} className="flex items-center gap-3 text-base text-white/90">
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-white text-[#2d2a5c]">
                    {icons.check}
                  </span>
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <PillButton href="#contact">درخواست همکاری</PillButton>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- مهارت‌ها ---------- */}
      <section id="skills" className="scroll-mt-16 bg-[#111] px-6 py-20 text-white md:px-10 md:py-28">
        <div className="mx-auto max-w-[1180px]">
          <h2 className="text-center text-3xl font-black leading-[1.5] md:text-5xl md:leading-[1.4]">
            ابزارهایی که با آن‌ها می‌سازم
          </h2>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {skillGroups.map((g) => (
              <div key={g.title} className="rounded-3xl border border-white/10 bg-white/5 p-7">
                <h3 className="mb-5 text-sm font-black" style={{ color: SOFT }}>
                  {g.title}
                </h3>
                <div className="flex flex-wrap gap-2" dir="ltr">
                  {g.items.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-white/15 px-4 py-2 text-[13px] font-bold text-white/90 transition hover:border-[#b9afff] hover:text-[#b9afff]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- سؤالات متداول ---------- */}
      <section id="faq" className="scroll-mt-16 px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-3xl font-black leading-[1.5] md:text-5xl md:leading-[1.4]">
            سؤالات متداول
          </h2>

          <div className="mt-12 divide-y divide-black/10 border-y border-black/10">
            {faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-black md:text-lg [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-black/20 text-lg transition group-open:rotate-45 group-open:bg-[#111] group-open:text-white">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-sm leading-8 text-[#555] md:text-base md:leading-9">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- تماس ---------- */}
      <section id="contact" className="scroll-mt-16 px-6 pb-20 md:px-10 md:pb-28">
        <div className="relative mx-auto max-w-[1180px] overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#5f5c96] to-[#1f1d45] px-8 py-16 text-center text-white md:px-16 md:py-20">
          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-3xl font-black leading-[1.5] md:text-5xl md:leading-[1.4]">
              آماده‌ای سایتت را بسازیم؟
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-9 text-white/80">
              برای همکاری، پروژه‌ی جدید یا هر سؤالی، از راه‌های زیر با من در تماس باش.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <PillButton href="mailto:mohamadxanzadeh@gmail.com">
                {icons.mail}
                <span>ایمیل</span>
              </PillButton>
              <PillButton href="https://github.com/RomanFard" variant="ghost" external>
                {icons.code}
                <span>GitHub</span>
              </PillButton>
              <PillButton href="https://linkedin.com" variant="ghost" external>
                {icons.link}
                <span>LinkedIn</span>
              </PillButton>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-[#111] transition hover:underline">
            <span>→</span>
            <span>بازگشت به فروشگاه</span>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}