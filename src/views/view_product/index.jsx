import { ArrowLeftOutlined, LoadingOutlined } from "@ant-design/icons";
import { ColorChooser, ImageLoader, MessageDisplay } from "@/components/common";
import { ProductShowcaseGrid } from "@/components/product";
import { RECOMMENDED_PRODUCTS, SHOP } from "@/constants/routes";
import { displayMoney } from "@/helpers/utils";
import {
  useBasket,
  useDocumentTitle,
  useProduct,
  useRecommendedProducts,
  useScrollTop,
} from "@/hooks";
import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Select from "react-select";
import { Helmet } from "react-helmet";

const ViewProduct = () => {
  const sizesBtnsEl = useRef([]);
  const { id } = useParams();
  const { product, isLoading, error } = useProduct(id);
  const { addToBasket, isItemOnBasket } = useBasket(id);
  useScrollTop();
  useDocumentTitle(`View ${product?.name || "Item"}`);
  const [selectedImage, setSelectedImage] = useState(product?.image || "");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const {
    recommendedProducts,
    fetchRecommendedProducts,
    isLoading: isLoadingFeatured,
    error: errorFeatured,
  } = useRecommendedProducts(6);
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
      quantity: 1,
      selectedSize: selectedSize,
    });
  };

  return (
    <>
      <Helmet>
        <meta name="description" content={product?.description} />
      </Helmet>

      <main className="content">
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
            <Link to={SHOP}>
              <h3 className="button-link d-inline-flex">
                <ArrowLeftOutlined />
                &nbsp; Back to shop
              </h3>
            </Link>
            <div className="product-modal">
              {product.imageCollection.length !== 0 && (
                <div className="product-modal-image-collection">
                  {product.imageCollection.map((image) => (
                    <div
                      className="product-modal-image-collection-wrapper"
                      key={image.id}
                      onClick={() => setSelectedImage(image.url)}
                      role="presentation"
                    >
                      <ImageLoader
                        className="product-modal-image-collection-img"
                        src={image.url}
                      />
                    </div>
                  ))}
                </div>
              )}
              <div className="product-modal-image-wrapper">
                {selectedColor && (
                  <input
                    type="color"
                    disabled
                    ref={colorOverlay}
                    id="color-overlay"
                  />
                )}
                <ImageLoader
                  alt={product.name}
                  className="product-modal-image"
                  src={selectedImage}
                />
              </div>
              <div className="product-modal-details">
                <br />
                <span className="text-subtle">{product.type}</span>
                <h1 className="margin-top-0">{product.name}</h1>
                <span>{product.description}</span>
                <br />
                <br />
                <div className="divider" />
                <br />
                <div>
                  <span className="text-subtle">Lens Width and Frame Size</span>
                  <br />
                  <br />
                  <div className="product-sizes-container">
                    <button
                      ref={(el) => (sizesBtnsEl.current[0] = el)}
                      className={`product-size  ${
                        product.xlQuantity || "not-available"
                      }`}
                      disabled={product.xlQuantity ? false : true}
                      onClick={(e) => onSelectedSizeChange(0, "xl")}
                    >
                      Xl
                    </button>
                    <button
                      ref={(el) => (sizesBtnsEl.current[1] = el)}
                      className={`product-size ${
                        product.lgQuantity || "not-available"
                      }`}
                      disabled={product.lgQuantity ? false : true}
                      onClick={(e) => onSelectedSizeChange(1, "lg")}
                    >
                      L
                    </button>
                    <button
                      ref={(el) => (sizesBtnsEl.current[2] = el)}
                      className={`product-size ${
                        product.mdQuantity || "not-available"
                      }`}
                      disabled={product.mdQuantity ? false : true}
                      onClick={(e) => onSelectedSizeChange(2, "md")}
                    >
                      M
                    </button>
                    <button
                      ref={(el) => (sizesBtnsEl.current[3] = el)}
                      className={`product-size  ${
                        product.smQuantity || "not-available"
                      }`}
                      disabled={product.smQuantity ? false : true}
                      onClick={(e) => onSelectedSizeChange(3, "sm")}
                    >
                      S
                    </button>
                    <button
                      ref={(el) => (sizesBtnsEl.current[4] = el)}
                      className={`product-size ${
                        product.xsQuantity || "not-available"
                      }`}
                      disabled={product.xsQuantity ? false : true}
                      onClick={(e) => onSelectedSizeChange(4, "xs")}
                    >
                      Xs
                    </button>
                  </div>
                </div>
                <br />
                {product.availableColors.length >= 1 && (
                  <div>
                    <span className="text-subtle">Choose Color</span>
                    <br />
                    <br />
                    <ColorChooser
                      availableColors={product.availableColors}
                      onSelectedColorChange={onSelectedColorChange}
                    />
                  </div>
                )}
                <h1>{displayMoney(product.price)}</h1>
                <div className="product-modal-action">
                  <button
                    className={`button button-small ${
                      isItemOnBasket(product.id)
                        ? "button-border button-border-gray"
                        : ""
                    }`}
                    onClick={handleAddToBasket}
                    type="button"
                  >
                    {isItemOnBasket(product.id)
                      ? "Remove From Basket"
                      : "Add To Basket"}
                  </button>
                </div>
              </div>
            </div>
            <div style={{ marginTop: "10rem" }}>
              <div className="display-header">
                <h1>Recommended</h1>
                <Link to={RECOMMENDED_PRODUCTS}>See All</Link>
              </div>
              {errorFeatured && !isLoadingFeatured ? (
                <MessageDisplay
                  message={error}
                  action={fetchRecommendedProducts}
                  buttonLabel="Try Again"
                />
              ) : (
                <ProductShowcaseGrid
                  products={recommendedProducts}
                  skeletonCount={3}
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
