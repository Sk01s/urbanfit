import {
  ADD_QTY_ITEM_V2,
  ADD_TO_BASKET_V2,
  CLEAR_BASKET_V2,
  MINUS_QTY_ITEM_V2,
  REMOVE_FROM_BASKET_V2,
  SET_BASKET_V2_ITEMS,
} from "@/experimental/constants/actionTypesV2";

const getItemKey = (item) =>
  `${item.id}_${item.selectedColor || ""}_${item.selectedSize || ""}`;

export default (state = [], action) => {
  switch (action.type) {
    case SET_BASKET_V2_ITEMS:
      return action.payload;

    case ADD_TO_BASKET_V2: {
      const key = getItemKey(action.payload);
      const exists = state.some((item) => getItemKey(item) === key);
      if (exists) return state;
      return [action.payload, ...state];
    }

    case REMOVE_FROM_BASKET_V2:
      return state.filter((item) => getItemKey(item) !== action.payload);

    case CLEAR_BASKET_V2:
      return [];

    case ADD_QTY_ITEM_V2:
      return state.map((item) => {
        if (getItemKey(item) === action.payload) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });

    case MINUS_QTY_ITEM_V2:
      return state.map((item) => {
        if (getItemKey(item) === action.payload) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      });

    default:
      return state;
  }
};