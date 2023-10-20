import { displayActionMessage } from "@/helpers/utils";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWish as dispatchAddToWish,
  removeFromWish as dispatchRemoveFromWish,
} from "@/redux/actions/wishActions";

const useWish = () => {
  const { wish } = useSelector((state) => ({ wish: state.wish }));
  const dispatch = useDispatch();

  const isItemOnWish = (id) => !!wish.find((item) => item.id === id);

  const removeFromWish = (product) => {
    dispatch(dispatchRemoveFromWish(product.id));
    displayActionMessage("Item removed from wish list", "info");
  };
  const addToWish = (product) => {
    if (isItemOnWish(product.id)) return removeFromWish(product);
    dispatch(dispatchAddToWish(product));
    displayActionMessage("Item added to wish list", "success");
    console.log(wish);
  };

  return { wish, removeFromWish, addToWish, isItemOnWish };
};

export default useWish;
