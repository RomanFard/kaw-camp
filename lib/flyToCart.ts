// 🎯 انیمیشن پرتاب تصویر به سمت سبد خرید
export function flyToCart(sourceEl: HTMLElement, imageUrl: string) {
  if (typeof window === "undefined") return;

  // پیدا کردن آیکون سبد
  const cartIcon =
    (document.querySelector("[data-cart-icon]") as HTMLElement) ||
    (document.querySelector('header [aria-label*="سبد"]') as HTMLElement) ||
    (document.querySelector('header a[href="/cart"]') as HTMLElement);

  // مختصات مبدأ
  const sourceRect = sourceEl.getBoundingClientRect();
  const startX = sourceRect.left + sourceRect.width / 2;
  const startY = sourceRect.top + sourceRect.height / 2;

  // مختصات مقصد
  const endX = cartIcon
    ? cartIcon.getBoundingClientRect().left +
      cartIcon.getBoundingClientRect().width / 2
    : window.innerWidth - 60;
  const endY = cartIcon
    ? cartIcon.getBoundingClientRect().top +
      cartIcon.getBoundingClientRect().height / 2
    : 40;

  // ساخت تصویر پرنده
  const flyer = document.createElement("img");
  flyer.src = imageUrl;
  flyer.alt = "";
  flyer.style.cssText = `
    position: fixed;
    left: ${startX}px;
    top: ${startY}px;
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 12px;
    z-index: 9999;
    pointer-events: none;
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
    transition: left 0.8s cubic-bezier(0.4, 0, 0.2, 1),
                top 0.8s cubic-bezier(0.4, 0, 0.2, 1),
                width 0.8s ease,
                height 0.8s ease,
                opacity 0.8s ease,
                border-radius 0.8s ease,
                transform 0.8s ease;
  `;
  document.body.appendChild(flyer);

  void flyer.offsetWidth;

  requestAnimationFrame(() => {
    flyer.style.left = `${endX}px`;
    flyer.style.top = `${endY}px`;
    flyer.style.width = "20px";
    flyer.style.height = "20px";
    flyer.style.opacity = "0.4";
    flyer.style.borderRadius = "50%";
    flyer.style.transform = "translate(-50%, -50%) scale(0.6)";
  });

  setTimeout(() => {
    flyer.remove();
  }, 850);
}