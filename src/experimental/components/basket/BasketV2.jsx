import { BasketItemV2 } from "@/experimental/components/basket";
import { BasketToggle } from "@/components/basket";
import { Boundary, Modal } from "@/components/common";
import { CHECKOUT_STEP_1 } from "@/constants/routes";
import { calculateSubtotal, displayMoney } from "@/helpers/utils";
import { useDidMount, useModal } from "@/hooks";
import { useProductsV2 } from "@/experimental/hooks";
import { getProductVariant } from "@/experimental/helpers/getProductVariant";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { clearBasketV2, setBasketV2Items } from "@/experimental/redux/actions/basketV2Actions";
import { showPromoPopup } from "@/redux/actions/miscActions";

const getItemKey = (id, selectedColor, selectedSize) =>
  `${id}_${selectedColor || ""}_${selectedSize || ""}`;

const BasketV2 = () => {
  const { isOpenModal, onOpenModal, onCloseModal } = useModal();
  const { basketV2, user } = useSelector((state) => ({
    basketV2: state.basketV2,
    user: state.auth,
  }));
  const history = useHistory();
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const didMount = useDidMount();
  const { products } = useProductsV2();

  useEffect(() => {
    if (didMount && basketV2.length !== 0) {
      const updated = basketV2.map((basketItem) => {
        const freshProduct = products.find((p) => p.id === basketItem.id);
        if (freshProduct) {
          const freshVariant = getProductVariant(freshProduct, basketItem.selectedColor);
          return {
            ...basketItem,
            ...freshProduct,
            ...(freshVariant || {}),
            quantity: basketItem.quantity,
            selectedColor: basketItem.selectedColor,
            selectedColorName: freshVariant?.activeColorName || basketItem.selectedColorName,
            selectedSize: basketItem.selectedSize,
            activeVariant: freshVariant?.activeVariant || basketItem.activeVariant,
          };
        }
        return basketItem;
      });
      dispatch(setBasketV2Items(updated));
    }
  }, [products]);

  const onCheckOut = () => {
    if (basketV2.length !== 0 && user) {
      dispatch(showPromoPopup());
      document.body.classList.remove("is-basket-open");
      history.push(CHECKOUT_STEP_1);
    } else {
      onOpenModal();
    }
  };

  const onSignInClick = () => {
    onCloseModal();
    document.body.classList.remove("basket-open");
    history.push(CHECKOUT_STEP_1);
  };

  const onClearBasket = () => {
    if (basketV2.length !== 0) {
      dispatch(clearBasketV2());
    }
  };

  return user && user.role === "ADMIN" ? null : (
    <Boundary>
      <Modal isOpen={isOpenModal} onRequestClose={onCloseModal}>
        <p className="text-center">You must sign in to continue checking out</p>
        <br />
        <div className="d-flex-center">
          <button className="button button-border button-border-gray button-small" onClick={onCloseModal} type="button">
            Continue shopping
          </button>
          &nbsp;
          <button className="button button-small" onClick={onSignInClick} type="button">
            Sign in to checkout
          </button>
        </div>
      </Modal>
      <div className="basket">
        {basketV2.length <= 0 ? (
          <>
            <div className="basket-header-btn">
              <BasketToggle>
                {({ onClickToggle }) => (
                  <span
                    style={{ marginLeft: "auto", marginTop: ".5rem", marginRight: "0.5rem" }}
                    className="basket-toggle button button-border button-border-gray button-small"
                    onClick={onClickToggle}
                    role="presentation"
                  >
                    Close
                  </span>
                )}
              </BasketToggle>
            </div>
            <div className="basket-empty">
              <h5 className="basket-empty-msg">Your Cart is empty</h5>
              <BasketToggle>
                {({ onClickToggle }) => (
                  <button className="button" onClick={onClickToggle} role="presentation">
                    Start Shopping
                  </button>
                )}
              </BasketToggle>
            </div>
          </>
        ) : (
          <>
            <div className="basket-list">
              <div className="basket-header">
                <h3 className="basket-header-title">
                  My Cart &nbsp;
                  <span>({` ${basketV2.length} ${basketV2.length > 1 ? "items" : "item"} `})</span>
                </h3>
                <div className="basket-header-btn">
                  <BasketToggle>
                    {({ onClickToggle }) => (
                      <span
                        className="basket-toggle button button-border button-border-gray button-small"
                        onClick={onClickToggle}
                        role="presentation"
                      >
                        Close
                      </span>
                    )}
                  </BasketToggle>
                </div>
              </div>
              <div style={{ overflowY: "scroll" }}>
                {basketV2.map((product, i) => (
                  <BasketItemV2
                    key={getItemKey(product.id, product.selectedColor, product.selectedSize)}
                    product={product}
                  />
                ))}
              </div>
            </div>
            <div className="basket-checkout">
              <div className="basket-total">
                <p className="basket-total-title">Subtotal Amout:</p>
                <h2 className="basket-total-amount">{displayMoney(calculateSubtotal(basketV2))}</h2>
              </div>
              <button
                className="basket-checkout-button button"
                disabled={basketV2.length === 0 || pathname === "/checkout"}
                onClick={onCheckOut}
                type="button"
              >
                Check Out
              </button>
            </div>
          </>
        )}
      </div>
    </Boundary>
  );
};

export default BasketV2;