// عکس‌های واقعی کوهنوردی از Unsplash (به تفکیک دسته‌بندی)
export const categoryImages: Record<string, string[]> = {
  tent: [
    "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80",
    "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80",
    "https://images.unsplash.com/photo-1445307806294-bff7f67ff225?w=800&q=80",
  ],
  sleep: [
    "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=800&q=80",
    "https://images.unsplash.com/photo-1520095972714-909e91b038e5?w=800&q=80",
  ],
  mattress: [
    "https://images.unsplash.com/photo-1520095972714-909e91b038e5?w=800&q=80",
    "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=800&q=80",
  ],
  backpack: [
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
    "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&q=80",
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
  ],
  clothing: [
    "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800&q=80",
    "https://images.unsplash.com/photo-1551106652-a5bcf4b29ab6?w=800&q=80",
    "https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?w=800&q=80",
  ],
  shoes: [
    "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&q=80",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
  ],
  socks: [
    "https://images.unsplash.com/photo-1582966772680-860e372bb558?w=800&q=80",
  ],
  gaiters: [
    "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=80",
  ],
  tools: [
    "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?w=800&q=80",
    "https://images.unsplash.com/photo-1531577444461-73c6b4a34a15?w=800&q=80",
  ],
  lighting: [
    "https://images.unsplash.com/photo-1517824806704-9040b037703b?w=800&q=80",
    "https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800&q=80",
  ],
  bottle: [
    "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80",
    "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80",
  ],
  cooking: [
    "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800&q=80",
    "https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=800&q=80",
  ],
  sunglasses: [
    "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80",
  ],
  watch: [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
  ],
  bicycle: [
    "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80",
  ],
  accessories: [
    "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80",
  ],
};

// گرفتن عکس برای هر محصول
export function getProductImage(
  category: string,
  productId: string,
  index: number = 0
): string {
  const images = categoryImages[category] || categoryImages.accessories;
  return images[index % images.length];
}

// گرفتن چند عکس برای گالری
export function getProductImages(
  category: string,
  productId: string
): string[] {
  return categoryImages[category] || categoryImages.accessories;
}