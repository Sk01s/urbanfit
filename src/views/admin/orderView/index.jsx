import { FlagFilled, LoadingOutlined } from "@ant-design/icons";
import { useDocumentTitle, useScrollTop } from "@/hooks";
import PropType from "prop-types";
import React, { lazy, Suspense, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Redirect, withRouter, useParams } from "react-router-dom";
import { editProduct } from "@/redux/actions/productActions";
import firebase from "@/services/firebase";
import Skeleton from "react-loading-skeleton";
import { displayMoney, displayDate, calculateSubtotal } from "@/helpers/utils";
import { OrderPaymentSummery } from "@/components/common";
import { BasketItem } from "@/components/basket";

const ProductForm = lazy(() => import("../components/ProductForm"));

const EditProduct = () => {
  useDocumentTitle("Edit Product | Urbanfit");
  useScrollTop();

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
    promo: { percentage: 0 },
  });

  const subtotal = calculateSubtotal(orderDetails?.items);
  // const totalPrice = orderDetails.address.isInternational
  //   ? subtotal + 50
  //   : subtotal + 5;

  const { orderId } = useParams();

  useEffect(() => {
    async function getOrder() {
      const data = await firebase.getOrder(orderId);
      const order = await data?.data();
      setOrderDetails(order);
    }
    getOrder();
  }, [orderId]);
  const onSubmitForm = (updates) => {
    dispatch(editProduct(product.id, updates));
  };
  return (
    <section className="product-form-container">
      <h2>Order</h2>
      {orderId && (
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
            <section className="address">
              <h4>Contact</h4>
              <div>
                <div>{orderDetails.address?.email}</div>
                <div>{orderDetails.address?.mobile?.value}</div>

                <div>
                  {orderDetails.address?.building || <Skeleton width={40} />}
                </div>
              </div>
            </section>
            <section className="address">
              <h4>Shipping Address</h4>
              <span>
                {orderDetails.address?.isInternational ? "" : "No "}
                International Shipping
              </span>
              <div>
                <div>
                  Country :{" "}
                  {orderDetails.address?.country || <Skeleton width={40} />}
                  {" , "}
                </div>
                <div>
                  City : {orderDetails.address?.city || <Skeleton width={40} />}
                  {" , "}
                </div>

                <div>
                  Street :{" "}
                  {orderDetails.address?.street || <Skeleton width={40} />}
                  {" , "}
                </div>

                <div>
                  Floor :{" "}
                  {orderDetails.address?.floor || <Skeleton width={40} />}
                  {" , "}
                </div>

                <div>
                  Building{" "}
                  {orderDetails.address?.building || <Skeleton width={40} />}
                </div>
              </div>
            </section>
            <section className="items">
              <h4>items</h4>
              <ol style={{ paddingLeft: "1.8rem", fontSize: "1.4rem" }}>
                {orderDetails.items?.map((item, index) => (
                  <BasketItem display product={item} key={index} />
                ))}
              </ol>
            </section>
            <div
              style={{ display: "flex", alignItems: "center", gap: "1.4rem" }}
            >
              {/* <h4>Price</h4>
              {Number.isInteger(price) ? (
                displayMoney(totalPrice)
              ) : (
                <Skeleton width={50} />
              )} */}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <strong>Order's Date : </strong>
              <span>
                {orderDetails.date ? (
                  displayDate(orderDetails.date.toDate())
                ) : (
                  <Skeleton width={30} />
                )}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <strong>Time : </strong>
              <span>
                {orderDetails.date ? (
                  <>
                    {new Date(orderDetails.date.toDate()).getHours()} :{" "}
                    {new Date(orderDetails.date.toDate()).getMinutes()}
                  </>
                ) : (
                  <Skeleton width={30} />
                )}
              </span>
            </div>
            <br />
            <OrderPaymentSummery
              subtotal={subtotal}
              promo={orderDetails.promo}
            />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "2rem",
              }}
            >
              <h4>Deliverd </h4>
              <span style={{ fontSize: "1.5rem" }}>
                {orderDetails.fulfillment ? "Yes" : "No"}
              </span>
              <button
                onClick={() => {
                  setOrderDetails((prev) => ({
                    ...prev,
                    fulfillment: !prev.fulfillment,
                  }));
                  firebase.updateOrder(orderDetails.id, {
                    ...orderDetails,
                    fulfillment: !orderDetails.fulfillment,
                  });
                }}
                style={{
                  borderRadius: 0,
                  border: "solid 1px #222",
                  backgroundColor: "white",
                  padding: " 0.5rem 1rem",
                }}
              >
                Change
              </button>
            </div>
          </div>
        </Suspense>
      )}
    </section>
  );
};

EditProduct.propTypes = {
  match: PropType.shape({
    params: PropType.shape({
      id: PropType.string,
    }),
  }).isRequired,
};

export default EditProduct;
