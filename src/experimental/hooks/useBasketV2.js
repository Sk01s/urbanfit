import { displayActionMessage } from "@/helpers/utils";
import { useDispatch, useSelector } from "react-redux";
import {
  addToBasketV2 as dispatchAddToBasket,
  removeFromBasketV2,
} from "@/experimental/redux/actions/basketV2Actions";

const getItemKey = (id, selectedColor, selectedSize) =>
  `${id}_${selectedColor || ""}_${selectedSize || ""}`;

const useBasketV2 = () => {
  const { basketV2 } = useSelector((state) => ({
    basketV2: state.basketV2,
  }));
  const dispatch = useDispatch();

  const isItemOnBasket = (id, selectedColor, selectedSize) =>
    !!basketV2.find(
      (item) => getItemKey(item.id, item.selectedColor, item.selectedSize) === getItemKey(id, selectedColor, selectedSize)
    );

  const addToBasket = (product, show) => {
    if (product.selectedSize === "")
      return displayActionMessage("select size", "info");
    const key = getItemKey(product.id, product.selectedColor, product.selectedSize);
    if (isItemOnBasket(product.id, product.selectedColor, product.selectedSize)) {
      dispatch(removeFromBasketV2(key));
    } else {
      dispatch(dispatchAddToBasket(product));
      show();
    }
  };

  return { basketV2, isItemOnBasket, addToBasket, getItemKey };
};

export default useBasketV2;