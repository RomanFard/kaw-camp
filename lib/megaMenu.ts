export type MegaMenuItem = {
  label: string;
  href: string;
};

export type MegaMenuGroup = {
  title: string;
  items: MegaMenuItem[];
};

export type MegaMenuCategory = {
  key: string;
  label: string;
  icon: string;      // مسیر تصویر
  groups: MegaMenuGroup[];
};

export const megaMenu: MegaMenuCategory[] = [
  // ۱. چادر و سایبان
  {
    key: "tent",
    label: "چادر و سایبان",
    icon: "/images/categories/tent.svg",
    groups: [
      {
        title: "براساس استفاده",
        items: [
          { label: "چادر بادی", href: "/products?cat=tent" },
          { label: "چادر اتوماتیک", href: "/products?cat=tent" },
          { label: "چادر کمپینگ", href: "/products?cat=tent" },
          { label: "چادر کوهنوردی", href: "/products?cat=tent" },
          { label: "سایبان کمپینگ", href: "/products?cat=tent" },
        ],
      },
      {
        title: "براساس برند",
        items: [
          { label: "چادر پکینیو", href: "/products?cat=tent&brand=pikniku" },
          { label: "چادر چانوداگ", href: "/products?cat=tent&brand=chanodag" },
          { label: "چادر نیچرهایک", href: "/products?cat=tent&brand=naturehike" },
          { label: "چادر کینگ کمپ", href: "/products?cat=tent&brand=kingcamp" },
        ],
      },
      {
        title: "براساس ظرفیت",
        items: [
          { label: "چادر ۱ نفره", href: "/products?cat=tent&capacity=1" },
          { label: "چادر ۲ نفره", href: "/products?cat=tent&capacity=2" },
          { label: "چادر ۳ نفره", href: "/products?cat=tent&capacity=3" },
          { label: "چادر ۴ نفره", href: "/products?cat=tent&capacity=4" },
          { label: "چادر ۶ تا ۸ نفره", href: "/products?cat=tent&capacity=6-8" },
          { label: "چادر ۱۰ نفره و بالاتر", href: "/products?cat=tent&capacity=10" },
        ],
      },
    ],
  },

  // ۲. چراغ و روشنایی
  {
    key: "lighting",
    label: "چراغ و روشنایی",
    icon: "/images/categories/lighting.svg",
    groups: [
      {
        title: "چراغ قوه",
        items: [
          { label: "چراغ قوه UV", href: "/products?cat=lighting" },
          { label: "چراغ قوه نیچرهایک", href: "/products?cat=lighting&brand=naturehike" },
          { label: "چراغ قوه اسمال سان", href: "/products?cat=lighting&brand=small-sun" },
          { label: "چراغ قوه زینگارو", href: "/products?cat=lighting&brand=zingaro" },
          { label: "چراغ قوه کینساچ", href: "/products?cat=lighting&brand=kinsach" },
        ],
      },
      {
        title: "سایر چراغ‌ها",
        items: [
          { label: "چراغ پیشانی", href: "/products?cat=lighting" },
          { label: "چراغ چادر", href: "/products?cat=lighting" },
          { label: "چراغ فانوس", href: "/products?cat=lighting" },
        ],
      },
    ],
  },

  // ۳. پخت و پز
  {
    key: "cooking",
    label: "پخت و پز",
    icon: "/images/categories/cooking.svg",
    groups: [
      {
        title: "اجاق",
        items: [
          { label: "اجاق کمپینگ", href: "/products?cat=cooking" },
          { label: "اجاق هیزمی", href: "/products?cat=cooking" },
          { label: "اجاق نیچرهایک", href: "/products?cat=cooking&brand=naturehike" },
          { label: "سرشعله کوهنوردی", href: "/products?cat=cooking" },
        ],
      },
      {
        title: "ظروف و لوازم",
        items: [
          { label: "باربیکیو", href: "/products?cat=cooking" },
          { label: "ظروف کمپینگ", href: "/products?cat=cooking" },
          { label: "ماگ و فلاسک", href: "/products?cat=bottle" },
        ],
      },
    ],
  },

  // ۴. لوازم خواب و شب‌مانی
  {
    key: "sleep",
    label: "لوازم خواب و شب‌مانی",
    icon: "/images/categories/sleep.svg",
    groups: [
      {
        title: "کیسه خواب",
        items: [
          { label: "کیسه خواب نیچرهایک", href: "/products?cat=sleep&brand=naturehike" },
          { label: "کیسه خواب چهارفصل", href: "/products?cat=sleep" },
          { label: "کیسه خواب سه‌فصل", href: "/products?cat=sleep" },
          { label: "کیسه خواب تابستانه", href: "/products?cat=sleep" },
        ],
      },
      {
        title: "تشک و بالش",
        items: [
          { label: "تشک بادی", href: "/products?cat=sleep" },
          { label: "تشک بادی نیچرهایک", href: "/products?cat=sleep&brand=naturehike" },
          { label: "بالش گردنی", href: "/products?cat=sleep" },
          { label: "بالش بادی", href: "/products?cat=sleep" },
        ],
      },
      {
        title: "سایر",
        items: [
          { label: "پتو کمپینگ", href: "/products?cat=sleep" },
          { label: "تخت کمپینگ", href: "/products?cat=sleep" },
        ],
      },
    ],
  },

  // ۵. میز و صندلی
  {
    key: "table",
    label: "میز و صندلی",
    icon: "/images/categories/table.svg",
    groups: [
      {
        title: "محصولات",
        items: [
          { label: "صندلی کمپینگ", href: "/products?cat=accessories" },
          { label: "صندلی نیچرهایک", href: "/products?cat=accessories&brand=naturehike" },
          { label: "میز کمپینگ", href: "/products?cat=accessories" },
          { label: "میز نیچرهایک", href: "/products?cat=accessories&brand=naturehike" },
          { label: "مبل بادی", href: "/products?cat=accessories" },
        ],
      },
    ],
  },

  // ۶. تجهیزات و ابزار
  {
    key: "tools",
    label: "تجهیزات و ابزار",
    icon: "/images/categories/tools.svg",
    groups: [
      {
        title: "ابزار",
        items: [
          { label: "پاور استیشن", href: "/products?cat=tools" },
          { label: "جعبه وسایل", href: "/products?cat=tools" },
          { label: "کول باکس", href: "/products?cat=tools" },
          { label: "باتوم (عصا) کوهنوردی", href: "/products?cat=tools" },
        ],
      },
    ],
  },

  // ۷. زیرانداز کمپینگ
  {
    key: "mattress",
    label: "زیرانداز کمپینگ",
    icon: "/images/categories/mattress.svg",
    groups: [
      {
        title: "محصولات",
        items: [
          { label: "زیرانداز نیچرهایک", href: "/products?cat=mattress&brand=naturehike" },
          { label: "زیرانداز نشیمن", href: "/products?cat=mattress" },
          { label: "زیرانداز چادر", href: "/products?cat=mattress" },
          { label: "زیرانداز کیسه خواب", href: "/products?cat=mattress" },
        ],
      },
    ],
  },

  // ۸. کیف و کوله‌پشتی
  {
    key: "backpack",
    label: "کیف و کوله‌پشتی",
    icon: "/images/categories/backpack.svg",
    groups: [
      {
        title: "محصولات",
        items: [
          { label: "کوله‌پشتی کوهنوردی", href: "/products?cat=backpack" },
          { label: "کوله پشتی مسافرتی", href: "/products?cat=backpack" },
          { label: "کوله پشتی تاکتیکال", href: "/products?cat=backpack" },
          { label: "کیف وسایل", href: "/products?cat=backpack" },
        ],
      },
    ],
  },

  // ۹. پوشاک کوهنوردی
  {
    key: "clothing",
    label: "پوشاک کوهنوردی",
    icon: "/images/categories/clothing.svg",
    groups: [
      {
        title: "محصولات",
        items: [
          { label: "کاپشن و بادگیر", href: "/products?cat=clothing" },
          { label: "شلوار کوهنوردی", href: "/products?cat=clothing" },
          { label: "دستکش", href: "/products?cat=clothing" },
          { label: "کلاه", href: "/products?cat=clothing" },
          { label: "جوراب", href: "/products?cat=socks" },
          { label: "گتر", href: "/products?cat=gaiters" },
        ],
      },
    ],
  },
];