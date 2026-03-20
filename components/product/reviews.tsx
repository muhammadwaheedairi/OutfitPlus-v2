"use client";

import { useState, useEffect } from "react";
import { getReviews } from "@/sanity/lib/client";
import { useUser } from "@clerk/nextjs";
import { FiStar, FiUser } from "react-icons/fi";

interface Review {
  _id: string;
  rating: number;
  comment: string;
  userName: string;
  createdAt: string;
}

export default function ReviewsAndRatings({ productId }: { productId: string }) {
  const { user, isLoaded } = useUser();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [hover, setHover] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchReviews() {
      const fetched = await getReviews(productId);
      setReviews(fetched);
      const avg = fetched.length
        ? fetched.reduce((a: number, r: Review) => a + r.rating, 0) / fetched.length
        : 0;
      setAverageRating(avg);
    }
    fetchReviews();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { setError("Please sign in to submit a review."); return; }
    if (!newReview.rating) { setError("Please select a star rating."); return; }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          rating: newReview.rating,
          comment: newReview.comment,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      const submitted: Review = {
        _id: data.id?.toString() ?? Date.now().toString(),
        rating: newReview.rating,
        comment: newReview.comment,
        userName: user.fullName ?? user.emailAddresses[0]?.emailAddress ?? "Anonymous",
        createdAt: new Date().toISOString(),
      };

      setReviews([submitted, ...reviews]);
      const newAvg = (averageRating * reviews.length + submitted.rating) / (reviews.length + 1);
      setAverageRating(newAvg);
      setNewReview({ rating: 0, comment: "" });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* ── Left: Rating Summary + Review Form ─────────────── */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">

        {/* Rating Summary */}
        <div className="flex items-center gap-5 pb-5 border-b border-gray-100">
          <div className="text-center">
            <p className="text-[48px] font-bold text-[#252B42] leading-none">
              {averageRating.toFixed(1)}
            </p>
            <div className="flex gap-0.5 mt-1 justify-center">
              {[1, 2, 3, 4, 5].map((s) => (
                <FiStar key={s} size={14}
                  className={s <= Math.round(averageRating) ? "fill-[#F3CD03] text-[#F3CD03]" : "text-gray-200"}
                />
              ))}
            </div>
            <p className="text-[12px] text-[#737373] mt-1">{reviews.length} reviews</p>
          </div>
          <div className="flex-1 space-y-1.5">
            {[5, 4, 3, 2, 1].map((s) => {
              const count = reviews.filter((r) => r.rating === s).length;
              const pct = reviews.length ? (count / reviews.length) * 100 : 0;
              return (
                <div key={s} className="flex items-center gap-2">
                  <span className="text-[11px] text-[#737373] w-3">{s}</span>
                  <FiStar size={9} className="fill-[#F3CD03] text-[#F3CD03]" />
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#F3CD03] rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-[11px] text-[#737373] w-4">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Write Review Form */}
        <div>
          <h3 className="text-[16px] font-bold text-[#252B42] mb-4">Write a Review</h3>

          {/* Not logged in state */}
          {isLoaded && !user ? (
            <div className="text-center py-6 border border-dashed border-gray-200 rounded-xl">
              <p className="text-[14px] text-[#737373] mb-3">Sign in to write a review</p>
              <button
                onClick={() => window.location.href = "/sign-in"}
                className="px-6 py-2.5 bg-[#252B42] text-white text-[13px] font-bold rounded-lg hover:bg-[#2DC071] transition-colors"
              >
                Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Logged in user */}
              {user && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-[#252B42] flex items-center justify-center flex-shrink-0">
                    <FiUser size={13} className="text-white" />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-[#252B42]">
                      {user.fullName ?? user.emailAddresses[0]?.emailAddress}
                    </p>
                    <p className="text-[11px] text-[#737373]">Posting as you</p>
                  </div>
                </div>
              )}

              {/* Star Rating */}
              <div>
                <label className="block text-[12px] font-semibold text-[#737373] uppercase tracking-wider mb-2">
                  Your Rating *
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} type="button"
                      onMouseEnter={() => setHover(s)}
                      onMouseLeave={() => setHover(0)}
                      onClick={() => setNewReview((p) => ({ ...p, rating: s }))}
                    >
                      <FiStar size={26} className={`transition-colors ${
                        s <= (hover || newReview.rating) ? "fill-[#F3CD03] text-[#F3CD03]" : "text-gray-200"
                      }`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-[12px] font-semibold text-[#737373] uppercase tracking-wider mb-1.5">
                  Your Review *
                </label>
                <textarea required rows={3}
                  placeholder="Share your experience..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview((p) => ({ ...p, comment: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-[14px] text-[#252B42] placeholder:text-gray-300 focus:outline-none focus:border-[#252B42] transition-colors resize-none"
                />
              </div>

              {error && <p className="text-[13px] text-[#E74040]">{error}</p>}
              {success && <p className="text-[13px] text-[#2DC071] font-semibold">✓ Review submitted!</p>}

              <button type="submit" disabled={isSubmitting}
                className="w-full bg-[#252B42] text-white py-3 rounded-lg text-[14px] font-semibold hover:bg-[#2DC071] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* ── Right: Reviews List ─────────────────────────────── */}
      <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
        {reviews.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <FiStar size={32} className="text-gray-200 mx-auto mb-3" />
            <p className="text-[14px] font-semibold text-[#252B42]">No reviews yet</p>
            <p className="text-[13px] text-[#737373] mt-1">Be the first to review this product</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#252B42] flex items-center justify-center flex-shrink-0">
                    <FiUser size={13} className="text-white" />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-[#252B42]">{review.userName}</p>
                    <p className="text-[11px] text-[#737373]">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric", month: "short", day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex gap-0.5 flex-shrink-0">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <FiStar key={s} size={12}
                      className={s <= review.rating ? "fill-[#F3CD03] text-[#F3CD03]" : "text-gray-200"}
                    />
                  ))}
                </div>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-[#737373]">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}