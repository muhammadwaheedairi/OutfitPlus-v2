"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, ShoppingBag, Heart } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import { formatPrice, calcDiscountedPrice } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/context/wishlist-context";

export default function WishlistPage() {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart, openCart } = useCart();

  const moveToCart = (product: any) => {
    addToCart(product);
    openCart();
    removeFromWishlist(product._id);
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen">

      {/* ── Page Header ──────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#23A6F0] mb-2">
            Saved Items
          </p>
          <div className="flex items-center justify-between">
            <h1 className="text-[32px] font-bold text-[#252B42]">My Wishlist</h1>
            {items.length > 0 && (
              <span className="text-[13px] text-[#737373]">
                {items.length} {items.length === 1 ? "item" : "items"}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[860px] mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Empty State ───────────────────────────────── */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
              <Heart size={36} strokeWidth={1.5} className="text-red-300" />
            </div>
            <h3 className="text-[22px] font-bold text-[#252B42] mb-2">
              Your Wishlist is Empty
            </h3>
            <p className="text-[14px] text-[#737373] mb-8 max-w-xs">
              Save items you love — click the heart icon on any product.
            </p>
            <Link
              href="/product"
              className="px-8 py-3 bg-[#252B42] text-white text-[13px] font-semibold rounded-lg hover:bg-[#2DC071] transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((product) => {
              const discountedPrice = calcDiscountedPrice(product.price, product.discount);
              const imgUrl = product.image
                ? urlFor(product.image).width(200).height(240).url()
                : null;

              return (
                <div
                  key={product._id}
                  className="flex gap-5 items-center bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow"
                >
                  <Link href={`/product/${product._id}`} className="flex-shrink-0">
                    <div className="relative w-[80px] h-[100px] rounded-lg overflow-hidden bg-gray-100">
                      {imgUrl ? (
                        <Image src={imgUrl} alt={product.name} fill className="object-cover" sizes="80px" />
                      ) : (
                        <div className="w-full h-full bg-gray-100" />
                      )}
                    </div>
                  </Link>

                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-[#23A6F0] mb-1">
                      {product.category}
                    </p>
                    <Link href={`/product/${product._id}`}>
                      <h3 className="text-[15px] font-bold text-[#252B42] leading-snug hover:text-[#2DC071] transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[15px] font-bold text-[#252B42]">
                        {formatPrice(discountedPrice)}
                      </span>
                      {product.discount > 0 && (
                        <>
                          <span className="text-[13px] text-[#BDBDBD] line-through">
                            {formatPrice(product.price)}
                          </span>
                          <span className="text-[11px] font-bold text-white bg-[#E74040] px-1.5 py-0.5 rounded">
                            -{product.discount}%
                          </span>
                        </>
                      )}
                    </div>
                    <p className={`text-[12px] font-semibold mt-1 ${product.stock > 0 ? "text-[#2DC071]" : "text-[#E74040]"}`}>
                      {product.stock > 0 ? `✓ In Stock` : "✗ Out of Stock"}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button
                      onClick={() => moveToCart(product)}
                      disabled={product.stock === 0}
                      className="flex items-center gap-2 px-4 py-2.5 bg-[#252B42] text-white text-[12px] font-semibold rounded-lg hover:bg-[#2DC071] transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      <ShoppingBag size={13} strokeWidth={1.5} />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => removeFromWishlist(product._id)}
                      className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-[#737373] text-[12px] font-semibold rounded-lg hover:border-red-300 hover:text-red-400 transition-colors whitespace-nowrap"
                    >
                      <Trash2 size={13} strokeWidth={1.5} />
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}

            <div className="pt-4 flex justify-between items-center border-t border-gray-200 mt-6">
              <Link
                href="/product"
                className="text-[13px] font-semibold text-[#252B42] hover:text-[#23A6F0] transition-colors"
              >
                ← Continue Shopping
              </Link>
              <p className="text-[13px] text-[#737373]">
                {items.length} {items.length === 1 ? "item" : "items"} saved
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}