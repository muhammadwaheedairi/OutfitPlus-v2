import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { reviews } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

// GET — fetch reviews for a product (public)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });

  const result = await db
    .select()
    .from(reviews)
    .where(eq(reviews.productId, productId))
    .orderBy(desc(reviews.createdAt));

  const formatted = result.map((r) => ({
    _id: r.id.toString(),
    rating: r.rating,
    comment: r.comment,
    userName: r.userName,
    createdAt: r.createdAt.toISOString(),
  }));

  return NextResponse.json(formatted);
}

// POST — submit review (login required)
export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await currentUser();
  const userName = user?.fullName ?? user?.emailAddresses[0]?.emailAddress ?? "Anonymous";

  const { productId, rating, comment } = await req.json();
  if (!productId || !rating || !comment) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const [inserted] = await db.insert(reviews).values({
    productId,
    userId,
    userName,
    rating,
    comment,
  }).returning({ id: reviews.id });

  return NextResponse.json({ success: true, id: inserted.id });
}