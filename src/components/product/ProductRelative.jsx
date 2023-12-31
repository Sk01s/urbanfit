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
import { useProducts } from "@/hooks";

const ProductRelative = ({ values }) => {
  const [modelRelationProduct, setModelRelationProduct] = useState(false);
  const [state, setState] = useState(values.relative || []);
  const handleSetState = (newState) => {
    setState(newState);
    values.relative = newState;
  };
  const { products, fetchProducts, error, isLoading } = useProducts();

  const relatedProduct = useMemo(
    () => products.filter((product) => values.relative?.includes(product.id)),
    [state]
  );
  return (
    <div style={{ maxWidth: "70vw" }}>
      <div style={{ maxWeight: "30vw" }}>
        {error && !isLoading ? (
          <MessageDisplay
            message={error}
            action={fetchProducts}
            buttonLabel="Try Again"
          />
        ) : (
          <>
            <ProductShowcase
              products={relatedProduct}
              skeletonCount={4}
              relative={state}
              handleSetState={handleSetState}
              title={"remove by clicking"}
              add={false}
            />
          </>
        )}
      </div>
      {modelRelationProduct ? (
        <div>
          {error && !isLoading ? (
            <MessageDisplay
              message={error}
              action={fetchProducts}
              buttonLabel="Try Again"
            />
          ) : (
            <>
              <ProductShowcase
                products={products}
                skeletonCount={4}
                relative={state}
                handleSetState={handleSetState}
                title={"Choose by clicking"}
                add={true}
              />
            </>
          )}
        </div>
      ) : (
        <button
          className="button"
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
  return (
    <>
      <div className="display-header">
        <h1 style={titleStyle}>{title}</h1>
        <br />
      </div>
      <div className="product-grid">
        {products.length === 0
          ? new Array(skeletonCount).fill({}).map((product, index) => (
              <FeaturedProduct
                // eslint-disable-next-line react/no-array-index-key
                key={`product-skeleton ${index}`}
                product={product}
                relative={relative}
                handleSetState={handleSetState}
                skeleton
              />
            ))
          : products.map((product) => (
              <FeaturedProduct
                key={product.id}
                product={product}
                relative={relative}
                add={add}
                handleSetState={handleSetState}
                products={products}
              />
            ))}
      </div>
    </>
  );
};

ProductShowcase.defaultProps = {
  skeletonCount: 4,
};

const FeaturedProduct = ({
  product,
  relative,
  add,
  handleSetState,
  products,
}) => {
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
        <div className="product-display-img">
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

          {product.onSale ? (
            <div
              style={{
                marginTop: ".5rem",
                display: "flex",
                gap: ".7rem",
                letterSpacing: ".055rem",
                fontSize: "1.35rem",
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
              <p style={{ color: "#da6d77" }}>{product.percentage}% off</p>
            </div>
          ) : (
            <p
              style={{
                marginTop: ".5rem",
                letterSpacing: ".055rem",
                fontSize: "1.3rem",
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
      </div>
    </SkeletonTheme>
  );
};

export default ProductRelative;
