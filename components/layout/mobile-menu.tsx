"use client";

import Link from "next/link";
import { X, ShoppingBag, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: { href: string; label: string }[];
  pathname: string;
}

export default function MobileMenu({ isOpen, onClose, links, pathname }: MobileMenuProps) {
  // Lock scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 bottom-0 z-[70] w-[280px] bg-white transition-transform duration-300 ease-in-out flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--color-border)]">
          <span
            className="text-lg tracking-[0.1em] uppercase"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-brand)" }}
          >
            Menu
          </span>
          <button
            onClick={onClose}
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-brand)] transition-colors"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col px-6 pt-8 gap-2 flex-1">
          {links.map(({ href, label }) => {
            const isActive =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={cn(
                  "py-3 text-sm tracking-widest uppercase border-b border-[var(--color-border)] transition-colors duration-200",
                  isActive
                    ? "text-[var(--color-gold)]"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-brand)]"
                )}
                style={{ fontFamily: "var(--font-body)" }}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="px-6 py-6 border-t border-[var(--color-border)] flex gap-4">
          <Link
            href="/wishlist"
            onClick={onClose}
            className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-brand)] transition-colors"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <Heart size={16} strokeWidth={1.5} />
            <span className="tracking-wider uppercase text-xs">Wishlist</span>
          </Link>
          <Link
            href="/checkout"
            onClick={onClose}
            className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-brand)] transition-colors"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <ShoppingBag size={16} strokeWidth={1.5} />
            <span className="tracking-wider uppercase text-xs">Cart</span>
          </Link>
        </div>
      </div>
    </>
  );
}
