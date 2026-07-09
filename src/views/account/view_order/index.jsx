import { LoadingOutlined } from "@ant-design/icons";
import { useDocumentTitle, useScrollTop } from "@/hooks";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import firebase from "@/services/firebase";
import Skeleton from "react-loading-skeleton";
import {
  displayMoney,
  displayActionMessage,
  displayDate,
  calculateSubtotal,
} from "@/helpers/utils";
import { OrderPaymentSummery } from "@/components/common";
import { shipping as defaultShipping } from "@/constants/constants";

const displaySizeForOmar = (size) => {
  if (size === "lg") return "L";
  if (size === "md") return "M";
  if (size === "sm") return "S";
  return size?.toLocaleUpperCase();
};

const OrderView = () => {
  const history = useHistory();
  useDocumentTitle("View Order | Urbanfit");
  useScrollTop();
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const price = calculateSubtotal(orderDetails?.items || []);
  const shippingRate = orderDetails?.shippingRate ?? defaultShipping;
  const isCancelled = orderDetails?.cancelled;

  const { id } = useParams();

  useEffect(() => {
    async function getOrder() {
      const data = await firebase.getOrder(id);
      const order = await data?.data();
      setOrderDetails(order);
    }
    getOrder();
  }, [id]);

  return (
    <section style={{ width: "100%", maxWidth: "960px", margin: "0 auto", padding: "1rem" }}>
      <h2>Order</h2>
      {!id ? null : !orderDetails ? (
        <div className="loader" style={{ minHeight: "40dvh" }}>
          <LoadingOutlined style={{ fontSize: "2rem" }} />
        </div>
      ) : (
        <div>
          {/* Header */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "2rem",
              padding: "1.5rem 0",
              borderBottom: "2px solid #f0f0f0",
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: "1.3rem" }}>
                Order #{id.slice(-8)}
              </h3>
              {orderDetails?.date && (
                <p style={{ margin: "0.3rem 0 0", color: "#6f6f6f", fontSize: "0.85rem" }}>
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
                background: isCancelled
                  ? "#fce4ec"
                  : orderDetails?.fulfillment
                    ? "#e8f5e9"
                    : "#fff3e0",
                color: isCancelled
                  ? "#c62828"
                  : orderDetails?.fulfillment
                    ? "#2e7d32"
                    : "#e65100",
              }}
            >
              {isCancelled
                ? "Cancelled"
                : orderDetails?.fulfillment
                  ? "Delivered"
                  : "Pending"}
            </div>
          </div>

          {/* Contact & Shipping */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.5rem",
              marginBottom: "2rem",
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
                  {orderDetails?.address?.email || <Skeleton width={120} />}
                </div>
                <div>
                  <span style={{ color: "#6f6f6f" }}>Phone: </span>
                  {orderDetails?.address?.mobile?.value || <Skeleton width={100} />}
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
                {orderDetails?.address?.fullname && (
                  <div style={{ fontWeight: 500 }}>{orderDetails.address.fullname}</div>
                )}
                {orderDetails?.address?.country && (
                  <div>
                    <span style={{ color: "#6f6f6f" }}>Country: </span>
                    {orderDetails.address.country}
                  </div>
                )}
                <div>
                  <span style={{ color: "#6f6f6f" }}>City: </span>
                  {orderDetails?.address?.city || <Skeleton width={80} />}
                </div>
                {orderDetails?.address?.street && (
                  <div>
                    <span style={{ color: "#6f6f6f" }}>Street: </span>
                    {orderDetails.address.street}
                  </div>
                )}
                <div>
                  <span style={{ color: "#6f6f6f" }}>Building: </span>
                  {orderDetails?.address?.building || <Skeleton width={60} />}
                </div>
                {orderDetails?.address?.floor && (
                  <div>
                    <span style={{ color: "#6f6f6f" }}>Floor: </span>
                    {orderDetails.address.floor}
                  </div>
                )}
                {orderDetails?.address?.zipcode && (
                  <div>
                    <span style={{ color: "#6f6f6f" }}>ZIP: </span>
                    {orderDetails.address.zipcode}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Payment Method */}
          {orderDetails?.payment && (
            <div
              style={{
                padding: "1.5rem",
                borderRadius: "12px",
                border: "1px solid #e8e8e8",
                background: "#fafafa",
                marginBottom: "2rem",
              }}
            >
              <h4 style={{ margin: "0 0 0.5rem", fontSize: "1rem", color: "#343120" }}>
                Payment Method
              </h4>
              <p style={{ margin: 0, fontSize: "0.95rem" }}>
                {orderDetails.payment === "COD"
                  ? "Cash on delivery"
                  : orderDetails.payment}
              </p>
            </div>
          )}

          {/* Items */}
          <div
            style={{
              padding: "1.5rem",
              borderRadius: "12px",
              border: "1px solid #e8e8e8",
              marginBottom: "2rem",
            }}
          >
            <h4 style={{ margin: "0 0 1.2rem", fontSize: "1rem", color: "#343120" }}>
              Items ({orderDetails?.items?.length || 0})
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {orderDetails?.items?.map((item, index) => (
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

          {/* Date and Status */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1.5rem",
              fontSize: "0.95rem",
              marginBottom: "1.5rem",
              paddingInline: "0.5rem",
            }}
          >
            {orderDetails?.date && (
              <div>
                <span style={{ color: "#6f6f6f" }}>Order Date: </span>
                <strong>
                  {displayDate(orderDetails.date.toDate())} at{" "}
                  {new Date(orderDetails.date.toDate()).getHours()}:
                  {String(new Date(orderDetails.date.toDate()).getMinutes()).padStart(2, "0")}
                </strong>
              </div>
            )}
            <div>
              <span style={{ color: "#6f6f6f" }}>Status: </span>
              <strong>
                {isCancelled
                  ? "Cancelled"
                  : orderDetails?.fulfillment
                    ? "Delivered"
                    : "Pending"}
              </strong>
            </div>
          </div>

          {/* Payment Summary */}
          <div
            style={{
              padding: "1.5rem",
              borderRadius: "12px",
              border: "1px solid #e8e8e8",
              marginBottom: "2rem",
            }}
          >
            <h4 style={{ margin: "0 0 1rem", fontSize: "1rem", color: "#343120" }}>
              Payment Summary
            </h4>
            <OrderPaymentSummery
              subtotal={price}
              promo={orderDetails?.promo}
              city={orderDetails?.address?.city}
              storedShippingRate={orderDetails?.shippingRate}
            />
          </div>

          {/* Cancel */}
          <div style={{ marginBottom: "3rem" }}>
            {isCancelled ? (
              <p
                style={{
                  color: "#c62828",
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  textAlign: "center",
                }}
              >
                This order has been cancelled
              </p>
            ) : (
              <button
                className="button"
                style={{ width: "100%", maxWidth: "400px", display: "block", margin: "0 auto" }}
                onClick={() => setModel(true)}
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {model && (
        <section
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            backgroundColor: "white",
            borderRadius: "1.5rem",
            padding: "2.5rem",
            width: "90%",
            maxWidth: "400px",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            alignItems: "center",
            zIndex: "1000",
            boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
          }}
        >
          <h3 style={{ margin: 0, textAlign: "center", fontSize: "1.2rem" }}>
            Are you sure you want to cancel your order?
          </h3>
          <div style={{ display: "flex", gap: "1rem", width: "100%" }}>
            <button
              style={{
                flex: 1,
                padding: "0.8rem",
                borderRadius: "0.8rem",
                border: "1px solid #333",
                background: "#fff",
                cursor: "pointer",
                fontWeight: 500,
              }}
              onClick={() => setModel(false)}
            >
              No
            </button>
            <button
              style={{
                flex: 1,
                padding: "0.8rem",
                borderRadius: "0.8rem",
                border: "1px solid #c62828",
                background: "#c62828",
                color: "#fff",
                cursor: "pointer",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
              onClick={async () => {
                setLoading(true);
                await firebase
                  .removeOrder(id, orderDetails)
                  .then(() => {
                    history.push("/");
                    displayActionMessage("Order has been canceled");
                  })
                  .catch(() => {
                    displayActionMessage("Error happened");
                  })
                  .finally(() => {
                    setLoading(false);
                  });
              }}
            >
              Yes
              {loading && (
                <div
                  style={{
                    width: "1.2rem",
                    height: "1.2rem",
                    borderRadius: "50%",
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#fff",
                  }}
                  className="spining"
                />
              )}
            </button>
          </div>
        </section>
      )}

      {/* Modal backdrop */}
      {model && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 999,
          }}
          onClick={() => setModel(false)}
        />
      )}
    </section>
  );
};

export default OrderView;
