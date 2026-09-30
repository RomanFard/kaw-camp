export type Category =
  | "tent"
  | "sleep"
  | "mattress"
  | "backpack"
  | "clothing"
  | "shoes"
  | "socks"
  | "gaiters"
  | "tools"
  | "lighting"
  | "bottle"
  | "cooking"
  | "sunglasses"
  | "watch"
  | "bicycle"
  | "accessories";

export type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  oldPrice?: number;
  category: Category;
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  shortDesc: string;
  description: string;
  features: string[];
  brand?: string;
  englishName?: string;
  colors?: { label: string; value: string }[];
};

export const categories: { key: Category; label: string; emoji: string }[] = [
  { key: "tent",        label: "چادر",              emoji: "⛺" },
  { key: "sleep",       label: "کیسه خواب",         emoji: "🛏️" },
  { key: "mattress",    label: "زیرانداز",          emoji: "🟦" },
  { key: "backpack",    label: "کوله پشتی",         emoji: "🎒" },
  { key: "clothing",    label: "لباس کوهنوردی",     emoji: "🧥" },
  { key: "shoes",       label: "کفش کوهنوردی",      emoji: "🥾" },
  { key: "socks",       label: "جوراب",              emoji: "🧦" },
  { key: "gaiters",     label: "گتر",                emoji: "🦵" },
  { key: "tools",       label: "ابزار فنی",          emoji: "🧰" },
  { key: "lighting",    label: "لامپ و چراغ",        emoji: "🔦" },
  { key: "bottle",      label: "لیوان و قمقمه",      emoji: "🥤" },
  { key: "cooking",     label: "لوازم پخت و پز",     emoji: "🍳" },
  { key: "sunglasses",  label: "عینک",               emoji: "🕶️" },
  { key: "watch",       label: "ساعت ورزشی",         emoji: "⌚" },
  { key: "bicycle",     label: "دوچرخه",             emoji: "🚲" },
  { key: "accessories", label: "اکسسوری",            emoji: "🎒" },
];

export const products: Product[] = [
  {
    id: "1",
    name: "چادر کوهنوردی ۳ نفره ضدآب",
    slug: "tent-3person",
    price: 4_500_000,
    oldPrice: 5_200_000,
    category: "tent",
    image: "https://picsum.photos/seed/tent1/600/600",
    rating: 4.8,
    reviews: 124,
    inStock: true,
    shortDesc: "چادر سبک و ضدآب مناسب کمپینگ چهارفصل",
    description:
      "چادر کوهنوردی سه نفره با پارچه ضدآب ۵۰۰۰ میل، اسکلت آلومینیومی سبک و تهویه دوطرفه. مناسب برای کمپینگ در ارتفاعات و شرایط جوی نامساعد.",
    features: [
      "پارچه ضدآب ۵۰۰۰mm",
      "اسکلت آلومینیومی سبک",
      "وزن فقط ۲.۸ کیلوگرم",
      "دارای دو ورودی و ایوان",
    ],
  },
  {
    id: "2",
    name: "کوله‌پشتی ۶۰ لیتری حرفه‌ای",
    slug: "backpack-60l",
    price: 2_800_000,
    category: "backpack",
    image: "https://picsum.photos/seed/backpack1/600/600",
    rating: 4.6,
    reviews: 89,
    inStock: true,
    shortDesc: "کوله‌پشتی ۶۰ لیتری با سیستم پشتی قابل تنظیم",
    description:
      "کوله‌پشتی کوهنوردی ۶۰ لیتری با سیستم پشتی قابل تنظیم، بندهای سینه‌ای و کمری پددار و پارچه ضد پارگی Ripstop.",
    features: [
      "حجم ۶۰ لیتر",
      "پارچه Ripstop ضد پارگی",
      "روکش باران رایگان",
      "جیب مخصوص قمقمه",
    ],
  },
  {
    id: "3",
    name: "کیسه‌خواب پَر چهارفصل",
    slug: "sleeping-bag-down",
    price: 1_900_000,
    oldPrice: 2_300_000,
    category: "sleep",
    image: "https://picsum.photos/seed/sleep1/600/600",
    rating: 4.9,
    reviews: 210,
    inStock: true,
    shortDesc: "کیسه‌خواب پَری با آستری نرم و گرمای عالی",
    description:
      "کیسه‌خواب پَری چهارفصل با آستری داخلی نرم، زیپ دوطرفه و کیسه نگهداری فشرده. مناسب برای دمای تا -۱۰ درجه.",
    features: [
      "پر طبیعی سبک",
      "دمای راحتی تا -۱۰°C",
      "زیپ دوطرفه YKK",
      "کیسه فشرده‌ساز همراه",
    ],
  },
  {
    id: "4",
    name: "اجاق گاز کوهنوردی قابل حمل",
    slug: "camping-stove",
    price: 850_000,
    category: "cooking",
    image: "https://picsum.photos/seed/stove1/600/600",
    rating: 4.5,
    reviews: 67,
    inStock: true,
    shortDesc: "اجاق گاز سبک با شعله قوی و مصرف کم",
    description:
      "اجاق گاز کوهنوردی سبک و جمع‌وجور با پیزو الکترونیک، مناسب استفاده در ارتفاعات و سفرهای کمپینگ.",
    features: [
      "پیزو الکترونیک",
      "مصرف سوخت پایین",
      "بدنه استیل ضدزنگ",
      "وزن ۳۲۰ گرم",
    ],
  },
  {
    id: "5",
    name: "فانوس LED کمپینگ شارژی",
    slug: "led-lantern",
    price: 450_000,
    category: "lighting",
    image: "https://picsum.photos/seed/lantern1/600/600",
    rating: 4.4,
    reviews: 145,
    inStock: true,
    shortDesc: "فانوس LED با باتری شارژی و نور قابل تنظیم",
    description:
      "فانوس LED شارژی با سه حالت نوری، باتری ۴۰۰۰ میلی‌آمپری و قابلیت پاوربانک. مقاوم در برابر آب و گرد و غبار.",
    features: [
      "باتری ۴۰۰۰mAh",
      "۳ حالت نوری",
      "قابلیت پاوربانک",
      "ضدآب IPX4",
    ],
  },
  {
    id: "6",
    name: "قمقمه استیل ۱ لیتر",
    slug: "steel-bottle-1l",
    price: 320_000,
    category: "bottle",
    image: "https://picsum.photos/seed/bottle1/600/600",
    rating: 4.7,
    reviews: 198,
    inStock: true,
    shortDesc: "قمقمه استیل ضدزنگ با عایق حرارتی",
    description:
      "قمقمه استیل ۱ لیتری با دیواره دوجداره و عایق خلأ. نگهدارنده دما تا ۱۲ ساعت گرم و ۲۴ ساعت سرد.",
    features: [
      "استیل ۳۱۶ ضدزنگ",
      "عایق خلأ دوجداره",
      "نگهداری دما ۱۲ ساعت",
      "بدون BPA",
    ],
  },
  {
    id: "7",
    name: "تشک بادی سبک کوهنوردی",
    slug: "air-mattress",
    price: 680_000,
    category: "mattress",
    image: "https://picsum.photos/seed/mattress1/600/600",
    rating: 4.3,
    reviews: 92,
    inStock: true,
    shortDesc: "تشک بادی فوق سبک با پمپ داخلی",
    description:
      "تشک بادی سبک با پمپ داخلی، سطح ضدلغزش و ضخامت ۵ سانتی. مناسب خواب راحت در کمپینگ.",
    features: [
      "پمپ داخلی",
      "ضخامت ۵ سانتی‌متر",
      "وزن ۷۸۰ گرم",
      "کیسه حمل همراه",
    ],
  },
  {
    id: "8",
    name: "عصای کوهنوردی تلسکوپی",
    slug: "trekking-poles",
    price: 550_000,
    category: "tools",
    image: "https://picsum.photos/seed/poles1/600/600",
    rating: 4.6,
    reviews: 156,
    inStock: false,
    shortDesc: "جفت عصای تلسکوپی با دسته چوب‌پنبه",
    description:
      "جفت عصای کوهنوردی تلسکوپی سه‌تکه با دسته چوب‌پنبه، سیستم قفل سریع و نوک کاربید.",
    features: [
      "بدنه آلومینیوم ۷۰۷۵",
      "قفل سریع Lever Lock",
      "دسته چوب‌پنبه",
      "وزن ۴۹۰ گرم (هر عدد)",
    ],
  },
  {
    id: "9",
    name: "کاپشن پَر کوهنوردی مردانه",
    slug: "down-jacket-men",
    price: 3_200_000,
    oldPrice: 3_800_000,
    category: "clothing",
    image: "https://picsum.photos/seed/jacket1/600/600",
    rating: 4.7,
    reviews: 87,
    inStock: true,
    shortDesc: "کاپشن پَری سبک و گرم با پارچه ضدآب",
    description:
      "کاپشن پَر کوهنوردی مردانه با پرِ ۷۰۰ فیل، پارچه ضدآب و ضدباد، مناسب ارتفاعات بالا و سرمای شدید.",
    features: [
      "پرِ ۷۰۰ فیل پاور",
      "پارچه ضدآب و ضدباد",
      "وزن ۵۵۰ گرم",
      "دارای کلاه قابل جدا شدن",
    ],
  },
  {
    id: "10",
    name: "شلوار کوهنوردی زنانه ضدآب",
    slug: "pants-women",
    price: 1_450_000,
    category: "clothing",
    image: "https://picsum.photos/seed/pants1/600/600",
    rating: 4.5,
    reviews: 63,
    inStock: true,
    shortDesc: "شلوار سبک و ضدآب با پارچه کشی",
    description:
      "شلوار کوهنوردی زنانه با پارچه کشی و ضدآب، دارای جیب‌های زیپ‌دار و کمر کشی برای راحتی حرکت.",
    features: [
      "پارچه کشی راحت",
      "ضدآب و ضدباد",
      "جیب‌های زیپ‌دار",
      "قابل استفاده چهارفصل",
    ],
  },
  {
    id: "11",
    name: "دستکش کوهنوردی ضدآب",
    slug: "gloves-waterproof",
    price: 480_000,
    category: "clothing",
    image: "https://picsum.photos/seed/gloves1/600/600",
    rating: 4.4,
    reviews: 112,
    inStock: true,
    shortDesc: "دستکش ضدآب و ضدباد با آستری گرم",
    description:
      "دستکش کوهنوردی ضدآب با آستری پشمی، کف ضدلغزش و بند مچی قابل تنظیم. مناسب سرمای شدید.",
    features: [
      "ضدآب و ضدباد",
      "آستری پشمی گرم",
      "کف ضدلغزش",
      "بند مچی قابل تنظیم",
    ],
  },
  {
    id: "12",
    name: "عینک آفتابی کوهنوردی UV400",
    slug: "sunglasses-uv400",
    price: 950_000,
    oldPrice: 1_200_000,
    category: "sunglasses",
    image: "https://picsum.photos/seed/sunglasses1/600/600",
    rating: 4.6,
    reviews: 178,
    inStock: true,
    shortDesc: "عینک آفتابی با محافظ UV400 و بدنه سبک",
    description:
      "عینک آفتابی کوهنوردی با عدسی پلاریزه و محافظ UV400، بدنه سبک و مقاوم، مناسب ارتفاعات و برف.",
    features: [
      "عدسی پلاریزه",
      "محافظ UV400",
      "بدنه TR90 سبک",
      "کیف و دستمال همراه",
    ],
  },
  {
    id: "13",
    name: "ساعت ورزشی GPS کوهنوردی",
    slug: "gps-watch",
    price: 8_500_000,
    category: "watch",
    image: "https://picsum.photos/seed/watch1/600/600",
    rating: 4.8,
    reviews: 245,
    inStock: true,
    shortDesc: "ساعت GPS با ارتفاع‌سنج و باتری ۲۰ روزه",
    description:
      "ساعت ورزشی GPS با ارتفاع‌سنج، قطب‌نما، فشارسنج و باتری ۲۰ روزه. مقاوم در برابر آب تا ۱۰۰ متر.",
    features: [
      "GPS دقیق",
      "ارتفاع‌سنج و قطب‌نما",
      "باتری ۲۰ روزه",
      "ضدآب ۱۰۰ متر",
    ],
  },
  {
    id: "14",
    name: "کلاه نقاب‌دار کوهنوردی",
    slug: "cap-outdoor",
    price: 280_000,
    category: "accessories",
    image: "https://picsum.photos/seed/cap1/600/600",
    rating: 4.3,
    reviews: 156,
    inStock: true,
    shortDesc: "کلاه سبک با محافظ UV و پارچه تنفسی",
    description:
      "کلاه نقاب‌دار کوهنوردی با پارچه تنفسی و محافظ UV، بند قابل تنظیم و سبک برای استفاده روزانه.",
    features: [
      "پارچه تنفسی",
      "محافظ UV",
      "بند قابل تنظیم",
      "وزن ۹۰ گرم",
    ],
  },
  {
    id: "15",
    name: "کفش کوهنوردی چرم حرفه‌ای",
    slug: "hiking-boots",
    price: 3_800_000,
    oldPrice: 4_500_000,
    category: "shoes",
    image: "https://picsum.photos/seed/boots1/600/600",
    rating: 4.7,
    reviews: 134,
    inStock: true,
    shortDesc: "کفش چرم ضدآب با زیره ویبرام",
    description:
      "کفش کوهنوردی چرم طبیعی با غشای ضدآب، زیره ویبرام ضدلغزش و قالب حمایت‌کننده از قوزک پا.",
    features: [
      "چرم طبیعی درجه یک",
      "غشای ضدآب Gore-Tex",
      "زیره ویبرام",
      "قالب حمایت‌کننده",
    ],
  },
  {
    id: "16",
    name: "جوراب کوهنوردی پشمی",
    slug: "wool-socks",
    price: 180_000,
    category: "socks",
    image: "https://picsum.photos/seed/socks1/600/600",
    rating: 4.5,
    reviews: 267,
    inStock: true,
    shortDesc: "جوراب پشمی ضخیم با بالشتک مخصوص",
    description:
      "جوراب کوهنوردی پشمی با بالشتک در نواحی حساس پا، الیاف ضد باکتری و بافت تنفسی برای سفرهای طولانی.",
    features: [
      "پشم مرینو",
      "بالشتک ضربه‌گیر",
      "ضد باکتری",
      "بافت تنفسی",
    ],
  },
  {
    id: "17",
    name: "گتر کوهنوردی ضدآب",
    slug: "gaiters",
    price: 420_000,
    category: "gaiters",
    image: "https://picsum.photos/seed/gaiters1/600/600",
    rating: 4.4,
    reviews: 78,
    inStock: true,
    shortDesc: "گتر ضدآب و ضدباد برای برف و باران",
    description:
      "گتر کوهنوردی ضدآب با پارچه مقاوم، بند زیر کفش و زیپ سرتاسری. مناسب برف، گل و باران.",
    features: [
      "ضدآب و ضدباد",
      "زیپ سرتاسری",
      "بند زیر کفش",
      "پارچه مقاوم",
    ],
  },
  {
    id: "18",
    name: "پروژکتور کمپینگ نیرچرهایک مدل CNK2300BI012",
    slug: "naturehike-camping-lantern-cnk2300bi012",
    price: 8_280_000,
    category: "lighting",
    image: "https://picsum.photos/seed/projector1/800/800",
    rating: 4,
    reviews: 0,
    inStock: true,
    shortDesc: "چراغ کمپینگ ۲۰۰ لومن با باتری ۶۴ ساعته و مقاوم در برابر آب IPX4",
    description:
      "پروژکتور کمپینگ نیرچرهایک مدل CNK2300BI012 یک چراغ کمپینگ چندمنظوره برای استفاده در کمپینگ، طبیعت‌گردی و سفرهای فضای باز است که با حداکثر شدت روشنایی ۲۰۰ لومن طراحی شده تا فضای اطراف چادر یا محل استقرار شما را به خوبی روشن کند. این چراغ با باتری لیتیومی داخلی، زمان نوردهای طولانی تا ۶۴ ساعت را با یک بار شارژ در اختیار شما قرار می‌دهد. این چراغ یا با رنگ سفید و قرمز پشتیبانی می‌کند و با درگاه USB می‌تواند به عنوان پاوربانک نیز استفاده شود. طراحی سبک، ابعاد جمع‌وجور و استحکام مقاومت در برابر آب IPX4 آن را برای کمپینگ و طبیعت‌گردی مناسب کرده است.",
    features: [
      "شدت روشنایی تا ۲۰۰ لومن",
      "زاویه پخش نور ۱۱۰ درجه",
      "پوشش روشنایی تا ۳۰ متر مربع",
      "زمان نوردی تا ۶۴ ساعت",
      "باتری لیتیومی داخلی با قابلیت پاوربانک USB",
      "مقاوم در برابر آب IPX4",
    ],
    brand: "Naturehike",
    englishName: "Naturehike Camping Lantern Model CNK2300BI012",
    colors: [
      { label: "نیرچرهایک", value: "naturehike" },
      { label: "سفید و سبز", value: "white-green" },
      { label: "سفید و قرمز", value: "white-red" },
    ],
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(category: Category): Product[] {
  return products.filter((p) => p.category === category);
}

export function getBestSellers(limit = 8): Product[] {
  return [...products]
    .filter((p) => p.inStock)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

export function getDiscountedProducts(): Product[] {
  return products.filter((p) => p.oldPrice);
}