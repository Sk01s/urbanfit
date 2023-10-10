import { useDocumentTitle, useScrollTop } from "@/hooks";
import { shallowEqual, useSelector } from "react-redux";
import { selectFilter } from "@/selectors/selector";
import { ImageLoader } from "@/components/common";
import { displayMoney } from "@/helpers/utils";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useHistory } from "react-router-dom";
import React, { useEffect, useRef, useState, useMemo } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProductRelative = ({ values }) => {
  const [modelRelationProduct, setModelRelationProduct] = useState(false);
  const [state, setState] = useState(values.relative || []);
  const handleSetState = (newState) => {
    setState(newState);
    values.relative = newState;
  };
  const store = useSelector(
    (state) => ({
      filteredProducts: selectFilter(state.products.items, state.filter),
      products: state.products,
      requestStatus: state.app.requestStatus,
      isLoading: state.app.loading,
    }),
    shallowEqual
  );

  const relatedProduct = useMemo(
    () =>
      store.products.items.filter((product) =>
        values.relative?.includes(product.id)
      ),
    [state]
  );
  return (
    <div style={{ maxWidth: "70vw" }}>
      <div style={{ maxWeight: "30vw" }}>
        <ProductShowcase
          products={relatedProduct}
          skeletonCount={4}
          relative={state}
          handleSetState={handleSetState}
          title={"remove by clicking"}
          add={false}
        />
      </div>
      {modelRelationProduct ? (
        <div>
          <ProductShowcase
            products={store.products.items}
            skeletonCount={4}
            relative={state}
            handleSetState={handleSetState}
            title={"Choose by clicking"}
            add={true}
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setModelRelationProduct(true);
          }}
        >
          Add relation
        </button>
      )}
    </div>
  );
};

const ProductShowcase = ({
  products = [],
  skeletonCount,
  title,
  titleStyle,
  relative,
  add,
  handleSetState,
}) => {
  const settings = {
    className: "center",
    centerMode: true,
    infinite: false,
    centerPadding: "0",
    slidesToShow: 1,
    speed: 500,
    arrows: false,
    variableWidth: true,
  };

  const sliderRef = useRef(null);

  const goToNext = () => {
    sliderRef.current.slickNext(); // Go to the next slide
  };

  const goToPrevious = () => {
    sliderRef.current.slickPrev(); // Go to the previous slide
  };

  return (
    <>
      <div className="display-header">
        <button
          type="button"
          onClick={goToPrevious}
          style={{
            background: "rgba(255, 255, 255, 0)",
            border: "none",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <title>Left</title>
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <h1 style={titleStyle}>{title}</h1>
        <button
          type="button"
          onClick={goToNext}
          style={{
            background: "rgba(255, 255, 255, 0)",
            border: "none",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="feather feather-chevron-right"
          >
            <title>Right</title>
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
      <Slider ref={sliderRef} {...settings}>
        {products.length === 0
          ? new Array(skeletonCount).fill({}).map((product, index) => (
              <FeaturedProduct
                // eslint-disable-next-line react/no-array-index-key
                key={`product-skeleton ${index}`}
                product={product}
                relative={relative}
                handleSetState={handleSetState}
              />
            ))
          : products.map((product) => (
              <FeaturedProduct
                key={product.id}
                product={product}
                relative={relative}
                add={add}
                handleSetState={handleSetState}
              />
            ))}
      </Slider>
    </>
  );
};

ProductShowcase.defaultProps = {
  skeletonCount: 4,
};

const FeaturedProduct = ({ product, relative, add, handleSetState }) => {
  const history = useHistory();
  const onClickItem = () => {
    if (!product) return;
    if (add) {
      if (relative.includes(product.id)) return;
      handleSetState([...relative, product.id]);
    } else {
      handleSetState(relative.filter((id) => id !== product.id));
    }
  };
  return (
    <SkeletonTheme color="#e1e1e1" highlightColor="#f2f2f2">
      <div
        className="product-display"
        onClick={onClickItem}
        role="presentation"
      >
        {product.totalQuantity === 0 && <div className="badge">Sold Out</div>}
        <div className="product-display-img" style={{ height: "20rem" }}>
          {product.image ? (
            <ImageLoader
              className="product-card-img"
              src={product.image}
              draggable={false}
            />
          ) : (
            <Skeleton width="100%" height="100%" />
          )}
        </div>
        <div className="product-display-details">
          <h4>{product.name ? `${product.name} ` : <Skeleton width={80} />}</h4>

          <p className="product-card-price ">
            {product.price ? (
              ` ${displayMoney(product.price)} USD `
            ) : (
              <Skeleton width={40} />
            )}
          </p>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default ProductRelative;
