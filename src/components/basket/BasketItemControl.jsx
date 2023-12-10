import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import PropType from "prop-types";
import React from "react";
import { useDispatch } from "react-redux";
import { addQtyItem, minusQtyItem } from "@/redux/actions/basketActions";

const BasketItemControl = ({ product }) => {
  const dispatch = useDispatch();
  const selectedSizeQuantity = product[`${product.selectedSize}Quantity`];

  const onAddQty = () => {
    if (product.quantity < selectedSizeQuantity) {
      dispatch(addQtyItem(product.id));
    }
  };

  const onMinusQty = () => {
    if (selectedSizeQuantity >= product.quantity && product.quantity !== 0) {
      dispatch(minusQtyItem(product.id));
    }
  };

  return (
    <div className="basket-item-control">
      <button
        style={{ color: "#000" }}
        className="  button-small basket-control basket-control-minus"
        disabled={product.quantity === 1}
        onClick={onMinusQty}
        type="button"
      >
        <MinusOutlined style={{ fontSize: "9px" }} />
      </button>
      {product.quantity}

      <button
        style={{ color: "#000" }}
        className="  button-small basket-control basket-control-add"
        disabled={selectedSizeQuantity === product.quantity}
        onClick={onAddQty}
        type="button"
      >
        <PlusOutlined style={{ fontSize: "9px" }} />
      </button>
    </div>
  );
};

BasketItemControl.propTypes = {
  product: PropType.shape({
    id: PropType.string,
    name: PropType.string,
    type: PropType.string,
    price: PropType.number,
    quantity: PropType.number,
    description: PropType.string,
    keywords: PropType.arrayOf(PropType.string),
    selectedSize: PropType.string,
    selectedColor: PropType.string,
    imageCollection: PropType.arrayOf(PropType.string),
    sizes: PropType.arrayOf(PropType.number),
    image: PropType.string,
    imageUrl: PropType.string,
    isFeatured: PropType.bool,
    isRecommended: PropType.bool,
    availableColors: PropType.arrayOf(PropType.string),
  }).isRequired,
};

export default BasketItemControl;
