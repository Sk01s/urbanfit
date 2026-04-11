import { SET_PRODUCTS_V2 } from "@/experimental/constants/actionTypesV2";

export const setAllProductsV2 = (products) => ({
  type: SET_PRODUCTS_V2,
  payload: products,
});