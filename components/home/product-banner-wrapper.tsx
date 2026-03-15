import { getFeaturedBannerProduct } from "@/sanity/lib/client";
import ProductBanner from "@/components/home/product-banner";

export default async function FeaturedBanner() {
  const product = await getFeaturedBannerProduct().catch(() => null);
  if (!product) return null;
  return <ProductBanner product={product} />;
}