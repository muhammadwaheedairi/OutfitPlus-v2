"use client";

import Image from "next/image";
import { useCart } from "@/hooks/use-cart";
import { urlFor } from "@/sanity/lib/image";
import { formatPrice, calcDiscountedPrice } from "@/lib/utils";
import type { Product } from "@/types";

export default function ProductBanner({ product }: { product: Product }) {
  const { addToCart, openCart } = useCart();

  const finalPrice = calcDiscountedPrice(product.price, product.discount);
  const imageUrl = product.image
    ? urlFor(product.image).width(600).height(700).url()
    : null;

  const handleAddToCart = () => {
    addToCart(product);
    openCart();
  };

  return (
    <section className="bg-[#23856D] overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center min-h-[500px] sm:min-h-[600px]">

          {/* ── Left: Text Content ─────────────────────── */}
          <div className="py-16 lg:py-20">
            <p className="text-[13px] font-semibold text-white/70 uppercase tracking-[0.2em] mb-5">
              SUMMER 2026
            </p>
            <h2 className="text-[40px] sm:text-[52px] lg:text-[58px] font-bold text-white leading-tight mb-6">
              {product.name}
            </h2>
            {product.description && (
              <p className="text-[15px] text-white/70 leading-relaxed mb-8 max-w-sm">
                {product.description}
              </p>
            )}
            <div className="flex items-center gap-6">
              <span className="text-[28px] font-bold text-white">
                {formatPrice(finalPrice)}
              </span>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="px-8 py-3.5 bg-[#2DC071] text-white text-[13px] font-bold uppercase tracking-widest hover:bg-[#27a863] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ADD TO CART
              </button>
            </div>
          </div>

          {/* ── Right: Product Image ───────────────────── */}
          {imageUrl && (
            <div className="relative flex justify-center lg:justify-end items-end h-[400px] sm:h-[500px] lg:h-[600px]">
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                sizes="(max-width:1024px) 100vw, 50vw"
                className="object-contain object-bottom"
                priority
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}