"use client";

import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { formatPrice, calcDiscountedPrice } from "@/lib/utils";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import { FiCheck, FiLock, FiShoppingBag, FiChevronDown, FiArrowRight } from "react-icons/fi";

type Step = "info" | "shipping" | "review";
const STEPS: { id: Step; label: string }[] = [
  { id: "info", label: "Contact" },
  { id: "shipping", label: "Shipping" },
  { id: "review", label: "Review" },
];

export default function CheckoutForm() {
  const { items, getCartTotal } = useCart();
  const [step, setStep] = useState<Step>("info");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [form, setForm] = useState({
    email: "", firstName: "", lastName: "", phone: "",
    address: "", city: "", state: "", zip: "",
    country: "Pakistan", shipping: "standard",
  });

  const total = getCartTotal();
  const shippingCost = form.shipping === "express" ? 15 : total >= 100 ? 0 : 8;
  const grandTotal = total + shippingCost;
  const currentIdx = STEPS.findIndex((s) => s.id === step);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError("");
    try {
      const itemsWithImages = items.map((item) => ({
        ...item,
        imageUrl: item.image ? urlFor(item.image).width(200).url() : "",
        price: calcDiscountedPrice(item.price, item.discount),
      }));
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: itemsWithImages, form, shippingCost }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      if (data.url) window.location.href = data.url;
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-[1fr_360px] gap-5 lg:gap-8 items-start">

      {/* ── Mobile Summary Toggle ── */}
      <button
        onClick={() => setSummaryOpen(!summaryOpen)}
        className="lg:hidden w-full flex items-center justify-between bg-[#252B42] text-white px-5 py-4 rounded-2xl"
      >
        <div className="flex items-center gap-2.5">
          <FiShoppingBag size={15} />
          <span className="text-[13px] font-semibold">
            {items.length} {items.length === 1 ? "item" : "items"} · {formatPrice(grandTotal)}
          </span>
        </div>
        <FiChevronDown size={16} className={`transition-transform duration-200 ${summaryOpen ? "rotate-180" : ""}`} />
      </button>

      {summaryOpen && (
        <div className="lg:hidden bg-white rounded-2xl border border-gray-100 p-5">
          <SummaryContent items={items} total={total} shippingCost={shippingCost} grandTotal={grandTotal} />
        </div>
      )}

      {/* ── Main Form Card ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden w-full">

        {/* Step Progress Bar */}
        <div className="px-5 sm:px-8 pt-6 pb-5 border-b border-gray-100">
          <div className="flex items-center gap-0">
            {STEPS.map((s, i) => {
              const isActive = step === s.id;
              const isDone = currentIdx > i;
              return (
                <div key={s.id} className={`flex items-center ${i < STEPS.length - 1 ? "flex-1" : ""}`}>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                      isActive ? "bg-[#252B42] text-white ring-4 ring-[#252B42]/10" :
                      isDone ? "bg-[#2DC071] text-white" :
                      "bg-gray-100 text-[#BDBDBD]"
                    }`}>
                      {isDone ? <FiCheck size={11} strokeWidth={3} /> : i + 1}
                    </div>
                    <span className={`text-[11px] font-bold uppercase tracking-wide hidden sm:block ${
                      isActive ? "text-[#252B42]" : isDone ? "text-[#2DC071]" : "text-[#BDBDBD]"
                    }`}>{s.label}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="flex-1 mx-2 sm:mx-3">
                      <div className={`h-[2px] rounded-full transition-all ${isDone ? "bg-[#2DC071]" : "bg-gray-100"}`} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="px-5 sm:px-8 py-6">

          {/* ── Step 1: Contact ── */}
          {step === "info" && (
            <div className="space-y-4">
              <div className="mb-2">
                <h2 className="text-[18px] font-bold text-[#252B42]">Contact Information</h2>
                <p className="text-[13px] text-[#737373] mt-0.5">We'll use this to send your order confirmation.</p>
              </div>
              <Field label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} required />
              <div className="grid grid-cols-2 gap-3">
                <Field label="First Name" name="firstName" value={form.firstName} onChange={handleChange} required />
                <Field label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} required />
              </div>
              <Field label="Phone Number" name="phone" type="tel" value={form.phone} onChange={handleChange} />
              <Btn
                onClick={() => setStep("shipping")}
                disabled={!form.email || !form.firstName || !form.lastName}
                label="Continue to Shipping"
              />
            </div>
          )}

          {/* ── Step 2: Shipping ── */}
          {step === "shipping" && (
            <div className="space-y-4">
              <div className="mb-2">
                <h2 className="text-[18px] font-bold text-[#252B42]">Shipping Address</h2>
                <p className="text-[13px] text-[#737373] mt-0.5">Where should we deliver your order?</p>
              </div>
              <Field label="Street Address" name="address" value={form.address} onChange={handleChange} required />
              <div className="grid grid-cols-2 gap-3">
                <Field label="City" name="city" value={form.city} onChange={handleChange} required />
                <Field label="State" name="state" value={form.state} onChange={handleChange} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="ZIP Code" name="zip" value={form.zip} onChange={handleChange} />
                <div>
                  <label className="text-[10px] font-bold tracking-widest uppercase text-[#737373] block mb-1.5">Country</label>
                  <select name="country" value={form.country} onChange={handleChange}
                    className="w-full py-2.5 px-3.5 text-[14px] border border-gray-200 rounded-lg bg-white outline-none focus:border-[#252B42] focus:ring-2 focus:ring-[#252B42]/8 transition-all text-[#252B42]">
                    {["Pakistan", "United States", "United Kingdom", "Canada", "Australia", "UAE"].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Shipping Method */}
              <div>
                <label className="text-[10px] font-bold tracking-widest uppercase text-[#737373] block mb-2">Shipping Method</label>
                <div className="space-y-2">
                  {[
                    { id: "standard", label: "Standard", sub: "5–7 business days", price: total >= 100 ? "Free" : "$8" },
                    { id: "express", label: "Express", sub: "2–3 business days", price: "$15" },
                  ].map(({ id, label, sub, price }) => (
                    <label key={id} className={`flex items-center justify-between px-4 py-3 border rounded-xl cursor-pointer transition-all ${
                      form.shipping === id
                        ? "border-[#252B42] bg-[#252B42]/[0.02]"
                        : "border-gray-200 hover:border-gray-300"
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          form.shipping === id ? "border-[#252B42]" : "border-gray-300"
                        }`}>
                          {form.shipping === id && <div className="w-2 h-2 rounded-full bg-[#252B42]" />}
                        </div>
                        <input type="radio" name="shipping" value={id} checked={form.shipping === id} onChange={handleChange} className="sr-only" />
                        <div>
                          <p className="text-[13px] font-semibold text-[#252B42]">{label}</p>
                          <p className="text-[11px] text-[#737373]">{sub}</p>
                        </div>
                      </div>
                      <span className={`text-[13px] font-bold ${price === "Free" ? "text-[#2DC071]" : "text-[#252B42]"}`}>{price}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button onClick={() => setStep("info")}
                  className="px-5 py-2.5 border border-gray-200 text-[#737373] text-[12px] font-semibold rounded-lg hover:border-[#252B42] hover:text-[#252B42] transition-all">
                  ← Back
                </button>
                <Btn onClick={() => setStep("review")} disabled={!form.address || !form.city} label="Review Order" className="flex-1" />
              </div>
            </div>
          )}

          {/* ── Step 3: Review ── */}
          {step === "review" && (
            <div className="space-y-4">
              <div className="mb-2">
                <h2 className="text-[18px] font-bold text-[#252B42]">Review & Pay</h2>
                <p className="text-[13px] text-[#737373] mt-0.5">Double-check your details before paying.</p>
              </div>

              {[
                { title: "Contact", lines: [`${form.firstName} ${form.lastName}`, form.email, form.phone], onEdit: () => setStep("info") },
                { title: "Ship To", lines: [form.address, `${form.city}${form.state ? `, ${form.state}` : ""} ${form.zip}`, form.country], onEdit: () => setStep("shipping") },
              ].map(({ title, lines, onEdit }) => (
                <div key={title} className="flex justify-between items-start px-4 py-3.5 bg-gray-50 rounded-xl border border-gray-100">
                  <div>
                    <p className="text-[10px] font-bold tracking-widest uppercase text-[#2DC071] mb-1.5">{title}</p>
                    {lines.filter(Boolean).map((line, i) => (
                      <p key={i} className="text-[13px] text-[#737373] leading-relaxed">{line}</p>
                    ))}
                  </div>
                  <button onClick={onEdit} className="text-[11px] text-[#737373] border border-gray-200 rounded-md px-2.5 py-1 hover:border-[#252B42] hover:text-[#252B42] transition-all ml-4 flex-shrink-0">
                    Edit
                  </button>
                </div>
              ))}

              <div className="flex items-center gap-2.5 px-4 py-3 bg-[#2DC071]/5 border border-[#2DC071]/20 rounded-xl">
                <FiLock size={13} className="text-[#2DC071] flex-shrink-0" />
                <p className="text-[12px] text-[#737373]">
                  Securely redirected to <strong className="text-[#252B42]">Stripe</strong> to complete payment.
                </p>
              </div>

              {error && (
                <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-xl">
                  <p className="text-[12px] text-red-600 font-medium">{error}</p>
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button onClick={() => setStep("shipping")}
                  className="px-5 py-2.5 border border-gray-200 text-[#737373] text-[12px] font-semibold rounded-lg hover:border-[#252B42] hover:text-[#252B42] transition-all">
                  ← Back
                </button>
                <button onClick={handlePlaceOrder} disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#252B42] text-white text-[13px] font-bold rounded-lg hover:bg-[#2DC071] transition-all disabled:opacity-60 active:scale-[0.98]">
                  {loading ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</>
                  ) : (
                    <><FiLock size={13} /> Pay {formatPrice(grandTotal)}</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Desktop Summary ── */}
      <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
        <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#737373] mb-4">
          Order Summary · <span className="text-[#252B42]">{items.length} {items.length === 1 ? "item" : "items"}</span>
        </p>
        <SummaryContent items={items} total={total} shippingCost={shippingCost} grandTotal={grandTotal} />
      </div>
    </div>
  );
}

// ── Summary Content ───────────────────────────────────────────────────────────

function SummaryContent({ items, total, shippingCost, grandTotal }: {
  items: any[]; total: number; shippingCost: number; grandTotal: number;
}) {
  return (
    <>
      <div className="space-y-3 mb-5 max-h-[260px] overflow-y-auto">
        {items.map((item) => {
          const price = calcDiscountedPrice(item.price, item.discount);
          const imgUrl = item.image ? urlFor(item.image).width(100).height(120).url() : null;
          return (
            <div key={item._id} className="flex gap-3 items-start">
              <div className="relative flex-shrink-0 w-[48px] h-[58px] rounded-lg overflow-hidden bg-gray-100">
                {imgUrl && <Image src={imgUrl} alt={item.name} fill className="object-cover" sizes="48px" />}
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white bg-[#252B42]">
                  {item.quantity}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-[#252B42] line-clamp-2 leading-snug">{item.name}</p>
                <p className="text-[11px] text-[#737373] mt-0.5">{formatPrice(price)} × {item.quantity}</p>
              </div>
              <p className="text-[12px] font-bold text-[#252B42] flex-shrink-0">{formatPrice(price * item.quantity)}</p>
            </div>
          );
        })}
      </div>

      <div className="space-y-2 pt-4 border-t border-gray-100">
        <div className="flex justify-between text-[13px]">
          <span className="text-[#737373]">Subtotal</span>
          <span className="font-semibold text-[#252B42]">{formatPrice(total)}</span>
        </div>
        <div className="flex justify-between text-[13px]">
          <span className="text-[#737373]">Shipping</span>
          <span className={`font-semibold ${shippingCost === 0 ? "text-[#2DC071]" : "text-[#252B42]"}`}>
            {shippingCost === 0 ? "Free" : formatPrice(shippingCost)}
          </span>
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <span className="text-[12px] font-bold uppercase tracking-wider text-[#252B42]">Total</span>
          <span className="text-[24px] font-bold text-[#252B42]">{formatPrice(grandTotal)}</span>
        </div>
      </div>
    </>
  );
}

// ── Reusable Primary Button ───────────────────────────────────────────────────

function Btn({ onClick, disabled, label, className = "w-full" }: {
  onClick: () => void; disabled?: boolean; label: string; className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${className} flex items-center justify-center gap-2 py-3 bg-[#252B42] text-white text-[13px] font-bold rounded-lg hover:bg-[#2DC071] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      {label}
      <FiArrowRight size={14} />
    </button>
  );
}

// ── Field Component ───────────────────────────────────────────────────────────

function Field({ label, name, type = "text", value, onChange, required }: {
  label: string; name: string; type?: string;
  value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-[10px] font-bold tracking-widest uppercase text-[#737373] block mb-1.5">
        {label}{required && <span className="text-[#E74040] ml-0.5">*</span>}
      </label>
      <input id={name} name={name} type={type} value={value} onChange={onChange} required={required}
        className="w-full py-2.5 px-3.5 text-[14px] border border-gray-200 rounded-lg bg-white outline-none focus:border-[#252B42] focus:ring-2 focus:ring-[#252B42]/8 transition-all text-[#252B42] placeholder:text-gray-300"
      />
    </div>
  );
}