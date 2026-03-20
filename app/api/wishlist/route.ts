import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { wishlist } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

// GET — fetch user wishlist
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const items = await db.select().from(wishlist).where(eq(wishlist.userId, userId));
  return NextResponse.json(items);
}

// POST — add to wishlist
export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { productId, name, price, image, category } = body;

  // Check if already exists
  const existing = await db.select().from(wishlist).where(
    and(eq(wishlist.userId, userId), eq(wishlist.productId, productId))
  );
  if (existing.length > 0) return NextResponse.json({ message: "Already in wishlist" });

  await db.insert(wishlist).values({ userId, productId, name, price, image, category });
  return NextResponse.json({ success: true });
}

// DELETE — remove from wishlist
export async function DELETE(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId } = await req.json();
  await db.delete(wishlist).where(
    and(eq(wishlist.userId, userId), eq(wishlist.productId, productId))
  );
  return NextResponse.json({ success: true });
}