import { SET_ORDERS } from "@/constants/constants";
const defaultState = {
  orders: [],
};

export default (state = defaultState, action) => {
  console.log(action.payload);
  switch (action.type) {
    case SET_ORDERS:
      return {
        orders: action.payload,
      };
    // case SET_CHECKOUT_PAYMENT_DETAILS:
    //   return {
    //     ...state,
    //     payment: action.payload,
    //   };
    // case RESET_CHECKOUT:
    //   return defaultState;
    default:
      return state;
  }
};
