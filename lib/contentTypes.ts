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