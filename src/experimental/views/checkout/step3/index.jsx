import { CHECKOUT_STEP_1 } from "@/constants/routes";
import { Form, Formik } from "formik";
import { displayActionMessage } from "@/helpers/utils";
import { useDocumentTitle, useScrollTop } from "@/hooks";
import PropType from "prop-types";
import React, { useRef, useState } from "react";
import { Redirect } from "react-router-dom";
import * as Yup from "yup";
import { StepTracker } from "@/views/checkout/components";
import withCheckoutV2 from "../hoc/withCheckoutV2";
import CreditPayment from "@/views/checkout/step3/CreditPayment";
import CODPayment from "@/views/checkout/step3/CODPayment";
import TotalV2 from "./Total";
import { useSelector } from "react-redux";
import firebase from "@/services/firebase";
import firebaseInstance from "@/services/firebase";

const FormSchema = Yup.object().shape({
  name: Yup.string()
    .min(4, "Name should be at least 4 characters.")
    .required("Name is required"),
  cardnumber: Yup.string()
    .min(13, "Card number should be 13-19 digits long")
    .max(19, "Card number should only be 13-19 digits long")
    .required("Card number is required."),
  expiry: Yup.date().required("Credit card expiry is required."),
  ccv: Yup.string()
    .min(3, "CCV length should be 3-4 digit")
    .max(4, "CCV length should only be 3-4 digit")
    .required("CCV is required."),
  type: Yup.string().required("Please select payment mode"),
});

const PaymentV2 = ({ shipping, payment, subtotal }) => {
  const [paymentType, setPaymentType] = useState();
  const basketV2 = useSelector((s) => s.basketV2);
  const checkoutPromo = useSelector((s) => s.checkout.promo);
  const checkoutShipping = useSelector((s) => s.checkout.shipping);
  const checkoutPayment = useSelector((s) => s.checkout.payment);

  const orderId = useRef(firebase.generateRandomNumbers());

  useDocumentTitle("Check Out Step 3 | Urbanfit");
  useScrollTop();

  const order = {
    fulfillment: false,
    items: basketV2,
    promo: checkoutPromo,
    payment: paymentType || checkoutPayment.type,
    address: checkoutShipping,
    date: new Date(),
    uid: firebase.auth.currentUser?.uid,
    id: orderId.current,
  };

  const initFormikValues = {
    name: payment.name || "",
    cardnumber: payment.cardnumber || "",
    expiry: payment.expiry || "",
    ccv: payment.ccv || "",
    type: payment.type || "COD",
  };

  const onConfirm = (e) => {
    e.preventDefault();
  };

  if (!shipping || !shipping.isDone) {
    return <Redirect to={CHECKOUT_STEP_1} />;
  }

  return (
    <div className="checkout">
      <StepTracker current={3} />
      <Formik
        initialValues={initFormikValues}
        validateOnChange
        validationSchema={FormSchema}
        validate={(form) => {
          if (form.type === "") {
            displayActionMessage("Please select payment method.", "info");
          } else if (form.type === "credit") {
            displayActionMessage(
              "Unfortunately, we are not accepting online payments.",
              "info"
            );
          } else {
            return true;
          }
        }}
      >
        {({ values, setValues }) => (
          <Form className="checkout-step-3" onSubmit={onConfirm}>
            <h3 className="text-center">Payment</h3>
            <br />
            <span className="d-block padding-s">Payment Option</span>
            <CODPayment setPaymentType={setPaymentType} />
            <CreditPayment setPaymentType={setPaymentType} />
            {order && (
              <TotalV2
                isInternational={shipping.isInternational}
                subtotal={subtotal}
                order={order}
                paymentType={paymentType}
              />
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};

PaymentV2.propTypes = {
  shipping: PropType.shape({
    isDone: PropType.bool,
    isInternational: PropType.bool,
  }).isRequired,
  payment: PropType.shape({
    name: PropType.string,
    cardnumber: PropType.string,
    expiry: PropType.string,
    ccv: PropType.string,
    type: PropType.string,
  }).isRequired,
  subtotal: PropType.number.isRequired,
};

export default withCheckoutV2(PaymentV2);