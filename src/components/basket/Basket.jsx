/* eslint-disable max-len */
import { BasketItem, BasketToggle } from "@/components/basket";
import { Boundary, Modal } from "@/components/common";
import { CHECKOUT_STEP_1, ESSENTIAL_PRODUCTS } from "@/constants/routes";
import { calculateSubtotal, displayMoney } from "@/helpers/utils";
import { useDidMount, useModal } from "@/hooks";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { clearBasket } from "@/redux/actions/basketActions";
import { ProductShowcaseGrid } from "@/components/product";
import { useEssentialProducts } from "@/hooks";
import firebaseInstance from "@/services/firebase";
import { useProducts } from "@/hooks";
import { useState } from "react";
import { setBasketItems } from "@/redux/actions/basketActions";

const Basket = () => {
  const { isOpenModal, onOpenModal, onCloseModal } = useModal();
  const { basket, user } = useSelector((state) => ({
    basket: state.basket,
    user: state.auth,
  }));
  const history = useHistory();
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const didMount = useDidMount();
  const { products, isLoading, error } = useProducts();
  const basketItemId = basket.map((item) => item.id);

  useEffect(() => {
    if (didMount && firebaseInstance.auth.currentUser && basket.length !== 0) {
      firebaseInstance
        .saveBasketItems(basket, firebaseInstance.auth.currentUser.uid)
        .then(() => {})
        .catch((e) => {
          console.log(e);
        });
    }
  }, [basket.length]);
  useEffect(() => {
    dispatch(
      setBasketItems(
        products
          .filter((item) => basketItemId.includes(item.id))
          .map((item) => {
            const { quantity } = basket.find(({ id }) => id === item.id);

            return { ...item, quantity };
          })
      )
    );
  }, [products]);

  const onCheckOut = () => {
    if (basket.length !== 0 && user) {
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
    if (basket.length !== 0) {
      dispatch(clearBasket());
    }
  };

  return user && user.role === "ADMIN" ? null : (
    <Boundary>
      <Modal isOpen={isOpenModal} onRequestClose={onCloseModal}>
        <p className="text-center">You must sign in to continue checking out</p>
        <br />
        <div className="d-flex-center">
          <button
            className="button button-border button-border-gray button-small"
            onClick={onCloseModal}
            type="button"
          >
            Continue shopping
          </button>
          &nbsp;
          <button
            className="button button-small"
            onClick={onSignInClick}
            type="button"
          >
            Sign in to checkout
          </button>
        </div>
      </Modal>
      <div className="basket">
        {basket.length <= 0 ? (
          <>
            <div className="basket-header-btn">
              <BasketToggle>
                {({ onClickToggle }) => (
                  <span
                    style={{
                      marginLeft: "auto",
                      marginTop: ".5rem",
                      marginRight: "0.5rem",
                    }}
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
                  <button
                    className="button"
                    onClick={onClickToggle}
                    role="presentation"
                  >
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
                  <span>
                    (
                    {` ${basket.length} ${
                      basket.length > 1 ? "items" : "item"
                    } `}
                    )
                  </span>
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
                {basket.map((product, i) => (
                  <BasketItem
                    // eslint-disable-next-line react/no-array-index-key
                    key={`${product.id}_${i}`}
                    product={product}
                    basket={basket}
                    dispatch={dispatch}
                  />
                ))}
                <section style={{ overflow: "hidden", height: " 95dvh; " }}>
                  <div
                    style={{
                      width: "99%",
                      marginTop: "2rem",
                      gap: 0,
                    }}
                  >
                    <br />
                    <br />
                    <ProductShowcaseGrid
                      products={products.filter(
                        (item) => item.sex === basket[0].sex
                      )}
                      skeletonCount={6}
                      title={"You may also like"}
                      titleStyle={{}}
                      infinite={false}
                      center={false}
                      to={""}
                      cart
                    />
                    <br />
                  </div>
                </section>
              </div>
            </div>

            <div className="basket-checkout">
              <div className="basket-total">
                <p className="basket-total-title">Subtotal Amout:</p>
                <h2 className="basket-total-amount">
                  {displayMoney(calculateSubtotal(basket))}
                </h2>
              </div>
              <button
                className="basket-checkout-button button"
                disabled={basket.length === 0 || pathname === "/checkout"}
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

export default Basket;
