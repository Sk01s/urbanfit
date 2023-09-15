import { SET_ORDERS } from "@/constants/constants";

export const setOrders = (orders) => ({
  type: SET_ORDERS,
  payload: orders,
});

// export const setPaymentDetails = (details) => ({
//   type: SET_CHECKOUT_PAYMENT_DETAILS,
//   payload: details,
// });

// export const resetCheckout = () => ({
//   type: RESET_CHECKOUT,
// });
