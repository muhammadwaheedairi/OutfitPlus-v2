"use client";

import React, { createContext, useContext, useEffect, useReducer } from "react";
import { useUser } from "@clerk/nextjs";
import type { Product } from "@/types";

interface WishlistState {
  items: Product[];
}

type WishlistAction =
  | { type: "ADD_ITEM"; payload: Product }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "HYDRATE"; payload: Product[] };

function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case "HYDRATE":
      return { items: action.payload };
    case "ADD_ITEM": {
      const exists = state.items.find((i) => i._id === action.payload._id);
      if (exists) return state;
      return { items: [...state.items, action.payload] };
    }
    case "REMOVE_ITEM":
      return { items: state.items.filter((i) => i._id !== action.payload) };
    default:
      return state;
  }
}

interface WishlistContextValue {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  toggleWishlist: (product: Product) => void;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);
const WISHLIST_KEY = "outfit-plus-wishlist";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, { items: [] });
  const { user, isLoaded } = useUser();

  // Hydrate — logged in: DB se, logged out: localStorage se
  useEffect(() => {
    if (!isLoaded) return;

    if (user) {
      // Fetch from DB
      fetch("/api/wishlist")
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data)) {
            const products: Product[] = data.map((item: any) => ({
              _id: item.productId,
              name: item.name,
              price: item.price,
              image: item.image ? JSON.parse(item.image) : null,
              category: item.category ?? "",
              discount: 0,
              stock: 99,
              rating: 0,
              tags: [],
              description: "",
            }));
            dispatch({ type: "HYDRATE", payload: products });
          }
        })
        .catch(() => {});
    } else {
      // Fallback to localStorage
      try {
        const stored = localStorage.getItem(WISHLIST_KEY);
        if (stored) dispatch({ type: "HYDRATE", payload: JSON.parse(stored) });
      } catch {}
    }
  }, [user, isLoaded]);

  // Persist to localStorage when logged out
  useEffect(() => {
    if (!user) {
      try {
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(state.items));
      } catch {}
    }
  }, [state.items, user]);

  const addToWishlist = async (product: Product) => {
    dispatch({ type: "ADD_ITEM", payload: product });
    if (user) {
      await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.image ? JSON.stringify(product.image) : null,
          category: product.category,
        }),
      }).catch(() => {});
    }
  };

  const removeFromWishlist = async (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
    if (user) {
      await fetch("/api/wishlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id }),
      }).catch(() => {});
    }
  };

  const isInWishlist = (id: string) => state.items.some((i) => i._id === id);

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <WishlistContext.Provider value={{ items: state.items, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
}

export { WishlistContext };