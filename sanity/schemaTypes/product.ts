import { defineField, defineType } from "sanity";

export const productType = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Product Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "price",
      title: "Price ($)",
      type: "number",
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: "discount",
      title: "Discount (%)",
      type: "number",
      validation: (Rule) => Rule.min(0).max(100),
      initialValue: 0,
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Men's Wear", value: "Men's Wear" },
          { title: "Women's Wear", value: "Women's Wear" },
          { title: "Kid's Wear", value: "Kid's Wear" },
          { title: "Accessories", value: "Accessories" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "rating",
      title: "Rating (0–5)",
      type: "number",
      validation: (Rule) => Rule.min(0).max(5),
      initialValue: 0,
    }),
    defineField({
      name: "stock",
      title: "Stock Quantity",
      type: "number",
      validation: (Rule) => Rule.required().integer().positive(),
      initialValue: 99,
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Featured", value: "featured" },
          { title: "Editors Pick", value: "editors-pick" },
          { title: "Featured Banner (Home #1)", value: "featured-banner" },
          { title: "Featured Banner (Home #2)", value: "featured-banner-2" },
          { title: "New Arrival", value: "new-arrival" },
          { title: "Sale", value: "sale" },
          { title: "Best Seller", value: "best-seller" },
        ],
        layout: "tags",
      },
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "image",
      subtitle: "category",
    },
  },
});