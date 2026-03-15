export interface Product {
  _id: string;
  name: string;
  image: {
    asset: {
      _ref: string;
      _type: "reference";
    };
    hotspot?: {
      x: number;
      y: number;
      height: number;
      width: number;
    };
  };
  price: number;
  discount: number;
  description: string;
  category: "Men's Wear" | "Women's Wear" | "Kid's Wear" | "Accessories";
  rating: number;
  stock: number;
  tags: string[];
}

export interface CartItem extends Product {
  quantity: number;
}
