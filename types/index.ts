export type { Product, CartItem } from "./product";

export interface BlogPost {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  body: unknown[];
  publishedAt: string;
  image: {
    asset: {
      _ref: string;
      _type: "reference";
    };
  };
  excerpt?: string;
}

export type Category = "All" | "Men's Wear" | "Women's Wear" | "Kid's Wear" | "Accessories";

export interface FilterState {
  category: Category;
  priceRange: [number, number];
  searchQuery: string;
  sortBy: SortOption;
}

export type SortOption =
  | "newest"
  | "price-asc"
  | "price-desc"
  | "rating-desc"
  | "name-asc";
