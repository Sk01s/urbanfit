import { SET_PRODUCTS_V2 } from "@/experimental/constants/actionTypesV2";

const defaultState = {
  lastRefKey: null,
  total: 0,
  items: [],
  searchedProducts: { lastRefKey: null, total: 0, items: [] },
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case SET_PRODUCTS_V2:
      return {
        ...state,
        items: action.payload,
      };
    default:
      return state;
  }
};