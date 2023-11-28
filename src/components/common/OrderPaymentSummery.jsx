import React from "react";
import { calculateDiscount, displayMoney } from "@/helpers/utils";
import { shipping } from "@/constants/constants";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
const OrderPaymentSummery = ({ subtotal, promo }) => {
  const [discount, setDiscount] = useState(
    calculateDiscount(subtotal, (promo = { percentage: 0 }))
  );
  const total = subtotal - discount + shipping;
  useEffect(() => {
    setDiscount(calculateDiscount(subtotal, promo));
  }, [subtotal, promo]);
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
        <div style={{ color: "rgb(115, 115, 115)" }}>Shipping :</div>
        <strong>{displayMoney(shipping)}</strong>
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
