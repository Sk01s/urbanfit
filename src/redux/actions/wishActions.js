import {
  ADD_TO_WISH,
  CLEAR_WISH,
  REMOVE_FROM_WISH,
  SET_WISH_ITEMS,
} from "@/constants/constants";

export const setWishItems = (items = []) => ({
  type: SET_BASKET_ITEMS,
  payload: items,
});

export const addToWish = (product) => ({
  type: ADD_TO_WISH,
  payload: product,
});

export const removeFromWish = (id) => ({
  type: REMOVE_FROM_WISH,
  payload: id,
});

export const clearWish = () => ({
  type: CLEAR_WISH,
});
