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
// 🖼 هر عکس توی گرید می‌تونه لینک و متن اختصاصی داشته باشه
export type CategoryGridPhoto = {
  name: string;         // نام فایل عکس (مثلاً tent)
  href?: string;        // لینک اختصاصی (اگه نباشه: /products?cat={filter.key})
  label?: string;       // عنوان اختصاصی (اگه نباشه: از LABELS خونده می‌شه)
  description?: string; // توضیح اختصاصی
};

export type CategoryGridFilter = {
  key: string;
  label: string;
  // 🆕 می‌تونه string باشه (سازگاری با قدیمی) یا object
  photos: (string | CategoryGridPhoto)[];
};

// helper — تبدیل string به object
export function normalizeGridPhoto(
  p: string | CategoryGridPhoto
): CategoryGridPhoto {
  if (typeof p === "string") return { name: p };
  return p;
}
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
// ─────────────────────────────────────────────
// 🔗 لینک‌های دسته‌بندی (CategoryLinks)
// ─────────────────────────────────────────────

export type CategoryLink = {
  label: string;
  href: string;
};

export type CategoryLinkGroup = {
  title: string;
  links: CategoryLink[];
};

export const CATEGORY_LINKS_KEY = "category_links";

export const DEFAULT_CATEGORY_LINKS: CategoryLinkGroup[] = [
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