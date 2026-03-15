import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/cart-context";
import { WishlistProvider } from "@/context/wishlist-context";
import { SanityLive } from "@/sanity/lib/live";

export const metadata: Metadata = {
  title: {
    default: "OutfitPlus — Premium Fashion Store",
    template: "%s | OutfitPlus",
  },
  description:
    "Discover curated fashion for men, women, and kids. Premium quality, timeless style.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <CartProvider>
          <WishlistProvider>
            {children}
            <SanityLive />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}