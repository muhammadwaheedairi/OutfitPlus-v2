"use client";

import type React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import { urlFor } from "@/sanity/lib/image";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/context/wishlist-context";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, openCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const rating = Number(product.rating);
  const hasDiscount = product.discount && product.discount > 0;
  const discountedPrice = product.price * (1 - (product.discount || 0) / 100);
  const wishlisted = isInWishlist(product._id);

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === "string" ? Number.parseFloat(price) : price;
    return isNaN(numPrice) ? "0.00" : numPrice.toFixed(2);
  };

  const imageUrl = product.image
    ? urlFor(product.image).width(300).height(300).url()
    : "/placeholder.svg";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    openCart();
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product);
  };

  return (
    <div className="flex flex-col items-center p-2 rounded-lg transition-all transform hover:scale-105 hover:shadow-lg group">
      {/* Image with hover overlay */}
      <div className="relative w-full pb-[100%]">
        <Link href={`/product/${product._id}`}>
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="rounded-lg object-cover"
          />
        </Link>

        {/* Hover overlay — 2 buttons */}
        <div className="absolute inset-0 rounded-lg bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3 gap-2">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="flex items-center gap-1.5 bg-[#252B42] text-white text-[12px] font-bold px-4 py-2 rounded-lg hover:bg-[#2DC071] transition-colors disabled:opacity-50"
          >
            <FiShoppingCart size={13} />
            Add to Cart
          </button>
          <button
            onClick={handleWishlist}
            className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors ${
              wishlisted
                ? "bg-red-50 border border-red-300"
                : "bg-white border border-gray-200 hover:border-red-300 hover:bg-red-50"
            }`}
          >
            <FiHeart
              size={15}
              className={wishlisted ? "fill-red-500 text-red-500" : "text-gray-500"}
            />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 text-center w-full">
        <h3 className="text-[#252B42] text-[16px] font-bold">{product.name}</h3>
        <p className="text-[#737373] text-[14px]">{product.category}</p>
        {hasDiscount ? (
          <p className="text-[16px] font-bold mt-2">
            <span className="line-through text-[#BDBDBD]">${formatPrice(product.price)}</span>{" "}
            <span className="text-[#23856D]">${formatPrice(discountedPrice)}</span>
          </p>
        ) : (
          <p className="text-[#23856D] text-[16px] font-bold mt-2">
            ${formatPrice(product.price)}
          </p>
        )}
        <div className="flex justify-center items-center mt-2">
          <div className="text-[#F3CD03] text-[14px]">{rating > 0 ? `${rating.toFixed(1)} ★` : ""}</div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;