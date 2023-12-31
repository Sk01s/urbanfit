import { ImageLoader } from "@/components/common";
import { displayMoney } from "@/helpers/utils";
import { useWish } from "@/hooks";
import { BasketToggle } from "@/components/basket";
import PropType from "prop-types";
import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useHistory } from "react-router-dom";

const ProductFeatured = ({ product, skeleton, onClick, cart }) => {
  const { wish, addToWish, isItemOnWish } = useWish(product.id);
  const history = useHistory();
  const onClickItem = (onClickToggle, e) => {
    if (!product) return;
    onClick?.();
    document.body.classList.remove("is-basket-open");
    history.push(`/product/${product.id}`);
  };
  return (
    <SkeletonTheme color="#e1e1e1" highlightColor="#f2f2f2">
      {cart ? (
        <BasketToggle>
          {({ onClickToggle }) => (
            <div
              style={{ position: "relative" }}
              className="basket-toggle"
              onMouseEnter={(e) => e.currentTarget.classList.add("hover")}
              onMouseLeave={(e) => e.currentTarget.classList.remove("hover")}
            >
              <div
                className={`product-display ${
                  product.totalQuantity === 0 ? "out" : ""
                }`}
                onClick={(e) => onClickItem(onClickToggle, e)}
                role="presentation"
              >
                {product.totalQuantity === 0 && (
                  <div className="badge">Sold Out</div>
                )}
                <div className="product-display-img">
                  {product.image ? (
                    <>
                      <ImageLoader
                        src={product.image}
                        draggable={false}
                        style={{ minWidth: "200px" }}
                      />
                      {product.imageCollection[3] &&
                        window.innerWidth > 700 && (
                          <ImageLoader
                            className="image"
                            src={product.imageCollection[3].url}
                            draggable={false}
                            style={{ minWidth: "200px" }}
                          />
                        )}
                    </>
                  ) : (
                    <Skeleton width="50vw" height="100%" />
                  )}
                </div>
                <div className="product-display-details">
                  <h4>
                    {product.name ? (
                      `${product.name} `
                    ) : (
                      <Skeleton width={80} />
                    )}
                  </h4>
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
                      <p style={{ color: "#da6d77" }}>
                        {product.percentage}% off
                      </p>
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
                  {/* <p className="product-card-price ">
                    {product.price ? (
                      ` ${displayMoney(product.price)} USD `
                    ) : (
                      <Skeleton width={40} />
                    )}
                  </p> */}
                </div>
              </div>
              {skeleton || (
                <button
                  style={{
                    all: "unset",
                    cursor: "pointer",
                    position: "absolute",
                    top: 0,
                    right: "1.5rem",
                    padding: ".5rem",
                  }}
                  onClick={() => {
                    addToWish(product);
                  }}
                >
                  {isItemOnWish(product.id) ? (
                    <svg width={25} height={25} id="heart">
                      <path d="M2.2 9.4c0 1.3.2 3.3 2 5.1 1.6 1.6 6.9 5.2 7.1 5.4.2.1.4.2.6.2s.4-.1.6-.2c.2-.2 5.5-3.7 7.1-5.4 1.8-1.8 2-3.8 2-5.1 0-3-2.4-5.4-5.4-5.4-1.6 0-3.2.9-4.2 2.3C11 4.9 9.4 4 7.6 4 4.7 4 2.2 6.4 2.2 9.4z"></path>
                    </svg>
                  ) : (
                    <svg width={27} height={27} viewBox="0 0 50 50">
                      <path d="M25 39.7l-.6-.5C11.5 28.7 8 25 8 19c0-5 4-9 9-9 4.1 0 6.4 2.3 8 4.1 1.6-1.8 3.9-4.1 8-4.1 5 0 9 4 9 9 0 6-3.5 9.7-16.4 20.2l-.6.5zM17 12c-3.9 0-7 3.1-7 7 0 5.1 3.2 8.5 15 18.1 11.8-9.6 15-13 15-18.1 0-3.9-3.1-7-7-7-3.5 0-5.4 2.1-6.9 3.8L25 17.1l-1.1-1.3C22.4 14.1 20.5 12 17 12z" />
                    </svg>
                  )}
                </button>
              )}
            </div>
          )}
        </BasketToggle>
      ) : (
        <div
          style={{ position: "relative" }}
          onMouseEnter={(e) => e.currentTarget.classList.add("hover")}
          onMouseLeave={(e) => e.currentTarget.classList.remove("hover")}
        >
          <div
            className={`product-display ${
              product.totalQuantity === 0 ? "out" : ""
            }`}
            onClick={onClickItem}
            role="presentation"
          >
            {product.totalQuantity === 0 && (
              <div className="badge">Sold Out</div>
            )}
            <div className="product-display-img">
              {product.image ? (
                <>
                  <ImageLoader
                    src={product.image}
                    draggable={false}
                    style={{ minWidth: "200px" }}
                  />
                  {product.imageCollection[3] && window.innerWidth > 700 && (
                    <ImageLoader
                      className="image"
                      src={product.imageCollection[3].url}
                      draggable={false}
                      style={{ minWidth: "200px" }}
                    />
                  )}
                </>
              ) : (
                <Skeleton width="50vw" height="100%" />
              )}
            </div>
            <div className="product-display-details">
              <h4>
                {product.name ? `${product.name} ` : <Skeleton width={80} />}
              </h4>
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
          {skeleton || (
            <button
              style={{
                all: "unset",
                cursor: "pointer",
                position: "absolute",
                top: 0,
                right: "1.5rem",
                padding: ".5rem",
              }}
              onClick={() => {
                addToWish(product);
              }}
            >
              {isItemOnWish(product.id) ? (
                <svg width={25} height={25} id="heart">
                  <path d="M2.2 9.4c0 1.3.2 3.3 2 5.1 1.6 1.6 6.9 5.2 7.1 5.4.2.1.4.2.6.2s.4-.1.6-.2c.2-.2 5.5-3.7 7.1-5.4 1.8-1.8 2-3.8 2-5.1 0-3-2.4-5.4-5.4-5.4-1.6 0-3.2.9-4.2 2.3C11 4.9 9.4 4 7.6 4 4.7 4 2.2 6.4 2.2 9.4z"></path>
                </svg>
              ) : (
                <svg width={27} height={27} viewBox="0 0 50 50">
                  <path d="M25 39.7l-.6-.5C11.5 28.7 8 25 8 19c0-5 4-9 9-9 4.1 0 6.4 2.3 8 4.1 1.6-1.8 3.9-4.1 8-4.1 5 0 9 4 9 9 0 6-3.5 9.7-16.4 20.2l-.6.5zM17 12c-3.9 0-7 3.1-7 7 0 5.1 3.2 8.5 15 18.1 11.8-9.6 15-13 15-18.1 0-3.9-3.1-7-7-7-3.5 0-5.4 2.1-6.9 3.8L25 17.1l-1.1-1.3C22.4 14.1 20.5 12 17 12z" />
                </svg>
              )}
            </button>
          )}
        </div>
      )}
    </SkeletonTheme>
  );
};

ProductFeatured.propTypes = {
  product: PropType.shape({
    image: PropType.string,
    name: PropType.string,
    id: PropType.string,
    type: PropType.string,
  }).isRequired,
};

export default ProductFeatured;
