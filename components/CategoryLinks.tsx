"use client";

import Link from "next/link";

type CategoryLink = {
  label: string;
  href: string;
};

type CategoryGroup = {
  title: string;
  links: CategoryLink[];
};

const GROUPS: CategoryGroup[] = [
  {
    title: "چادر و خواب",
    links: [
      { label: "چادر و سایبان", href: "/products?cat=tent" },
      { label: "کیسه خواب", href: "/products?cat=sleep" },
      { label: "زیرانداز کمپینگ", href: "/products?cat=mattress" },
    ],
  },
  {
    title: "حمل و پوشاک",
    links: [
      { label: "کیف و کوله‌پشتی", href: "/products?cat=backpack" },
      { label: "پوشاک کوهنوردی", href: "/products?cat=clothing" },
      { label: "کفش کوهنوردی", href: "/products?cat=shoes" },
      { label: "جوراب", href: "/products?cat=socks" },
      { label: "گتر", href: "/products?cat=gaiters" },
    ],
  },
  {
    title: "پخت و تجهیزات",
    links: [
      { label: "پخت و پز", href: "/products?cat=cooking" },
      { label: "چراغ و روشنایی", href: "/products?cat=lighting" },
      { label: "تجهیزات و ابزار", href: "/products?cat=tools" },
      { label: "میز و صندلی", href: "/products?cat=table" },
    ],
  },
  {
    title: "اکسسوری و سایر",
    links: [
      { label: "لیوان و قمقمه", href: "/products?cat=bottle" },
      { label: "عینک", href: "/products?cat=sunglasses" },
      { label: "ساعت ورزشی", href: "/products?cat=watch" },
      { label: "دوچرخه", href: "/products?cat=bicycle" },
      { label: "اکسسوری", href: "/products?cat=accessories" },
      { label: "سایر", href: "/products?cat=other" },
    ],
  },
];

export default function CategoryLinks() {
  return (
    <section
      dir="rtl"
      className="w-full border-t border-black/10 bg-theme px-3 py-10 dark:border-white/10 sm:px-6 md:px-7 md:py-14"
    >
      <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4 md:gap-x-12">
        {GROUPS.map((group) => (
          <div key={group.title}>
            <h3 className="mb-4 text-[13px] font-black uppercase tracking-wider text-theme md:text-[14px]">
              {group.title}
            </h3>

            <ul className="space-y-2.5">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block text-[12px] text-theme-muted transition hover:text-theme md:text-[13px]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}