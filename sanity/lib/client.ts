import { createClient } from "next-sanity";
import { env } from "../env";

export const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION,
  useCdn: false,
});

// ─── PRODUCT FIELDS ───────────────────────────────────────────────────────────

const PRODUCT_FIELDS = `
  _id,
  name,
  "price": coalesce(price, 0),
  "discount": coalesce(discount, 0),
  description,
  category,
  "rating": coalesce(rating * 1, 0),
  "stock": coalesce(stock, 99),
  tags,
  image
`;

// ─── PRODUCT QUERIES ──────────────────────────────────────────────────────────

export async function getAllProducts() {
  return client.fetch(
    `*[_type == "product"] | order(_createdAt desc) { ${PRODUCT_FIELDS} }`
  );
}

export async function getProductById(id: string) {
  return client.fetch(
    `*[_type == "product" && _id == $id][0] { ${PRODUCT_FIELDS} }`,
    { id }
  );
}

export async function getProductsByCategory(category: string) {
  return client.fetch(
    `*[_type == "product" && category == $category] | order(_createdAt desc) { ${PRODUCT_FIELDS} }`,
    { category }
  );
}

export async function getFeaturedBannerProduct() {
  return client.fetch(
    `*[_type == "product" && "featured-banner" in tags][0] { ${PRODUCT_FIELDS} }`
  );
}

export async function getFeaturedBanner2Product() {
  return client.fetch(
    `*[_type == "product" && "featured-banner-2" in tags][0] { ${PRODUCT_FIELDS} }`
  );
}

export async function getFeaturedProducts() {
  const featured = await client.fetch(
    `*[_type == "product" && "featured" in tags] | order(_createdAt desc)[0...8] { ${PRODUCT_FIELDS} }`
  );
  if (featured && featured.length > 0) return featured;
  const [men, women, kids, acc] = await Promise.all([
    client.fetch(`*[_type == "product" && category == "Men's Wear"] | order(_createdAt desc)[0...2] { ${PRODUCT_FIELDS} }`),
    client.fetch(`*[_type == "product" && category == "Women's Wear"] | order(_createdAt desc)[0...2] { ${PRODUCT_FIELDS} }`),
    client.fetch(`*[_type == "product" && category == "Kid's Wear"] | order(_createdAt desc)[0...2] { ${PRODUCT_FIELDS} }`),
    client.fetch(`*[_type == "product" && category == "Accessories"] | order(_createdAt desc)[0...2] { ${PRODUCT_FIELDS} }`),
  ]);
  return [...(men ?? []), ...(women ?? []), ...(kids ?? []), ...(acc ?? [])];
}

export async function getEditorsPicks() {
  return client.fetch(
    `*[_type == "product" && "editors-pick" in tags] | order(_createdAt desc)[0...4] { ${PRODUCT_FIELDS} }`
  );
}

export async function getRecommendedProducts(currentId: string, category: string) {
  const result = await client.fetch(
    `*[_type == "product" && category == $category && _id != $currentId] | order(_createdAt desc)[0...4] { ${PRODUCT_FIELDS} }`,
    { currentId, category }
  );
  return result ?? [];
}

export async function searchProducts(query: string) {
  const searchTerm = `*${query}*`;
  return client.fetch(
    `*[_type == "product" && (name match $searchTerm || description match $searchTerm || category match $searchTerm)] { ${PRODUCT_FIELDS} }`,
    { searchTerm }
  );
}

// ─── BLOG QUERIES ─────────────────────────────────────────────────────────────

export async function getAllPosts() {
  return client.fetch(
    `*[_type == "post"] | order(_createdAt desc) {
      _id, title, slug, body, publishedAt, image,
      "excerpt": pt::text(body)[0...150]
    }`
  );
}

export async function getPostById(id: string) {
  return client.fetch(
    `*[_type == "post" && _id == $id][0] {
      _id, title, slug, body, publishedAt, image,
      "excerpt": pt::text(body)[0...200]
    }`,
    { id }
  );
}

export async function getFeaturedPosts() {
  return client.fetch(
    `*[_type == "post"] | order(_createdAt desc)[0...3] {
      _id, title, slug, publishedAt, image,
      "excerpt": pt::text(body)[0...120]
    }`
  );
}

// ─── REVIEWS — Neon DB se (API route ke zariye) ───────────────────────────────

export async function getReviews(productId: string): Promise<any[]> {
  try {
    const res = await fetch(`/api/reviews?productId=${productId}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}