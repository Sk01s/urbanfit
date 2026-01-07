import React, { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import firebase from "@/services/firebase";
import { BasketItem } from "@/components/basket";
import { Link } from "react-router-dom";
import { displayActionMessage, calculateSubtotal } from "@/helpers/utils";
import { useScrollTop, useFeatureFlag } from "@/hooks";
import { OrderPaymentSummery } from "@/components/common";
const OrderCompleted = () => {
  useScrollTop();
  const location = useLocation();
  const { id } = useParams();
  const isOtpEnabled = useFeatureFlag("ENABLE_OTP_VERIFICATION");
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
        if (isOtpEnabled && location.state?.id) {
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
  }, [isOtpEnabled]);
  const confiremOtp = (otp) => {
    setConfroming(true);
    firebase
      .confiremOtp(otp)
      .then((e) => {
        setOtpModel(false);
        firebase.unlinkMobile();
        window.scrollTo({ top: 0, behavior: "smooth" });
      })
      .catch((error) => {
        setConfroming(false);
        setMessage("invalide code ");
      });
  };

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

  return (
    <>
      {isOtpEnabled && (
        <div
          style={{
            position: "fixed",
            display: otpRec ? "flex" : "none",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10000,
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "100vw",
              height: "100vh",
              display: otpRec ? "flex" : "none",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#fff",
              backgroundImage: "url('/urbanfitpng-removebg-preview.png')",
              backgroundSize: window.innerWidth <= 500 ? "99vw" : "33vw",

              filter: "blur(0.7px)",
              top: 0,
              left: 0,
            }}
          />
          <div style={{ position: "relative" }} id="container"></div>

          {/* <button
            ref={recaptchaRef}
            className="button"
            onClick={() => {
              console.log(location.state.address.mobile.value);
              firebase
                .requestPhoneOtp(
                  location.state.address.mobile.value || "+96176875941"
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
      )}
      <main
        key={order}
        style={{
          marginTop: "14.5rem",
          marginBottom: "4rem",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "1rem",
            fontSize: "1.4rem",
            fontWeight: "300",
            backgroundColor: "rgba(132, 247, 182, 0.84)",
            padding: "1rem",
            marginInline: "2rem",
            marginBottom: "2rem",
            borderRadius: "1rem",
            display: isOtpEnabled ? "flex" : "none",
          }}
        >
          <svg
            width={18}
            height={18}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 50 50"
            fill="none"
            stroke-width="2"
            class="checkmark"
            stroke="#000"
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
          <div>Your phone number has been verified</div>
        </div>
        <div
          style={{
            display: "flex",
            gap: "2rem",
            justifyContent: "left",
            alignItems: "center",
            marginInline: "2rem",
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
            <span>Order #{id}</span>
            <p style={{ margin: ".5rem 0 0 0 " }}>
              THANK YOU, {firebase.auth.currentUser.displayName}
            </p>
          </div>
        </div>
        <div
          style={{
            border: "1px solid rgb(219, 215, 215)",
            padding: "1rem",
            fontWeight: "500",
            borderRadius: ".8rem",
            marginBlock: "2rem",
            zIndex: 1,
            width: "calc(100% - 4rem)",
            marginInline: "auto",
          }}
        >
          <h3 style={{ marginBlock: "0.6rem" }}>Your order is confirmed </h3>
          <p style={{ fontSize: "1.3rem" }}>
            You'll receive a confirmation email with your order number shortly
          </p>
        </div>
        <div
          style={{
            border: "1px solid rgb(219, 215, 215)",
            padding: "1rem",
            fontWeight: "500",
            borderRadius: ".8rem",
            width: "calc(100% - 4rem)",
            marginInline: "auto",
          }}
        >
          <h3
            style={{
              marginTop: "0.6rem",
              marginBottom: "1rem",
              fontWeight: "400",
            }}
          >
            Order details
          </h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div>
              <h4
                style={{
                  marginTop: "0.6rem",
                  marginBottom: "1rem",
                  fontSize: "1.35rem",

                  fontWeight: "500",
                }}
              >
                Contact information
              </h4>
              <p style={{ margin: 0, fontSize: "1.3rem" }}>
                {location.state?.address?.email}
              </p>
            </div>
            {/* <div>
              <h3
                style={{
                  marginBlock: "1rem",
                  fontSize: "1.35rem",
                  fontWeight: "500",
                }}
              >
                Shipping method
              </h3>
              <div style={{ color: "#4a4a4a", fontSize: "1.3rem" }}>
                {(location.state.payment === "COD" &&
                  "Cash on delivery (2 - 3 working days)") ||
                  location.state.payment ||
                  location.state?.payment}
              </div>
            </div> */}
            <div>
              <h4
                style={{
                  marginBlock: "1rem",
                  fontSize: "1.35rem",
                  fontWeight: "500",
                }}
              >
                Shipping address
              </h4>

              <div
                style={{
                  color: "#4a4a4a",
                  fontSize: "1.3rem",
                  marginBottom: ".5rem",
                }}
              >
                {order.address?.fullname || location.state?.address?.fullname}
              </div>
              <div
                style={{
                  color: "#4a4a4a",
                  fontSize: "1.3rem",
                  marginBottom: ".5rem",
                }}
              >
                {order.address?.street || location.state?.address?.street}
              </div>
              <div
                style={{
                  color: "#4a4a4a",
                  fontSize: "1.3rem",
                  marginBottom: ".5rem",
                }}
              >
                {order.address?.building || location.state?.address.building} ,{" "}
                {getOrdinalSuffix(parseInt(location.state?.address.floor))}
              </div>

              <div
                style={{
                  color: "#4a4a4a",
                  fontSize: "1.3rem",
                  marginBottom: ".5rem",
                }}
              >
                {order.address?.city || location.state?.address?.city}{" "}
                {order.address?.zipcode || location.state?.address.zipcode}
              </div>

              <div
                style={{
                  color: "#4a4a4a",
                  fontSize: "1.3rem",
                  marginBottom: ".5rem",
                }}
              >
                {order.address?.country || location.state?.address?.country}
              </div>
              <div
                style={{
                  color: "#4a4a4a",
                  fontSize: "1.3rem",
                  marginBottom: ".5rem",
                }}
              >
                {order.address?.mobile.value ||
                  location.state?.address?.mobile.value}
              </div>
            </div>
            <div>
              <h3
                style={{
                  marginBlock: "0.8rem",
                  fontSize: "1.35rem",
                  fontWeight: "500",
                }}
              >
                Payment method
              </h3>
              <div style={{ color: "#4a4a4a", fontSize: "1.3rem" }}>
                {(location.state.payment === "COD" && "Cash on delivery ") ||
                  location.state.payment ||
                  location.state?.payment}
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            border: "1px solid rgb(219, 215, 215)",
            padding: "1rem 0 0 0",
            fontWeight: "500",
            marginTop: "2rem",
            borderRadius: ".8rem",
            width: "calc(100% - 4rem)",
            marginInline: "auto",
          }}
        >
          {location.state?.items?.map((item, index) => (
            <BasketItem product={item} display={true} key={index} />
          ))}
        </div>
        <br />
        <br />
        <OrderPaymentSummery
          subtotal={calculateSubtotal(location.state?.items)}
          promo={location?.state.promo || { percentage: 0 }}
        />
        <br />
        <Link
          to="/"
          className="button"
          style={{
            marginTop: "2rem",
            width: "calc(100% - 4rem)",
            marginInline: "auto",
          }}
        >
          Continue shopping
        </Link>
        {otpModel && isOtpEnabled && (
          <>
            <section
              style={{
                position: "fixed",
                top: "55%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                backgroundColor: "white",
                borderRadius: "3rem",
                padding: "3rem 4rem",
                width: "40rem",
                maxWidth: "90vw",
                display: "flex",
                flexDirection: "column",
                gap: "2rem",
                alignItems: "center",
                zIndex: "200",
                boxShadow: "0 0 20px 8px #cccbcb40",
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
            <div
              style={{
                width: "100vw",
                position: "fixed",
                height: "100vh",
                backgroundColor: "#fff",
                backgroundImage: "url('/urbanfitpng-removebg-preview.png')",
                backgroundSize: window.innerWidth <= 500 ? "99vw" : "33vw",
                filter: "blur(0.75px)",
                top: 0,
                zIndex: 100,
                top: 0,
                left: 0,
              }}
            />
          </>
        )}
      </main>
    </>
  );
};

export default OrderCompleted;
