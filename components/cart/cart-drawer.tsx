"use client";

import type React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiX, FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";
import { useCart } from "@/hooks/use-cart";
import { urlFor } from "@/sanity/lib/image";
import { formatPrice } from "@/lib/utils";

type CartDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { items, removeFromCart, updateQuantity } = useCart();

  const getCartTotal = () =>
    items.reduce((total, item) => total + item.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto p-6 shadow-xl transform transition-transform duration-300 ease-in-out">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Your Cart</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">Your cart is empty.</p>
            <Link href="/product" onClick={onClose}>
              <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors">
                Start Shopping
              </button>
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {items.map((item) => {
                const imageUrl = item.image
                  ? urlFor(item.image).width(60).height(60).url()
                  : "/placeholder.svg";

                return (
                  <div
                    key={item._id}
                    className="flex items-center bg-gray-50 p-4 rounded-lg shadow-sm"
                  >
                    <Image
                      src={imageUrl}
                      alt={item.name}
                      width={60}
                      height={60}
                      className="rounded-md mr-4 object-cover"
                    />
                    <div className="flex-grow">
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-gray-600">{formatPrice(item.price)}</p>
                      <div className="flex items-center mt-2">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="text-gray-500 hover:text-gray-700 transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <FiMinus size={18} />
                        </button>
                        <span className="mx-2 text-gray-800">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          <FiPlus size={18} />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-500 hover:text-red-700 transition-colors ml-4"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-xl font-bold text-gray-800">
                  {formatPrice(getCartTotal())}
                </span>
              </div>
              <Link href="/checkout" onClick={onClose}>
                <button className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 transition-colors text-lg font-semibold">
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;