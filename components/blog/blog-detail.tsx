"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft, FiClock, FiBookOpen, FiShare2, FiTwitter, FiLink } from "react-icons/fi";
import { FaFacebook } from "react-icons/fa";
import { urlFor } from "@/sanity/lib/image";
import { formatDate } from "@/lib/utils";
import type { BlogPost } from "@/types";

type Block = {
  _key?: string;
  _type?: string;
  style?: string;
  children?: { text: string; marks?: string[] }[];
};

function estimateReadTime(body: Block[]): number {
  const text = body.map((b) => b?.children?.map((c) => c.text).join("") ?? "").join(" ");
  return Math.max(1, Math.ceil(text.split(" ").filter(Boolean).length / 200));
}

function renderBlock(block: Block, i: number) {
  if (block._type !== "block" || !block.children) return null;
  const text = block.children.map((c) => c.text).join("");
  if (!text.trim()) return null;

  const inline = block.children.map((c, ci) => {
    if (c.marks?.includes("strong"))
      return <strong key={ci} className="font-bold text-[#252B42]">{c.text}</strong>;
    if (c.marks?.includes("em"))
      return <em key={ci} className="italic">{c.text}</em>;
    return <span key={ci}>{c.text}</span>;
  });

  if (block.style === "h2") return (
    <h2
      key={block._key ?? i}
      style={{ fontFamily: "'Sora', sans-serif" }}
      className="text-[28px] sm:text-[32px] font-bold text-[#252B42] mt-16 mb-6 leading-tight tracking-tight"
    >
      {text}
    </h2>
  );

  if (block.style === "h3") return (
    <h3
      key={block._key ?? i}
      style={{ fontFamily: "'Sora', sans-serif" }}
      className="text-[22px] font-bold text-[#252B42] mt-12 mb-4 leading-snug"
    >
      {text}
    </h3>
  );

  if (block.style === "blockquote") return (
    <blockquote
      key={block._key ?? i}
      className="my-12 pl-8 border-l-4 border-[#23A6F0] bg-gray-50 py-8 pr-8 rounded-r-2xl"
    >
      <p
        style={{ fontFamily: "'Lora', Georgia, serif" }}
        className="text-[20px] italic text-[#252B42] leading-relaxed font-medium"
      >
        "{text}"
      </p>
    </blockquote>
  );

  return (
    <p
      key={block._key ?? i}
      style={{
        fontFamily: "'Lora', Georgia, serif",
        wordSpacing: "0.06em",
        letterSpacing: "0.01em",
      }}
      className="text-[19px] text-[#444] leading-[2.0] mb-8"
    >
      {inline}
    </p>
  );
}

/* ─── Scroll Progress Hook ─────────────────────────── */
function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return progress;
}

/* ─── Main Component ───────────────────────────────── */
export default function BlogDetail({ post }: { post: BlogPost }) {
  const imageUrl = post.image ? urlFor(post.image).width(1200).height(1600).url() : null;
  const body = Array.isArray(post.body) ? (post.body as Block[]) : [];
  const readTime = body.length ? estimateReadTime(body) : 1;
  const date = post.publishedAt ? formatDate(post.publishedAt) : null;
  const progress = useScrollProgress();

  const [copied, setCopied] = useState(false);
  const [pageUrl, setPageUrl] = useState("");
  useEffect(() => { setPageUrl(window.location.href); }, []);

  const encodedUrl = encodeURIComponent(pageUrl);
  const encodedTitle = encodeURIComponent(post.title);
  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

  function copyLink() {
    navigator.clipboard.writeText(pageUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Lora:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@400;500;600&display=swap');
      `}</style>

      <div className="bg-white min-h-screen selection:bg-[#23A6F0]/20 selection:text-[#23A6F0]">

        {/* ── Scroll Progress Bar ───────────────────────── */}
        <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-gray-100">
          <div
            className="h-full bg-[#23A6F0] transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* ── Sticky Nav ───────────────────────────────── */}
        <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="max-w-[1280px] mx-auto px-6 sm:px-12 flex items-center justify-between h-16">

            <Link
              href="/blog"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
              className="group flex items-center gap-2 text-[13px] font-medium text-[#737373] hover:text-[#252B42] transition-colors"
            >
              <FiArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">Back to Articles</span>
            </Link>

            <Link href="/" className="absolute left-1/2 -translate-x-1/2">
              <span style={{ fontFamily: "'Sora', sans-serif" }} className="text-[19px] font-extrabold tracking-tighter text-[#252B42]">
                OUTFIT<span className="text-[#23A6F0]">PLUS</span>
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <span
                style={{ fontFamily: "'DM Sans', sans-serif" }}
                className="hidden md:flex items-center gap-1.5 text-[13px] font-medium text-[#737373]"
              >
                <FiBookOpen size={14} />
                {readTime} min read
              </span>
              <a
                href={twitterShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Share on Twitter"
                className="p-2 rounded-full hover:bg-gray-100 text-[#252B42] transition-colors"
              >
                <FiShare2 size={17} />
              </a>
            </div>
          </div>
        </nav>

        {/* ── Hero ─────────────────────────────────────── */}
        <header className="max-w-[1280px] mx-auto px-6 sm:px-12 pt-14 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">

            {/* Left: Meta + Title */}
            <div className="lg:col-span-7 flex flex-col">
              {date && (
                <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="flex items-center gap-3 mb-7">
                  <span className="px-3 py-1 bg-[#23A6F0]/10 text-[#23A6F0] text-[11px] font-bold uppercase tracking-widest rounded-full">
                    {date}
                  </span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full" />
                  <span className="text-[12px] font-medium text-[#737373] uppercase tracking-wider">Fashion Trends</span>
                </div>
              )}

              <h1
                style={{ fontFamily: "'Sora', sans-serif" }}
                className="text-[36px] sm:text-[50px] lg:text-[58px] font-extrabold text-[#252B42] leading-[1.1] tracking-tight mb-8"
              >
                {post.title}
              </h1>

              {post.excerpt && (
                <p
                  style={{ fontFamily: "'Lora', Georgia, serif" }}
                  className="text-[19px] text-[#737373] leading-relaxed font-light mb-10 max-w-xl"
                >
                  {post.excerpt}
                </p>
              )}

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#252B42] flex items-center justify-center flex-shrink-0 ring-2 ring-[#23A6F0]/20">
                  <span style={{ fontFamily: "'Sora', sans-serif" }} className="text-white text-[11px] font-bold tracking-wider">OP</span>
                </div>
                <div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-[15px] font-bold text-[#252B42]">
                    OutfitPlus Editorial
                  </p>
                  <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="flex items-center gap-2 mt-0.5 text-[13px] text-[#737373]">
                    {date && (
                      <span className="flex items-center gap-1">
                        <FiClock size={12} />{date}
                      </span>
                    )}
                    <span className="w-[3px] h-[3px] rounded-full bg-gray-300" />
                    <span className="flex items-center gap-1">
                      <FiBookOpen size={12} />{readTime} min read
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Hero Image */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/5] rounded-[28px] overflow-hidden shadow-2xl group">
                {imageUrl ? (
                  <>
                    <Image
                      src={imageUrl}
                      alt={post.title}
                      fill
                      priority
                      sizes="(max-width:1024px) 100vw, 40vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#252B42]/25 to-transparent" />
                    <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-[28px]" />
                  </>
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <span style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-gray-400 text-sm tracking-wide uppercase">No Image</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* ── Article + Sidebar ─────────────────────────── */}
        <main className="max-w-[1280px] mx-auto px-6 sm:px-12 pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

            {/* Sticky Social Sidebar */}
            <aside className="hidden lg:flex lg:col-span-1 justify-center">
              <div className="sticky top-28 flex flex-col gap-4">
                <a
                  href={twitterShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Share on Twitter"
                  className="w-11 h-11 flex items-center justify-center rounded-full border border-gray-200 text-[#737373] hover:border-[#23A6F0] hover:text-[#23A6F0] transition-all duration-200"
                >
                  <FiTwitter size={18} />
                </a>
                <a
                  href={facebookShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Share on Facebook"
                  className="w-11 h-11 flex items-center justify-center rounded-full border border-gray-200 text-[#737373] hover:border-[#23A6F0] hover:text-[#23A6F0] transition-all duration-200"
                >
                  <FaFacebook size={18} />
                </a>
                <button
                  onClick={copyLink}
                  title={copied ? "Copied!" : "Copy Link"}
                  className="w-11 h-11 flex items-center justify-center rounded-full border border-gray-200 text-[#737373] hover:border-[#23A6F0] hover:text-[#23A6F0] transition-all duration-200"
                >
                  {copied ? <span className="text-[9px] font-bold text-[#2DC071]">✓</span> : <FiLink size={18} />}
                </button>
              </div>
            </aside>

            {/* Article Body */}
            <article className="lg:col-span-8 lg:col-start-3">

              {/* Divider */}
              <div className="flex items-center gap-3 mb-12">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#23A6F0] opacity-60" />
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
              </div>

              {body.length > 0 ? (
                body.map((block, i) => renderBlock(block, i))
              ) : (
                <p style={{ fontFamily: "'Lora', Georgia, serif" }} className="text-[18px] text-[#737373] italic">
                  No content available.
                </p>
              )}

              {/* Bottom border */}
              <div className="mt-16 pt-10 border-t border-gray-100" />
            </article>
          </div>
        </main>

        {/* ── CTA Section ──────────────────────────────── */}
        <section className="max-w-[1280px] mx-auto px-6 sm:px-12 pb-24">
          <div className="relative bg-[#252B42] rounded-[36px] px-10 sm:px-16 py-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 overflow-hidden">
            {/* Glow blobs */}
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#23A6F0] opacity-[0.12] blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#2DC071] opacity-[0.08] blur-[60px] rounded-full pointer-events-none" />

            <div className="relative z-10">
              <span
                style={{ fontFamily: "'DM Sans', sans-serif" }}
                className="inline-block px-4 py-1.5 bg-white/10 text-[#23A6F0] text-[11px] font-bold uppercase tracking-[0.28em] rounded-full mb-5"
              >
                Continue Exploring
              </span>
              <h3
                style={{ fontFamily: "'Sora', sans-serif" }}
                className="text-[28px] sm:text-[34px] font-extrabold text-white leading-tight tracking-tight"
              >
                Discover the latest<br />fashion collections
              </h3>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0 relative z-10">
              <Link
                href="/blog"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
                className="px-6 py-3 rounded-2xl border border-white/20 text-[13px] font-semibold text-white hover:bg-white/10 transition-colors whitespace-nowrap"
              >
                ← More Articles
              </Link>
              <Link
                href="/product"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
                className="px-6 py-3 rounded-2xl bg-[#23A6F0] text-[13px] font-semibold text-white hover:bg-[#2DC071] transition-colors whitespace-nowrap shadow-lg shadow-[#23A6F0]/20"
              >
                Shop Now →
              </Link>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}