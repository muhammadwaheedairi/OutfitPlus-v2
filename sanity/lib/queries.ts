export const FEATURED_PRODUCTS_QUERY = `
  *[_type == "product"] | order(rating desc)[0...8] {
    _id, name, "imageUrl": image.asset->url,
    price, discount, category, rating, tags, stock
  }
`;

export const PAGINATED_PRODUCTS_QUERY = `
  {
    "products": *[_type == "product"
      ${`$categories`} != null && count($categories) > 0 ? [category in $categories] : []
      | order(_createdAt desc) [$start...$end] {
        _id, name, "imageUrl": image.asset->url,
        price, discount, category, rating, tags, stock
      },
    "total": count(*[_type == "product"])
  }
`;

export const PRODUCT_BY_ID_QUERY = `
  *[_type == "product" && _id == $id][0] {
    _id, name, "imageUrl": image.asset->url,
    price, discount, description, category, rating, tags, stock
  }
`;

export const RECOMMENDED_PRODUCTS_QUERY = `
  *[_type == "product" && _id != $id] | order(rating desc)[0...8] {
    _id, name, "imageUrl": image.asset->url,
    price, discount, category, rating, tags, stock
  }
`;

export const CATEGORIES_QUERY = `
  *[_type == "category"] { name } | order(name asc)
`;

export const REVIEWS_QUERY = `
  *[_type == "review" && productId == $productId] | order(createdAt desc) {
    _id, rating, comment, userName, createdAt
  }
`;
