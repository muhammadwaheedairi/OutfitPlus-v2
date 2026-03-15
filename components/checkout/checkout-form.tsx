"use client";

import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { formatPrice, calcDiscountedPrice } from "@/lib/utils";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import { FiCheck, FiChevronRight } from "react-icons/fi";

type Step = "info" | "shipping" | "review";
const STEPS: { id: Step; label: string }[] = [
  { id: "info", label: "Contact" },
  { id: "shipping", label: "Shipping" },
  { id: "review", label: "Review" },
];

export default function CheckoutForm() {
  const { items, getCartTotal, clearCart } = useCart();
  const [step, setStep] = useState<Step>("info");
  const [placed, setPlaced] = useState(false);
  const [form, setForm] = useState({
    email: "", firstName: "", lastName: "", phone: "",
    address: "", city: "", state: "", zip: "",
    country: "Pakistan", shipping: "standard",
  });

  const total = getCartTotal();
  const shippingCost = form.shipping === "express" ? 15 : total >= 100 ? 0 : 8;
  const grandTotal = total + shippingCost;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = () => {
    setPlaced(true);
    clearCart();
  };

  if (placed) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-[#2DC071]/10 flex items-center justify-center mb-6">
          <FiCheck size={36} className="text-[#2DC071]" strokeWidth={2.5} />
        </div>
        <h2 className="text-[32px] font-bold text-[#252B42] mb-3">Order Placed!</h2>
        <p className="text-[15px] text-[#737373] mb-8 max-w-sm">
          Thank you! A confirmation will be sent to <strong>{form.email}</strong>.
        </p>
        <Link href="/" className="px-10 py-4 bg-[#252B42] text-white text-[13px] font-bold uppercase tracking-widest hover:bg-[#2DC071] transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const currentIdx = STEPS.findIndex((s) => s.id === step);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">

      {/* ── Left: Form ─────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8">

        {/* Step Indicator */}
        <div className="flex items-center mb-10">
          {STEPS.map((s, i) => {
            const thisIdx = i;
            const isActive = step === s.id;
            const isDone = currentIdx > thisIdx;
            return (
              <div key={s.id} className="flex items-center">
                <div className="flex items-center gap-2.5">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold transition-all ${
                    isActive ? "bg-[#252B42] text-white" :
                    isDone ? "bg-[#2DC071] text-white" :
                    "bg-gray-100 text-[#737373]"
                  }`}>
                    {isDone ? <FiCheck size={14} strokeWidth={2.5} /> : i + 1}
                  </span>
                  <span className={`text-[12px] font-bold uppercase tracking-wider hidden sm:block ${
                    isActive ? "text-[#252B42]" : isDone ? "text-[#2DC071]" : "text-[#BDBDBD]"
                  }`}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <FiChevronRight size={16} className="mx-3 text-gray-300 flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        {/* ── Step 1: Contact ── */}
        {step === "info" && (
          <div className="space-y-5">
            <h2 className="text-[20px] font-bold text-[#252B42] mb-6">Contact Information</h2>
            <Field label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} required />
            <div className="grid grid-cols-2 gap-4">
              <Field label="First Name" name="firstName" value={form.firstName} onChange={handleChange} required />
              <Field label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} required />
            </div>
            <Field label="Phone Number" name="phone" type="tel" value={form.phone} onChange={handleChange} />
            <button
              onClick={() => setStep("shipping")}
              disabled={!form.email || !form.firstName || !form.lastName}
              className="w-full py-4 bg-[#252B42] text-white text-[13px] font-bold uppercase tracking-widest rounded-xl hover:bg-[#2DC071] transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-2"
            >
              Continue to Shipping →
            </button>
          </div>
        )}

        {/* ── Step 2: Shipping ── */}
        {step === "shipping" && (
          <div className="space-y-5">
            <h2 className="text-[20px] font-bold text-[#252B42] mb-6">Shipping Address</h2>
            <Field label="Street Address" name="address" value={form.address} onChange={handleChange} required />
            <div className="grid grid-cols-2 gap-4">
              <Field label="City" name="city" value={form.city} onChange={handleChange} required />
              <Field label="State / Province" name="state" value={form.state} onChange={handleChange} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="ZIP / Postal Code" name="zip" value={form.zip} onChange={handleChange} />
              <div>
                <label className="text-[11px] font-bold tracking-widest uppercase text-[#737373] block mb-2">Country</label>
                <select name="country" value={form.country} onChange={handleChange}
                  className="w-full py-3 px-4 text-[14px] border border-gray-200 rounded-lg bg-white outline-none focus:border-[#252B42] transition-colors">
                  {["Pakistan", "United States", "United Kingdom", "Canada", "Australia", "UAE"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Shipping Method */}
            <div>
              <label className="text-[11px] font-bold tracking-widest uppercase text-[#737373] block mb-3">Shipping Method</label>
              <div className="space-y-2">
                {[
                  { id: "standard", label: "Standard Shipping", sub: "5–7 business days", price: total >= 100 ? "Free" : "$8.00" },
                  { id: "express", label: "Express Shipping", sub: "2–3 business days", price: "$15.00" },
                ].map(({ id, label, sub, price }) => (
                  <label key={id} className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${
                    form.shipping === id ? "border-[#252B42] bg-gray-50" : "border-gray-200 hover:border-gray-300"
                  }`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="shipping" value={id} checked={form.shipping === id} onChange={handleChange} className="accent-[#252B42]" />
                      <div>
                        <p className="text-[14px] font-semibold text-[#252B42]">{label}</p>
                        <p className="text-[12px] text-[#737373]">{sub}</p>
                      </div>
                    </div>
                    <span className="text-[14px] font-bold text-[#252B42]">{price}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setStep("info")}
                className="flex-1 py-4 border border-gray-200 text-[#737373] text-[13px] font-bold uppercase tracking-widest rounded-xl hover:border-[#252B42] hover:text-[#252B42] transition-colors">
                ← Back
              </button>
              <button onClick={() => setStep("review")} disabled={!form.address || !form.city}
                className="flex-1 py-4 bg-[#252B42] text-white text-[13px] font-bold uppercase tracking-widest rounded-xl hover:bg-[#2DC071] transition-colors disabled:opacity-40">
                Review Order →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Review ── */}
        {step === "review" && (
          <div>
            <h2 className="text-[20px] font-bold text-[#252B42] mb-6">Review Your Order</h2>
            {[
              { title: "Contact", lines: [`${form.firstName} ${form.lastName}`, form.email, form.phone], onEdit: () => setStep("info") },
              { title: "Ship To", lines: [form.address, `${form.city}${form.state ? `, ${form.state}` : ""} ${form.zip}`, form.country], onEdit: () => setStep("shipping") },
            ].map(({ title, lines, onEdit }) => (
              <div key={title} className="flex justify-between items-start p-5 border border-gray-200 rounded-xl mb-4">
                <div>
                  <p className="text-[11px] font-bold tracking-widest uppercase text-[#2DC071] mb-2">{title}</p>
                  {lines.filter(Boolean).map((line, i) => (
                    <p key={i} className="text-[14px] text-[#737373]">{line}</p>
                  ))}
                </div>
                <button onClick={onEdit} className="text-[12px] text-[#737373] underline hover:text-[#252B42] transition-colors flex-shrink-0 ml-4">Edit</button>
              </div>
            ))}

            {/* Payment placeholder */}
            <div className="p-5 border border-dashed border-gray-300 rounded-xl mb-6 bg-gray-50 text-center">
              <p className="text-[13px] text-[#737373] font-medium">💳 Stripe Payment — Coming in Part 2</p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep("shipping")}
                className="flex-1 py-4 border border-gray-200 text-[#737373] text-[13px] font-bold uppercase tracking-widest rounded-xl hover:border-[#252B42] transition-colors">
                ← Back
              </button>
              <button onClick={handlePlaceOrder}
                className="flex-1 py-4 bg-[#252B42] text-white text-[13px] font-bold uppercase tracking-widest rounded-xl hover:bg-[#2DC071] transition-colors">
                Place Order — {formatPrice(grandTotal)}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Right: Order Summary ────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
        <h3 className="text-[12px] font-bold tracking-[0.25em] uppercase text-[#252B42] mb-6">
          Order Summary
          <span className="ml-2 text-[#737373] font-normal">({items.length} {items.length === 1 ? "item" : "items"})</span>
        </h3>

        <div className="space-y-4 mb-6 max-h-[320px] overflow-y-auto pr-1">
          {items.map((item) => {
            const price = calcDiscountedPrice(item.price, item.discount);
            const imgUrl = item.image ? urlFor(item.image).width(100).height(120).url() : null;
            return (
              <div key={item._id} className="flex gap-3 items-start">
                <div className="relative flex-shrink-0 w-[56px] h-[68px] rounded-lg overflow-hidden bg-gray-100">
                  {imgUrl && <Image src={imgUrl} alt={item.name} fill className="object-cover" sizes="56px" />}
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center text-white bg-[#252B42]">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-[#252B42] line-clamp-2 leading-snug">{item.name}</p>
                  <p className="text-[12px] text-[#737373] mt-1">{formatPrice(price)} × {item.quantity}</p>
                </div>
                <p className="text-[14px] font-bold text-[#252B42] flex-shrink-0">{formatPrice(price * item.quantity)}</p>
              </div>
            );
          })}
        </div>

        <div className="space-y-3 pt-4 border-t border-gray-100">
          <div className="flex justify-between text-[14px]">
            <span className="text-[#737373]">Subtotal</span>
            <span className="font-semibold text-[#252B42]">{formatPrice(total)}</span>
          </div>
          <div className="flex justify-between text-[14px]">
            <span className="text-[#737373]">Shipping</span>
            <span className={`font-semibold ${shippingCost === 0 ? "text-[#2DC071]" : "text-[#252B42]"}`}>
              {shippingCost === 0 ? "Free" : formatPrice(shippingCost)}
            </span>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-gray-100">
            <span className="text-[13px] font-bold uppercase tracking-widest text-[#252B42]">Total</span>
            <span className="text-[28px] font-bold text-[#252B42]">{formatPrice(grandTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, name, type = "text", value, onChange, required }: {
  label: string; name: string; type?: string;
  value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-[11px] font-bold tracking-widest uppercase text-[#737373] block mb-2">
        {label} {required && <span className="text-[#E74040]">*</span>}
      </label>
      <input id={name} name={name} type={type} value={value} onChange={onChange} required={required}
        className="w-full py-3 px-4 text-[14px] border border-gray-200 rounded-lg bg-white outline-none focus:border-[#252B42] transition-colors"
      />
    </div>
  );
}