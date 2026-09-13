import { displayMoney } from "@/helpers/utils";
import PropType from "prop-types";
import React from "react";

export const displaySizeForPackingSlip = (size) => {
  if (!size) return "—";
  if (size === "lg") return "L";
  if (size === "md") return "M";
  if (size === "sm") return "S";
  return String(size).toLocaleUpperCase();
};

export const formatOrderDate = (date) => {
  try {
    const d =
      date && typeof date.toDate === "function" ? date.toDate() : new Date(date);
    if (Number.isNaN(d.getTime())) return "—";
    return `${d.toLocaleDateString("en-GB")} ${String(d.getHours()).padStart(2, "0")}:${String(
      d.getMinutes(),
    ).padStart(2, "0")}`;
  } catch (e) {
    return "—";
  }
};

const itemPrice = (item) => {
  if (item.onSale && item.percentage) {
    return Number(item.price) * (1 - Number(item.percentage) / 100);
  }
  return Number(item.price) || 0;
};

// One ink-friendly packing slip for a single order: big size/qty for picking,
// full address + big phone for the courier, checkboxes to tick items off.
const PackingSlipDoc = ({ order }) => {
  if (!order) return null;
  const address = order.address || {};
  const subtotal = (order.items || []).reduce(
    (sum, item) => sum + itemPrice(item) * (Number(item.quantity) || 0),
    0,
  );
  const discount = (subtotal * (order.promo?.percentage || 0)) / 100;
  const shipping = order.shippingRate ?? order.shipping ?? 5;
  const total = subtotal - discount + shipping;

  return (
    <div
      className="packing-slip-sheet"
      style={{
        background: "#fff",
        color: "#000",
        maxWidth: "760px",
        margin: "0 auto 2rem",
        padding: "2rem",
        border: "1px solid #e5e7eb",
        fontSize: "14px",
        lineHeight: 1.5,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "1rem",
          borderBottom: "3px solid #000",
          paddingBottom: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <div style={{ fontSize: "1.6rem", fontWeight: 800, letterSpacing: "0.05em" }}>
            URBANFIT — PACKING SLIP
          </div>
          <div style={{ fontSize: "1.1rem", marginTop: "0.3rem" }}>
            Order <strong>#{order.id}</strong>
          </div>
          <div style={{ color: "#333" }}>{formatOrderDate(order.date)}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              display: "inline-block",
              border: "2px solid #000",
              borderRadius: "6px",
              padding: "0.3rem 0.9rem",
              fontWeight: 700,
            }}
          >
            {order.cancelled
              ? "CANCELLED"
              : order.fulfillment
                ? "DELIVERED"
                : "PENDING"}
          </div>
          <div style={{ marginTop: "0.5rem", fontWeight: 600 }}>
            {order.payment === "cod" || order.payment === "COD"
              ? "Cash on Delivery"
              : order.payment || "—"}
          </div>
        </div>
      </div>

      {/* Pick list */}
      <div style={{ fontWeight: 800, fontSize: "1rem", marginBottom: "0.6rem" }}>
        PICK LIST — {(order.items || []).length} line(s),{" "}
        {(order.items || []).reduce((n, i) => n + (Number(i.quantity) || 0), 0)} unit(s)
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1.5rem" }}>
        <thead>
          <tr>
            {["✓", "Item", "Size", "Qty"].map((h) => (
              <th
                key={h}
                style={{
                  textAlign: h === "Item" ? "left" : "center",
                  borderBottom: "2px solid #000",
                  padding: "0.5rem",
                  fontSize: "0.85rem",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(order.items || []).map((item, index) => (
            <tr key={index}>
              <td
                style={{
                  borderBottom: "1px solid #999",
                  padding: "0.7rem 0.5rem",
                  textAlign: "center",
                  verticalAlign: "top",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: "18px",
                    height: "18px",
                    border: "2px solid #000",
                    borderRadius: "3px",
                  }}
                />
              </td>
              <td
                style={{
                  borderBottom: "1px solid #999",
                  padding: "0.7rem 0.5rem",
                  verticalAlign: "top",
                }}
              >
                <div style={{ fontWeight: 700 }}>{item.name || "—"}</div>
                <div style={{ fontSize: "0.8rem", color: "#333" }}>
                  ID: {item.id || "—"}
                  {item.selectedColorName ? ` · ${item.selectedColorName}` : ""}
                  {item.selectedColor && !item.selectedColorName
                    ? ` · ${item.selectedColor}`
                    : ""}
                </div>
              </td>
              <td
                style={{
                  borderBottom: "1px solid #999",
                  padding: "0.7rem 0.5rem",
                  textAlign: "center",
                  verticalAlign: "top",
                  fontSize: "1.5rem",
                  fontWeight: 800,
                }}
              >
                {displaySizeForPackingSlip(item.selectedSize)}
              </td>
              <td
                style={{
                  borderBottom: "1px solid #999",
                  padding: "0.7rem 0.5rem",
                  textAlign: "center",
                  verticalAlign: "top",
                  fontSize: "1.5rem",
                  fontWeight: 800,
                }}
              >
                ×{item.quantity || 0}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Deliver to */}
      <div style={{ fontWeight: 800, fontSize: "1rem", marginBottom: "0.6rem" }}>
        DELIVER TO
      </div>
      <div
        style={{
          border: "2px solid #000",
          borderRadius: "8px",
          padding: "1rem 1.2rem",
          marginBottom: "1.5rem",
        }}
      >
        <div style={{ fontWeight: 700, fontSize: "1.05rem" }}>
          {address.fullname || "—"}
        </div>
        <div>
          {[address.street, address.building ? `Bldg ${address.building}` : "",
            address.floor ? `Fl ${address.floor}` : ""]
            .filter(Boolean)
            .join(", ") || "—"}
        </div>
        <div>
          {[address.city, address.zipcode, address.country].filter(Boolean).join(" · ") || "—"}
        </div>
        <div style={{ fontSize: "1.3rem", fontWeight: 800, marginTop: "0.4rem" }}>
          ☎ {address.mobile?.value || "—"}
        </div>
        {address.email && (
          <div style={{ fontSize: "0.85rem", color: "#333" }}>{address.email}</div>
        )}
      </div>

      {/* Totals */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1.5rem" }}>
        <tbody>
          <tr>
            <td style={{ padding: "0.25rem 0" }}>Subtotal</td>
            <td style={{ textAlign: "right" }}>{displayMoney(subtotal)}</td>
          </tr>
          {discount > 0 && (
            <tr>
              <td style={{ padding: "0.25rem 0" }}>
                Discount{order.promo?.code ? ` (${order.promo.code})` : ""}
              </td>
              <td style={{ textAlign: "right" }}>-{displayMoney(discount)}</td>
            </tr>
          )}
          <tr>
            <td style={{ padding: "0.25rem 0" }}>Shipping</td>
            <td style={{ textAlign: "right" }}>{displayMoney(shipping)}</td>
          </tr>
          <tr>
            <td
              style={{
                padding: "0.5rem 0",
                borderTop: "2px solid #000",
                fontSize: "1.2rem",
                fontWeight: 800,
              }}
            >
              {order.payment === "cod" || order.payment === "COD" ? "COLLECT (COD)" : "Total"}
            </td>
            <td
              style={{
                textAlign: "right",
                borderTop: "2px solid #000",
                fontSize: "1.2rem",
                fontWeight: 800,
              }}
            >
              {displayMoney(total)}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Sign-off */}
      <div style={{ display: "flex", gap: "2rem", fontSize: "0.85rem", color: "#000" }}>
        <div style={{ flex: 1 }}>
          Packed by: <span style={{ display: "inline-block", minWidth: "140px", borderBottom: "1px solid #000" }}>&nbsp;</span>
        </div>
        <div style={{ flex: 1 }}>
          Date: <span style={{ display: "inline-block", minWidth: "140px", borderBottom: "1px solid #000" }}>&nbsp;</span>
        </div>
      </div>
    </div>
  );
};

PackingSlipDoc.propTypes = {
  order: PropType.object,
};

export default PackingSlipDoc;
