import type { Metadata } from "next";
import CheckoutForm from "@/components/checkout/checkout-form";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your OutfitPlus order.",
};

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <p className="text-[11px] tracking-[0.3em] uppercase text-[#2DC071] font-bold mb-2">
            Almost There
          </p>
          <h1 className="text-[36px] font-bold text-[#252B42]">Checkout</h1>
        </div>
        <CheckoutForm />
      </div>
    </div>
  );
}