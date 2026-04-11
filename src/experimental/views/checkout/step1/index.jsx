import { CHECKOUT_STEP_1, CHECKOUT_STEP_2 } from "@/constants/routes";
import { BasketItemV2 } from "@/experimental/components/basket";
import { displayMoney } from "@/helpers/utils";
import { useDocumentTitle, useScrollTop } from "@/hooks";
import PropType from "prop-types";
import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { PromoBox, StepTracker } from "@/views/checkout/components";
import withCheckoutV2 from "../hoc/withCheckoutV2";
import { OrderPaymentSummery } from "@/components/common";

const OrderSummaryV2 = ({ basket, subtotal }) => {
  useDocumentTitle("Check Out Step 1 | Urbanfit");
  useScrollTop();
  const promo = useSelector((store) => store.checkout.promo);
  const history = useHistory();

  return (
    <div className="checkout">
      <StepTracker current={1} />
      <div className="checkout-step-1">
        <h3 className="text-center">Order Summary</h3>
        <span className="d-block text-center">Review items in your basket.</span>
        <br />
        <div className="checkout-items">
          {basket.map((product) => (
            <BasketItemV2
              key={`${product.id}_${product.selectedColor}_${product.selectedSize}`}
              product={product}
            />
          ))}
        </div>
        <PromoBox />
        <br />
        <div className="basket-total text-right">
          <OrderPaymentSummery subtotal={subtotal} promo={promo} />
        </div>
        <br />
        <div className="checkout-shipping-action">
          <button
            className="button button-muted"
            onClick={() => history.push("/")}
            type="button"
            style={{ fontSize: "1.3rem" }}
          >
            Continue Shopping
          </button>
          <button
            className="button"
            onClick={() => history.push(CHECKOUT_STEP_2)}
            type="submit"
            style={{ fontSize: "1.3rem" }}
          >
            Next Step &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

OrderSummaryV2.propTypes = {
  basket: PropType.arrayOf(PropType.object).isRequired,
  subtotal: PropType.number.isRequired,
};

export default withCheckoutV2(OrderSummaryV2);