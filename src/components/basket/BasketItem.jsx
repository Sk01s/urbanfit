import { CloseOutlined } from "@ant-design/icons";
import { BasketItemControl } from "@/components/basket";
import { ImageLoader } from "@/components/common";
import { displayMoney } from "@/helpers/utils";
import PropType from "prop-types";
import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { removeFromBasket } from "@/redux/actions/basketActions";

const BasketItem = ({ product, display = false }) => {
  const dispatch = useDispatch();
  const onRemoveFromBasket = () => dispatch(removeFromBasket(product.id));
  const displaySizeForOmar = (size) => {
    if (size === "lg") return "L";
    if (size === "md") return "M";
    if (size === "sm") {
      return "S";
    } else {
      return size.toLocaleUpperCase();
    }
  };
  return (
    <div className="basket-item">
      <div className="basket-item-wrapper">
        <div className="basket-item-img-wrapper">
          <ImageLoader
            alt={product.name}
            className="basket-item-img"
            src={product.image}
          />
        </div>
        <div className="basket-item-details">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Link
              to={`/product/${product.id}`}
              onClick={() => document.body.classList.remove("is-basket-open")}
              style={{ maxWidth: "30vw" }}
            >
              <h4 className="basket-item-name">{product.name}</h4>
            </Link>
            {display ? (
              <></>
            ) : (
              <div className="basket-item-price">
                <h4 className="my-0">{displayMoney(product.price)}</h4>
              </div>
            )}
          </div>

          <div className="basket-item-specs">
            <div>
              {display ? (
                <></>
              ) : (
                <div style={{ display: "flex", gap: "0.8rem" }}>
                  <span className="spec-title">Color : </span>
                  <div
                    style={{
                      backgroundColor:
                        product.selectedColor || product.availableColors[0],
                      width: "11px",
                      height: "11px",
                      borderRadius: "50%",
                      translate: " -3px 1.5px",
                    }}
                  />
                </div>
              )}
              <div
                style={{ display: "flex", gap: "0.8rem", marginBlock: ".6rem" }}
              >
                <span className="spec-title">Size : </span>
                <h5 className="my-0" style={{ fontSize: "1.125rem" }}>
                  {displaySizeForOmar(product.selectedSize)}{" "}
                </h5>
              </div>
              {display && (
                <div className="spec-title">
                  <div className="my-0" style={{ fontSize: "1.125rem" }}>
                    Quantity : {product.quantity}
                  </div>
                </div>
              )}
              {product[`${product.selectedSize}Quantity`] <= 9 && !display && (
                <div
                  style={{
                    display: "flex",
                    gap: "0.8rem",
                    marginBlock: ".6rem",
                  }}
                >
                  <h5 className="my-0" style={{ fontSize: "1.125rem" }}>
                    {product[`${product.selectedSize}Quantity`]}
                  </h5>
                  <span className="spec-title">in stock </span>
                </div>
              )}

              {display ? (
                <></>
              ) : (
                <div>
                  <span className="spec-title"></span>
                  {/* <h5 className="my-0">{product.quantity}</h5> */}
                  <BasketItemControl product={product} />
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

BasketItem.propTypes = {
  product: PropType.shape({
    id: PropType.string,
    name: PropType.string,
    type: PropType.string,
    price: PropType.number,
    quantity: PropType.number,
    maxQuantity: PropType.number,
    description: PropType.string,
    keywords: PropType.arrayOf(PropType.string),
    selectedSize: PropType.string,
    selectedColor: PropType.string,
    imageCollection: PropType.arrayOf(PropType.string),
    sizes: PropType.arrayOf(PropType.number),
    image: PropType.string,
    imageUrl: PropType.string,
    isFeatured: PropType.bool,
    isRecommended: PropType.bool,
    availableColors: PropType.arrayOf(PropType.string),
  }).isRequired,
};

export default BasketItem;
