import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { FiPackage, FiDollarSign, FiShoppingBag, FiTruck, FiCheck } from "react-icons/fi";
import AdminOrderRow from "@/components/admin/admin-order-row";

const ADMIN_USER_ID = process.env.ADMIN_USER_ID!;

function formatPrice(n: number) {
  return `$${Number(n).toFixed(2)}`;
}

export default async function AdminPage() {
  const { userId } = await auth();
  if (!userId || userId !== ADMIN_USER_ID) redirect("/");

  const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));

  const totalRevenue = allOrders.reduce((s, o) => s + Number(o.total), 0);
  const pendingCount = allOrders.filter((o) => o.status === "pending").length;
  const shippedCount = allOrders.filter((o) => o.status === "shipped").length;
  const deliveredCount = allOrders.filter((o) => o.status === "delivered").length;

  const stats = [
    { label: "Total Revenue", value: formatPrice(totalRevenue), icon: FiDollarSign, color: "text-[#2DC071] bg-[#2DC071]/10" },
    { label: "Total Orders", value: String(allOrders.length), icon: FiShoppingBag, color: "text-[#23A6F0] bg-[#23A6F0]/10" },
    { label: "Pending", value: String(pendingCount), icon: FiPackage, color: "text-yellow-500 bg-yellow-50" },
    { label: "Delivered", value: String(deliveredCount), icon: FiCheck, color: "text-[#2DC071] bg-green-50" },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">

      {/* Header */}
      <div className="bg-[#252B42]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#2DC071] mb-1">Admin Panel</p>
              <h1 className="text-[22px] sm:text-[28px] font-bold text-white">OutfitPlus Dashboard</h1>
            </div>
            <Link href="/"
              className="flex-shrink-0 text-[12px] sm:text-[13px] text-gray-300 hover:text-white transition-colors border border-white/20 px-3 sm:px-4 py-2 rounded-lg hover:bg-white/10">
              ← Store
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#737373] leading-tight">{label}</p>
                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                  <Icon size={15} />
                </div>
              </div>
              <p className="text-[24px] sm:text-[28px] font-bold text-[#252B42]">{value}</p>
            </div>
          ))}
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-[15px] sm:text-[16px] font-bold text-[#252B42]">All Orders</h2>
            <span className="text-[12px] text-[#737373] bg-gray-100 px-2.5 py-1 rounded-full font-semibold">
              {allOrders.length} total
            </span>
          </div>

          {allOrders.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <FiShoppingBag size={24} className="text-gray-300" />
              </div>
              <p className="text-[14px] font-semibold text-[#252B42] mb-1">No orders yet</p>
              <p className="text-[13px] text-[#737373]">Orders will appear here once customers start buying.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      {["Order", "Customer", "Date", "Total", "Status", "Update"].map((h) => (
                        <th key={h} className="text-left px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-[#737373]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {allOrders.map((order) => (
                      <AdminOrderRow key={order.id} order={order} />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-gray-100">
                {allOrders.map((order) => (
                  <AdminOrderRow key={order.id} order={order} mobile />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}