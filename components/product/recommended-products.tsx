import ProductCard from "@/components/product/product-card";
import type { Product } from "@/types";

interface RecommendedProductsProps {
  recommendedProducts: Product[];
}

export default function RecommendedProducts({ recommendedProducts = [] }: RecommendedProductsProps) {
  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold mb-8">Recommended Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {recommendedProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}