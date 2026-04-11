import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import PropType from "prop-types";
import React from "react";
import { useDispatch } from "react-redux";
import { addQtyItemV2, minusQtyItemV2 } from "@/experimental/redux/actions/basketV2Actions";

const getItemKey = (id, selectedColor, selectedSize) =>
  `${id}_${selectedColor || ""}_${selectedSize || ""}`;

const BasketItemControlV2 = ({ product }) => {
  const dispatch = useDispatch();
  const activeVariant = product.activeVariant;
  const selectedSizeQuantity = activeVariant?.quantities
    ? activeVariant.quantities[product.selectedSize] || 0
    : 0;

  const itemKey = getItemKey(product.id, product.selectedColor, product.selectedSize);

  const onAddQty = () => {
    if (product.quantity < selectedSizeQuantity) {
      dispatch(addQtyItemV2(itemKey));
    }
  };

  const onMinusQty = () => {
    if (product.quantity > 1) {
      dispatch(minusQtyItemV2(itemKey));
    }
  };

  return (
    <div className="basket-item-control">
      <button
        style={{ color: "#000" }}
        className="button-small basket-control basket-control-minus"
        disabled={product.quantity === 1}
        onClick={onMinusQty}
        type="button"
      >
        <MinusOutlined style={{ fontSize: "9px" }} />
      </button>
      {product.quantity}
      <button
        style={{ color: "#000" }}
        className="button-small basket-control basket-control-add"
        disabled={selectedSizeQuantity === product.quantity}
        onClick={onAddQty}
        type="button"
      >
        <PlusOutlined style={{ fontSize: "9px" }} />
      </button>
    </div>
  );
};

BasketItemControlV2.propTypes = {
  product: PropType.shape({
    id: PropType.string,
    name: PropType.string,
    price: PropType.number,
    quantity: PropType.number,
    selectedSize: PropType.string,
    selectedColor: PropType.string,
    selectedColorName: PropType.string,
    activeVariant: PropType.shape({
      color: PropType.string,
      name: PropType.string,
      image: PropType.string,
      quantities: PropType.object,
    }),
  }).isRequired,
};

export default BasketItemControlV2;