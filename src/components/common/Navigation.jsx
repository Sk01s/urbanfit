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
import { useRecommendedProducts } from "@/hooks";

const Navigation = () => {
  const navigationMenu = useRef();
  const navbar = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { recommendedProducts, fetchRecommendedProducts, isLoading, error } =
    useRecommendedProducts();
  const toggleLinks = () => {
    setIsMenuOpen((prev) => !prev);
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
    <nav className="navigation is-nav-scrolled" ref={navbar}>
      <ul
        className="navigation-menu-main"
        ref={navigationMenu}
        onClick={toggleLinks}
      >
        <li>
          <NavLink
            activeClassName="navigation-menu-active"
            exact
            to={Route.HOME}
          >
            Home
          </NavLink>
        </li>
        <li>
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
      </div>
    </nav>
  );
};

export default Navigation;
