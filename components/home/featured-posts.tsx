import Image from "next/image";
import Link from "next/link";
import { FiClock } from "react-icons/fi";
import { getFeaturedPosts } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

export default async function FeaturedPosts() {
  const posts = await getFeaturedPosts().catch(() => []);

  if (!posts || posts.length === 0) return null;

  return (
    <section className="bg-[#FAFAFA] py-16" id="blog">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-[#23A6F0]">
            Trending Articles
          </p>
          <h2 className="text-3xl font-black text-[#252B42]">Featured Posts</h2>
          <p className="mt-3 text-[#737373] text-[14px] max-w-xl mx-auto">
            Stay up to date with the latest trends and tips in fashion, accessories, and more for Men, Women, and Kids.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: any) => {
            const imageUrl = post.image
              ? urlFor(post.image).width(600).height(400).url()
              : "/post1.png";

            const date = post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                  day: "numeric", month: "long", year: "numeric",
                })
              : "";

            return (
              <Link
                key={post._id}
                href={`/blog/${post._id}`}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 hover:shadow-md transition"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <span className="absolute left-3 top-3 z-10 rounded-full bg-[#E74040] px-2.5 py-0.5 text-xs font-bold text-white">
                    NEW
                  </span>
                  <Image
                    src={imageUrl}
                    alt={post.title}
                    fill
                    sizes="(max-width:768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="line-clamp-2 text-base font-black text-[#252B42] group-hover:text-[#2DC071] transition">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="mt-2 line-clamp-2 text-sm text-[#737373]">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="mt-4 flex items-center justify-between text-xs text-[#737373]">
                    {date && (
                      <span className="flex items-center gap-1">
                        <FiClock size={11} />
                        {date}
                      </span>
                    )}
                    <span className="text-[#23A6F0] font-semibold group-hover:underline">
                      Learn More →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/blog"
            className="inline-block border border-[#252B42] text-[#252B42] px-8 py-3 rounded-lg text-[14px] font-semibold hover:bg-[#252B42] hover:text-white transition"
          >
            View All Posts
          </Link>
        </div>
      </div>
    </section>
  );
}