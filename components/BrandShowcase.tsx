"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { useProducts } from "@/components/context/ProductsContext";

export type BrandConfig = {
  key: string;
  nameFa: string;
  nameEn: string;
  matchNames: string[];
};

type Props = {
  title?: string;
  brands: BrandConfig[];
  productsPerBrand?: number;
};

export default function BrandShowcase({
  title = "برندها",
  brands,
  productsPerBrand = 4,
}: Props) {
  const { products, loading } = useProducts();
  const [activeKey, setActiveKey] = useState<string>(brands[0].key);

  const activeBrand = brands.find((b) => b.key === activeKey) || brands[0];

  const brandProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (!p.brand) return false;
        const lower = p.brand.toLowerCase().trim();
        return activeBrand.matchNames.some(
          (n) => n.toLowerCase().trim() === lower
        );
      })
      .slice(0, productsPerBrand);
  }, [products, activeBrand, productsPerBrand]);

  if (loading) {
    return (
      <section className="w-full px-3 py-10 sm:px-6 md:px-7 md:py-14">
        <div className="mb-6 flex items-center justify-between md:mb-8">
          <div className="h-7 w-32 animate-pulse bg-theme-surface" />
          <div className="h-5 w-20 animate-pulse bg-theme-surface" />
        </div>
        <div className="mb-6 flex gap-2 md:mb-8">
          {brands.map((b) => (
            <div
              key={b.key}
              className="h-10 w-24 animate-pulse bg-theme-surface"
            />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-2.5">
          {Array.from({ length: productsPerBrand }).map((_, i) => (
            <div key={i}>
              <div className="aspect-[4/5] w-full animate-pulse bg-theme-surface" />
              <div className="mt-3 h-4 w-3/4 animate-pulse bg-theme-surface" />
              <div className="mt-2 h-3 w-1/2 animate-pulse bg-theme-surface" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="w-full px-3 py-10 sm:px-6 md:px-7 md:py-14">
      {/* ─── هدر ─── */}
      <div className="mb-6 flex items-end justify-between md:mb-8">
        <h2 className="text-lg font-black tracking-tight text-theme md:text-xl lg:text-2xl">
          {title}
        </h2>

        <Link
          href={`/products?brand=${activeBrand.key}`}
          className="text-[12px] font-semibold text-theme-muted underline underline-offset-4 transition hover:text-theme md:text-[13px]"
        >
          مشاهده همه
        </Link>
      </div>

      {/* ─── تب‌ها ─── */}
      <div className="mb-6 flex gap-2 md:mb-8">
        {brands.map((brand) => {
          const isActive = activeKey === brand.key;
          return (
            <button
              key={brand.key}
              type="button"
              onClick={() => setActiveKey(brand.key)}
              className={
                "rounded-none border px-5 py-2 text-[13px] font-bold transition md:px-7 md:py-2.5 md:text-sm " +
                (isActive
                  ? "border-black text-black dark:border-white dark:text-white"
                  : "border-zinc-300 text-zinc-400 hover:border-zinc-500 hover:text-zinc-600 dark:border-zinc-700 dark:text-zinc-500 dark:hover:border-zinc-500 dark:hover:text-zinc-300")
              }
            >
              {brand.nameFa}
            </button>
          );
        })}
      </div>

      {/* ─── محصولات ─── */}
      {brandProducts.length === 0 ? (
        <div className="flex h-[200px] items-center justify-center border-2 border-dashed border-theme/40">
          <p className="text-sm text-theme-muted">
            به‌زودی محصولات {activeBrand.nameFa} اضافه می‌شود
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-2.5">
          {brandProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

function ProductCard({ product }: { product: any }) {
  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-theme-surface">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          draggable={false}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>

      <div className="mt-3 md:mt-4">
        <h3 className="line-clamp-1 text-[14px] font-bold text-theme md:text-[15px]">
          {product.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-theme-muted md:text-[13px]">
          {product.shortDesc}
        </p>
        <p className="mt-2 text-[14px] font-black text-theme md:text-[15px]">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}