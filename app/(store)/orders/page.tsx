import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { orders, orderItems } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { FiPackage, FiShoppingBag, FiClock, FiTruck, FiCheck, FiX, FiMapPin } from "react-icons/fi";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  pending:   { label: "Pending",   color: "bg-yellow-50 text-yellow-600 border-yellow-200", icon: FiClock },
  shipped:   { label: "Shipped",   color: "bg-blue-50 text-blue-600 border-blue-200",       icon: FiTruck },
  delivered: { label: "Delivered", color: "bg-green-50 text-[#2DC071] border-green-200",    icon: FiCheck },
  cancelled: { label: "Cancelled", color: "bg-red-50 text-red-500 border-red-200",          icon: FiX },
};

function formatPrice(n: number) {
  return `$${Number(n).toFixed(2)}`;
}

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default async function OrdersPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const userOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt));

  const ordersWithItems = await Promise.all(
    userOrders.map(async (order) => {
      const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
      return { ...order, items };
    })
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA]">

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#23A6F0] mb-2">My Account</p>
          <div className="flex items-center justify-between">
            <h1 className="text-[26px] sm:text-[32px] font-bold text-[#252B42]">My Orders</h1>
            {ordersWithItems.length > 0 && (
              <span className="text-[12px] sm:text-[13px] text-[#737373] bg-gray-100 px-3 py-1.5 rounded-full font-semibold">
                {ordersWithItems.length} order{ordersWithItems.length > 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

        {/* Empty State */}
        {ordersWithItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 sm:py-24 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
              <FiShoppingBag size={30} className="text-gray-300" />
            </div>
            <h3 className="text-[20px] sm:text-[22px] font-bold text-[#252B42] mb-2">No orders yet</h3>
            <p className="text-[14px] text-[#737373] mb-8 max-w-xs leading-relaxed">
              Start shopping and your orders will appear here.
            </p>
            <Link href="/product"
              className="px-8 py-3 bg-[#252B42] text-white text-[13px] font-bold rounded-xl hover:bg-[#2DC071] transition-colors">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {ordersWithItems.map((order) => {
              const status = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
              const StatusIcon = status.icon;
              return (
                <div key={order.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">

                  {/* Order Header */}
                  <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center flex-shrink-0">
                          <FiPackage size={15} className="text-[#252B42]" />
                        </div>
                        <div>
                          <p className="text-[14px] sm:text-[15px] font-bold text-[#252B42]">Order #{order.id}</p>
                          <p className="text-[11px] sm:text-[12px] text-[#737373]">{formatDate(order.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border text-[11px] sm:text-[12px] font-bold ${status.color}`}>
                          <StatusIcon size={11} />
                          {status.label}
                        </span>
                        <span className="text-[15px] sm:text-[16px] font-bold text-[#252B42]">{formatPrice(order.total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="px-4 sm:px-6 py-4 space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                          {item.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FiPackage size={14} className="text-gray-300" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-[#252B42] truncate">{item.name}</p>
                          <p className="text-[12px] text-[#737373]">{formatPrice(item.price)} × {item.quantity}</p>
                        </div>
                        <p className="text-[13px] sm:text-[14px] font-bold text-[#252B42] flex-shrink-0">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="px-4 sm:px-6 py-3 bg-gray-50 border-t border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-[12px] text-[#737373]">
                        <FiMapPin size={11} className="flex-shrink-0" />
                        <span className="truncate">{order.address}, {order.city}, {order.country}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[12px] text-[#737373]">
                        <span>Subtotal: <span className="font-semibold text-[#252B42]">{formatPrice(order.subtotal)}</span></span>
                        <span>·</span>
                        <span>Shipping: <span className={`font-semibold ${Number(order.shippingCost) === 0 ? "text-[#2DC071]" : "text-[#252B42]"}`}>
                          {Number(order.shippingCost) === 0 ? "Free" : formatPrice(order.shippingCost)}
                        </span></span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="pt-4 flex justify-between items-center border-t border-gray-200 mt-2">
              <Link href="/product"
                className="text-[13px] font-semibold text-[#252B42] hover:text-[#23A6F0] transition-colors">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}