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

const ViewProduct = () => {
  const { pathname } = useLocation();
  const slider = useRef();
  const sizesBtnsEl = useRef([]);
  const { id } = useParams();
  const { product, isLoading, error } = useProduct(id);
  const { addToBasket, isItemOnBasket } = useBasket(id);
  const { wish, addToWish, isItemOnWish } = useWish(id);
  useScrollTop();
  useDocumentTitle(`View ${product?.name || "Item"}`);
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

  const handleAddToBasket = () => {
    addToBasket({
      ...product,
      selectedColor,
      quantity,
      selectedSize: selectedSize,
    });
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
                  <svg
                    role="presentation"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M14.7663 1.41452C14.3753 0.966073 13.9111 0.610337 13.4002 0.367629C12.8893 0.124922 12.3417 0 11.7887 0C11.2357 0 10.6881 0.124922 10.1772 0.367629C9.66629 0.610337 9.20211 0.966073 8.81116 1.41452L7.9998 2.34476L7.18843 1.41452C6.39874 0.509117 5.32768 0.0004693 4.21089 0.000469309C3.09409 0.000469319 2.02303 0.509117 1.23334 1.41452C0.443646 2.31992 8.32078e-09 3.5479 0 4.82833C-8.32078e-09 6.10875 0.443646 7.33674 1.23334 8.24214L2.0447 9.17238L7.9998 16L13.9549 9.17238L14.7663 8.24214C15.1574 7.79391 15.4677 7.26171 15.6794 6.67596C15.891 6.0902 16 5.46237 16 4.82833C16 4.19428 15.891 3.56645 15.6794 2.9807C15.4677 2.39494 15.1574 1.86275 14.7663 1.41452Z"
                      fill={isItemOnWish(product.id) ? "#000" : "#fff"}
                    ></path>
                  </svg>
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
                <h2>{product.name}</h2>
                <p style={{ fontWeight: "300 ", fontSize: "19px" }}>
                  {displayMoney(product.price)}
                </p>
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
                  <button
                    className={`button ${
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
                    onClick={handleAddToBasket}
                    type="button"
                  >
                    {isItemOnBasket(product.id)
                      ? "Remove From Cart"
                      : "Add To Cart"}
                  </button>
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
                      ? "This item is designed to be oversized for a regular fit."
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
                  description={""}
                />
                <InfoBox
                  title={
                    <>
                      <svg
                        class="icon icon--small icon--type-box"
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
                          d="M14.41 3.37L8.27 1.41a1 1 0 00-.61 0L1.52 3.37a1 1 0 00-.7.95v7.86c0 .41.25.78.63.93l6.14 2.46c.24.1.5.1.75 0l6.14-2.46a1 1 0 00.62-.93V4.32a1 1 0 00-.69-.95zM7.96 2.36l6.05 1.93-2.7.9L5.35 3.2l2.63-.84zm-.46 12.1l-5.68-2.28V5.3L7.5 7.2v7.26zM8 6.3L1.96 4.28l2.58-.82 5.99 2L8 6.3zm6.1 5.89l-5.6 2.24V7.19l5.6-1.87v6.87z"
                        ></path>
                      </svg>
                      <h5>Shipping</h5>
                    </>
                  }
                  description={""}
                />
                {relatedProduct.length === 0 ? (
                  <></>
                ) : (
                  <>
                    <br />
                    <br />
                    <ProductShowcase
                      products={relatedProduct}
                      skeletonCount={4}
                      title={"Make your look perfect "}
                      to={false}
                      center={false}
                    />
                  </>
                )}
              </div>
            </div>

            <div style={{ marginTop: "10rem" }}>
              {errorSeasonal && !isLoadingSeasonal ? (
                <MessageDisplay
                  message={error}
                  action={fetchEssentialProducts}
                  buttonLabel="Try Again"
                />
              ) : (
                <ProductShowcaseGrid
                  products={essentialProducts}
                  title={"Essentials"}
                  skeletonCount={2}
                  to={ESSENTIAL_PRODUCTS}
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
