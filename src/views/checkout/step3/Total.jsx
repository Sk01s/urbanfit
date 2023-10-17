import { ArrowLeftOutlined, CheckOutlined } from "@ant-design/icons";
import { CHECKOUT_STEP_2, ORDER_COMPLETED } from "@/constants/routes";
import { useFormikContext } from "formik";
import { displayMoney, displayActionMessage } from "@/helpers/utils";
import PropType from "prop-types";
import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { setPaymentDetails } from "@/redux/actions/checkoutActions";
import firebase from "@/services/firebase";
import { clearBasket } from "@/redux/actions/basketActions";
import emailjs from "@emailjs/browser";

const Total = ({ isInternational, subtotal, order }) => {
  const displaySizeForOmar = (size) => {
    if (size === "lg") return "L";
    if (size === "md") return "M";
    if (size === "sm") {
      return "S";
    } else {
      return size.toLocaleUpperCase();
    }
  };
  const { values, submitForm } = useFormikContext();
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const searchData = new URLSearchParams();
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
          <span class="my-0">${displayMoney(product.price)}</span>
        </div>
      </div>

      <div class="basket-item-specs">
        <div>
          <div
            style="display: flex;
            align-items: center;" 
          >
            <span class="spec-title" style="font-size:0.9rem;
            font-size:1rem;">Size : </span>
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
  const handleOrder = () => {
    if (order.payment !== "COD")
      return displayActionMessage("Feature not ready yet :)", "info");
    // Update the Orders date

    order.date = new Date();
    order.otp = false;

    firebase.addOrder(order.id, order);
    emailjs
      .send(
        "service_vyw8iqt",
        "template_btzkhrc",
        {
          id: order.id.split("-")[0],
          name: order.address.fullname,
          email: order.address.email,
          items: createEmailItems(),
        },
        "JPeR2g9TA1pVocFL4"
      )
      .then((e) => console.log(e));
    dispatch(clearBasket());
    
    history.push(`/order-completed/${order.id}`, order);
  };
  const onClickBack = () => {
    // destructure to only select left fields omitting cardnumber and ccv
    const { cardnumber, ccv, ...rest } = values;

    dispatch(setPaymentDetails({ ...rest })); // save payment details
    history.push(CHECKOUT_STEP_2);
  };

  return (
    <>
      <div className="basket-total text-right">
        <p className="basket-total-title">Total:</p>
        <h2 className="basket-total-amount">
          {displayMoney(subtotal + (isInternational ? 50 : 5))}
        </h2>
      </div>
      <br />
      <div className="checkout-shipping-action">
        <button
          className="button button-muted"
          onClick={() => onClickBack(values)}
          type="button"
        >
          <ArrowLeftOutlined />
          &nbsp; Go Back
        </button>
        <button
          className="button"
          disabled={false}
          onClick={handleOrder}
          type="button"
        >
          <CheckOutlined />
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
