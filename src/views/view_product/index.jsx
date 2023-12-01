import { ArrowLeftOutlined, LoadingOutlined } from "@ant-design/icons";
import { ColorChooser, ImageLoader, MessageDisplay } from "@/components/common";
import { ProductShowcaseGrid } from "@/components/product";
import { ESSENTIAL_PRODUCTS, SHOP } from "@/constants/routes";
import { displayMoney } from "@/helpers/utils";
import {
  useBasket,
  useWish,
  useDocumentTitle,
  useProduct,
  useEssentialProducts,
  useScrollTop,
  useDidMount,
} from "@/hooks";
import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Select from "react-select";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import Dotdotdot from "react-dotdotdot";

import { Helmet } from "react-helmet";
import CustomDots from "@/components/product/CustomDotes";
import InfoBox from "@/components/product/InfoBox";
import QuantitySelector from "@/components/product/QuantitySelecter";
import { shallowEqual, useSelector } from "react-redux";
import { selectFilter } from "@/selectors/selector";
import { useMemo } from "react";
import ProductShowcase from "@/components/product/ProductShowcaseGrid";
import {} from "@/hooks";
import firebase from "@/services/firebase";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { BasketToggle } from "@/components/basket";

const ViewProduct = () => {
  const { pathname } = useLocation();
  const slider = useRef();
  const sizesBtnsEl = useRef([]);
  const { id } = useParams();
  const { product, isLoading, error } = useProduct(id);
  const { addToBasket, isItemOnBasket } = useBasket(id);
  const { wish, addToWish, isItemOnWish } = useWish(id);
  useScrollTop();
  useDocumentTitle(`${product?.name || ""}`);
  const [selectedImage, setSelectedImage] = useState(product?.image || "");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantitiy] = useState(1);
  const [maxQuantity, setMaxQuantity] = useState(10);
  const [relatedProduct, setRelatedProduct] = useState([]);
  // const products = useSelector((state) => state.products.items);
  useEffect(() => {
    (async () => {
      const docs = await firebase.getProducts();
      setRelatedProduct(
        docs.products.filter((item) => product?.relative?.includes(item.id))
      );
      console.log(relatedProduct.length === 0);
    })();
    return () => {
      setRelatedProduct([]);
    };
  }, [product]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  const isOverSized = () => {
    // Search in the name if there is nama has the word over

    // Convert the input string to lowercase to perform a case-insensitive search

    // Check if the lowercased string contains "oversized" or "oversize"
    return (
      product.name.toLocaleLowerCase().includes("oversized") ||
      product.name.toLocaleLowerCase().includes("oversize")
    );
  };

  const {
    essentialProducts,
    fetchEssentialProducts,
    isLoading: isLoadingSeasonal,
    error: errorSeasonal,
  } = useEssentialProducts(6);
  const colorOverlay = useRef(null);

  useEffect(() => {
    setSelectedImage(product?.image);
  }, [product]);

  const onSelectedSizeChange = (index, newValue) => {
    console.log(newValue);
    setSelectedSize(newValue);
    sizesBtnsEl.current.map((el, i) => {
      i === index ? el.classList.add("active") : el.classList.remove("active");
    });
  };

  const onSelectedColorChange = (color) => {
    setSelectedColor(color);
    if (colorOverlay.current) {
      colorOverlay.current.value = color;
    }
  };

  console.log(product);
  const handleAddToBasket = (onClickToggle, e) => {
    addToBasket(
      {
        ...product,
        selectedColor,
        quantity,
        selectedSize: selectedSize,
      },
      onClickToggle
    );
  };

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleChangeIndex = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    setQuantitiy(1);
    setMaxQuantity(product?.[`${selectedSize}Quantity`]);
  }, [selectedSize]);
  return (
    <>
      <Helmet>
        <meta name="description" content={product?.description} />
      </Helmet>

      <main>
        {isLoading && (
          <div className="loader">
            <h4>Loading Product...</h4>
            <br />
            <LoadingOutlined style={{ fontSize: "3rem" }} />
          </div>
        )}
        {error && <MessageDisplay message={error} />}
        {product && !isLoading && (
          <div className="product-view">
            <div className="product-modal">
              <div className="product-image-wrapper">
                <SwipeableViews
                  index={currentIndex}
                  onChangeIndex={handleChangeIndex}
                  enableMouseEvents
                  height={"90dvh"}
                  style={{ overflowY: "hidden" }}
                >
                  {product.imageCollection.map((image, index) => (
                    <ImageLoader
                      className="product-modal-image"
                      src={image.url}
                      key={index}
                      draggable={false}
                    />
                  ))}
                </SwipeableViews>
                <button
                  style={{
                    all: "unset",
                    cursor: "pointer",
                    position: "absolute",
                    top: 0,
                    right: 0,
                    padding: "1rem",
                  }}
                  onClick={() => {
                    addToWish(product);
                  }}
                >
                  {isItemOnWish(product.id) ? (
                    <svg width={25} id="heart">
                      <path d="M2.2 9.4c0 1.3.2 3.3 2 5.1 1.6 1.6 6.9 5.2 7.1 5.4.2.1.4.2.6.2s.4-.1.6-.2c.2-.2 5.5-3.7 7.1-5.4 1.8-1.8 2-3.8 2-5.1 0-3-2.4-5.4-5.4-5.4-1.6 0-3.2.9-4.2 2.3C11 4.9 9.4 4 7.6 4 4.7 4 2.2 6.4 2.2 9.4z"></path>
                    </svg>
                  ) : (
                    <svg width={27} viewBox="0 0 50 50">
                      <path d="M25 39.7l-.6-.5C11.5 28.7 8 25 8 19c0-5 4-9 9-9 4.1 0 6.4 2.3 8 4.1 1.6-1.8 3.9-4.1 8-4.1 5 0 9 4 9 9 0 6-3.5 9.7-16.4 20.2l-.6.5zM17 12c-3.9 0-7 3.1-7 7 0 5.1 3.2 8.5 15 18.1 11.8-9.6 15-13 15-18.1 0-3.9-3.1-7-7-7-3.5 0-5.4 2.1-6.9 3.8L25 17.1l-1.1-1.3C22.4 14.1 20.5 12 17 12z" />
                    </svg>
                  )}
                </button>
                {product.imageCollection.length !== 0 && (
                  <CustomDots
                    currentSlide={currentIndex}
                    onDotClick={setCurrentIndex} // Handle dot click
                    imageCollection={product.imageCollection}
                  />
                )}
              </div>
              <div className="product-modal-details">
                <div className="divider" />

                <h2 style={{ marginBlock: "2rem 0" }}>{product.name}</h2>
                <div style={{ fontWeight: "400" }}>
                  {product.onSale ? (
                    <div
                      style={{
                        marginTop: ".5rem",
                        display: "flex",
                        gap: ".7rem",
                        letterSpacing: ".055rem",
                        fontSize: "1.6rem",
                      }}
                    >
                      <p style={{ color: "#da6d77" }}>
                        {product.price ? (
                          ` ${displayMoney(
                            Number(product.price) *
                              (1 - Number(product.percentage) / 100)
                          )}  `
                        ) : (
                          <Skeleton width={40} />
                        )}
                      </p>
                      <p
                        style={{
                          textDecoration: "line-through",
                          color: "rgb(52, 58, 64)",
                          opacity: 0.7,
                        }}
                      >
                        {product.price ? (
                          ` ${displayMoney(product.price)} `
                        ) : (
                          <Skeleton width={40} />
                        )}
                      </p>
                      <p style={{ color: "#da6d77" }}>
                        {product.percentage}% off
                      </p>
                    </div>
                  ) : (
                    <p
                      style={{
                        marginTop: "1rem",
                        letterSpacing: ".055rem",
                        fontSize: "1.6rem",
                      }}
                    >
                      {product.price ? (
                        ` ${displayMoney(product.price)}  `
                      ) : (
                        <Skeleton width={40} />
                      )}
                    </p>
                  )}
                </div>
                <div className="divider" />
                <br />
                {product.availableColors.length >= 1 && (
                  <div>
                    <span
                      style={{
                        color: "#343120",
                        fontWeight: "700",
                        fontSize: "1.2rem",
                      }}
                    >
                      Color
                    </span>
                    <ColorChooser
                      availableColors={product.availableColors}
                      onSelectedColorChange={onSelectedColorChange}
                    />
                  </div>
                )}
                <div>
                  <div>
                    <div
                      style={{
                        color: "#343120",
                        fontWeight: "700",
                        fontSize: "1.2rem",
                        marginTop: "2rem",
                      }}
                    >
                      Size (UK)
                    </div>
                    <div className="product-sizes-container">
                      <button
                        ref={(el) => (sizesBtnsEl.current[3] = el)}
                        className={`product-size  ${
                          product.smQuantity || "not-available"
                        }`}
                        disabled={product.smQuantity > 0 ? false : true}
                        onClick={(e) => onSelectedSizeChange(3, "sm")}
                      >
                        S
                      </button>
                      <button
                        ref={(el) => (sizesBtnsEl.current[2] = el)}
                        className={`product-size ${
                          product.mdQuantity || "not-available"
                        }`}
                        disabled={product.mdQuantity > 0 ? false : true}
                        onClick={(e) => onSelectedSizeChange(2, "md")}
                      >
                        M
                      </button>
                      <button
                        ref={(el) => (sizesBtnsEl.current[1] = el)}
                        className={`product-size ${
                          product.lgQuantity || "not-available"
                        }`}
                        disabled={product.lgQuantity > 0 ? false : true}
                        onClick={(e) => onSelectedSizeChange(1, "lg")}
                      >
                        L
                      </button>
                      <button
                        ref={(el) => (sizesBtnsEl.current[0] = el)}
                        className={`product-size  ${
                          product.xlQuantity || "not-available"
                        }`}
                        disabled={product.xlQuantity > 0 ? false : true}
                        onClick={(e) => onSelectedSizeChange(0, "xl")}
                      >
                        XL
                      </button>
                    </div>
                    {/* <button
                      ref={(el) => (sizesBtnsEl.current[4] = el)}
                      className={`product-size ${
                        product.xsQuantity || "not-available"
                      }`}
                      disabled={product.xsQuantity ? false : true}
                      onClick={(e) => onSelectedSizeChange(4, "xs")}
                    >
                      Xs
                    </button> */}
                  </div>
                </div>

                <div
                  style={{
                    color: "#343120",
                    fontWeight: "700",
                    fontSize: "1.2rem",
                    marginBlock: "1rem",
                  }}
                >
                  Quantity
                </div>
                <QuantitySelector
                  maxQuantity={maxQuantity}
                  setQuantity={setQuantitiy}
                  quantity={quantity}
                />
                <div
                  className="product-modal-action"
                  style={{ marginBlock: "5.6rem" }}
                >
                  <BasketToggle>
                    {({ onClickToggle }) => (
                      <button
                        className={`button basket-toggle ${
                          isItemOnBasket(product.id)
                            ? "button-border button-border-gray"
                            : ""
                        }`}
                        style={{
                          background: isItemOnBasket(product.id) && "#6f6f6f",
                          color: "#fff",
                          lineHeight: "1em",
                          height: "auto",
                          margin: "0",
                          textDecoration: "none !important",
                          cursor: "pointer",
                          padding: "1.2em 25px",
                          verticalAlign: "middle",
                          textAlign: "center",
                          borderRadius: ".75rem",
                          transition:
                            "background-color .1s,color .1s,border-color .1s,opacity .1s",
                          display: "inline-block",
                          fontWeight: "400",
                          fontStyle: "normal",
                          letterSpacing: ".08em",
                          textTransform: "uppercase",
                          padding: "15px 25px",
                          fontSize: "14px;",
                          width: "100%",
                        }}
                        onClick={(e) => handleAddToBasket(onClickToggle, e)}
                        type="button"
                      >
                        {isItemOnBasket(product.id)
                          ? "Remove From Cart"
                          : "Add To Cart"}
                      </button>
                    )}
                  </BasketToggle>
                </div>
                <InfoBox
                  open={true}
                  title={
                    <>
                      <svg
                        class="icon icon--small icon--type-eye"
                        stroke-width="1"
                        aria-hidden="true"
                        focusable="false"
                        role="presentation"
                        xmlns="http://www.w3.org/2000/svg"
                        width={15}
                        height={15}
                        viewBox="0 0 16 16"
                      >
                        <path
                          fill="currentColor"
                          d="M8 10a2 2 0 100-4 2 2 0 000 4zm0 1a3 3 0 100-6 3 3 0 000 6z"
                          fill-rule="evenodd"
                        ></path>
                        <path
                          fill="currentColor"
                          d="M15.79 8.62L15 8l.79-.62a1 1 0 010 1.24zM1 8l-.79.62.02.02a5.56 5.56 0 00.15.18 15.16 15.16 0 002.05 1.96C3.77 11.84 5.73 13 8 13c2.26 0 4.23-1.16 5.57-2.22a15.17 15.17 0 002.2-2.14l.01-.02L15 8l.79-.62-.02-.02a6.17 6.17 0 00-.6-.67c-.37-.4-.92-.94-1.6-1.47C12.23 4.16 10.27 3 8 3 5.73 3 3.77 4.16 2.43 5.22a15.16 15.16 0 00-2.2 2.14l-.01.02L1 8zm0 0l-.79.62a1 1 0 010-1.24L1 8zm0 0s3.13-4 7-4 7 4 7 4-3.13 4-7 4-7-4-7-4z"
                          fill-rule="evenodd"
                        ></path>
                      </svg>

                      <h5>Desciption</h5>
                    </>
                  }
                  description={
                    <div
                      dangerouslySetInnerHTML={{ __html: product.description }}
                    />
                  }
                />
                <InfoBox
                  title={
                    <>
                      <svg
                        class="icon icon--small icon--type-ruler"
                        stroke-width="1"
                        aria-hidden="true"
                        focusable="false"
                        role="presentation"
                        viewBox="0 0 16 16"
                        width={15}
                        height={15}
                      >
                        <path
                          fill="currentColor"
                          d="M14.93 4.11L12.1 1.28a1 1 0 00-1.41 0L6.8 5.17.78 11.18a1 1 0 000 1.42l2.82 2.82a1 1 0 001.42 0l9.9-9.9a1 1 0 000-1.4zm-10.6 10.6L1.48 11.9l1.41-1.41 1.06 1.06a.5.5 0 00.71-.71L3.61 9.77l1.42-1.42 1.05 1.06a.5.5 0 00.71-.7L5.73 7.65l1.42-1.42L8.2 7.3c.2.2.5.2.7 0s.2-.5 0-.7L7.85 5.53 9.27 4.1l1.06 1.06a.5.5 0 00.71-.7L9.98 3.4 11.39 2l2.83 2.83-9.9 9.9z"
                        ></path>
                      </svg>
                      <h5>Fit</h5>
                    </>
                  }
                  description={
                    isOverSized()
                      ? "This item is designed to be oversized for a regular fit. Please order 1size smaller"
                      : "This item is designed to have a regular fit and should correspond accurately to standard sizing."
                  }
                />
                <InfoBox
                  title={
                    <>
                      <svg
                        class="icon icon--small icon--type-truck"
                        stroke-width="1"
                        aria-hidden="true"
                        focusable="false"
                        role="presentation"
                        width={15}
                        height={15}
                        viewBox="0 0 16 16"
                      >
                        <path
                          fill="currentColor"
                          d="M15.64 6.92L9.5 5.12V4a.5.5 0 00-.5-.5H1a.5.5 0 00-.5.5v8.5c0 .28.22.5.5.5h1.27a2.1 2.1 0 004.06 0h3.94a2.1 2.1 0 004.06 0h1.17a.5.5 0 00.5-.5V7.4a.5.5 0 00-.36-.48zM4.3 13.6a1.1 1.1 0 110-2.2 1.1 1.1 0 010 2.2zM6.33 12a2.1 2.1 0 00-4.06 0H1.5V4.5h7V12H6.33zm5.97 1.6a1.1 1.1 0 110-2.2 1.1 1.1 0 010 2.2zM15 12h-.67a2.1 2.1 0 00-4.06 0H9.5V6.17l5.5 1.6V12z"
                        ></path>
                      </svg>
                      <h5>Shipping</h5>
                    </>
                  }
                  description={`You can expect to receive your order within 3-5 working days.
Once shipped, you will receive an email to let you know your order is on its way to you.
Once your order is dispatched, you will receive an email notification confirming its shipment.
In the rare event of any exceptions, delivery may take up to a maximum of 15 days.`}
                />
                <InfoBox
                  title={
                    <>
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        stroke-width="0"
                        viewBox="0 0 16 16"
                        width={15}
                        height={15}
                        style={{ translate: "0 1px" }}
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M7.752.066a.5.5 0 0 1 .496 0l3.75 2.143a.5.5 0 0 1 .252.434v3.995l3.498 2A.5.5 0 0 1 16 9.07v4.286a.5.5 0 0 1-.252.434l-3.75 2.143a.5.5 0 0 1-.496 0l-3.502-2-3.502 2.001a.5.5 0 0 1-.496 0l-3.75-2.143A.5.5 0 0 1 0 13.357V9.071a.5.5 0 0 1 .252-.434L3.75 6.638V2.643a.5.5 0 0 1 .252-.434L7.752.066ZM4.25 7.504 1.508 9.071l2.742 1.567 2.742-1.567L4.25 7.504ZM7.5 9.933l-2.75 1.571v3.134l2.75-1.571V9.933Zm1 3.134 2.75 1.571v-3.134L8.5 9.933v3.134Zm.508-3.996 2.742 1.567 2.742-1.567-2.742-1.567-2.742 1.567Zm2.242-2.433V3.504L8.5 5.076V8.21l2.75-1.572ZM7.5 8.21V5.076L4.75 3.504v3.134L7.5 8.21ZM5.258 2.643 8 4.21l2.742-1.567L8 1.076 5.258 2.643ZM15 9.933l-2.75 1.571v3.134L15 13.067V9.933ZM3.75 14.638v-3.134L1 9.933v3.134l2.75 1.571Z"></path>
                      </svg>
                      <h5>Returns</h5>
                    </>
                  }
                  description={`Return items must be in their original condition, undamaged and unworn, with the original tag and packaging.
Returns eligible on full-price items only.`}
                />
                {relatedProduct.length === 0 ? (
                  <></>
                ) : (
                  <>
                    <br />
                    <br />
                    <ProductShowcase
                      products={relatedProduct.filter(
                        (product) => product.id !== id
                      )}
                      skeletonCount={4}
                      title={"Make your look perfect "}
                      to={false}
                      center={false}
                    />
                  </>
                )}
              </div>
            </div>

            <div style={{ marginTop: "10rem", marginBottom: 0 }}>
              {errorSeasonal && !isLoadingSeasonal ? (
                <MessageDisplay
                  message={error}
                  action={fetchEssentialProducts}
                  buttonLabel="Try Again"
                />
              ) : (
                <ProductShowcaseGrid
                  products={essentialProducts.filter(
                    (item) => item.id !== id && item.sex === product.sex
                  )}
                  title={"Essentials"}
                  skeletonCount={2}
                  to={ESSENTIAL_PRODUCTS}
                  view
                />
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default ViewProduct;
