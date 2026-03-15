import Link from "next/link";
import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="py-6 bg-white">
      <div className="flex justify-between items-center py-12 px-10 mx-auto max-w-screen-xl bg-[#FAFAFA]">
        <h2 className="text-[24px] font-bold text-[#252B42]">OutfitPlus</h2>
        <div className="flex space-x-6">
          <Link href="https://www.facebook.com/OutfitPlus" aria-label="Facebook" className="text-[#23A6F0] hover:opacity-75">
            <FaFacebookF className="w-6 h-6" />
          </Link>
          <Link href="https://www.instagram.com/OutfitPlus" aria-label="Instagram" className="text-[#23A6F0] hover:opacity-75">
            <FaInstagram className="w-6 h-6" />
          </Link>
          <Link href="https://www.twitter.com/OutfitPlus" aria-label="Twitter" className="text-[#23A6F0] hover:opacity-75">
            <FaTwitter className="w-6 h-6" />
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-[1200px] mt-10">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6">

          {/* Company */}
          <div className="flex-1 min-w-[120px]">
            <h3 className="text-[16px] font-bold text-[#252B42] mb-2">Company</h3>
            <ul className="text-[#737373] space-y-1 text-[14px] font-bold">
              <li><Link href="/about" className="hover:underline">About Us</Link></li>
              <li><Link href="/blog" className="hover:underline">Blog</Link></li>
              <li><Link href="/contact" className="hover:underline">Contact</Link></li>
            </ul>
          </div>

          {/* Shop */}
          <div className="flex-1 min-w-[120px]">
            <h3 className="text-[16px] font-bold text-[#252B42] mb-2">Shop</h3>
            <ul className="text-[#737373] space-y-1 text-[14px] font-bold">
              <li><Link href="/product?category=Men%27s+Wear" className="hover:underline">Men's Wear</Link></li>
              <li><Link href="/product?category=Women%27s+Wear" className="hover:underline">Women's Wear</Link></li>
              <li><Link href="/product?category=Kid%27s+Wear" className="hover:underline">Kid's Wear</Link></li>
              <li><Link href="/product?category=Accessories" className="hover:underline">Accessories</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div className="flex-1 min-w-[120px]">
            <h3 className="text-[16px] font-bold text-[#252B42] mb-2">Help</h3>
            <ul className="text-[#737373] space-y-1 text-[14px] font-bold">
              <li><Link href="/contact" className="hover:underline">FAQ</Link></li>
              <li><Link href="/contact" className="hover:underline">Shipping Policy</Link></li>
              <li><Link href="/contact" className="hover:underline">Returns & Exchanges</Link></li>
              <li><Link href="/contact" className="hover:underline">Track Order</Link></li>
            </ul>
          </div>

          {/* Get In Touch */}
          <div className="flex-1 min-w-[150px]">
            <h3 className="text-[16px] font-bold text-[#252B42] mb-2">Get In Touch</h3>
            <div>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your Email"
                  className="px-3 py-2 border rounded-l-md text-[14px] w-full focus:outline-none"
                />
                <button className="bg-[#23A6F0] text-white px-4 py-2 rounded-r-md hover:bg-blue-400 text-[14px]">
                  Subscribe
                </button>
              </div>
              <p className="text-[#737373] text-[12px] mt-2">
                Subscribe for latest arrivals & exclusive offers.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-16 text-left bg-[#FAFAFA] py-9">
          <p className="text-[#737373] font-bold text-[14px]">
            © 2026 OutfitPlus. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;