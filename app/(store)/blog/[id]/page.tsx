import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPostById } from "@/sanity/lib/client";
import BlogDetail from "@/components/blog/blog-detail";
import type { BlogPost } from "@/types";

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post: BlogPost | null = await getPostById(id);
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.title,
    description: post.excerpt ?? `Read ${post.title} on OutfitPlus Blog`,
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { id } = await params;
  const post: BlogPost | null = await getPostById(id);
  if (!post) notFound();
  return <BlogDetail post={post} />;
}