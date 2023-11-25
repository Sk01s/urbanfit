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

const handleScroll = () => {
  const scrollY = window.scrollY;
  const maxScroll = 100; // Adjust this value to control the scroll threshold

  // Calculate the opacity based on the scroll position
  const opacity = Math.min(scrollY / maxScroll, 1);

  return opacity;
};

const Navigation = () => {
  const navigationMenu = useRef();
  const navbar = useRef(null);
  const [isMenPopupVisible, setMenPopupVisible] = useState(false);
  const [isWomenPopupVisible, setWomenPopupVisible] = useState(false);
  const [isInfoPopupVisible, setInfoPopupVisible] = useState(false);
  const [isSmall, setSmall] = useState(false);
  const [scrollOpacity, setScrollOpacity] = useState(handleScroll());

  const { pathname } = useLocation();
  const { essentialProducts, fetchEssentialProducts, isLoading, error } =
    useEssentialProducts();
  const handleMouseEnterMen = () => {
    setMenPopupVisible(true);
  };
  const handleMouseEnterInfo = () => {
    setInfoPopupVisible(true);
  };
  const handleMouseEnterWomen = () => {
    setWomenPopupVisible(true);
  };

  const handleMouseLeave = () => {
    setMenPopupVisible(false);
    setWomenPopupVisible(false);
    setInfoPopupVisible(false);
  };

  function isInVisable() {
    return pathname.startsWith("/checkout");
  }
  const store = useSelector((state) => ({
    basketLength: state.basket.length,
    wishLength: state.wish.length,
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

  useEffect(() => {
    const setScroll = () => {
      setScrollOpacity(() => handleScroll());
    };
    window.addEventListener("scroll", setScroll);

    return () => {
      window.removeEventListener("scroll", setScroll);
    };
  }, []);
  useEffect(() => {
    const small = () => {
      setSmall(window.innerWidth <= 850);
    };
    window.addEventListener("resize", small);
    small();
  }, []);

  if (
    (store.user &&
      store.user.role === "ADMIN" &&
      location.pathname.startsWith("/admin")) ||
    isInVisable()
  ) {
    return null;
  }
  if (isSmall) {
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

        boxShadow: `-4px 16px 9px rgba(0, 0, 0, ${scrollOpacity * 0.09})`,
      }}
      onMouseEnter={() => setScrollOpacity(1)}
      onMouseLeave={() => setScrollOpacity(handleScroll())}
    >
      <ul className="navigation-menu-main" ref={navigationMenu}>
        {/* <li>
          <NavLink
            activeClassName="navigation-menu-active"
            exact
            to={Route.HOME}
          >
            Home
          </NavLink>
        </li> */}
        {/* <li>
          <NavLink activeClassName="navigation-menu-active" to={Route.SHOP}>
            Shop
          </NavLink>
        </li> */}
        <li
          onMouseEnter={handleMouseEnterWomen}
          onMouseLeave={() => {
            handleMouseLeave();
          }}
        >
          <NavLink activeClassName="navigation-menu-active" to={Route.WOMEN}>
            Women
          </NavLink>
          <div className={`popup-menu ${isWomenPopupVisible && "open"}`}>
            <ul style={{ flexDirection: "column", display: "flex" }}>
              <li>
                <h4>Women</h4>
              </li>
              <li>
                <Link
                  onClick={() => {
                    handleMouseLeave();
                  }}
                  to="/store/women"
                  className="type-link"
                >
                  View all women
                </Link>
              </li>
              <li>
                <Link
                  onClick={() => {
                    handleMouseLeave();
                  }}
                  to="/women"
                  className="type-link"
                >
                  Collections
                </Link>
              </li>
              {/* <li>
                <Link onClick={()=>handleMouseLeave()} to="/type/men/" className="type-link">New Arrivals</Link>
              </li> */}
              <li>
                <Link
                  onClick={handleMouseLeave}
                  to="/store/women/essential"
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
          </div>
        </li>
        <li
          onMouseEnter={handleMouseEnterMen}
          onMouseLeave={() => {
            handleMouseLeave();
          }}
        >
          <NavLink activeClassName="navigation-menu-active" to={Route.MEN}>
            Men
          </NavLink>
          <div className={`popup-menu ${isMenPopupVisible && "open"}`}>
            <ul style={{ flexDirection: "column", display: "flex" }}>
              <li>
                <h4>Men</h4>
              </li>
              <li>
                <Link
                  onClick={handleMouseLeave}
                  to="/store/men"
                  className="type-link"
                >
                  View all men
                </Link>
              </li>
              <li>
                <Link
                  onClick={handleMouseLeave}
                  to="/men"
                  className="type-link"
                >
                  Collections
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
        </li>

        <li style={{ position: "relative" }} className="info-popup-container">
          <NavLink activeClassName="navigation-menu-active" to={Route.ABOUT_US}>
            Info
          </NavLink>
          <div
            className="info-popup"
            onMouseEnter={() => setTimeout(handleMouseEnterInfo, 100)}
            style={{
              position: "absolute",
              top: "100% ",
              left: "-2.5rem",
              background: " #fff",
              width: "calc(100% + 5rem )",
              paddingTop: "2rem",
              padding: "1.5rem",
              borderRadius: " 0 0 0.4rem 0.4rem",
              textAlign: "center",
            }}
          >
            <div
              style={{
                flexDirection: "column",
                display: "flex",
                gap: "1rem",
                fontSize: "1.5rem",
                fontWeight: "400",
                color: "#555",
              }}
            >
              <Link
                onClick={handleMouseLeave}
                to="/about-us"
                className="type-link"
              >
                Our Story
              </Link>
              <Link onClick={handleMouseLeave} to="/faqs" className="type-link">
                FAQS
              </Link>
              <Link
                onClick={handleMouseLeave}
                to="/contact-us"
                className="type-link"
              >
                Contact us
              </Link>
            </div>
          </div>
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
        <li
          className="navigation-menu-item"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Badge
            count={store.wishLength}
            style={{ top: "-3.2px", right: "-10px" }}
          >
            <Link
              style={{
                all: "unset",
                display: "block",
                translate: "0 3px",
                cursor: "pointer",
              }}
              to={Route.WISH}
            >
              <svg width={35} viewBox="0 0 50 50">
                <path
                  d="M25 39.7l-.6-.5C11.5 28.7 8 25 8 19c0-5 4-9 9-9 4.1 0 6.4 2.3 8 4.1 1.6-1.8 3.9-4.1 8-4.1 5 0 9 4 9 9 0 6-3.5 9.7-16.4 20.2l-.6.5zM17 12c-3.9 0-7 3.1-7 7 0 5.1 3.2 8.5 15 18.1 11.8-9.6 15-13 15-18.1 0-3.9-3.1-7-7-7-3.5 0-5.4 2.1-6.9 3.8L25 17.1l-1.1-1.3C22.4 14.1 20.5 12 17 12z"
                  fill={"#000"}
                  strokeWidth={2}
                />
              </svg>
            </Link>
          </Badge>
        </li>

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
