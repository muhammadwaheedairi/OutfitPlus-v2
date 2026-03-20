"use client";

import { useState } from "react";
import { FiClock, FiTruck, FiCheck, FiX } from "react-icons/fi";

const STATUS_OPTIONS = ["pending", "shipped", "delivered", "cancelled"];

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  pending:   { label: "Pending",   color: "bg-yellow-50 text-yellow-600 border-yellow-200", icon: FiClock },
  shipped:   { label: "Shipped",   color: "bg-blue-50 text-blue-600 border-blue-200",       icon: FiTruck },
  delivered: { label: "Delivered", color: "bg-green-50 text-[#2DC071] border-green-200",    icon: FiCheck },
  cancelled: { label: "Cancelled", color: "bg-red-50 text-red-500 border-red-200",          icon: FiX },
};

export default function AdminOrderRow({ order, mobile = false }: { order: any; mobile?: boolean }) {
  const [status, setStatus] = useState(order.status);
  const [loading, setLoading] = useState(false);

  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  const StatusIcon = config.icon;

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id, status: newStatus }),
      });
      if (res.ok) setStatus(newStatus);
    } catch {}
    setLoading(false);
  };

  const dateStr = new Date(order.createdAt).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

  // Mobile card view
  if (mobile) {
    return (
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[14px] font-bold text-[#252B42]">#{order.id}</p>
            <p className="text-[12px] text-[#737373]">{dateStr}</p>
          </div>
          <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-bold flex-shrink-0 ${config.color}`}>
            <StatusIcon size={10} />
            {config.label}
          </span>
        </div>
        <div>
          <p className="text-[13px] font-semibold text-[#252B42]">{order.firstName} {order.lastName}</p>
          <p className="text-[12px] text-[#737373]">{order.email}</p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <p className="text-[15px] font-bold text-[#252B42]">${Number(order.total).toFixed(2)}</p>
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={loading}
            className="text-[12px] border border-gray-200 rounded-lg px-3 py-2 bg-white outline-none focus:border-[#252B42] transition-colors disabled:opacity-50 cursor-pointer"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  // Desktop table row
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <p className="text-[14px] font-bold text-[#252B42]">#{order.id}</p>
      </td>
      <td className="px-6 py-4">
        <p className="text-[14px] font-semibold text-[#252B42]">{order.firstName} {order.lastName}</p>
        <p className="text-[12px] text-[#737373]">{order.email}</p>
      </td>
      <td className="px-6 py-4">
        <p className="text-[13px] text-[#737373]">{dateStr}</p>
      </td>
      <td className="px-6 py-4">
        <p className="text-[14px] font-bold text-[#252B42]">${Number(order.total).toFixed(2)}</p>
      </td>
      <td className="px-6 py-4">
        <span className={`flex items-center gap-1.5 w-fit px-3 py-1.5 rounded-full border text-[12px] font-bold ${config.color}`}>
          <StatusIcon size={11} />
          {config.label}
        </span>
      </td>
      <td className="px-6 py-4">
        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          disabled={loading}
          className="text-[13px] border border-gray-200 rounded-lg px-3 py-2 bg-white outline-none focus:border-[#252B42] transition-colors disabled:opacity-50 cursor-pointer"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </td>
    </tr>
  );
}