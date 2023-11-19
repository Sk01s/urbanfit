import { FlagFilled, LoadingOutlined } from "@ant-design/icons";
import { useDocumentTitle, useScrollTop } from "@/hooks";
import PropType from "prop-types";
import React, { lazy, Suspense, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import firebase from "@/services/firebase";
import Skeleton from "react-loading-skeleton";
import {
  displayMoney,
  displayActionMessage,
  displayDate,
} from "@/helpers/utils";
import { BasketItem } from "@/components/basket";
import { OrderPaymentSummery } from "@/components/common";

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

const OrderView = () => {
  const history = useHistory();
  useDocumentTitle("View Order | Urbanfit");
  useScrollTop();
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    address: {
      city: "",
      street: "",
      building: "",
      floor: "",
      isInternational: null,
    },
    items: [],
    fulfillment: false,
    promo: {
      percentage: 0,
    },
  });

  const price = orderDetails?.items?.reduce(
    (acc, next) => parseInt(acc) + parseInt(next.price),
    0
  );
  const totalPrice = orderDetails?.address?.isInternational
    ? price + 50
    : price + 5;

  const { id } = useParams();

  useEffect(() => {
    async function getOrder() {
      const data = await firebase.getOrder(id);
      const order = await data?.data();
      // console.log(data, order);
      setOrderDetails(order);
    }
    getOrder();
  }, [id]);

  return (
    <section style={{ width: "100%" }}>
      <h2>Order</h2>
      {id && (
        <Suspense
          fallback={
            <div className="loader" style={{ minHeight: "80dvh" }}>
              <h6>Loading ... </h6>
              <br />
              <LoadingOutlined />
            </div>
          }
        >
          <div>
            <div
              style={{
                border: "1px solid rgb(219, 215, 215)",
                padding: "1rem",
                fontWeight: "500",
                borderRadius: ".8rem",
                width: "calc(100vw - 4rem)",
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
                    {orderDetails?.address?.email}
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
                {(orderDetails.payment === "COD" &&
                  "Cash on delivery (2 - 3 working days)") ||
                  orderDetails.payment ||
                  orderDetails?.payment}
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
                    {orderDetails?.address?.fullname}
                  </div>
                  <div
                    style={{
                      color: "#4a4a4a",
                      fontSize: "1.3rem",
                      marginBottom: ".5rem",
                    }}
                  >
                    {orderDetails?.address?.street}
                  </div>
                  <div
                    style={{
                      color: "#4a4a4a",
                      fontSize: "1.3rem",
                      marginBottom: ".5rem",
                    }}
                  >
                    {orderDetails?.address.building} ,{" "}
                    {getOrdinalSuffix(parseInt(orderDetails?.address.floor))}
                  </div>

                  <div
                    style={{
                      color: "#4a4a4a",
                      fontSize: "1.3rem",
                      marginBottom: ".5rem",
                    }}
                  >
                    {orderDetails?.address?.city}{" "}
                    {orderDetails?.address.zipcode}
                  </div>

                  <div
                    style={{
                      color: "#4a4a4a",
                      fontSize: "1.3rem",
                      marginBottom: ".5rem",
                    }}
                  >
                    {orderDetails?.address?.country}
                  </div>
                  <div
                    style={{
                      color: "#4a4a4a",
                      fontSize: "1.3rem",
                      marginBottom: ".5rem",
                    }}
                  >
                    {orderDetails?.address?.mobile?.value}
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
                    {(orderDetails.payment === "COD" && "Cash on delivery ") ||
                      orderDetails.payment ||
                      orderDetails?.payment}
                  </div>
                </div>
              </div>
            </div>
            {/* <section className="address">
              <h4>Shipping Address</h4>
              <span>
                {orderDetails?.address?.isInternational ? "" : "No "}
                International Shipping
              </span>
              <div>
                <div>
                  Country :{" "}
                  {orderDetails?.address?.country || <Skeleton width={40} />}
                </div>
                <div>
                  City :{" "}
                  {orderDetails?.address?.city || <Skeleton width={40} />}
                </div>

                <div>
                  Street :{" "}
                  {orderDetails?.address?.street || <Skeleton width={40} />}
                </div>

                <div>
                  Floor :{" "}
                  {orderDetails?.address?.floor || <Skeleton width={40} />}
                </div>

                <div>
                  Building{" "}
                  {orderDetails?.address?.building || <Skeleton width={40} />}
                </div>
              </div>
            </section> */}
            <section className="items">
              <h4>items</h4>
              <div
                style={{
                  border: "1px solid rgb(219, 215, 215)",
                  padding: "1rem 0 0 0",
                  fontWeight: "500",
                  marginTop: "2rem",
                  borderRadius: ".8rem",
                  marginInline: "auto",
                }}
              >
                {orderDetails?.items?.map((item, index) => (
                  <BasketItem product={item} display={true} key={index} />
                ))}
              </div>
            </section>
            <br />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                fontSize: "1.3rem",
                paddingInline: ".5rem",
                fontWeight: "400",
              }}
            >
              <strong>Order's Date : </strong>
              <span>
                {orderDetails?.date ? (
                  displayDate(orderDetails?.date.toDate())
                ) : (
                  <Skeleton width={30} />
                )}
              </span>
            </div>
            <br />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                fontSize: "1.3rem",
                paddingInline: ".5rem",
                fontWeight: "400",
              }}
            >
              <strong>Deliverd : </strong>
              <span> {orderDetails?.fulfillment ? "Yes" : "No"}</span>
            </div>
            <br />
            <OrderPaymentSummery subtotal={price} promo={orderDetails.promo} />
            <br />
            <button
              className="button"
              onClick={() => {
                setModel(true);
              }}
            >
              Cancel Order
            </button>
          </div>
        </Suspense>
      )}
      {model && (
        <section
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            backgroundColor: "white",
            borderRadius: "3rem",
            padding: "3rem 4rem",
            width: "40rem",
            display: "flex",
            maxWidth: "90vw",
            flexDirection: "column",
            gap: "2rem",
            alignItems: "center",
            zIndex: "2",
            boxShadow: "0 0 40px 5px #cccbcbd4",
          }}
        >
          <div style={{ padding: "2rem" }}>
            <h3>Are you sure that you want to cancel your order ?</h3>
          </div>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "space-between",
              width: "75%",
            }}
          >
            <button
              style={{
                backgroundColor: "white",
                borderRadius: "1rem",
                border: "solid #333 1px ",
                marginTop: "1rem",
                padding: "1.2rem 1.7rem",
                color: "#cacaa",
              }}
              onClick={() => {
                setModel(false);
              }}
            >
              No
            </button>
            <button
              style={{
                backgroundColor: "white",
                borderRadius: "1rem",
                border: "solid #333 1px ",
                marginTop: "1rem",
                padding: "1.2rem 1.7rem",
                color: "#cacaa",
                display: "flex",
                gap: "1rem",
              }}
              onClick={async () => {
                // currentTarget.disabled = true;
                // firebase.requestPhoneOtp(orderDetails.address.mobile.value);
                setLoading(true);
                await firebase
                  .removeOrder(id, orderDetails)
                  .then((e) => {
                    history.push("/");
                    displayActionMessage("Order has been canceled");
                    return e;
                  })
                  .catch((e) => {
                    displayActionMessage("Error happend");
                    return e;
                  })
                  .finally(() => {
                    setLoading(true);
                  });
              }}
            >
              Yes
              {loading && (
                <div
                  style={{
                    width: "2rem",
                    height: "2rem",
                    borderRadius: "50%",
                    borderTop: "solid 1px ",
                    borderRight: "solid 1px",
                  }}
                  className="spining"
                />
              )}
            </button>
          </div>
        </section>
      )}
    </section>
  );
};

export default OrderView;
