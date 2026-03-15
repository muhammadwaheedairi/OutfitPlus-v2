"use client";

import Image from "next/image";
import { useState } from "react";
import { urlFor } from "@/sanity/lib/image";
import type { Product } from "@/types";

export default function ProductImages({ product }: { product: Product }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const images = product.image ? [product.image] : [];

  const mainImageUrl = images[activeIndex]
    ? urlFor(images[activeIndex]).width(800).height(960).url()
    : null;

  if (!mainImageUrl) {
    return (
      <div className="w-full aspect-[5/6] bg-gray-100 flex items-center justify-center rounded-lg">
        <span className="text-[13px] tracking-widest uppercase text-gray-400">No Image</span>
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      {/* Thumbnails — multiple images future */}
      {images.length > 1 && (
        <div className="flex flex-col gap-3 w-16">
          {images.map((img, i) => {
            const thumbUrl = urlFor(img).width(120).height(150).url();
            return (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`relative overflow-hidden rounded aspect-[4/5] border-2 transition-all ${
                  i === activeIndex ? "border-[#252B42]" : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <Image src={thumbUrl} alt={`View ${i + 1}`} fill className="object-cover" sizes="64px" />
              </button>
            );
          })}
        </div>
      )}

      {/* Main Image */}
      <div className="relative flex-1 aspect-[5/6] overflow-hidden rounded-xl bg-gray-50">
        <Image
          src={mainImageUrl}
          alt={product.name}
          fill
          className="object-cover transition-opacity duration-300"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.discount > 0 && (
            <span className="px-3 py-1 text-[11px] tracking-widest uppercase font-bold text-white bg-[#E74040] rounded">
              -{product.discount}% OFF
            </span>
          )}
          {product.stock === 0 && (
            <span className="px-3 py-1 text-[11px] tracking-widest uppercase font-bold text-white bg-gray-500 rounded">
              Sold Out
            </span>
          )}
          {product.tags?.includes("new-arrival") && (
            <span className="px-3 py-1 text-[11px] tracking-widest uppercase font-bold text-white bg-[#252B42] rounded">
              New
            </span>
          )}
        </div>
      </div>
    </div>
  );
}