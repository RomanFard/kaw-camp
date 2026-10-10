"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getProductImage } from "@/lib/productImages";
import { useProducts } from "@/components/context/ProductsContext";
import { useCart } from "@/components/context/CartContext";

type Product = ReturnType<typeof useProducts>["products"][number];
type Props = {
  onSubmitCode?: (code: string) => boolean | void | Promise<boolean | void>;
};

const money = (n: number) => new Intl.NumberFormat("fa-IR").format(n);

const SPEED = 40;
const RESUME_DELAY = 2000;

// 🆕 درصد تخفیف نمایشی برای محصولات بدون oldPrice
const FAKE_DISCOUNT = 15;

// 🆕 محاسبه‌ی قیمت اصلی و درصد تخفیف (واقعی یا نمایشی)
function getPricing(p: Product) {
  if (p.oldPrice && p.oldPrice > p.price) {
    const discount = Math.round(
      ((p.oldPrice - p.price) / p.oldPrice) * 100
    );
    return { original: p.oldPrice, discount, isFake: false };
  }
  // محصول بدون تخفیف → تخفیف نمایشی
  const original = Math.round(p.price / (1 - FAKE_DISCOUNT / 100));
  return { original, discount: FAKE_DISCOUNT, isFake: true };
}

export default function DiscountProducts({}: Props = {}) {
  const { products, loading } = useProducts();
  const { addItem } = useCart();
  const [notice, setNotice] = useState("");
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  const trackRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef(false);
  const offsetRef = useRef(0);
  const pauseUntilRef = useRef(0);
  const dragRef = useRef({
    active: false,
    moved: false,
    startX: 0,
    startOffset: 0,
    pointerId: -1,
  });

  const items = useMemo(
    () =>
      [
        ...products.filter((p) => p.oldPrice),
        ...products.filter((p) => !p.oldPrice),
      ].slice(0, 12),
    [products]
  );

  const loopItems = useMemo(() => {
    if (items.length === 0) return [];
    return [...items, ...items, ...items];
  }, [items]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || loopItems.length === 0) return;

    let frameId: number;
    let lastTime = performance.now();

    function apply() {
      if (!track) return;
      const third = track.offsetWidth / 3;
      if (third > 0) {
        offsetRef.current = ((offsetRef.current % third) + third) % third;
      }
      track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
    }

    function step(time: number) {
      const delta = Math.min(time - lastTime, 50);
      lastTime = time;

      const now = Date.now();
      const canMove =
        !hoverRef.current &&
        !dragRef.current.active &&
        now >= pauseUntilRef.current;

      if (canMove) {
        offsetRef.current += (SPEED * delta) / 1000;
      }

      apply();
      frameId = requestAnimationFrame(step);
    }

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [loopItems.length]);

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const d = dragRef.current;
    d.active = true;
    d.moved = false;
    d.startX = e.clientX;
    d.startOffset = offsetRef.current;
    d.pointerId = e.pointerId;
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const d = dragRef.current;
    if (!d.active) return;
    const dx = e.clientX - d.startX;
    if (!d.moved) {
      if (Math.abs(dx) < 5) return;
      d.moved = true;
      e.currentTarget.setPointerCapture(d.pointerId);
      e.currentTarget.style.cursor = "grabbing";
    }
    offsetRef.current = d.startOffset - dx;
  }

  function endDrag(e: React.PointerEvent<HTMLDivElement>) {
    const d = dragRef.current;
    if (!d.active) return;
    d.active = false;
    e.currentTarget.style.cursor = "";
    if (e.currentTarget.hasPointerCapture?.(d.pointerId)) {
      e.currentTarget.releasePointerCapture(d.pointerId);
    }
    pauseUntilRef.current = Date.now() + RESUME_DELAY;
  }

  function handleClickCapture(e: React.MouseEvent) {
    if (dragRef.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      dragRef.current.moved = false;
    }
  }

  function handleHoverStart() {
    hoverRef.current = true;
  }

  function handleHoverEnd() {
    hoverRef.current = false;
    pauseUntilRef.current = Date.now() + RESUME_DELAY;
  }

  const add = (e: React.MouseEvent, p: Product) => {
    e.preventDefault();
    e.stopPropagation();
    if (!p.inStock) {
      setNotice("این محصول فعلاً موجود نیست");
      return;
    }
    addItem(p, 1);
    setNotice(`${p.name} به سبد خرید اضافه شد`);
    window.setTimeout(() => setNotice(""), 2400);
  };

  if (loading || items.length === 0) return null;

  const card = (p: Product, idx: number) => {
    const { original, discount } = getPricing(p);
    const img = p.image || getProductImage(p.category, p.id);
    const isActive = activeCardId === p.id;

    return (
      <article
        key={`${p.id}-${idx}`}
        className={`camp-product ${isActive ? "camp-product--active" : ""}`}
        onPointerEnter={() => setActiveCardId(p.id)}
        onPointerLeave={() => setActiveCardId(null)}
        onPointerCancel={() => setActiveCardId(null)}
      >
        <a
          href={`/product/${p.id}`}
          className="camp-product__link"
          draggable={false}
        >
          <div className="camp-product__photo">
            <img src={img} alt={p.name} draggable={false} />
            {/* 🆕 همیشه بج تخفیف نشون داده می‌شه */}
            <span className="camp-badge">
              {discount.toLocaleString("fa-IR")}٪
            </span>
          </div>
          <div className="camp-product__info">
            <h3>{p.name}</h3>
            <span className="camp-brand">KAW CAMP</span>
            {/* 🆕 همیشه قیمت خط‌خورده + قیمت اصلی نشون داده می‌شه */}
            <del>{money(original)}</del>
            <strong>
              {money(p.price)} <small>تومان</small>
            </strong>
          </div>
        </a>
        <button
          className="camp-cart"
          aria-label={`افزودن ${p.name} به سبد خرید`}
          onClick={(e) => add(e, p)}
          disabled={!p.inStock}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 4h2l2.2 11.1a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 1.9-1.4L22 8H6M10 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
          </svg>
        </button>
      </article>
    );
  };

  return (
    <section dir="rtl" className="camp-deals">
      <style>{`
        .camp-deals{position:relative;isolation:isolate;overflow:hidden;padding:32px 0 28px;color:#f8f4e9;background:radial-gradient(ellipse at 50% 63%,rgba(211,111,35,.23),transparent 30%),linear-gradient(180deg,#111e2a 0%,#172a2d 38%,#111b16 100%);font-family:inherit}
        .camp-deals:before{content:"";position:absolute;inset:0;z-index:-2;background:linear-gradient(180deg,rgba(3,10,13,.12),rgba(4,11,8,.64)),url('/images/camping-adventure-bg.png') center/cover no-repeat;opacity:.42}
        .camp-deals:after{content:"";position:absolute;inset:auto -5% -75px;height:180px;z-index:-1;background:radial-gradient(ellipse,rgba(255,133,37,.18),transparent 65%);pointer-events:none}

        .camp-sign{position:relative;margin:0 auto 18px;width:min(400px,90%);padding:18px 16px 16px;text-align:center;background:linear-gradient(120deg,#24170f,#50331f 48%,#26180f);border:1px solid #a87948;border-radius:4px;box-shadow:0 8px 18px #0008,inset 0 0 0 3px #21160f;transform:rotate(-.5deg)}
        .camp-sign:before,.camp-sign:after{content:"";position:absolute;top:-40px;width:3px;height:44px;background:linear-gradient(90deg,#342115,#9a7448,#2b1b10)}.camp-sign:before{right:13%}.camp-sign:after{left:13%}

        .camp-logo{
          display:block;
          width:200px;
          height:auto;
          margin:0 auto 10px;
          object-fit:contain;
        }

       .camp-sign small{display:block;margin-top:6px;color:#e6bd86;letter-spacing:2px;font-size:13px;font-weight:800}

        .camp-carousel{position:relative;width:100%;margin:0 auto;padding:14px 0;border-top:2px solid #684a2c;border-bottom:2px solid #684a2c;background:linear-gradient(145deg,rgba(53,43,31,.96),rgba(9,16,13,.98) 38%,rgba(35,29,20,.98));box-shadow:0 14px 30px #0009,inset 0 2px 2px #e4bb7b44,inset 0 -6px 0 #080c0a}
        .camp-carousel__viewport{overflow:hidden;cursor:grab;user-select:none;touch-action:pan-y;padding:10px 0;-webkit-mask-image:linear-gradient(to right,transparent 0,#000 6%,#000 94%,transparent 100%);mask-image:linear-gradient(to right,transparent 0,#000 6%,#000 94%,transparent 100%)}
        .camp-carousel__viewport:active{cursor:grabbing}
        .camp-carousel__track{display:flex;width:max-content;will-change:transform;backface-visibility:hidden}

        .camp-product{position:relative;flex-shrink:0;width:190px;margin:0 5px;padding:6px 6px 10px;border:1px solid #5d5748;border-radius:12px;background:linear-gradient(180deg,rgba(17,28,23,.94),rgba(7,13,12,.98));box-shadow:0 5px 10px #0008;transition:transform .35s cubic-bezier(.2,.8,.2,1),border-color .35s,box-shadow .35s;overflow:hidden;will-change:transform}

        .camp-product--active{transform:scale(1.12);z-index:5;border-color:#e5a044;box-shadow:0 10px 22px #000c,0 0 26px #f49a3288,inset 0 0 18px #d7862020}

        .camp-product__link{display:block;color:inherit;text-decoration:none}
        .camp-product__photo{height:145px;position:relative;overflow:hidden;border-radius:7px;background:linear-gradient(135deg,#26382b,#0b1412)}
        .camp-product__photo:after{content:"";position:absolute;inset:35% 0 0;background:linear-gradient(transparent,#08100de8);pointer-events:none}
        .camp-product__photo img{width:100%;height:100%;object-fit:cover;transition:transform .5s;pointer-events:none}
        .camp-product--active .camp-product__photo img{transform:scale(1.08)}

        /* 🆕 بج تخفیف همیشه با استایل قرمز */
        .camp-badge{position:absolute;z-index:2;top:5px;right:5px;padding:3px 8px;border-radius:14px;background:#e64f35;color:#fff;font-size:10px;font-weight:900;box-shadow:0 2px 6px rgba(0,0,0,.5),0 0 0 1px rgba(255,255,255,.15);letter-spacing:.3px}

        .camp-product__info{text-align:center;padding:7px 1px 0}
        .camp-product__info h3{min-height:32px;margin:0 0 3px;font-size:11px;line-height:1.5;font-weight:700;color:#f5f1e6;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
        .camp-brand{display:block;margin-bottom:5px;color:#a9aaa0;font-size:8px;letter-spacing:1px;direction:ltr}

        /* 🆕 قیمت خط‌خورده واضح‌تر */
        .camp-product__info del{display:block;color:#8b8275;font-size:9px;text-decoration:line-through;margin-bottom:2px}

        .camp-product__info strong{display:block;margin-top:2px;color:#ff9d32;font-size:13px;white-space:nowrap}
        .camp-product__info small{font-size:8px;color:#e2a35d;font-weight:500}

        .camp-cart{display:grid;place-items:center;width:30px;height:30px;margin:7px auto 0;border:1px solid #d5c5a9;border-radius:50%;background:#111b16;color:#f4eee1;cursor:pointer;transition:background .2s,color .2s,transform .2s}
        .camp-cart:hover{background:#f49a32;color:#15130f;transform:translateY(-2px)}
        .camp-cart:disabled{opacity:.35;cursor:not-allowed}
        .camp-cart svg{width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}

        .camp-status{min-height:18px;margin:12px 0 0;text-align:center;color:#f7c17d;font-size:11px}

        @media(max-width:760px){
          .camp-deals{padding:22px 0 18px}
          .camp-sign{margin-bottom:14px;width:min(340px,88%);padding:14px 12px 12px}
          .camp-sign:before,.camp-sign:after{top:-28px;height:30px;width:2px}
          .camp-logo{width:150px;margin:0 auto 8px}
          .camp-sign small{font-size:8px}
          .camp-carousel{padding:10px 0}
          .camp-carousel__viewport{padding:8px 0}
          .camp-product{width:135px;margin:0 4px;padding:5px 5px 8px;border-radius:9px}
          .camp-product--active{transform:scale(1.14)}
          .camp-product__photo{height:100px;border-radius:6px}
          .camp-badge{font-size:9px;padding:2px 6px;top:4px;right:4px}
          .camp-product__info h3{min-height:28px;font-size:9px}
          .camp-product__info del{font-size:8px}
          .camp-product__info strong{font-size:10px}
          .camp-cart{width:26px;height:26px;margin:6px auto 0}
          .camp-cart svg{width:13px;height:13px}
          .camp-status{font-size:10px}
        }

        @media(max-width:390px){
          .camp-product{width:120px}
          .camp-product__photo{height:90px}
          .camp-product__info strong{font-size:9px}
          .camp-product__info del{font-size:7px}
          .camp-badge{font-size:8px;padding:2px 5px}
          .camp-logo{width:130px}
        }
        @media(prefers-reduced-motion:reduce){
          .camp-product,.camp-product__photo img,.camp-cart{transition:none}
        }
      `}</style>

      <header className="camp-sign">
        <img
          src="/images/logo.png"
          alt="KAW CAMP"
          className="camp-logo"
          draggable={false}
        />
        <small>تخفیف‌های ویژه</small>
      </header>

      <div className="camp-carousel">
        <div
          dir="ltr"
          className="camp-carousel__viewport"
          onMouseEnter={handleHoverStart}
          onMouseLeave={handleHoverEnd}
          onTouchStart={handleHoverStart}
          onTouchEnd={handleHoverEnd}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClickCapture={handleClickCapture}
        >
          <div ref={trackRef} dir="rtl" className="camp-carousel__track">
            {loopItems.map((p, i) => card(p, i))}
          </div>
        </div>
      </div>

      <p className="camp-status" role="status" aria-live="polite">
        {notice}
      </p>
    </section>
  );
}