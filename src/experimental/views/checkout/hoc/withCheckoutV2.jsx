import { CHECKOUT_STEP_1 } from "@/constants/routes";
import { calculateSubtotal } from "@/helpers/utils";
import React from "react";
import { useSelector } from "react-redux";
import { Redirect, withRouter } from "react-router-dom";

const withCheckoutV2 = (Component) =>
  withRouter((props) => {
    const state = useSelector((store) => ({
      isAuth: !!store.auth.id && !!store.auth.role,
      basketV2: store.basketV2,
      shipping: store.checkout.shipping,
      payment: store.checkout.payment,
      profile: store.profile,
    }));

    const shippingFee = state.shipping.isInternational ? 50 : 0;
    const subtotal = calculateSubtotal(state.basketV2);

    if (!state.isAuth) {
      return <Redirect to="/signin" />;
    }
    if (state.basketV2.length === 0) {
      return <Redirect to="/" />;
    }
    if (state.isAuth && state.basketV2.length !== 0) {
      return (
        <Component
          {...props}
          basket={state.basketV2}
          payment={state.payment}
          profile={state.profile}
          shipping={state.shipping}
          subtotal={Number(subtotal + shippingFee)}
        />
      );
    }
    return null;
  });

export default withCheckoutV2;