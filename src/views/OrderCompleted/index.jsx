import React, { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import firebase from "@/services/firebase";
import { BasketItem } from "@/components/basket";
import { Link } from "react-router-dom";
import { displayActionMessage } from "@/helpers/utils";
const OrderCompleted = () => {
  const location = useLocation();
  const { id } = useParams();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [otpModel, setOtpModel] = useState(false);
  const [otpRec, setOtpRec] = useState(true);
  const [confroming, setConfroming] = useState(false);
  const [order, setOrder] = useState({});
  const recaptchaRef = useRef();

  useEffect(() => {
    const recaptcha = async () => {
      try {
        if (location.state?.id) {
          firebase.generateRecaptcha(
            location.state.address.mobile.value,
            setOtpModel,
            setError,
            setOtpRec
          );
        }
      } catch (error) {
        console.log(error);
      }
    };

    recaptcha();
  }, []);
  const confiremOtp = (otp) => {
    setConfroming(true);
    firebase
      .confiremOtp(otp)
      .then((e) => {
        setOtpModel(false);
        firebase.unlinkMobile();
      })
      .catch((error) => {
        setConfroming(false);
        setMessage("invalide code ");
      });
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          width: "100vw",
          height: "100vh",
          display: otpRec ? "flex" : "none",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#22222299",
          backdropFilter: "blur(3px)",
          top: 0,
          left: 0,
          zIndex: 10000,
        }}
        id="container"
      >
        {/* <button
          ref={recaptchaRef}
          className="button"
          onClick={() => {
            console.log(location.state.address.mobile.value);
            firebase
              .requestPhoneOtp(
                location.state.address.mobile.value || "+96171108084"
              )
              .then(() => {
                console.log(location.state);
                setOtpModel(true);
                setOtpRec(false);
              })
              .catch((error) => {
                console.log(error);
                setOtpModel(false);
                setError(error);
                displayActionMessage(error);
              });
          }}
          id="container"
        >
          Verfity Phone Number
        </button> */}
      </div>
      <main key={order} style={{ marginTop: "4rem" }}>
        <div
          style={{
            display: "flex",
            gap: "2rem",
            justifyContent: "left",
            alignItems: "center",
            width: "100vw",
          }}
        >
          <svg
            width={50}
            height={50}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 50 50"
            fill="none"
            stroke-width="2"
            class="checkmark"
            stroke="#5b9bbe"
          >
            <path
              class="checkmark__circle"
              d="M25 49c13.255 0 24-10.745 24-24S38.255 1 25 1 1 11.745 1 25s10.745 24 24 24z"
            ></path>
            <path
              class="checkmark__check"
              d="M15 24.51l7.307 7.308L35.125 19"
            ></path>
          </svg>
          <div>
            <span>Order Completed</span>
            <p style={{ margin: ".5rem 0 0 0 " }}>
              THANK YOU, {firebase.auth.currentUser.displayName}
            </p>
          </div>
        </div>
        <div
          style={{
            maxWidth: "80vw",
            border: "1px solid rgb(219, 215, 215)",
            padding: "1rem",
            maxWidth: "95vw",
            fontWeight: "500",
            borderRadius: ".8rem",
            marginBlock: "2rem",
            zIndex: 1,
          }}
        >
          <h3 style={{ marginBlock: "0.6rem" }}>Your order is confirmed </h3>
          <p style={{ fontSize: "1.3rem" }}>
            You’ll receive an email when your order is ready.
          </p>
        </div>
        <div
          style={{
            border: "1px solid rgb(219, 215, 215)",
            padding: "1rem",
            maxWidth: "95vw",
            fontWeight: "500",
            borderRadius: ".8rem",
          }}
        >
          <h3 style={{ marginBlock: "0.6rem" }}>Order details</h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div>
              <h4 style={{ marginBlock: "0.6rem", fontSize: "1.5rem" }}>
                Contact information
              </h4>
              <p>{location.state?.address?.email}</p>
            </div>
            <div>
              <h4 style={{ marginBlock: "0.6rem", fontSize: "1.5rem" }}>
                Shipping address
              </h4>
              <div style={{ color: "#4a4a4a", fontSize: "1.3rem" }}>
                {order.address?.country || location.state?.address?.country} ,
              </div>
              <div style={{ color: "#4a4a4a", fontSize: "1.3rem" }}>
                {order.address?.city || location.state?.address?.city} ,
              </div>
              <div style={{ color: "#4a4a4a", fontSize: "1.3rem" }}>
                {order.address?.street || location.state?.address?.street} ,
              </div>
              <div style={{ color: "#4a4a4a", fontSize: "1.3rem" }}>
                {order.address?.building || location.state?.address.building} ,
              </div>
              <div style={{ color: "#4a4a4a", fontSize: "1.3rem" }}>
                {order.address?.floor || location.state?.address.floor} ,
              </div>
              <div style={{ color: "#4a4a4a", fontSize: "1.3rem" }}>
                {order.address?.zipcode || location.state?.address.zipcode}
              </div>
            </div>
            <div>
              <h3 style={{ marginBlock: "0.6rem", fontSize: "1.5rem" }}>
                Payment method
              </h3>
              <div style={{ color: "#4a4a4a", fontSize: "1.3rem" }}>
                {(order.payment === "COD" && "Cash on delivery") ||
                  order.payment ||
                  location.state?.payment}
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            border: "1px solid rgb(219, 215, 215)",
            padding: "1rem",
            maxWidth: "95vw",
            fontWeight: "500",
            marginTop: "2rem",
            borderRadius: ".8rem",
          }}
        >
          {location.state?.items?.map((item, index) => (
            <BasketItem product={item} display={true} key={index} />
          ))}
        </div>
        <Link to="/" className="button" style={{ marginTop: "2rem" }}>
          Continue shopping
        </Link>
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
              boxShadow: "0 0 40px 5px #cccbcbd4",
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
                        location.state.address.mobile.value
                      );
                    }}
                  >
                    Resend OTP
                  </button>
                </>
              )}
            </div>

            <div>{message}</div>
            <div>{error && "error happend"}</div>
          </section>
        )}
      </main>
    </>
  );
};

export default OrderCompleted;
