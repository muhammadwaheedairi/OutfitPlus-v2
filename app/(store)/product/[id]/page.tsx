// import { notFound } from "next/navigation";
// import type { Metadata } from "next";
// import { getProductById, getAllProducts, getRecommendedProducts } from "@/sanity/lib/client";
// import ProductImages from "@/components/product/product-images";
// import ProductDetail from "@/components/product/product-detail";
// import RecommendedProducts from "@/components/product/recommended-products";
// import Reviews from "@/components/product/reviews";
// import type { Product } from "@/types";

// interface ProductPageProps {
//   params: Promise<{ id: string }>;
// }

// export async function generateStaticParams() {
//   const products: Product[] = await getAllProducts();
//   return products.map((p) => ({ id: p._id }));
// }

// export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
//   const { id } = await params;
//   const product: Product | null = await getProductById(id);
//   if (!product) return { title: "Product Not Found" };
//   return {
//     title: product.name,
//     description: product.description ?? `Shop ${product.name} at OutfitPlus`,
//     openGraph: {
//       title: product.name,
//       description: product.description,
//       type: "website",
//     },
//   };
// }

// export default async function ProductPage({ params }: ProductPageProps) {
//   const { id } = await params;
//   const product: Product | null = await getProductById(id);

//   if (!product) notFound();

//   const recommended: Product[] = await getRecommendedProducts(product._id, product.category);

//   return (
//     <div className="bg-white">
//       <div className="container py-12">
//         {/* Breadcrumb */}
//         <nav className="flex items-center gap-2 text-xs tracking-wider uppercase mb-10 text-gray-400">
//           <a href="/" className="hover:text-gray-900 transition-colors">Home</a>
//           <span>/</span>
//           <a href="/product" className="hover:text-gray-900 transition-colors">Shop</a>
//           <span>/</span>
//           <a
//             href={`/product?category=${encodeURIComponent(product.category)}`}
//             className="hover:text-gray-900 transition-colors"
//           >
//             {product.category}
//           </a>
//           <span>/</span>
//           <span className="text-gray-800 truncate max-w-[200px]">{product.name}</span>
//         </nav>

//         {/* Main Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
//           <div className="sticky top-24 self-start">
//             <ProductImages product={product} />
//           </div>
//           <ProductDetail product={product} />
//         </div>
//       </div>

//       {/* Reviews */}
//       <Reviews productId={product._id} />

//       {/* Recommended */}
//       <div className="container pb-16">
//         <RecommendedProducts recommendedProducts={recommended} />
//       </div>
//     </div>
//   );
// }
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductById, getRecommendedProducts } from "@/sanity/lib/client";
import ProductImages from "@/components/product/product-images";
import ProductDetail from "@/components/product/product-detail";
import ReviewsAndRatings from "@/components/product/reviews";
import RecommendedProducts from "@/components/product/recommended-products";
import type { Product } from "@/types";

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product: Product | null = await getProductById(id);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.description ?? `Shop ${product.name} at OutfitPlus`,
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product: Product | null = await getProductById(id);
  if (!product) notFound();

  const recommended: Product[] = await getRecommendedProducts(product._id, product.category);

  return (
    <div className="bg-[#FAFAFA] min-h-screen">

      {/* ── Breadcrumb ─────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-[13px] text-[#737373]">
            <Link href="/" className="hover:text-[#252B42] transition-colors">Home</Link>
            <span className="text-gray-300">/</span>
            <Link href="/product" className="hover:text-[#252B42] transition-colors">Shop</Link>
            <span className="text-gray-300">/</span>
            <Link
              href={`/product?category=${encodeURIComponent(product.category)}`}
              className="hover:text-[#252B42] transition-colors"
            >
              {product.category}
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-[#252B42] font-medium truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* ── Product Main ───────────────────────────────────────── */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
            {/* Image */}
            <div className="sticky top-24 self-start">
              <ProductImages product={product} />
            </div>
            {/* Detail */}
            <ProductDetail product={product} />
          </div>
        </div>

        {/* ── Reviews ──────────────────────────────────────────── */}
        <div className="mt-8">
          <h2 className="text-[24px] font-bold text-[#252B42] mb-5">Customer Reviews</h2>
          <ReviewsAndRatings productId={product._id} />
        </div>

        {/* ── Recommended ──────────────────────────────────────── */}
        {recommended.length > 0 && (
          <div className="mt-10 pb-6">
            <RecommendedProducts recommendedProducts={recommended} />
          </div>
        )}
      </div>
    </div>
  );
}