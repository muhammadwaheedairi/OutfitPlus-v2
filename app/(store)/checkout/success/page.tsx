import Link from "next/link";
import { FiCheck, FiPackage } from "react-icons/fi";
import Stripe from "stripe";
import { Resend } from "resend";
import { db } from "@/lib/db";
import { orders, orderItems } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { OrderConfirmationEmail } from "@/lib/email/order-email";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const resend = new Resend(process.env.RESEND_API_KEY!);

async function saveOrder(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") return null;

    // Check duplicate
    const existing = await db.select().from(orders)
      .where(eq(orders.stripeSessionId, sessionId))
      .limit(1);
    if (existing.length > 0) return existing[0];

    const meta = session.metadata!;
    const items = JSON.parse(meta.items ?? "[]");
    const shippingCost = parseFloat(meta.shippingCost ?? "0");
    const subtotal = parseFloat(meta.subtotal ?? "0");
    const total = subtotal + shippingCost;

    const [order] = await db.insert(orders).values({
      userId: meta.userId,
      email: session.customer_email ?? "",
      firstName: meta.firstName,
      lastName: meta.lastName,
      phone: meta.phone ?? "",
      address: meta.address,
      city: meta.city,
      state: meta.state ?? "",
      zip: meta.zip ?? "",
      country: meta.country,
      shipping: meta.shipping,
      subtotal,
      shippingCost,
      total,
      status: "pending",
      stripeSessionId: sessionId,
    }).returning();

    if (items.length > 0) {
      await db.insert(orderItems).values(
        items.map((item: any) => ({
          orderId: order.id,
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image ?? "",
        }))
      );
    }

    // Send confirmation email to owner only (free tier limitation)
    try {
      const emailResult = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: "wm0297567@gmail.com",
        subject: `New Order #${order.id} — $${total.toFixed(2)} from ${meta.firstName}`,
        react: OrderConfirmationEmail({
          firstName: meta.firstName,
          orderId: order.id,
          items,
          subtotal,
          shippingCost,
          total,
          address: meta.address,
          city: meta.city,
          country: meta.country,
        }),
      });
      console.log("Email result:", emailResult);
    } catch (emailErr) {
      console.error("Email send error:", emailErr);
    }

    return order;
  } catch (err) {
    console.error("saveOrder error:", err);
    return null;
  }
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const order = session_id ? await saveOrder(session_id) : null;

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 max-w-md w-full text-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#2DC071]/10 flex items-center justify-center mx-auto mb-6">
          <FiCheck size={36} className="text-[#2DC071]" strokeWidth={2.5} />
        </div>
        <h1 className="text-[26px] sm:text-[32px] font-bold text-[#252B42] mb-3">
          Order Confirmed!
        </h1>
        <p className="text-[14px] sm:text-[15px] text-[#737373] mb-2 leading-relaxed">
          Thank you for your purchase. Your order has been placed successfully.
        </p>

        {order && (
          <div className="flex items-center justify-center gap-2 bg-gray-50 rounded-xl px-4 py-3 mb-8">
            <FiPackage size={15} className="text-[#252B42]" />
            <p className="text-[13px] font-bold text-[#252B42]">
              Order #{order.id} · <span className="text-[#2DC071] capitalize">{order.status}</span>
            </p>
          </div>
        )}

        {!order && <div className="mb-8" />}

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/orders"
            className="flex-1 py-3.5 bg-[#252B42] text-white text-[12px] sm:text-[13px] font-bold uppercase tracking-widest rounded-xl hover:bg-[#2DC071] transition-colors text-center">
            View My Orders
          </Link>
          <Link href="/product"
            className="flex-1 py-3.5 border border-gray-200 text-[#737373] text-[12px] sm:text-[13px] font-bold uppercase tracking-widest rounded-xl hover:border-[#252B42] hover:text-[#252B42] transition-colors text-center">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}