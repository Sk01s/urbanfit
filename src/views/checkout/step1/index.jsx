import { ArrowRightOutlined, ShopOutlined } from "@ant-design/icons";
import { BasketItem } from "@/components/basket";
import { CHECKOUT_STEP_2 } from "@/constants/routes";
import { displayMoney } from "@/helpers/utils";
import { useDocumentTitle, useScrollTop } from "@/hooks";
import PropType from "prop-types";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { PromoBox, StepTracker } from "../components";
import withCheckout from "../hoc/withCheckout";
import { OrderPaymentSummery } from "@/components/common";

const OrderSummary = ({ basket, subtotal }) => {
  useDocumentTitle("Check Out Step 1 | Urbanfit");
  useScrollTop();
  const { promo } = useSelector((store) => store.checkout);
  console.log(promo);
  const dispatch = useDispatch();
  const history = useHistory();
  const onClickPrevious = () => history.push("/");
  const onClickNext = () => history.push(CHECKOUT_STEP_2);

  return (
    <div className="checkout">
      <StepTracker current={1} />
      <div className="checkout-step-1">
        <h3 className="text-center">Order Summary</h3>
        <span className="d-block text-center">
          Review items in your basket.
        </span>
        <br />
        <div className="checkout-items">
          {basket.map((product) => (
            <BasketItem
              basket={basket}
              dispatch={dispatch}
              key={product.id}
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
            onClick={onClickPrevious}
            type="button"
            style={{ fontSize: "1.3rem" }}
          >
            <ShopOutlined />
            &nbsp; Continue Shopping
          </button>
          <button
            className="button"
            onClick={onClickNext}
            type="submit"
            style={{ fontSize: "1.3rem" }}
          >
            Next Step &nbsp;
            <ArrowRightOutlined />
          </button>
        </div>
      </div>
    </div>
  );
};

OrderSummary.propTypes = {
  basket: PropType.arrayOf(PropType.object).isRequired,
  subtotal: PropType.number.isRequired,
};

export default withCheckout(OrderSummary);
