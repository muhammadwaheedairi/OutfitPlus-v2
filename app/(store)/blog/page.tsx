import { getAllPosts } from "@/sanity/lib/client";
import BlogCard from "@/components/blog/blog-card";
import type { BlogPost } from "@/types";

export default async function BlogPage() {
  const posts: BlogPost[] = await getAllPosts().catch(() => []);

  return (
    <div className="bg-[#FAFAFA] min-h-screen">

      {/* ── Hero ──────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-[12px] font-bold uppercase tracking-[0.25em] text-[#23A6F0] mb-3">
            Our Blog
          </p>
          <h1 className="text-[36px] sm:text-[42px] font-bold text-[#252B42]">
            Latest Articles
          </h1>
          <p className="mt-3 text-[#737373] text-[15px] max-w-xl mx-auto">
            Stay up to date with the latest trends, tips, and style guides from our fashion experts.
          </p>
        </div>
      </div>

      {/* ── Posts Grid ────────────────────────────────── */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#737373] text-[15px]">No posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}