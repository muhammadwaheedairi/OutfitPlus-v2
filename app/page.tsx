import HeaderNav from "@/components/layout/header-nav";
import Footer from "@/components/layout/footer";
import Hero from "@/components/home/hero";
import EditorsPicks from "@/components/home/editors-picks";
import FeaturedProducts from "@/components/home/featured-products";
import FeaturedBanner from "@/components/home/product-banner-wrapper";
import FeaturedBanner2 from "@/components/home/product-banner-2-wrapper";
import FeaturedPosts from "@/components/home/featured-posts";

export default function Home() {
  return (
    <>
      <HeaderNav />
      <Hero />
      <EditorsPicks />
      <FeaturedProducts />
      <FeaturedBanner />
      <FeaturedBanner2 />
      <FeaturedPosts />
      <Footer />
    </>
  );
}