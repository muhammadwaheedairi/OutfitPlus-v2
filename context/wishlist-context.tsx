"use client";

import React, { createContext, useContext, useEffect, useReducer } from "react";
import type { Product } from "@/types";

// ─── STATE ────────────────────────────────────────────────────────────────────

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

// ─── CONTEXT ──────────────────────────────────────────────────────────────────

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

  useEffect(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_KEY);
      if (stored) dispatch({ type: "HYDRATE", payload: JSON.parse(stored) });
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(state.items));
    } catch {}
  }, [state.items]);

  const addToWishlist = (product: Product) =>
    dispatch({ type: "ADD_ITEM", payload: product });

  const removeFromWishlist = (id: string) =>
    dispatch({ type: "REMOVE_ITEM", payload: id });

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