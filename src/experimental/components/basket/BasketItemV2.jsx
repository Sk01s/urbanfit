import BasketItemControlV2 from "@/experimental/components/basket/BasketItemControlV2";
import { ImageLoader } from "@/components/common";
import { displayMoney } from "@/helpers/utils";
import PropType from "prop-types";
import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { removeFromBasketV2 } from "@/experimental/redux/actions/basketV2Actions";

const getItemKey = (id, selectedColor, selectedSize) =>
  `${id}_${selectedColor || ""}_${selectedSize || ""}`;

const displaySizeForOmar = (size) => {
  if (size === "lg") return "L";
  if (size === "md") return "M";
  if (size === "sm") return "S";
  return size?.toLocaleUpperCase();
};

const BasketItemV2 = ({ product, display = false }) => {
  const dispatch = useDispatch();
  const itemKey = getItemKey(product.id, product.selectedColor, product.selectedSize);
  const onRemoveFromBasket = () => dispatch(removeFromBasketV2(itemKey));
  const activeVariant = product.activeVariant;
  const thumbnailImage = activeVariant?.image || product.image;
  const stockQty = activeVariant?.quantities
    ? activeVariant.quantities[product.selectedSize] || 0
    : 0;

  return (
    <div className="basket-item">
      <div className="basket-item-wrapper">
        <div className="basket-item-img-wrapper">
          <ImageLoader
            alt={product.name}
            className="basket-item-img"
            src={thumbnailImage}
            minWidth="90px"
            minHeight="90px"
            aspectRatio="auto"
          />
        </div>
        <div className="basket-item-details">
          <div
            style={{
              marginTop: "0.5rem",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Link
              to={`/product/${product.id}`}
              onClick={() => document.body.classList.remove("is-basket-open")}
              style={{ maxWidth: "30vw" }}
            >
              <h3 className="basket-item-name" style={{ margin: 0 }}>
                {product.name}
              </h3>
            </Link>
            {display ? (
              <></>
            ) : (
              <div className="basket-item-price">
                {product.onSale ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: ".7rem",
                      letterSpacing: ".055rem",
                      fontSize: "1.4rem",
                    }}
                  >
                    <div className="m-0">
                      {product.price ? (
                        ` ${displayMoney(
                          Number(product.price) * (1 - Number(product.percentage) / 100)
                        )}  `
                      ) : null}
                    </div>
                    <div
                      className="m-0"
                      style={{
                        marginTop: ".5rem",
                        textDecoration: "line-through",
                        color: "rgb(52, 58, 64)",
                        fontSize: "1.1rem",
                      }}
                    >
                      {product.price ? ` ${displayMoney(product.price)} ` : null}
                    </div>
                  </div>
                ) : (
                  <div className="m-0">
                    {product.price ? ` ${displayMoney(product.price)}  ` : null}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="basket-item-specs">
            <div>
              {display ? (
                <></>
              ) : (
                <div style={{ display: "flex", gap: "0.8rem", alignItems: "center" }}>
                  <span className="spec-title">Color{product.selectedColorName ? ` — ${product.selectedColorName}` : ""}:</span>
                  <div
                    style={{
                      backgroundColor: product.selectedColor,
                      width: "11px",
                      height: "11px",
                      borderRadius: "50%",
                      translate: "-3px 1.5px",
                    }}
                  />
                </div>
              )}
              <div style={{ display: "flex", gap: "0.8rem", marginBlock: ".6rem" }}>
                <span className="spec-title">Size : </span>
                <h5 className="my-0" style={{ fontSize: "1.125rem" }}>
                  {displaySizeForOmar(product.selectedSize)}
                </h5>
              </div>
              {display && (
                <div className="spec-title">
                  <div className="my-0" style={{ fontSize: "1.125rem" }}>
                    Quantity : {product.quantity}
                  </div>
                </div>
              )}
              {stockQty <= 9 && !display && (
                <div style={{ display: "flex", gap: "0.8rem", marginBlock: ".6rem" }}>
                  <h5 className="my-0" style={{ fontSize: "1.125rem" }}>{stockQty}</h5>
                  <span className="spec-title">in stock</span>
                </div>
              )}

              {display ? (
                <></>
              ) : (
                <div>
                  <span className="spec-title"></span>
                  <BasketItemControlV2 product={product} />
                </div>
              )}
            </div>
            {display ? (
              <></>
            ) : (
              <button
                onClick={onRemoveFromBasket}
                type="button"
                style={{
                  all: "unset",
                  cursor: "pointer",
                  fontSize: "1rem",
                  textDecoration: "underline",
                  color: "#000",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: "1rem",
                }}
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

BasketItemV2.propTypes = {
  product: PropType.shape({
    id: PropType.string,
    name: PropType.string,
    price: PropType.number,
    quantity: PropType.number,
    onSale: PropType.bool,
    percentage: PropType.number,
    selectedSize: PropType.string,
    selectedColor: PropType.string,
    selectedColorName: PropType.string,
    image: PropType.string,
    activeVariant: PropType.shape({
      image: PropType.string,
      quantities: PropType.object,
    }),
  }).isRequired,
  display: PropType.bool,
};

export default BasketItemV2;