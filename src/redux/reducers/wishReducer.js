import {
  ADD_TO_WISH,
  CLEAR_WISH,
  REMOVE_FROM_WISH,
  SET_WISH_ITEMS,
} from "@/constants/constants";

export default (state = localStorage.getItem("wishlist") || [], action) => {
  switch (action.type) {
    case SET_WISH_ITEMS:
      localStorage.setItem("wishlist", action.payload);
      return action.payload;
    case ADD_TO_WISH: {
      const data = state.some((product) => product.id === action.payload.id)
        ? state
        : [action.payload, ...state];
      localStorage.setItem("wishlist", data);
      return data;
    }
    case REMOVE_FROM_WISH: {
      const data = state.filter((product) => product.id !== action.payload);
      localStorage.setItem("wishlist", data);
      return data;
    }
    case CLEAR_WISH:
      localStorage.setItem("wishlist", []);
      return [];

    default:
      return state;
  }
};
