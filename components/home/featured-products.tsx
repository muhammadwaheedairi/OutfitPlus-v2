import ProductCard from "@/components/product/product-card";
import { getFeaturedProducts } from "@/sanity/lib/client";
import type { Product } from "@/types";

const FeaturedProducts = async () => {
  const featuredProducts: Product[] = await getFeaturedProducts();

  return (
    <div className="flex flex-col items-center justify-center text-center mt-5 mb-7 overflow-x-hidden">
      <h2 className="text-2xl font-bold mb-4">Featured Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6 w-full max-w-6xl mx-auto px-4">
        {featuredProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;