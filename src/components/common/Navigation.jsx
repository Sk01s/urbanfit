/* eslint-disable indent */
import { FilterOutlined, ShoppingOutlined } from "@ant-design/icons";
import * as Route from "@/constants/routes";
import logo from "@/images/logo-full.svg";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, NavLink, useLocation } from "react-router-dom";
import UserAvatar from "@/views/account/components/UserAvatar";
import BasketToggle from "../basket/BasketToggle";
import Badge from "./Badge";
import FiltersToggle from "./FiltersToggle";
import MobileNavigation from "./MobileNavigation";
import SearchBar from "./SearchBar";
import { ProductShowcaseGrid } from "@/components/product";
import { useEssentialProducts } from "@/hooks";

const Navigation = () => {
  const navigationMenu = useRef();
  const navbar = useRef(null);
  const [isPopupVisible, setPopupVisible] = useState(false);

  const { pathname } = useLocation();
  const { essentialProducts, fetchEssentialProducts, isLoading, error } =
    useEssentialProducts();
  const handleMouseEnter = () => {
    console.log("entering");
    setPopupVisible(true);
  };

  const handleMouseLeave = () => {
    console.log("fading");
    setPopupVisible(false);
  };

  const store = useSelector((state) => ({
    basketLength: state.basket.length,
    user: state.auth,
    isAuthenticating: state.app.isAuthenticating,
    isLoading: state.app.loading,
  }));

  const onClickLink = (e) => {
    if (store.isAuthenticating) e.preventDefault();
  };

  // disable the basket toggle to these pathnames
  const basketDisabledpathnames = [
    Route.CHECKOUT_STEP_1,
    Route.CHECKOUT_STEP_2,
    Route.CHECKOUT_STEP_3,
    Route.SIGNIN,
    Route.SIGNUP,
    Route.FORGOT_PASSWORD,
  ];
  if (
    store.user &&
    store.user.role === "ADMIN" &&
    location.pathname.startsWith("/admin")
  ) {
    return null;
  }
  if (window.screen.width <= 800) {
    return (
      <MobileNavigation
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...store}
        disabledPaths={basketDisabledpathnames}
        pathname={pathname}
      />
    );
  }
  return (
    <nav
      className=" navigation is-nav-scrolled"
      ref={navbar}
      onMouseLeave={handleMouseLeave}
    >
      <ul className="navigation-menu-main" ref={navigationMenu}>
        <li>
          <NavLink
            activeClassName="navigation-menu-active"
            exact
            to={Route.HOME}
          >
            Home
          </NavLink>
        </li>
        <li onMouseEnter={handleMouseEnter} style={{ isolation: "isolate" }}>
          <NavLink activeClassName="navigation-menu-active" to={Route.SHOP}>
            Shop
          </NavLink>
        </li>
      </ul>
      <div className="logo">
        <Link onClick={onClickLink} to="/">
          <img alt="Logo" src={logo} />
        </Link>
      </div>
      <div style={{ display: "flex" }}>
        <ul className="navigation-menu">
          {store.user ? (
            <li className="navigation-menu-item">
              <UserAvatar />
            </li>
          ) : (
            <li className="navigation-action">
              {pathname !== Route.SIGNUP && (
                <Link
                  className="button button-small"
                  onClick={onClickLink}
                  to={Route.SIGNUP}
                >
                  Sign Up
                </Link>
              )}
              {pathname !== Route.SIGNIN && (
                <Link
                  className="button button-small button-muted margin-left-s"
                  onClick={onClickLink}
                  to={Route.SIGNIN}
                >
                  Sign In
                </Link>
              )}
            </li>
          )}
        </ul>
        <BasketToggle>
          {({ onClickToggle }) => (
            <button
              className="button-link navigation-menu-link basket-toggle"
              disabled={basketDisabledpathnames.includes(pathname)}
              onClick={onClickToggle}
              type="button"
            >
              <Badge count={store.basketLength}>
                <ShoppingOutlined style={{ fontSize: "2.4rem" }} />
              </Badge>
            </button>
          )}
        </BasketToggle>
        <div className={`popup-menu ${isPopupVisible && "open"}`}>
          <ul style={{ flexDirection: "column", display: "flex" }}>
            <li>
              <h4>Women</h4>
            </li>
            <li>
              <Link
                onClick={() => {
                  setPopupVisible(false);
                  console.log(isPopupVisible);
                }}
                to="/women"
                className="type-link"
              >
                View all women
              </Link>
            </li>
            {/* <li>
                <Link onClick={()=>handleMouseLeave()} to="/type/men/" className="type-link">New Arrivals</Link>
              </li> */}
            <li>
              <Link
                onClick={handleMouseLeave}
                to="/shop/women/essentials"
                className="type-link"
              >
                Essentials
              </Link>
            </li>
            <li>
              <Link
                onClick={handleMouseLeave}
                to="type/women/t-shirt"
                className="type-link"
              >
                T-shirts
              </Link>
            </li>
            <li>
              <Link
                onClick={handleMouseLeave}
                to="type/women/active-wear"
                className="type-link"
              >
                Active wear
              </Link>
            </li>
            <li>
              <Link
                onClick={handleMouseLeave}
                to="/type/women/legging"
                className="type-link"
              >
                Leggings
              </Link>
            </li>
            <li>
              <Link
                onClick={handleMouseLeave}
                to="/type/women/jacket"
                className="type-link"
              >
                Jackets
              </Link>
            </li>
            <li>
              <Link
                onClick={handleMouseLeave}
                to="/type/women/hoodies-&-sweatshrits"
                className="type-link"
              >
                Hoodies & Sweatshrits
              </Link>
            </li>
            <li>
              <Link
                onClick={handleMouseLeave}
                to="/type/women/sweatpants-&-pants"
                className="type-link"
              >
                Sweatpants & Pants
              </Link>
            </li>
            {/* <li>
              <Link onClick={handleMouseLeave} to="" className="type-link">
                Sets
              </Link>
            </li> */}
          </ul>
          <ul style={{ flexDirection: "column", display: "flex" }}>
            <li>
              <h4>Men</h4>
            </li>
            <li>
              <Link onClick={handleMouseLeave} to="/men" className="type-link">
                View all men
              </Link>
            </li>
            {/* <li>
                <Link onClick={()=>handleMouseLeave()} to="" className="type-link">New Arrivals</Link>
              </li> */}
            <li>
              <Link
                onClick={handleMouseLeave}
                to="/shop/men/essential"
                className="type-link"
              >
                Essentials
              </Link>
            </li>
            <li>
              <Link
                onClick={handleMouseLeave}
                to="/type/men/t-shirt"
                className="type-link"
              >
                T-shirts
              </Link>
            </li>
            <li>
              <Link
                onClick={handleMouseLeave}
                to="/type/men/jacket"
                className="type-link"
              >
                Jackets
              </Link>
            </li>
            <li>
              <Link
                onClick={handleMouseLeave}
                to="/type/men/hoodies-&-sweatshrits"
                className="type-link"
              >
                Hoodies & Sweatshrits
              </Link>
            </li>
            <li>
              <Link
                onClick={handleMouseLeave}
                to="/type/men/sweatpants"
                className="type-link"
              >
                Sweatpants{" "}
              </Link>
            </li>
            {/* <li>
              <Link
                onClick={handleMouseLeave}
                to="/type/men/"
                className="type-link"
              >
                Sets
              </Link>
            </li> */}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
