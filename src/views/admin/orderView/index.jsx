import { LoadingOutlined } from "@ant-design/icons";
import { useDocumentTitle, useScrollTop } from "@/hooks";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import firebase from "@/services/firebase";
import Skeleton from "react-loading-skeleton";
import { displayMoney, displayDate, calculateSubtotal } from "@/helpers/utils";
import { OrderPaymentSummery } from "@/components/common";

const displaySizeForOmar = (size) => {
  if (size === "lg") return "L";
  if (size === "md") return "M";
  if (size === "sm") return "S";
  return size?.toLocaleUpperCase();
};

const OrderView = () => {
  useDocumentTitle("Order | Urbanfit");
  useScrollTop();

  const [orderDetails, setOrderDetails] = useState(null);
  const { orderId } = useParams();

  useEffect(() => {
    async function getOrder() {
      const data = await firebase.getOrder(orderId);
      const order = await data?.data();
      setOrderDetails(order);
    }
    getOrder();
  }, [orderId]);

  if (!orderId) return null;

  return (
    <section className="product-form-container">
      <h2>Order</h2>

        {!orderDetails ? (
          <div className="loader" style={{ minHeight: "40dvh" }}>
            <LoadingOutlined style={{ fontSize: "2rem" }} />
          </div>
        ) : (
          <div style={{ maxWidth: "960px", margin: "0 auto" }}>
            {/* Order Header */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "2.5rem",
                padding: "1.5rem 0",
                borderBottom: "2px solid #f0f0f0",
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: "1.4rem" }}>Order #{orderId.slice(-8)}</h3>
                {orderDetails.date && (
                  <p style={{ margin: "0.3rem 0 0", color: "#6f6f6f", fontSize: "0.9rem" }}>
                    {displayDate(orderDetails.date.toDate())} at{" "}
                    {new Date(orderDetails.date.toDate()).getHours()}:
                    {String(new Date(orderDetails.date.toDate()).getMinutes()).padStart(2, "0")}
                  </p>
                )}
              </div>
              <div
                style={{
                  padding: "0.4rem 1rem",
                  borderRadius: "20px",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  background: orderDetails.fulfillment ? "#e8f5e9" : "#fff3e0",
                  color: orderDetails.fulfillment ? "#2e7d32" : "#e65100",
                }}
              >
                {orderDetails.fulfillment ? "Delivered" : "Pending"}
              </div>
            </div>

            {/* Contact & Shipping */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "1.5rem",
                marginBottom: "2.5rem",
              }}
            >
              <div
                style={{
                  padding: "1.5rem",
                  borderRadius: "12px",
                  border: "1px solid #e8e8e8",
                  background: "#fafafa",
                }}
              >
                <h4 style={{ margin: "0 0 1rem", fontSize: "1rem", color: "#343120" }}>
                  Contact
                </h4>
                <div style={{ fontSize: "0.95rem", lineHeight: 1.8 }}>
                  <div>
                    <span style={{ color: "#6f6f6f" }}>Email: </span>
                    {orderDetails.address?.email || <Skeleton width={120} />}
                  </div>
                  <div>
                    <span style={{ color: "#6f6f6f" }}>Phone: </span>
                    {orderDetails.address?.mobile?.value || <Skeleton width={100} />}
                  </div>
                </div>
              </div>

              <div
                style={{
                  padding: "1.5rem",
                  borderRadius: "12px",
                  border: "1px solid #e8e8e8",
                  background: "#fafafa",
                }}
              >
                <h4 style={{ margin: "0 0 1rem", fontSize: "1rem", color: "#343120" }}>
                  Shipping Address
                </h4>
                <div style={{ fontSize: "0.95rem", lineHeight: 1.8 }}>
                  {orderDetails.address?.country && (
                    <div>
                      <span style={{ color: "#6f6f6f" }}>Country: </span>
                      {orderDetails.address.country}
                    </div>
                  )}
                  <div>
                    <span style={{ color: "#6f6f6f" }}>City: </span>
                    {orderDetails.address?.city || <Skeleton width={80} />}
                  </div>
                  {orderDetails.address?.street && (
                    <div>
                      <span style={{ color: "#6f6f6f" }}>Street: </span>
                      {orderDetails.address.street}
                    </div>
                  )}
                  <div>
                    <span style={{ color: "#6f6f6f" }}>Building: </span>
                    {orderDetails.address?.building || <Skeleton width={60} />}
                  </div>
                  {orderDetails.address?.floor && (
                    <div>
                      <span style={{ color: "#6f6f6f" }}>Floor: </span>
                      {orderDetails.address.floor}
                    </div>
                  )}
                  <div style={{ marginTop: "0.3rem", fontSize: "0.8rem", color: "#999" }}>
                    {orderDetails.address?.isInternational ? "International" : "Local"} Shipping
                  </div>
                </div>
              </div>
            </div>

            {/* Items */}
            <div
              style={{
                padding: "1.5rem",
                borderRadius: "12px",
                border: "1px solid #e8e8e8",
                marginBottom: "2.5rem",
              }}
            >
              <h4 style={{ margin: "0 0 1.2rem", fontSize: "1rem", color: "#343120" }}>
                Items ({orderDetails.items?.length || 0})
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {orderDetails.items?.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      gap: "1.2rem",
                      padding: "1rem",
                      borderRadius: "8px",
                      border: "1px solid #f0f0f0",
                      background: "#fff",
                      alignItems: "center",
                    }}
                  >
                    {/* Image */}
                    <div
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "8px",
                        overflow: "hidden",
                        flexShrink: 0,
                        background: "#f5f5f5",
                      }}
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#ccc",
                            fontSize: "0.75rem",
                          }}
                        >
                          No img
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: "0.95rem",
                          marginBottom: "0.4rem",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.name || <Skeleton width={150} />}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "0.8rem 1.5rem",
                          fontSize: "0.85rem",
                          color: "#555",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                          <span style={{ color: "#999" }}>Color:</span>
                          <div
                            style={{
                              width: "14px",
                              height: "14px",
                              borderRadius: "50%",
                              border: "1px solid #ddd",
                              background: item.selectedColor || "#ccc",
                            }}
                          />
                        </div>
                        <div>
                          <span style={{ color: "#999" }}>Size:</span>{" "}
                          {displaySizeForOmar(item.selectedSize)}
                        </div>
                        <div>
                          <span style={{ color: "#999" }}>Qty:</span> {item.quantity}
                        </div>
                        <div>
                          <span style={{ color: "#999" }}>Price:</span>{" "}
                          {item.price ? displayMoney(item.price) : "—"}
                        </div>
                      </div>
                    </div>

                    {/* Item total */}
                    <div
                      style={{
                        textAlign: "right",
                        fontWeight: 600,
                        fontSize: "1rem",
                        flexShrink: 0,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.price
                        ? displayMoney(Number(item.price) * Number(item.quantity))
                        : "—"}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Summary */}
            <div
              style={{
                padding: "1.5rem",
                borderRadius: "12px",
                border: "1px solid #e8e8e8",
                marginBottom: "2.5rem",
              }}
            >
              <h4 style={{ margin: "0 0 1rem", fontSize: "1rem", color: "#343120" }}>
                Payment Summary
              </h4>
              <OrderPaymentSummery
                subtotal={calculateSubtotal(orderDetails?.items)}
                promo={orderDetails.promo}
                city={orderDetails?.address?.city}
                storedShippingRate={orderDetails?.shippingRate}
              />
            </div>

            {/* Fulfillment */}
            <div
              style={{
                padding: "1.5rem",
                borderRadius: "12px",
                border: "1px solid #e8e8e8",
                background: "#fafafa",
                marginBottom: "3rem",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
              }}
            >
              <div>
                <h4 style={{ margin: 0, fontSize: "1rem", color: "#343120" }}>
                  Fulfillment Status
                </h4>
                <p style={{ margin: "0.3rem 0 0", fontSize: "0.85rem", color: "#6f6f6f" }}>
                  {orderDetails.fulfillment
                    ? "This order has been marked as delivered"
                    : "This order has not been delivered yet"}
                </p>
              </div>
              <button
                onClick={() => {
                  const updated = { ...orderDetails, fulfillment: !orderDetails.fulfillment };
                  setOrderDetails(updated);
                  firebase.updateOrder(orderDetails.id, updated);
                }}
                style={{
                  padding: "0.6rem 1.5rem",
                  borderRadius: "8px",
                  border: "1px solid #343120",
                  background: orderDetails.fulfillment ? "#fff" : "#343120",
                  color: orderDetails.fulfillment ? "#343120" : "#fff",
                  fontWeight: 500,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                Mark as {orderDetails.fulfillment ? "Pending" : "Delivered"}
              </button>
            </div>
          </div>
        )}

    </section>
  );
};

export default OrderView;
