"use client";

import { useState } from "react";
import { FiShoppingCart, FiHeart, FiStar, FiTruck, FiShield, FiRefreshCw } from "react-icons/fi";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/context/wishlist-context";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export default function ProductDetail({ product }: { product: Product }) {
  const { addToCart, openCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const rating = Number(product.rating) || 0;
  const finalPrice = product.price * (1 - (product.discount || 0) / 100);
  const wishlisted = isInWishlist(product._id);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    openCart();
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6">

      <div>
        <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#23A6F0] mb-2">
          {product.category}
        </p>
        <h1 className="text-[28px] sm:text-[32px] font-bold text-[#252B42] leading-tight">
          {product.name}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <FiStar key={s} size={16} className={s <= Math.round(rating) ? "fill-[#F3CD03] text-[#F3CD03]" : "text-gray-200"} />
          ))}
        </div>
        <span className="text-[13px] text-[#737373]">
          {rating > 0 ? `${rating.toFixed(1)} / 5` : "No ratings yet"}
        </span>
      </div>

      <div className="flex items-baseline gap-3">
        <span className="text-[32px] font-bold text-[#252B42]">{formatPrice(finalPrice)}</span>
        {product.discount > 0 && (
          <>
            <span className="text-[18px] text-[#BDBDBD] line-through">{formatPrice(product.price)}</span>
            <span className="bg-[#E74040] text-white text-[12px] font-bold px-2 py-0.5 rounded">
              -{product.discount}% OFF
            </span>
          </>
        )}
      </div>

      <p className={`text-[13px] font-semibold ${product.stock > 0 ? "text-[#2DC071]" : "text-[#E74040]"}`}>
        {product.stock > 0 ? `✓ In Stock — ${product.stock} items left` : "✗ Out of Stock"}
      </p>

      {product.description && (
        <p className="text-[14px] leading-relaxed text-[#737373] border-t border-gray-100 pt-4">
          {product.description}
        </p>
      )}

      <div className="border-t border-gray-100 pt-4">
        <p className="text-[13px] font-bold text-[#252B42] mb-3">
          Size{size && <span className="font-normal text-[#737373] ml-1">— {size}</span>}
        </p>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`h-10 w-12 rounded-lg border text-[13px] font-semibold transition-all ${
                size === s ? "border-[#252B42] bg-[#252B42] text-white" : "border-gray-200 text-[#737373] hover:border-[#252B42] hover:text-[#252B42]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[13px] font-bold text-[#252B42] mb-3">Quantity</p>
        <div className="flex items-center border border-gray-200 rounded-lg w-fit overflow-hidden">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center text-[#737373] hover:bg-gray-50 text-lg transition-colors">−</button>
          <span className="w-12 text-center text-[14px] font-bold text-[#252B42]">{qty}</span>
          <button onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))} className="w-10 h-10 flex items-center justify-center text-[#737373] hover:bg-gray-50 text-lg transition-colors">+</button>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleAdd}
          disabled={product.stock === 0}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-3.5 text-[14px] font-bold transition-all ${
            added ? "bg-[#2DC071] text-white" : "bg-[#252B42] text-white hover:bg-[#2DC071]"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <FiShoppingCart size={17} />
          {added ? "Added to Cart ✓" : "Add to Cart"}
        </button>
        <button
          onClick={() => toggleWishlist(product)}
          className={`w-14 flex items-center justify-center rounded-lg border transition-all ${
            wishlisted ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-red-300 hover:bg-red-50"
          }`}
          aria-label="Add to wishlist"
        >
          <FiHeart size={19} className={wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 border-t border-gray-100 pt-5">
        {[
          { Icon: FiTruck, label: "Free Shipping", sub: "Orders over $50" },
          { Icon: FiShield, label: "Secure Payment", sub: "100% protected" },
          { Icon: FiRefreshCw, label: "Easy Returns", sub: "30 day returns" },
        ].map(({ Icon, label, sub }) => (
          <div key={label} className="flex flex-col items-center gap-1.5 text-center">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
              <Icon size={17} className="text-[#2DC071]" />
            </div>
            <p className="text-[11px] font-bold text-[#252B42]">{label}</p>
            <p className="text-[10px] text-[#737373]">{sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}