/* eslint-disable indent */
import { FilterOutlined, ShoppingOutlined } from "@ant-design/icons";
import * as Route from "@/constants/routes";
import logo from "@/images/logo-full.png";
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
    setPopupVisible(true);
  };

  const handleMouseLeave = () => {
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

  const [scrollOpacity, setScrollOpacity] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = 100; // Adjust this value to control the scroll threshold

      // Calculate the opacity based on the scroll position
      const opacity = Math.min(scrollY / maxScroll, 1);

      setScrollOpacity(opacity);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (
    store.user &&
    store.user.role === "ADMIN" &&
    location.pathname.startsWith("/admin")
  ) {
    return null;
  }
  if (window.screen.width <= 728) {
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
      className=" navigation "
      ref={navbar}
      style={{
        backgroundColor: `rgba(255, 255, 255, ${scrollOpacity})`,

        boxShadow: `-4px 0px 50px rgba(0, 0, 0, ${scrollOpacity * 0.09})`,
      }}
      onMouseEnter={() => setScrollOpacity(1)}
      onMouseLeave={() => {
        setScrollOpacity(0);
        handleMouseLeave();
      }}
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
        <li>
          <NavLink activeClassName="navigation-menu-active" to={Route.ABOUT_US}>
            About Us
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
                to="/store/women/essentials"
                className="type-link"
              >
                Essentials
              </Link>
            </li>
            <li>
              <Link
                onClick={handleMouseLeave}
                to="/type/women/t-shrit"
                className="type-link"
              >
                T-shrits
              </Link>
            </li>
            <li>
              <Link
                onClick={handleMouseLeave}
                to="/type/women/active-wear"
                className="type-link"
              >
                Active wear
              </Link>
            </li>
            <li>
              <Link
                onClick={handleMouseLeave}
                to="/type/women/leggings"
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
                to="/store/men/essential"
                className="type-link"
              >
                Essentials
              </Link>
            </li>
            <li>
              <Link
                onClick={handleMouseLeave}
                to="/type/men/t-shrit"
                className="type-link"
              >
                T-shrits
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
                to="/type/men/sweatpants-&-pants"
                className="type-link"
              >
                Sweatpants & Pants
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
