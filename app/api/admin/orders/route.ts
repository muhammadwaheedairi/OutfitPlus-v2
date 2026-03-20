import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const ADMIN_USER_ID = process.env.ADMIN_USER_ID!;

export async function PATCH(req: Request) {
  const { userId } = await auth();
  if (!userId || userId !== ADMIN_USER_ID) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId, status } = await req.json();
  await db.update(orders).set({ status }).where(eq(orders.id, orderId));
  return NextResponse.json({ success: true });
}