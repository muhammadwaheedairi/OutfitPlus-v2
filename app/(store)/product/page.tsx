import type { Metadata } from "next";
import { getAllProducts } from "@/sanity/lib/client";
import ProductGrid from "@/components/product/product-grid";
import Filters from "@/components/shop/filters";
import SearchBar from "@/components/shop/search-bar";
import type { Product, SortOption } from "@/types";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse our full collection of fashion for men, women, and kids.",
};

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    q?: string;
    sort?: SortOption;
    minPrice?: string;
    maxPrice?: string;
    tag?: string | string[];
    page?: string;
  }>;
}

function filterAndSort(products: Product[], params: Awaited<ShopPageProps["searchParams"]>): Product[] {
  let result = [...products];
  if (params.category) result = result.filter((p) => p.category === params.category);
  if (params.q) {
    const q = params.q.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }
  if (params.minPrice) result = result.filter((p) => p.price >= Number(params.minPrice));
  if (params.maxPrice) result = result.filter((p) => p.price <= Number(params.maxPrice));
  if (params.tag) {
    const tags = Array.isArray(params.tag) ? params.tag : [params.tag];
    result = result.filter((p) => tags.some((t) => p.tags?.includes(t)));
  }
  switch (params.sort) {
    case "price-asc": result.sort((a, b) => a.price - b.price); break;
    case "price-desc": result.sort((a, b) => b.price - a.price); break;
    case "rating-desc": result.sort((a, b) => (Number(b.rating) ?? 0) - (Number(a.rating) ?? 0)); break;
    case "name-asc": result.sort((a, b) => a.name.localeCompare(b.name)); break;
  }
  return result;
}

const PER_PAGE = 12;

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const allProducts: Product[] = await getAllProducts();
  const filtered = filterAndSort(allProducts, params);
  const currentPage = Number(params.page ?? 1);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const buildPageUrl = (page: number) => {
    const p = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (k === "page") return;
      if (Array.isArray(v)) v.forEach((val) => p.append(k, val));
      else if (v) p.set(k, v);
    });
    if (page > 1) p.set("page", String(page));
    return `/product${p.toString() ? `?${p.toString()}` : ""}`;
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen">

      {/* ── Page Hero Banner ─────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-[12px] tracking-[0.3em] uppercase text-[#23A6F0] font-semibold mb-2">
            Our Collection
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <h1 className="text-[36px] sm:text-[42px] font-bold text-[#252B42] leading-tight">
              Shop All
            </h1>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-[13px] text-[#737373] pb-1">
              <a href="/" className="hover:text-[#252B42] transition-colors">Home</a>
              <span className="text-gray-300">/</span>
              <span className="text-[#252B42] font-medium">Shop</span>
            </nav>
          </div>
        </div>
      </div>

      {/* ── Main Content ─────────────────────────────────────────── */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 bg-white border border-gray-200 rounded-lg px-5 py-3">
          <p className="text-[14px] text-[#737373]">
            Showing{" "}
            <span className="font-semibold text-[#252B42]">
              {Math.min((currentPage - 1) * PER_PAGE + 1, filtered.length)}–{Math.min(currentPage * PER_PAGE, filtered.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-[#252B42]">{filtered.length}</span>{" "}
            products
          </p>
          <div className="w-full sm:w-64">
            <Suspense>
              <SearchBar />
            </Suspense>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* ── Sidebar ──────────────────────────────────────────── */}
          <div className="w-full lg:w-56 xl:w-60 flex-shrink-0">
            {/* Mobile collapsible */}
            <details className="lg:hidden mb-4 border border-gray-200 rounded-lg overflow-hidden bg-white">
              <summary className="px-4 py-3 text-[13px] font-semibold text-[#252B42] cursor-pointer tracking-widest uppercase select-none">
                ☰ Filters & Sort
              </summary>
              <div className="p-4 border-t border-gray-100">
                <Suspense><Filters /></Suspense>
              </div>
            </details>

            {/* Desktop sidebar */}
            <div className="hidden lg:block sticky top-20 bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
              <Suspense><Filters /></Suspense>
            </div>
          </div>

          {/* ── Products ─────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            <ProductGrid products={paged} />

            {/* ── Pagination ───────────────────────────────────── */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-1 flex-wrap">
                {/* Prev */}
                {currentPage > 1 ? (
                  <a
                    href={buildPageUrl(currentPage - 1)}
                    className="h-10 px-4 flex items-center text-[13px] font-medium text-[#737373] border border-gray-300 rounded-lg hover:border-[#252B42] hover:text-[#252B42] bg-white transition-all"
                  >
                    ← Prev
                  </a>
                ) : (
                  <span className="h-10 px-4 flex items-center text-[13px] font-medium text-gray-300 border border-gray-200 rounded-lg bg-white cursor-not-allowed">
                    ← Prev
                  </span>
                )}

                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  const isActive = page === currentPage;
                  // Show: first, last, current ±1, ellipsis
                  const show = page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
                  const showEllipsisBefore = page === currentPage - 2 && currentPage > 3;
                  const showEllipsisAfter = page === currentPage + 2 && currentPage < totalPages - 2;

                  if (showEllipsisBefore || showEllipsisAfter) {
                    return (
                      <span key={page} className="h-10 w-6 flex items-end justify-center text-[#737373] pb-1 text-lg tracking-tighter">
                        ...
                      </span>
                    );
                  }
                  if (!show) return null;

                  return (
                    <a
                      key={page}
                      href={buildPageUrl(page)}
                      className={`h-10 w-10 flex items-center justify-center text-[13px] font-semibold rounded-lg border transition-all ${
                        isActive
                          ? "bg-[#252B42] text-white border-[#252B42] shadow-sm"
                          : "bg-white text-[#737373] border-gray-300 hover:border-[#252B42] hover:text-[#252B42]"
                      }`}
                    >
                      {page}
                    </a>
                  );
                })}

                {/* Next */}
                {currentPage < totalPages ? (
                  <a
                    href={buildPageUrl(currentPage + 1)}
                    className="h-10 px-4 flex items-center text-[13px] font-medium text-[#737373] border border-gray-300 rounded-lg hover:border-[#252B42] hover:text-[#252B42] bg-white transition-all"
                  >
                    Next →
                  </a>
                ) : (
                  <span className="h-10 px-4 flex items-center text-[13px] font-medium text-gray-300 border border-gray-200 rounded-lg bg-white cursor-not-allowed">
                    Next →
                  </span>
                )}
              </div>
            )}

            {/* Page indicator */}
            {totalPages > 1 && (
              <p className="text-center text-[12px] text-[#737373] mt-3">
                Page {currentPage} of {totalPages}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}