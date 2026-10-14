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
// ─────────────────────────────────────────────
// 🎯 دسته‌بندی یکپارچه (Unified Category)
// ─────────────────────────────────────────────
// این تایپ همه‌ی اطلاعات دسته‌ها رو یه جا نگه می‌داره.
// همه‌ی کامپوننت‌ها از همین منبع می‌خونن.

export type CategoryShowIn = {
  megaMenu: boolean;    // توی هدر دسکتاپ (مگا منو)
  mobileMenu: boolean;  // توی منوی موبایل
  popular: boolean;     // توی بخش «محبوب‌ها» صفحه اصلی
  special: boolean;     // توی بخش «ویژه‌ها» صفحه اصلی
  grid: boolean;        // توی CategoryGrid
  showcase: boolean;    // توی CategoryShowcase
};

export type CategoryGroupItem = {
  label: string;
  href: string;
};

export type CategoryGroup = {
  title: string;
  items: CategoryGroupItem[];
};

export type UnifiedCategory = {
  key: string;              // مثل "tent"
  label: string;            // "چادر و سایبان"
  icon: string;             // SVG path
  photo: string;            // عکس اصلی
  emoji: string;            // "⛺" — برای PopularTab
  subtitle: string;         // برای SpecialTab
  iconKey: string;          // برای SpecialTab (tent, sleepingBag, ...)
  sortOrder: number;        // ترتیب کلی
  isActive: boolean;        // فعال/غیرفعال
  showIn: CategoryShowIn;   // کجا نمایش داده بشه
  groups: CategoryGroup[];  // زیرگروه‌ها (فقط برای megaMenu/mobileMenu)
};

// پیش‌فرض showIn
export const DEFAULT_SHOW_IN: CategoryShowIn = {
  megaMenu: true,
  mobileMenu: true,
  popular: false,
  special: false,
  grid: false,
  showcase: false,
};

// کلید ذخیره‌سازی توی app_content
export const CATEGORIES_KEY = "categories";

// helper: تبدیل یه category به فرمت‌های قدیمی
export function toMobileMenuCategory(cat: UnifiedCategory): MobileMenuCategory {
  return {
    key: cat.key,
    label: cat.label,
    icon: cat.icon,
    photo: cat.photo,
    groups: cat.groups,
  };
}

export function toPopularCategory(cat: UnifiedCategory): PopularCategory {
  return {
    key: cat.key,
    label: cat.label,
    emoji: cat.emoji || "📦",
    image: cat.photo,
    href: `/products?cat=${cat.key}`,
  };
}

export function toSpecialCategory(cat: UnifiedCategory): SpecialCategory {
  return {
    key: cat.key,
    label: cat.label,
    subtitle: cat.subtitle,
    iconKey: cat.iconKey || "tent",
    href: `/products?cat=${cat.key}`,
  };
}

export function toCategoryPhoto(cat: UnifiedCategory): { name: string; url: string } {
  return {
    name: cat.key,
    url: cat.photo,
  };
}