"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

const CATEGORIES = ["Men's Wear", "Women's Wear", "Kid's Wear", "Accessories"];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating-desc", label: "Highest Rated" },
  { value: "name-asc", label: "Name: A–Z" },
];

export default function Filters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") ?? "newest";
  const currentCategory = searchParams.get("category") ?? "";

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v === null) params.delete(k);
        else params.set(k, v);
      });
      params.delete("page");
      router.replace(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const clearAll = useCallback(() => router.replace(pathname), [router, pathname]);
  const hasFilters = searchParams.toString().length > 0;

  return (
    <aside className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-6">
        <h3 className="text-[12px] tracking-[0.25em] uppercase font-semibold text-[#252B42]">
          Filters
        </h3>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-[11px] tracking-widest uppercase text-[#737373] hover:text-[#252B42] underline transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-7">
        {/* ── Sort ─────────────────────────────────── */}
        <div>
          <p className="text-[11px] tracking-widest uppercase text-[#737373] mb-3 font-medium">
            Sort By
          </p>
          <select
            value={currentSort}
            onChange={(e) => updateParams({ sort: e.target.value === "newest" ? null : e.target.value })}
            className="w-full py-2.5 px-3 text-[14px] border border-gray-200 bg-white outline-none cursor-pointer rounded text-[#252B42] hover:border-gray-400 transition-colors"
          >
            {SORT_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        {/* ── Category ──────────────────────────────── */}
        <div>
          <p className="text-[11px] tracking-widest uppercase text-[#737373] mb-3 font-medium">
            Category
          </p>
          <div className="space-y-1">
            {/* All button */}
            <button
              onClick={() => updateParams({ category: null })}
              className={`w-full text-left px-3 py-2 rounded text-[14px] transition-colors ${
                !currentCategory
                  ? "bg-[#252B42] text-white font-semibold"
                  : "text-[#737373] hover:bg-gray-100 hover:text-[#252B42]"
              }`}
            >
              All Products
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => updateParams({ category: currentCategory === cat ? null : cat })}
                className={`w-full text-left px-3 py-2 rounded text-[14px] transition-colors ${
                  currentCategory === cat
                    ? "bg-[#252B42] text-white font-semibold"
                    : "text-[#737373] hover:bg-gray-100 hover:text-[#252B42]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── Price Range ───────────────────────────── */}
        <div>
          <p className="text-[11px] tracking-widest uppercase text-[#737373] mb-3 font-medium">
            Price Range
          </p>
          <PriceFilter searchParams={searchParams} updateParams={updateParams} />
        </div>


      </div>
    </aside>
  );
}

// ── Inline Price Filter ────────────────────────────────────────────────────────

import { useState } from "react";

function PriceFilter({
  searchParams,
  updateParams,
}: {
  searchParams: URLSearchParams;
  updateParams: (u: Record<string, string | null>) => void;
}) {
  const [min, setMin] = useState(Number(searchParams.get("minPrice") ?? 0));
  const [max, setMax] = useState(Number(searchParams.get("maxPrice") ?? 1000));

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-[13px] text-[#252B42] font-medium">
        <span>${min}</span>
        <span>${max}</span>
      </div>
      <div className="space-y-2">
        <input
          type="range"
          min={0} max={1000} step={10}
          value={min}
          onChange={(e) => {
            const val = Math.min(Number(e.target.value), max - 10);
            setMin(val);
            updateParams({ minPrice: val === 0 ? null : String(val) });
          }}
          className="w-full h-1 accent-[#252B42] cursor-pointer"
        />
        <input
          type="range"
          min={0} max={1000} step={10}
          value={max}
          onChange={(e) => {
            const val = Math.max(Number(e.target.value), min + 10);
            setMax(val);
            updateParams({ maxPrice: val === 1000 ? null : String(val) });
          }}
          className="w-full h-1 accent-[#252B42] cursor-pointer"
        />
      </div>
    </div>
  );
}