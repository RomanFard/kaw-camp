"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAppContent } from "@/lib/supabase/appContent";
import {
  type CategoryLinkGroup,
  CATEGORY_LINKS_KEY,
  DEFAULT_CATEGORY_LINKS,
} from "@/lib/contentTypes";

export default function CategoryLinks() {
  const [groups, setGroups] =
    useState<CategoryLinkGroup[]>(DEFAULT_CATEGORY_LINKS);

  useEffect(() => {
    (async () => {
      const data = await getAppContent<CategoryLinkGroup[]>(
        CATEGORY_LINKS_KEY
      );
      if (data && data.length > 0) setGroups(data);
    })();
  }, []);

  // 🆕 فیلتر کردن لینک‌های ناخواسته
  const filteredGroups = groups.map((group) => {
    let filteredLinks = group.links;

    // حذف گتر از «حمل و پوشاک»
    if (group.title === "حمل و پوشاک") {
      filteredLinks = filteredLinks.filter((l) => l.label !== "گتر");
    }

    // حذف دوچرخه و اکسسوری از «اکسسوری و سایر»
    if (group.title === "اکسسوری و سایر") {
      filteredLinks = filteredLinks.filter(
        (l) => l.label !== "دوچرخه" && l.label !== "اکسسوری"
      );
    }

    return { ...group, links: filteredLinks };
  });

  return (
    <section
      dir="rtl"
      className="w-full border-t border-black/10 bg-theme px-3 py-10 dark:border-white/10 sm:px-6 md:px-7 md:py-14"
    >
      <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4 md:gap-x-12">
        {filteredGroups.map((group) => (
          <div key={group.title}>
            <h3 className="mb-4 text-[13px] font-black uppercase tracking-wider text-theme md:text-[14px]">
              {group.title}
            </h3>

            <ul className="space-y-2.5">
              {group.links.map((link) => (
                <li key={link.href + link.label}>
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