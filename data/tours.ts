export type TourType = "off-road" | "hiking" | "camping";
export type Difficulty = "آسان" | "متوسط" | "سخت";

export type Tour = {
  id: string;
  title: string;
  location: string;
  duration: string;
  price: number;
  oldPrice?: number;
  image: string;
  images?: string[];
  type: TourType;
  difficulty: Difficulty;
  description: string;
  highlights: string[];
  capacity: number;
  rating: number;
  reviews: number;
  inStock: boolean;
  lat: number;
  lng: number;
};

export const tourTypeLabels: Record<TourType, string> = {
  "off-road": "آفرود",
  hiking: "کوهنوردی",
  camping: "کمپینگ",
};

export const tours: Tour[] = [
  {
    id: "1",
    title: "تور آفرود کویر مصر",
    location: "اصفهان - کویر مصر",
    duration: "۲ روز و ۱ شب",
    price: 4_500_000,
    oldPrice: 5_500_000,
    image: "/images/tours/desert-1.jpg",
    type: "off-road",
    difficulty: "متوسط",
    description:
      "تجربه یک سفر هیجان‌انگیز به کویر مصر با خودروهای آفرود حرفه‌ای و شب‌مانی در دل شن‌های طلایی.",
    highlights: [
      "آفرود با خودروهای لندکروز",
      "شب‌مانی در کمپ کویری",
      "تماشای غروب و طلوع کویر",
      "صرف شام سنتی زیر آسمان پرستاره",
    ],
    capacity: 8,
    rating: 4.8,
    reviews: 45,
    inStock: true,
    lat: 32.4,
    lng: 54.6,
  },
  {
    id: "2",
    title: "تور کوهنوردی دماوند",
    location: "تهران - دماوند",
    duration: "۳ روز",
    price: 6_800_000,
    image: "/images/tours/damavand-1.jpg",
    type: "hiking",
    difficulty: "سخت",
    description:
      "صعود به بام ایران با تیم حرفه‌ای و راهنماهای مجرب، همراه با تجهیزات کامل و اقامت در پناهگاه.",
    highlights: [
      "صعود به قله ۵۶۱۰ متری",
      "راهنمای کوهنوردی حرفه‌ای",
      "تجهیزات کامل",
      "اقامت در پناهگاه",
    ],
    capacity: 10,
    rating: 4.9,
    reviews: 78,
    inStock: true,
    lat: 35.9553,
    lng: 52.1099,
  },
  {
    id: "3",
    title: "تور کمپینگ جنگل گلستان",
    location: "گلستان - جنگل النگدره",
    duration: "۲ روز",
    price: 2_800_000,
    oldPrice: 3_200_000,
    image: "/images/tours/forest-1.jpg",
    type: "camping",
    difficulty: "آسان",
    description:
      "کمپینگ خانوادگی در دل جنگل‌های سرسبز گلستان با برنامه‌های گروهی و پخت غذا روی آتش.",
    highlights: [
      "کمپینگ خانوادگی",
      "پیاده‌روی در جنگل",
      "پخت غذا روی آتش",
      "بازی‌های گروهی",
    ],
    capacity: 15,
    rating: 4.7,
    reviews: 120,
    inStock: true,
    lat: 36.8411,
    lng: 54.4398,
  },
];