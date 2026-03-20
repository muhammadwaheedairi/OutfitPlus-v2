"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiPhone, FiMail, FiInstagram, FiYoutube,
  FiFacebook, FiTwitter, FiShoppingCart,
  FiHeart, FiMenu, FiX,
} from "react-icons/fi";
import { SignInButton, Show, UserButton } from "@clerk/nextjs";
import CartDrawer from "@/components/cart/cart-drawer";
import { useCart } from "@/hooks/use-cart";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/product", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Header({ isAdmin = false, isLoggedIn = false }: { isAdmin?: boolean; isLoggedIn?: boolean }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { items } = useCart();
  const pathname = usePathname();
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <>
      <header className="w-full bg-white shadow-sm sticky top-0 z-40">

        {/* ── Top Bar ─────────────────────────── */}
        <div className="bg-[#252B42] hidden lg:block">
          <div className="max-w-[1280px] mx-auto px-6 h-10 flex items-center justify-between">
            <div className="flex items-center gap-6 text-[13px] text-gray-300">
              <a href="tel:+923238293672" className="flex items-center gap-1.5 hover:text-white transition-colors">
                <FiPhone size={13} /><span>(923) 238-293672</span>
              </a>
              <a href="https://mail.google.com/mail/?view=cm&to=muhammadwaheedairi@gmail.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
                <FiMail size={13} /><span>muhammadwaheedairi@gmail.com</span>
              </a>
            </div>
            <p className="text-[13px] text-gray-300 font-medium tracking-wide">
              Free shipping on orders over <span className="text-[#2DC071] font-bold">$50</span> — Shop Now
            </p>
            <div className="flex items-center gap-1 text-gray-300">
              <span className="text-[13px] mr-2">Follow Us:</span>
              {[
                { icon: <FiInstagram size={14} />, href: "https://instagram.com/outfitplus" },
                { icon: <FiYoutube size={14} />, href: "https://youtube.com" },
                { icon: <FiFacebook size={14} />, href: "https://facebook.com/outfitplus" },
                { icon: <FiTwitter size={14} />, href: "https://twitter.com/outfitplus" },
              ].map(({ icon, href }, i) => (
                <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="w-7 h-7 flex items-center justify-center rounded hover:text-white hover:bg-white/10 transition-colors">
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Main Nav ────────────────────────── */}
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="h-16 flex items-center justify-between gap-8">

            <Link href="/" className="text-[22px] font-bold text-[#252B42] tracking-tight flex-shrink-0">
              OutfitPlus
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(({ href, label }) => {
                const active = pathname === href || (href !== "/" && pathname.startsWith(href));
                return (
                  <Link key={href} href={href}
                    className={`px-4 py-2 rounded text-[14px] font-medium transition-colors ${
                      active ? "text-[#252B42] font-semibold" : "text-[#737373] hover:text-[#252B42]"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
              {isLoggedIn && (
                <Link href="/orders"
                  className={`px-4 py-2 rounded text-[14px] font-medium transition-colors ${
                    pathname.startsWith("/orders") ? "text-[#252B42] font-semibold" : "text-[#737373] hover:text-[#252B42]"
                  }`}
                >
                  Orders
                </Link>
              )}
              {isAdmin && (
                <Link href="/admin"
                  className={`px-4 py-2 rounded text-[14px] font-bold transition-colors ${
                    pathname.startsWith("/admin") ? "text-[#2DC071] font-semibold" : "text-[#2DC071] hover:text-[#252B42]"
                  }`}
                >
                  Admin
                </Link>
              )}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button onClick={() => setIsCartOpen(true)}
                className="relative w-10 h-10 flex items-center justify-center rounded-full text-[#737373] hover:text-[#252B42] hover:bg-gray-100 transition-colors"
                aria-label="Open cart"
              >
                <FiShoppingCart size={20} />
                {itemCount > 0 && (
                  <span className="absolute top-1 right-1 bg-[#E74040] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </button>

              <Link href="/wishlist"
                className="w-10 h-10 flex items-center justify-center rounded-full text-[#737373] hover:text-[#252B42] hover:bg-gray-100 transition-colors"
                aria-label="Wishlist"
              >
                <FiHeart size={20} />
              </Link>

              <div className="w-10 h-10 flex items-center justify-center">
                <Show when="signed-out">
                  <SignInButton mode="modal">
                    <button className="w-10 h-10 flex items-center justify-center rounded-full text-[#737373] hover:text-[#252B42] hover:bg-gray-100 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                      </svg>
                    </button>
                  </SignInButton>
                </Show>
                <Show when="signed-in">
                  <UserButton />
                </Show>
              </div>

              <button onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden w-10 h-10 flex items-center justify-center rounded-full text-[#737373] hover:text-[#252B42] hover:bg-gray-100 transition-colors ml-1"
              >
                {isMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile Menu ─────────────────────── */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <nav className="max-w-[1280px] mx-auto px-6 py-3 flex flex-col">
              {NAV_LINKS.map(({ href, label }) => {
                const active = pathname === href || (href !== "/" && pathname.startsWith(href));
                return (
                  <Link key={href} href={href} onClick={() => setIsMenuOpen(false)}
                    className={`py-3 text-[15px] border-b border-gray-100 last:border-0 transition-colors ${
                      active ? "text-[#252B42] font-semibold" : "text-[#737373] hover:text-[#252B42]"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
              {isLoggedIn && (
                <Link href="/orders" onClick={() => setIsMenuOpen(false)}
                  className="py-3 text-[15px] border-b border-gray-100 text-[#737373] hover:text-[#252B42] transition-colors">
                  Orders
                </Link>
              )}
              {isAdmin && (
                <Link href="/admin" onClick={() => setIsMenuOpen(false)}
                  className="py-3 text-[15px] border-b border-gray-100 text-[#2DC071] font-bold hover:text-[#252B42] transition-colors">
                  Admin Dashboard
                </Link>
              )}
              <div className="py-3 text-[15px] text-[#737373]">
                <Show when="signed-out">
                  <SignInButton mode="modal">
                    <button className="hover:text-[#252B42] transition-colors">Login / Sign Up</button>
                  </SignInButton>
                </Show>
                <Show when="signed-in">
                  <UserButton />
                </Show>
              </div>
            </nav>
          </div>
        )}
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}