import React, { useState, useEffect } from "react";
import { calculateDiscount, displayMoney } from "@/helpers/utils";
import { shipping as defaultShipping } from "@/constants/constants";
import { useSelector } from "react-redux";

const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:3001";

const OrderPaymentSummery = ({ subtotal, promo, city, storedShippingRate }) => {
  const [discount, setDiscount] = useState(
    calculateDiscount(subtotal, promo || { percentage: 0 })
  );
  const [shippingRate, setShippingRate] = useState(storedShippingRate ?? defaultShipping);
  const [loadingShipping, setLoadingShipping] = useState(false);

  // Fetch shipping rate based on city (only if no stored rate is provided)
  useEffect(() => {
    // If a stored shipping rate is provided (viewing existing order), use it
    if (storedShippingRate !== undefined) {
      setShippingRate(storedShippingRate);
      return;
    }

    const fetchShippingRate = async () => {
      if (!city) {
        setShippingRate(defaultShipping);
        return;
      }

      setLoadingShipping(true);
      try {
        const response = await fetch(
          `${BACKEND_API_URL}/api/shipping/rate/${encodeURIComponent(city)}`
        );
        const data = await response.json();
        
        if (data.success) {
          setShippingRate(data.rate);
        } else {
          setShippingRate(defaultShipping);
        }
      } catch (error) {
        console.error("Failed to fetch shipping rate:", error);
        setShippingRate(defaultShipping);
      } finally {
        setLoadingShipping(false);
      }
    };

    fetchShippingRate();
  }, [city, storedShippingRate]);

  useEffect(() => {
    setDiscount(calculateDiscount(subtotal, promo));
  }, [subtotal, promo]);

  const total = subtotal - discount + shippingRate;

  return (
    <div style={{ paddingInline: "3rem" }}>
      <div
        style={{
          fontSize: "1.4rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1rem",
          fontWeight: "400",
        }}
      >
        <div style={{ color: "rgb(115, 115, 115)" }}>Subtotal :</div>
        <strong>{displayMoney(subtotal)}</strong>
      </div>
      <div
        style={{
          fontSize: "1.4rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1rem",
          fontWeight: "400",
        }}
      >
        <div style={{ color: "rgb(115, 115, 115)" }}>Discount :</div>
        <strong>-{displayMoney(discount)}</strong>
      </div>
      <div
        style={{
          fontSize: "1.4rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1rem",
          fontWeight: "400",
        }}
      >
        <div style={{ color: "rgb(115, 115, 115)" }}>
          Shipping {city && <span style={{ fontSize: "0.9rem" }}>({city})</span>} :
        </div>
        <strong>
          {loadingShipping ? "..." : displayMoney(shippingRate)}
        </strong>
      </div>
      <div
        style={{
          width: "100%",
          height: "1px",
          backgroundColor: "#cacaca",
          marginBlock: "2rem",
        }}
      ></div>
      <div
        style={{
          fontSize: "1.4rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1rem",
          fontWeight: "400",
        }}
      >
        <div style={{ color: "rgb(115, 115, 115)" }}>Total:</div>
        <strong>{displayMoney(total)}</strong>
      </div>
    </div>
  );
};

export default OrderPaymentSummery;
