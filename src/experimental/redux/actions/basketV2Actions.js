import {
  ADD_QTY_ITEM_V2,
  ADD_TO_BASKET_V2,
  CLEAR_BASKET_V2,
  MINUS_QTY_ITEM_V2,
  REMOVE_FROM_BASKET_V2,
  SET_BASKET_V2_ITEMS,
} from "@/experimental/constants/actionTypesV2";

export const setBasketV2Items = (items = []) => ({
  type: SET_BASKET_V2_ITEMS,
  payload: items,
});

export const addToBasketV2 = (product) => ({
  type: ADD_TO_BASKET_V2,
  payload: product,
});

export const removeFromBasketV2 = (itemKey) => ({
  type: REMOVE_FROM_BASKET_V2,
  payload: itemKey,
});

export const clearBasketV2 = () => ({
  type: CLEAR_BASKET_V2,
});

export const addQtyItemV2 = (itemKey) => ({
  type: ADD_QTY_ITEM_V2,
  payload: itemKey,
});

export const minusQtyItemV2 = (itemKey) => ({
  type: MINUS_QTY_ITEM_V2,
  payload: itemKey,
});