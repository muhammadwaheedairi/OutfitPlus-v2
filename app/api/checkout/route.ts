import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { items, form, shippingCost } = await req.json();

  const lineItems = items.map((item: any) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.name,
        images: item.imageUrl ? [item.imageUrl] : [],
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }));

  // Add shipping as line item if applicable
  if (shippingCost > 0) {
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: { name: `Shipping (${form.shipping === "express" ? "Express" : "Standard"})` },
        unit_amount: Math.round(shippingCost * 100),
      },
      quantity: 1,
    });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    customer_email: form.email,
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
    metadata: {
      userId,
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone ?? "",
      address: form.address,
      city: form.city,
      state: form.state ?? "",
      zip: form.zip ?? "",
      country: form.country,
      shipping: form.shipping,
      subtotal: String(items.reduce((s: number, i: any) => s + i.price * i.quantity, 0).toFixed(2)),
      shippingCost: String(shippingCost),
      items: JSON.stringify(items.map((i: any) => ({
        productId: i._id,
        name: i.name.substring(0, 30),
        price: i.price,
        quantity: i.quantity,
      }))),
    },
  });

  return NextResponse.json({ url: session.url });
}