import { CloseOutlined } from "@ant-design/icons";
import { ImageLoader } from "@/components/common";
import { displayMoney } from "@/helpers/utils";
import PropType from "prop-types";
import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { removeFromBasket } from "@/redux/actions/basketActions";

const EmailItem = ({ product, display = false }) => {
  const dispatch = useDispatch();
  const onRemoveFromBasket = () => dispatch(removeFromBasket(product.id));
  const displaySizeForOmar = (size) => {
    if (size === "lg") return "L";
    if (size === "md") return "M";
    if (size === "sm") {
      return "S";
    } else {
      return size?.toLocaleUpperCase();
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

            <div className="basket-item-price">
              <h4 className="my-0">
                {displayMoney(
                  product.onSale
                    ? Number(product.price) *
                        (1 - Number(product.percentage / 100)) *
                        Number(product.quantity || 1)
                    : Number(product.price) * Number(product.quantity || 1)
                )}
              </h4>
            </div>
          </div>

          <div className="basket-item-specs">
            <div>
              <div
                style={{ display: "flex", gap: "0.8rem", alignItems: "center" }}
              >
                <span className="spec-title">Size : </span>
                <h5 className="my-0">
                  {displaySizeForOmar(product.selectedSize)}{" "}
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

EmailItem.propTypes = {
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

export default EmailItem;
