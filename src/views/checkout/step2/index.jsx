/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-nested-ternary */
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { Boundary } from "@/components/common";
import { CHECKOUT_STEP_1, CHECKOUT_STEP_3 } from "@/constants/routes";
import { Form, Formik } from "formik";
import { useDocumentTitle, useScrollTop } from "@/hooks";
import PropType from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { setShippingDetails } from "@/redux/actions/checkoutActions";
import * as Yup from "yup";
import { StepTracker } from "../components";
import withCheckout from "../hoc/withCheckout";
import ShippingForm from "./ShippingForm";
import ShippingTotal from "./ShippingTotal";
import firebase from "@/services/firebase";

const FormSchema = Yup.object().shape({
  fullname: Yup.string()
    .required("Full name is required.")
    .min(2, "Full name must be at least 2 characters long.")
    .max(60, "Full name must only be less than 60 characters."),
  email: Yup.string()
    .email("Email is not valid.")
    .required("Email is required."),
  street: Yup.string().required("Shipping street is required."),
  city: Yup.string().required("Shipping city is required."),
  building: Yup.string().required("Shipping building is required."),
  floor: Yup.number().required("Shipping floor number is required."),
  nearby: Yup.string().required("Shipping nearby is required."),

  mobile: Yup.object()
    .shape({
      country: Yup.string(),
      countryCode: Yup.string(),
      dialCode: Yup.string().required("Mobile number is required"),
      value: Yup.string().required("Mobile number is required"),
    })
    .required("Mobile number is required."),
  isInternational: Yup.boolean(),
  isDone: Yup.boolean(),
});

const ShippingDetails = ({ profile, shipping, subtotal }) => {
  const form = useRef();
  useEffect(() => {
    firebase.generateRecaptcha();
    return () => {
      window.recaptchaVerifier = null;
    };
  }, []);

  useDocumentTitle("Check Out Step 2 | urbanfit");
  useScrollTop();
  const [otpModel, setOtpModel] = useState(false);
  const [confroming, setConfroming] = useState(false);
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();
  const initFormikValues = {
    fullname: shipping.fullname || profile.fullname || "",
    email: shipping.email || profile.email || "",
    address: shipping.address || profile.address || "",
    street: shipping.street || profile.street || "",
    city: shipping.city || profile.city || "",
    building: shipping.building || profile.building || "",
    floor: shipping.floor || profile.floor || "",
    nearby: shipping.nearby || profile.nearby || "",
    mobile: shipping.mobile || profile.mobile || {},
    isInternational: shipping.isInternational || false,
    isDone: shipping.isDone || false,
  };

  const onSubmitForm = (form) => {
    dispatch(
      setShippingDetails({
        fullname: form.fullname,
        email: form.email,
        street: form.street,
        city: form.city,
        building: form.building,
        floor: form.floor,
        nearby: form.nearby,
        mobile: form.mobile,
        isInternational: form.isInternational,
        isDone: true,
      })
    );
    history.push(CHECKOUT_STEP_3);
  };
  const confiremOtp = (otp) => {
    setConfroming(true);
    firebase
      .confiremOtp(otp)
      .then((e) => {
        setOtpModel(false);
        form.current.handleSubmit();
      })
      .catch((error) => {
        setConfroming(false);
        setMessage("invalide code ");
      });
  };

  return (
    <Boundary>
      <div className="checkout">
        <StepTracker current={2} />
        <div className="checkout-step-2">
          <h3 className="text-center">Shipping Details</h3>
          <Formik
            innerRef={form}
            initialValues={initFormikValues}
            validateOnChange
            validationSchema={FormSchema}
            onSubmit={onSubmitForm}
          >
            {() => (
              <Form>
                <ShippingForm />
                <br />
                {/*  ---- TOTAL --------- */}
                <ShippingTotal subtotal={subtotal} />
                <br />
                {/*  ----- NEXT/PREV BUTTONS --------- */}
                <div className="checkout-shipping-action">
                  <button
                    className="button button-muted"
                    onClick={() => history.push(CHECKOUT_STEP_1)}
                    type="button"
                  >
                    <ArrowLeftOutlined />
                    &nbsp; Go Back
                  </button>
                  <button
                    className="button button-icon"
                    type="button"
                    id="next"
                    onClick={() => {
                      firebase
                        .requestPhoneOtp(form.current.values.mobile.value)
                        .then(() => setOtpModel(true))
                        .catch((error) => {
                          setOtpModel(false);
                          setError(error);
                        });
                    }}
                  >
                    Next Step &nbsp;
                    <ArrowRightOutlined />
                  </button>
                </div>
                <div>{error}</div>
              </Form>
            )}
          </Formik>
          {otpModel && (
            <section
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                backgroundColor: "white",
                borderRadius: "3rem",
                padding: "3rem 4rem",
                width: "clamp(80vw,700px,70vw)",
                display: "flex",
                flexDirection: "column",
                gap: "2rem",
                alignItems: "center",
                zIndex: "2",
              }}
            >
              <div style={{ padding: "2rem" }}>
                <h2>We've sent you an OTP</h2>
                <p>Confirm your phone number . Please enter the OTP code. </p>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {confroming ? (
                  <div
                    style={{
                      width: "8rem",
                      height: "8rem",
                      borderRadius: "50%",
                      borderTop: "solid 1px ",
                      borderRight: "solid 1px",
                    }}
                    className="spining"
                  />
                ) : (
                  <>
                    <input
                      type="number"
                      style={{
                        border: "1px solid #ccc",
                        background:
                          "linear-gradient(to left, #ccc 1px, transparent 0)",
                        backgroundSize: "40px 1px",
                        width: "240px",
                        font: "24px monaco, monospace",
                        letterSpacing: "26.4px",
                        textIndent: " -2px",
                        textTransform: "uppercase",
                      }}
                      onChange={(otp) =>
                        otp.currentTarget.value.length === 6
                          ? confiremOtp(otp?.currentTarget?.value)
                          : otp.currentTarget.value
                      }
                      required={true}
                    />
                    <button
                      style={{
                        backgroundColor: "white",
                        borderRadius: "1rem",
                        border: "solid #333 1px ",
                        marginTop: "1rem",
                        padding: "1rem",
                        color: "#cacaa",
                      }}
                      onClick={({ currentTarget }) => {
                        currentTarget.disabled = true;
                        firebase.requestPhoneOtp(
                          form.current.values.mobile.value
                        );
                      }}
                    >
                      Resend OTP
                    </button>
                  </>
                )}
              </div>

              <div>{message}</div>
              <div>{error}</div>
            </section>
          )}
        </div>
      </div>
    </Boundary>
  );
};

ShippingDetails.propTypes = {
  subtotal: PropType.number.isRequired,
  profile: PropType.shape({
    fullname: PropType.string,
    email: PropType.string,
    address: PropType.string,
    mobile: PropType.object,
  }).isRequired,
  shipping: PropType.shape({
    fullname: PropType.string,
    email: PropType.string,
    address: PropType.string,
    mobile: PropType.object,
    isInternational: PropType.bool,
    isDone: PropType.bool,
  }).isRequired,
};

export default withCheckout(ShippingDetails);
