export type PopularCategory = {
  key: string;
  label: string;
  emoji: string;
  image: string;
  href: string;
};

export type SpecialCategory = {
  key: string;
  label: string;
  subtitle: string;
  iconKey: string;
  href: string;
};

export type MobileMenuCategory = {
  key: string;
  label: string;
  icon: string;
  photo: string;
  groups: { title: string; items: { label: string; href: string }[] }[];
};

export const SPECIAL_ICON_KEYS = [
  "tent",
  "sleepingBag",
  "backpack",
  "lighting",
  "cooking",
  "tools",
] as const;
export type CategoryGridFilter = {
  key: string;
  label: string;
  photos: string[];
};
// ─────────────────────────────────────────────
// 📢 نوار اعلان (Announcement Bar)
// ─────────────────────────────────────────────

export type AnnouncementMessage = {
  text: string;
  href?: string;
};

export type AnnouncementBar = {
  enabled: boolean;
  messages: AnnouncementMessage[];
  rotateInterval: number; // ms — زمان چرخش بین پیام‌ها
};

export const DEFAULT_ANNOUNCEMENT_BAR: AnnouncementBar = {
  enabled: true,
  messages: [
    {
      text: "۱۵٪ تخفیف برای عضویت در خبرنامه — همین حالا عضو شو",
      href: "/#newsletter",
    },
  ],
  rotateInterval: 5000,
};