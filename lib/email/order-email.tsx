import * as React from "react";

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface OrderEmailProps {
  firstName: string;
  orderId: number;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  address: string;
  city: string;
  country: string;
}

export function OrderConfirmationEmail({
  firstName,
  orderId,
  items,
  subtotal,
  shippingCost,
  total,
  address,
  city,
  country,
}: OrderEmailProps) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: 600, margin: "0 auto", backgroundColor: "#FAFAFA" }}>
      {/* Header */}
      <div style={{ backgroundColor: "#252B42", padding: "24px 32px" }}>
        <h1 style={{ color: "#fff", margin: 0, fontSize: 24, fontWeight: "bold" }}>OutfitPlus</h1>
      </div>

      {/* Body */}
      <div style={{ padding: "32px", backgroundColor: "#fff", margin: "16px", borderRadius: 12, border: "1px solid #e5e7eb" }}>
        <h2 style={{ color: "#252B42", fontSize: 22, marginBottom: 8 }}>Order Confirmed! 🎉</h2>
        <p style={{ color: "#737373", fontSize: 15, marginBottom: 24 }}>
          Hi {firstName}, thank you for your order. We&apos;ve received your purchase and will process it shortly.
        </p>

        {/* Order ID */}
        <div style={{ backgroundColor: "#f9fafb", borderRadius: 8, padding: "12px 16px", marginBottom: 24, display: "inline-block" }}>
          <p style={{ margin: 0, color: "#252B42", fontWeight: "bold", fontSize: 14 }}>
            Order #{orderId} · <span style={{ color: "#2DC071" }}>Pending</span>
          </p>
        </div>

        {/* Items */}
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24 }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
              <th style={{ textAlign: "left", padding: "8px 0", color: "#737373", fontSize: 12, fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em" }}>Item</th>
              <th style={{ textAlign: "center", padding: "8px 0", color: "#737373", fontSize: 12, fontWeight: "bold", textTransform: "uppercase" }}>Qty</th>
              <th style={{ textAlign: "right", padding: "8px 0", color: "#737373", fontSize: 12, fontWeight: "bold", textTransform: "uppercase" }}>Price</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #f3f4f6" }}>
                <td style={{ padding: "12px 0", color: "#252B42", fontSize: 14, fontWeight: "bold" }}>{item.name}</td>
                <td style={{ padding: "12px 0", color: "#737373", fontSize: 14, textAlign: "center" }}>{item.quantity}</td>
                <td style={{ padding: "12px 0", color: "#252B42", fontSize: 14, fontWeight: "bold", textAlign: "right" }}>${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div style={{ borderTop: "2px solid #e5e7eb", paddingTop: 16, marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ color: "#737373", fontSize: 14 }}>Subtotal</span>
            <span style={{ color: "#252B42", fontSize: 14, fontWeight: "bold" }}>${subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ color: "#737373", fontSize: 14 }}>Shipping</span>
            <span style={{ color: shippingCost === 0 ? "#2DC071" : "#252B42", fontSize: 14, fontWeight: "bold" }}>
              {shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #e5e7eb", paddingTop: 12, marginTop: 8 }}>
            <span style={{ color: "#252B42", fontSize: 16, fontWeight: "bold" }}>Total</span>
            <span style={{ color: "#252B42", fontSize: 20, fontWeight: "bold" }}>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Shipping Address */}
        <div style={{ backgroundColor: "#f9fafb", borderRadius: 8, padding: "16px", marginBottom: 24 }}>
          <p style={{ margin: "0 0 4px", color: "#2DC071", fontSize: 11, fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em" }}>Ship To</p>
          <p style={{ margin: 0, color: "#252B42", fontSize: 14 }}>{address}, {city}, {country}</p>
        </div>

        <p style={{ color: "#737373", fontSize: 13, marginBottom: 0 }}>
          Questions? Reply to this email or contact us at{" "}
          <a href="mailto:support@outfitplus.com" style={{ color: "#23A6F0" }}>support@outfitplus.com</a>
        </p>
      </div>

      {/* Footer */}
      <div style={{ padding: "16px 32px", textAlign: "center" }}>
        <p style={{ color: "#BDBDBD", fontSize: 12, margin: 0 }}>© 2026 OutfitPlus. All Rights Reserved.</p>
      </div>
    </div>
  );
}