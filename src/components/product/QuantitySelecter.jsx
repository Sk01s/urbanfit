import React, { useState } from "react";

const QuantitySelector = ({ setQuantity, quantity, maxQuantity = 10 }) => {
  const handleIncrement = () => {
    if (quantity === maxQuantity) return;
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
      <button
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "48px",
          padding: 0,
          height: "48px",
          marginRight: 10,
          marginLeft: 10,
          flexShrink: 1,
          fontSize: 16,
          fontWeight: 400,
          fontStyle: "normal",
          background: "#ffffff",
          color: " #343a40",
          border: " 1px rgb(204,206,207) solid",
          padding: " .8em 15",
          margin: 0,
          verticalalign: "middle",
          maxwidth: "100%",
          borderRadius: 3,
        }}
        onClick={handleDecrement}
      >
        -
      </button>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "48px",
          padding: 0,
          height: "48px",
          marginRight: 10,
          marginLeft: 10,
          flexShrink: 1,
          fontSize: 16,
          fontWeight: 400,
          fontStyle: "normal",
          background: "#ffffff",
          color: " #343a40",
          border: " 1px rgb(204,206,207) solid",
          padding: " .8em 15",
          margin: 0,
          verticalalign: "middle",
          maxwidth: "100%",
          borderRadius: 3,
        }}
      >
        {quantity}
      </div>
      <button
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "48px",
          padding: 0,
          height: "48px",
          marginRight: 10,
          marginLeft: 10,
          flexShrink: 1,
          fontSize: 16,
          fontWeight: 400,
          fontStyle: "normal",
          background: "#ffffff",
          color: " #343a40",
          border: " 1px rgb(204,206,207) solid",
          padding: " .8em 15",
          margin: 0,
          verticalalign: "middle",
          maxwidth: "100%",
          borderRadius: 3,
        }}
        onClick={handleIncrement}
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;
