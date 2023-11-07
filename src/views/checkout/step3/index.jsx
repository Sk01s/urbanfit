import { CHECKOUT_STEP_1 } from "@/constants/routes";
import { Form, Formik } from "formik";
import { displayActionMessage } from "@/helpers/utils";
import { useDocumentTitle, useScrollTop } from "@/hooks";
import PropType from "prop-types";
import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import * as Yup from "yup";
import { StepTracker } from "../components";
import withCheckout from "../hoc/withCheckout";
import CreditPayment from "./CreditPayment";
import PayPalPayment from "./PayPalPayment";
import CODPayment from "./CODPayment";
import Total from "./Total";
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
  type: Yup.string().required("Please select paymend mode"),
});

const Payment = ({ shipping, payment, subtotal }) => {
  const [paymentType, setPaymentType] = useState();
  let state = useSelector((state) => ({
    fulfillment: false,
    items: state.basket,
    payment: state.checkout.payment.type,
    address: state.checkout.shipping,
    date: new Date(),
    uid: firebase.getCurrentUser(),
    id: crypto.randomUUID(),
  }));
  useEffect(() => {
    state = {
      ...state,
      payment: paymentType || state.payment,
      uid: firebase.auth.currentUser.uid,
    };
    console.log(state);
  }, [paymentType, firebase.auth]);
  useDocumentTitle("Check Out Final Step | Urbanfit");
  useScrollTop();

  const initFormikValues = {
    name: payment.name || "",
    cardnumber: payment.cardnumber || "",
    expiry: payment.expiry || "",
    ccv: payment.ccv || "",
    type: payment.type || "paypal",
  };

  const onConfirm = (e) => {
    e.preventDefault();
    console.log(state);
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
          if (form.type !== "COD") {
            displayActionMessage("Feature not ready yet :)", "info");
          } else {
            return true;
          }
        }}
      >
        {({ values, setValues }) => (
          <Form className="checkout-step-3" onSubmit={onConfirm}>
            <CreditPayment setPaymentType={setPaymentType} />
            {/* <PayPalPayment setPaymentType={setPaymentType} /> */}
            <CODPayment setPaymentType={setPaymentType} />
            {state && (
              <Total
                key={state}
                isInternational={shipping.isInternational}
                subtotal={subtotal}
                order={state}
              />
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};

Payment.propTypes = {
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

export default withCheckout(Payment);
