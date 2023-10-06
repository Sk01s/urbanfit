import React, { useState } from "react";

const QuantitySelector = ({
  onQuantityChange,
  setQuantity,
  quantity,
  maxQuantity,
}) => {
  const handleIncrement = () => {
    if (quantity === maxQuantity) return;
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    onQuantityChange(newQuantity);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onQuantityChange(newQuantity);
    }
  };

  return (
    <div className="quantity-selector">
      <button className="decrement" onClick={handleDecrement}>
        -
      </button>
      <span className="quantity">{quantity}</span>
      <button className="increment" onClick={handleIncrement}>
        +
      </button>
    </div>
  );
};

export default QuantitySelector;
