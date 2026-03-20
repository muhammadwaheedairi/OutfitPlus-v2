import { pgTable, text, integer, timestamp, real, serial } from "drizzle-orm/pg-core";

// ─── ORDERS ───────────────────────────────────────────────────────────────────

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  email: text("email").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone"),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state"),
  zip: text("zip"),
  country: text("country").notNull().default("Pakistan"),
  shipping: text("shipping").notNull().default("standard"),
  subtotal: real("subtotal").notNull(),
  shippingCost: real("shipping_cost").notNull(),
  total: real("total").notNull(),
  status: text("status").notNull().default("pending"),
  stripeSessionId: text("stripe_session_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── ORDER ITEMS ──────────────────────────────────────────────────────────────

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: text("product_id").notNull(),
  name: text("name").notNull(),
  price: real("price").notNull(),
  quantity: integer("quantity").notNull(),
  image: text("image"),
});

// ─── WISHLIST ─────────────────────────────────────────────────────────────────

export const wishlist = pgTable("wishlist", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  productId: text("product_id").notNull(),
  name: text("name").notNull(),
  price: real("price").notNull(),
  image: text("image"),
  category: text("category"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── REVIEWS ──────────────────────────────────────────────────────────────────

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: text("product_id").notNull(),
  userId: text("user_id").notNull(),
  userName: text("user_name").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});