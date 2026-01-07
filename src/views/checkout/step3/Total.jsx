import {
  ArrowLeftOutlined,
  CheckOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { CHECKOUT_STEP_2, ORDER_COMPLETED } from "@/constants/routes";
import { useFormikContext } from "formik";
import { displayMoney, displayActionMessage } from "@/helpers/utils";
import PropType from "prop-types";
import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { setPaymentDetails } from "@/redux/actions/checkoutActions";
import firebase from "@/services/firebase";
import { clearBasket } from "@/redux/actions/basketActions";
import emailjs from "@emailjs/browser";
import { OrderPaymentSummery } from "@/components/common";
import { PromoBox } from "../components";
import { setPromo } from "@/redux/actions/checkoutActions";
import { shipping } from "@/constants/constants";
import firebaseInstance from "@/services/firebase";
function getOrdinalSuffix(number) {
  if (number === 0) {
    return "0"; // Special case for 0
  }

  const lastDigit = number % 10;
  const lastTwoDigits = number % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
    return number + "th";
  }

  switch (lastDigit) {
    case 1:
      return number + "st (floor)";
    case 2:
      return number + "nd (floor)";
    case 3:
      return number + "rd (floor)";
    default:
      return number + "th (floor)";
  }
}

const Total = ({ isInternational, subtotal, order }) => {
  const [loading, setLoading] = useState(false);
  const isNotOrderValide = () =>
    !!order.items.find(
      (product) => product[`${product.selectedSize}Quantity`] <= 0
    );

  const displaySizeForOmar = (size) => {
    if (size === "lg") return "L";
    if (size === "md") return "M";
    if (size === "sm") {
      return "S";
    } else {
      return size?.toLocaleUpperCase();
    }
  };
  const { values, submitForm } = useFormikContext();
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const searchData = new URLSearchParams();
  const summery = () => `
    <div style="padding-inline: 3rem;">
      <div style="font-size: 1.4rem; display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; font-weight: 400;">
        <div style="color: rgb(115, 115, 115);">Subtotal :</div>
        <strong>$${subtotal}</strong>
      </div>
      <div style="font-size: 1.4rem; display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; font-weight: 400;">
        <div style="color: rgb(115, 115, 115);">Discount :</div>
        <strong>-$${(subtotal * order.promo.percentage) / 100}</strong>
      </div>
      <div style="font-size: 1.4rem; display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; font-weight: 400;">
        <div style="color: rgb(115, 115, 115);">Shipping :</div>
        <strong>$${shipping}</strong>
      </div>
      <div style="width: 100%; height: 1px; background-color: rgb(202, 202, 202); margin-block: 2rem;"></div>
      <div style="font-size: 1.4rem; display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; font-weight: 400;">
        <div style="color: rgb(115, 115, 115);">Total:</div>
        <strong>$${subtotal + shipping - (subtotal * order.promo.percentage) / 100
    }</strong>
      </div>
    </div>
  `;
  const contact = () => `
    <div>
      <h4 style="margin-block: 1rem; font-size: 1.35rem; font-weight: 500;">
        Shipping address
      </h4>
      <p style="color: #555;  margin-bottom: 0.5rem;">
        ${order.address?.fullname}
      </p>
      <p style="color: #555;  margin-bottom: 0.5rem;">
      ${order.address?.street}
      </p>
      <p style="color: #555;  margin-bottom: 0.5rem;">
      ${order.address?.building} 
      ${getOrdinalSuffix(parseInt(order?.address.floor))}
      </p>
      <p style="color: #555;  margin-bottom: 0.5rem;">
      ${order.address?.city}
      ${order.address?.zipcode}
      </div>
      <p style="color: #555;  margin-bottom: 0.5rem;">
      ${order.address?.country}
      </p>
      <p style="color: #555;  margin-bottom: 0.5rem;">
      ${order.address?.mobile.value}
      </p>
    </div>`;
  const createEmailItems = () => {
    const items = order.items.reduce((acc, product) => {
      return (
        acc +
        `<div style="width: fit-content;
        border:solid 1px #a1a1a1;
          align-items: center;
          margin-bottom: 1.2rem;
        border-radius:.5rem;">
  <div class="basket-item-wrapper" style="display: flex;
  align-items: center;
  padding: 0.5rem 1rem;" >
    <div class="basket-item-img-wrapper" style="  width: 90px;
    height: 90px;
    margin-right:1.6rem;
    position: relative;
  display:inline-block">
    <img
        alt="${product.name}"
        style="height:100%; display:block; object-fit:contain; border-radius:0.5rem;"
        src="${product.image}"
      />
    </div>
    <div  style="  flex-grow: 1;
    display:inline-block;">
      <div
        style="
        display: flex;
        gap: 1rem;
        align-items: center;;'
      >
      <a
          href="urbanfitlb.com/product/${product.id}"
          style="max-width: 30vw" 
        >
          <span class="basket-item-name" style="margin: 1.2rem 0;
          font-size: 12px;
          color: #939393;">"${product.name}"</span>
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
          <div
            style="display: flex;
            align-items: center;" 
          >
            <span class="spec-title" style="font-size:0.9rem;
           ">size : </span>
            <span class="my-0" style="
            font-size:0.9rem;">
              ${displaySizeForOmar(product.selectedSize)}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`
      );
    }, "");
    return `<div>${items}</div>`;
  };
  createEmailItems();
  const handleOrder = async () => {
    try {
      if (order.payment === "")
        return displayActionMessage("Please select payment method.", "info");
      if (order.payment === "credit")
        return displayActionMessage(
          "Unfortunately, we are not accepting online payments yet.",
          "info"
        );
      // Update the Orders date
      if (isNotOrderValide()) {
        return displayActionMessage(
          "one or more of your item/items is out of stock",
          "info"
        );
      }
      setLoading(true);
      order.date = new Date();
      order.otp = false;
      if (!order.uid) {
        order.uid = firebaseInstance.getCurrentUser();
      }
      await firebase.addOrder(order.id, order);
      // await emailjs.send(
      //   "service_vyw8iqt",
      //   "template_btzkhrc",
      //   {
      //     id: order.id,
      //     name: order.address.fullname,
      //     email: order.address.email,
      //     items: createEmailItems(),
      //     contact: contact(),
      //     summery: summery(),
      //   },
      //   "JPeR2g9TA1pVocFL4"
      // );
      dispatch(clearBasket());
      dispatch(setPromo({ percentage: 0 }));
      // setLoading(false);
      history.push(`/order-completed/${order.id}`, order);
    } catch (error) {
      displayActionMessage(error, "error");
    }
  };
  const onClickBack = () => {
    // destructure to only select left fields omitting cardnumber and ccv
    const { cardnumber, ccv, ...rest } = values;

    dispatch(setPaymentDetails({ ...rest })); // save payment details
    history.push(CHECKOUT_STEP_2);
  };

  return (
    <>
      <PromoBox />
      <br />
      <br />
      <br />
      <div className="basket-total text-right">
        <OrderPaymentSummery subtotal={subtotal} promo={order.promo} />
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
          disabled={false}
          onClick={handleOrder}
          type="button"
          style={{
            fontSize: "1.3rem",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          {loading ? <LoadingOutlined /> : <CheckOutlined />}
          &nbsp; Confirm
        </button>
      </div>
    </>
  );
};

Total.propTypes = {
  isInternational: PropType.bool.isRequired,
  subtotal: PropType.number.isRequired,
};

export default Total;
