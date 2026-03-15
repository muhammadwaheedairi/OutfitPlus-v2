import { getFeaturedBanner2Product } from "@/sanity/lib/client";
import ProductBanner2 from "@/components/home/product-banner-2";

export default async function FeaturedBanner2() {
  const product = await getFeaturedBanner2Product().catch(() => null);
  if (!product) return null;
  return <ProductBanner2 product={product} />;
}