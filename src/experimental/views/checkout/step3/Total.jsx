import {
  ArrowLeftOutlined,
  CheckOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { CHECKOUT_STEP_2 } from "@/constants/routes";
import { useFormikContext } from "formik";
import { displayMoney, displayActionMessage } from "@/helpers/utils";
import { getVariantStock } from "@/experimental/helpers/getProductVariant";
import PropType from "prop-types";
import React, { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { setPaymentDetails } from "@/redux/actions/checkoutActions";
import firebaseV2 from "@/experimental/services/firebaseV2";
import { clearBasketV2 } from "@/experimental/redux/actions/basketV2Actions";
import { OrderPaymentSummery } from "@/components/common";
import { PromoBox } from "@/views/checkout/components";
import { setPromo } from "@/redux/actions/checkoutActions";
import { shipping as defaultShipping } from "@/constants/constants";
import firebaseInstance from "@/services/firebase";

const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:3001";

const displaySizeForOmar = (size) => {
  if (size === "lg") return "L";
  if (size === "md") return "M";
  if (size === "sm") return "S";
  return size?.toLocaleUpperCase();
};

const TotalV2 = ({ isInternational, subtotal, order, paymentType }) => {
  const [loading, setLoading] = useState(false);
  const [shippingRate, setShippingRate] = useState(defaultShipping);
  const city = order?.address?.city;

  useEffect(() => {
    const fetchShippingRate = async () => {
      if (!city) {
        setShippingRate(defaultShipping);
        return;
      }
      try {
        const response = await fetch(
          `${BACKEND_API_URL}/api/shipping/rate/${encodeURIComponent(city)}`
        );
        const data = await response.json();
        if (data.success) {
          setShippingRate(data.rate);
        } else {
          setShippingRate(defaultShipping);
        }
      } catch (error) {
        setShippingRate(defaultShipping);
      }
    };
    fetchShippingRate();
  }, [city]);

  const isNotOrderValide = () =>
    !!order.items.find((product) => {
      const stock = product.activeVariant?.quantities
        ? product.activeVariant.quantities[product.selectedSize]
        : 0;
      return stock <= 0;
    });

  const { values, submitForm } = useFormikContext();
  const history = useHistory();
  const dispatch = useDispatch();

  const createEmailItems = () => {
    return order.items.reduce((acc, product) => {
      const thumbnail = product.activeVariant?.image || product.image;
      return (
        acc +
        `<div style="width: fit-content; border:solid 1px #a1a1a1; align-items: center; margin-bottom: 1.2rem; border-radius:.5rem;">
          <div class="basket-item-wrapper" style="display: flex; align-items: center; padding: 0.5rem 1rem;">
            <div class="basket-item-img-wrapper" style="width: 90px; height: 90px; margin-right:1.6rem; position: relative; display:inline-block;">
              <img alt="${product.name}" style="height:100%; display:block; object-fit:contain; border-radius:0.5rem;" src="${thumbnail}" />
            </div>
            <div style="flex-grow: 1; display:inline-block;">
              <div style="display: flex; gap: 1rem; align-items: center;">
                <a href="urbanfitlb.com/product/${product.id}" style="max-width: 30vw">
                  <span class="basket-item-name" style="margin: 1.2rem 0; font-size: 12px; color: #939393;">${product.name}</span>
                </a>
                <div class="basket-item-price">
                  <span class="my-0">${displayMoney(
                    product.onSale
                      ? Number(product.price) * (1 - Number(product.percentage / 100))
                      : product.price
                  )}</span>
                </div>
              </div>
              <div class="basket-item-specs">
                <div>
                  <div style="display: flex; align-items: center;">
                    ${product.selectedColorName ? `<span class="spec-title" style="font-size:0.9rem;">Color: ${product.selectedColorName}</span>` : ""}
                    <span class="spec-title" style="font-size:0.9rem;">&nbsp;|&nbsp;Size: ${displaySizeForOmar(product.selectedSize)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>`
      );
    }, "");
  };

  const handleOrder = async () => {
    try {
      if (order.payment === "")
        return displayActionMessage("Please select payment method.", "info");
      if (order.payment === "credit")
        return displayActionMessage(
          "Unfortunately, we are not accepting online payments yet.",
          "info"
        );
      if (isNotOrderValide()) {
        return displayActionMessage(
          "One or more of your items is out of stock",
          "info"
        );
      }
      setLoading(true);
      order.date = new Date();
      order.otp = false;
      order.shippingRate = shippingRate;
      if (!order.uid) {
        order.uid = firebaseInstance.getCurrentUser();
      }
      await firebaseV2.addOrderV2(order.id, order);

      try {
        await fetch(`${BACKEND_API_URL}/api/email/order-confirmation`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order }),
        });
      } catch (emailError) {
        console.error("Failed to send order confirmation emails:", emailError);
      }

      dispatch(clearBasketV2());
      dispatch(setPromo({ percentage: 0 }));
      history.push(`/order-completed/${order.id}`, order);
    } catch (error) {
      displayActionMessage(error, "error");
    }
  };

  const onClickBack = () => {
    const { cardnumber, ccv, ...rest } = values;
    dispatch(setPaymentDetails({ ...rest }));
    history.push(CHECKOUT_STEP_2);
  };

  return (
    <>
      <PromoBox />
      <br />
      <br />
      <br />
      <div className="basket-total text-right">
        <OrderPaymentSummery subtotal={subtotal} promo={order.promo} city={city} />
      </div>
      <br />
      <br />
      <div className="checkout-shipping-action">
        <button
          className="button button-muted"
          onClick={() => onClickBack(values)}
          type="button"
          style={{ fontSize: "1.3rem" }}
        >
          <ArrowLeftOutlined />
          &nbsp; Go Back
        </button>
        <button
          className="button"
          disabled={!paymentType}
          onClick={handleOrder}
          type="button"
          style={{ fontSize: "1.3rem", display: "flex", alignItems: "center", gap: "1rem" }}
        >
          {loading ? <LoadingOutlined /> : <CheckOutlined />}
          &nbsp; Confirm
        </button>
      </div>
    </>
  );
};

TotalV2.propTypes = {
  isInternational: PropType.bool.isRequired,
  subtotal: PropType.number.isRequired,
  paymentType: PropType.string,
};

export default TotalV2;