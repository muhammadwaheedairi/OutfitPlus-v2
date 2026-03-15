import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { formatDate } from "@/lib/utils";
import type { BlogPost } from "@/types";

export default function BlogCard({ post }: { post: BlogPost }) {
  const imageUrl = post.image
    ? urlFor(post.image).width(600).height(400).url()
    : null;

  return (
    <Link href={`/blog/${post._id}`} className="group block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">

      {/* Image */}
      <div className="relative overflow-hidden aspect-[3/2] bg-gray-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[11px] tracking-widest uppercase text-gray-400">No Image</span>
          </div>
        )}
        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500 bg-[#23A6F0]" />
      </div>

      {/* Content */}
      <div className="p-5">
        {post.publishedAt && (
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#23A6F0] font-semibold mb-2">
            {formatDate(post.publishedAt)}
          </p>
        )}

        <h3 className="text-[15px] font-bold leading-snug text-[#252B42] group-hover:text-[#2DC071] transition-colors line-clamp-2">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="text-[13px] text-[#737373] line-clamp-2 leading-relaxed mt-2">
            {post.excerpt}
          </p>
        )}

        <div className="flex items-center gap-2 mt-4 text-[11px] tracking-widest uppercase text-[#737373] font-semibold">
          <span>Read More</span>
          <span className="h-px w-6 bg-[#23A6F0] transition-all duration-300 group-hover:w-10" />
        </div>
      </div>
    </Link>
  );
}