import { displayActionMessage } from "@/helpers/utils";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWish as dispatchAddToWish,
  removeFromWish,
} from "@/redux/actions/wishActions";

const useWish = () => {
  const { wish } = useSelector((state) => ({ wish: state.wish }));
  const dispatch = useDispatch();

  const isItemOnWish = (id) => !!wish.find((item) => item.id === id);

  const removeFromWish = (product) => {
    dispatch(removeFromWish(product.id));
    displayActionMessage("Item removed from wish list", "info");
  };
  const addToWish = (product) => {
    dispatch(dispatchAddToWish(product));
    displayActionMessage("Item added to wish list", "success");
    console.log(wish);
  };

  return { wish, removeFromWish, addToWish, isItemOnWish };
};

export default useWish;
