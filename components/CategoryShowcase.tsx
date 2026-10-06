"use client";

import Link from "next/link";

type CategoryItem = {
  key: string;
  label: string;
  image: string;
  gradient: string;
  href: string;
};

const CATEGORIES: CategoryItem[] = [
  // ─── ردیف اول (از راست به چپ) ───
  {
    key: "sleeping-bag",
    label: "کیسه خواب",
    image: "/images/categories/showcase/sleeping-bag.png",
    gradient: "from-rose-900/60 to-red-950/80",
    href: "/products?cat=sleep",
  },
  {
    key: "inflatable-tent",
    label: "چادر بادی",
    image: "/images/categories/showcase/inflatable-tent.png",
    gradient: "from-blue-900/60 to-blue-950/80",
    href: "/products?cat=tent",
  },
  {
    key: "auto-tent",
    label: "چادر اتوماتیک",
    image: "/images/categories/showcase/auto-tent.png",
    gradient: "from-slate-900/60 to-slate-950/80",
    href: "/products?cat=tent",
  },
  {
    key: "mattress",
    label: "زیرانداز کمپینگ",
    image: "/images/categories/showcase/mattress.png",
    gradient: "from-emerald-900/60 to-emerald-950/80",
    href: "/products?cat=mattress",
  },
  {
    key: "cooking",
    label: "ظروف کمپینگ",
    image: "/images/categories/showcase/cooking.png",
    gradient: "from-green-900/60 to-green-950/80",
    href: "/products?cat=cooking",
  },
  {
    key: "tools",
    label: "تجهیزات و ابزار",
    image: "/images/categories/showcase/tools.png",
    gradient: "from-rose-800/60 to-rose-950/80",
    href: "/products?cat=tools",
  },

  // ─── ردیف دوم (از راست به چپ) ───
  {
    key: "chair",
    label: "صندلی کمپینگ",
    image: "/images/categories/showcase/chair.png",
    gradient: "from-fuchsia-800/60 to-purple-950/80",
    href: "/products?cat=chair",
  },
  {
    key: "lantern",
    label: "چراغ فانوس",
    image: "/images/categories/showcase/lantern.png",
    gradient: "from-zinc-800/60 to-zinc-950/80",
    href: "/products?cat=lighting",
  },
  {
    key: "flashlight",
    label: "چراغ قوه",
    image: "/images/categories/showcase/flashlight.png",
    gradient: "from-stone-700/60 to-stone-900/80",
    href: "/products?cat=lighting",
  },
  {
    key: "power-station",
    label: "پاور استیشن",
    image: "/images/categories/showcase/power-station.png",
    gradient: "from-blue-800/60 to-blue-950/80",
    href: "/products?cat=power",
  },
  {
    key: "hand-cart",
    label: "چرخ دستی",
    image: "/images/categories/showcase/hand-cart.png",
    gradient: "from-amber-800/60 to-amber-950/80",
    href: "/products?cat=cart",
  },
  {
    key: "jet-fan",
    label: "جت فن",
    image: "/images/categories/showcase/jet-fan.png",
    gradient: "from-orange-800/60 to-orange-950/80",
    href: "/products?cat=jetfan",
  },
];

export default function CategoryShowcase() {
  return (
    <section dir="rtl" className="py-12 md:py-16">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-5 lg:grid-cols-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.key}
              href={cat.href}
              className="group flex flex-col items-center gap-3"
            >
              <div
                className={`relative aspect-square w-full overflow-hidden rounded-2xl bg-gradient-to-br ${cat.gradient} transition duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-accent/20`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cat.image}
                  alt={cat.label}
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent && !parent.querySelector(".fallback")) {
                      const span = document.createElement("span");
                      span.className =
                        "fallback absolute inset-0 flex items-center justify-center text-4xl";
                      span.textContent = "📦";
                      parent.appendChild(span);
                    }
                  }}
                  className="h-full w-full object-contain p-4 transition duration-500 group-hover:scale-110"
                />
              </div>

              <span className="text-center text-xs font-bold text-theme-muted transition group-hover:text-accent md:text-sm">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}