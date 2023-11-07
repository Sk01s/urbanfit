import { BasketToggle } from "@/components/basket";
import { HOME, SIGNIN } from "@/constants/routes";
import PropType from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import UserNav from "@/views/account/components/UserAvatar";
import Badge from "./Badge";
import logo from "@/images/logo-full.png";
import FiltersToggle from "./FiltersToggle";
import * as ROUTE from "@/constants/routes";
import SearchBar from "./SearchBar";
import { shallowEqual, useSelector } from "react-redux";
import { ShoppingOutlined, SearchOutlined } from "@ant-design/icons";
import * as Route from "@/constants/routes";
import { selectFilter } from "@/selectors/selector";
import { AppliedFilters, ProductGrid, ProductList } from "@/components/product";
import { ProductShowcaseGrid } from "@/components/product";
import { useEssentialProducts } from "@/hooks";
import InfoBox from "@/components/product/InfoBox";

const handleScroll = () => {
  const scrollY = window.scrollY;
  const maxScroll = 100; // Adjust this value to control the scroll threshold

  // Calculate the opacity based on the scroll position
  const opacity = Math.min(scrollY / maxScroll, 1);

  return opacity;
};

const Navigation = (props) => {
  const { isAuthenticating, basketLength, disabledPaths, user } = props;
  const { pathname } = useLocation();
  const [isSearching, setIsSearching] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWomenOpen, setIsWomenOpen] = useState(false);
  const [isMenOpen, setIsMenOpen] = useState(false);
  const [scrollOpacity, setScrollOpacity] = useState(handleScroll());
  const searchEl = useRef();

  const onClickLink = (e) => {
    if (isAuthenticating) e.preventDefault();
  };
  const store = useSelector((state) => ({
    basketLength: state.basket.length,
    user: state.auth,
    isAuthenticating: state.app.isAuthenticating,
    isLoading: state.app.loading,
  }));
  const { essentialProducts, EssentialProduct, isLoading, error } =
    useEssentialProducts();
  const toggleNav = () => {
    setIsMenuOpen((prev) => !prev);
  };
  const closeMenu = () => {
    setIsMenOpen(false);
    setIsMenuOpen(false);
    setIsWomenOpen(false);
  };
  useEffect(() => {
    let close = (e) => {
      if (e.target.nodeName !== "INPUT" && e.target.nodeName !== "svg") {
        setIsSearching(() => false);
      } else {
        document.addEventListener("click", close, { once: true });
      }
    };
    if (isSearching) {
      document.addEventListener("click", close, { once: true });
    } else {
      document.removeEventListener("click", close);
    }
  }, [isSearching]);

  useEffect(() => {
    const setScroll = () => {
      setScrollOpacity(() => handleScroll());
    };

    window.addEventListener("scroll", setScroll);

    return () => {
      window.removeEventListener("scroll", setScroll);
    };
  }, []);

  const basketDisabledpathnames = [
    ROUTE.CHECKOUT_STEP_1,
    ROUTE.CHECKOUT_STEP_2,
    ROUTE.CHECKOUT_STEP_3,
    ROUTE.SIGNIN,
    ROUTE.SIGNUP,
    ROUTE.FORGOT_PASSWORD,
  ];
  return (
    <nav
      className="mobile-navigation"
      style={{
        backgroundColor: `rgba(255, 255, 255, ${scrollOpacity})`,
        boxShadow: `-4px 16px 9px rgba(0, 0, 0, ${scrollOpacity * 0.09})`,
      }}
      onMouseEnter={() => setScrollOpacity(1)}
      onMouseLeave={() => setScrollOpacity(handleScroll())}
    >
      <div className="mobile-navigation-main">
        <div style={{ display: "flex", alignItems: "center" }}>
          <button className="menu-btn" onClick={toggleNav}>
            <div />
            <div />
            <div />
          </button>
          <SearchOutlined
            className="searchbar-icon"
            onClick={(e) => {
              e.bubbles = false;
              setIsSearching((prev) => !prev);
            }}
            style={{ position: "relative", left: "0" }}
          />
        </div>
        <Link
          className="mobile-navigation-logo"
          onClick={onClickLink}
          to={HOME}
        >
          <img alt="Logo" src={logo} />
        </Link>
        <ul className="mobile-navigation-menu">
          <li className="mobile-navigation-item">
            <UserNav isSigned={!!user} />
          </li>
          <li className="mobile-navigation-item">
            <Link
              style={{
                all: "unset",
                display: "block",
                translate: "0 2px",
                paddingLeft: "2px",
                cursor: "pointer",
              }}
              to={Route.WISH}
            >
              <svg width={29} viewBox="0 0 50 50">
                <path
                  d="M25 39.7l-.6-.5C11.5 28.7 8 25 8 19c0-5 4-9 9-9 4.1 0 6.4 2.3 8 4.1 1.6-1.8 3.9-4.1 8-4.1 5 0 9 4 9 9 0 6-3.5 9.7-16.4 20.2l-.6.5zM17 12c-3.9 0-7 3.1-7 7 0 5.1 3.2 8.5 15 18.1 11.8-9.6 15-13 15-18.1 0-3.9-3.1-7-7-7-3.5 0-5.4 2.1-6.9 3.8L25 17.1l-1.1-1.3C22.4 14.1 20.5 12 17 12z"
                  fill={"#000"}
                  strokeWidth={2}
                />
              </svg>
            </Link>
          </li>
          <li style={{ listStyle: "none" }}>
            <BasketToggle>
              {({ onClickToggle }) => (
                <button
                  className="button-link navigation-menu-link basket-toggle"
                  disabled={basketDisabledpathnames.includes(pathname)}
                  onClick={onClickToggle}
                  type="button"
                >
                  <Badge count={store.basketLength}>
                    <ShoppingOutlined
                      style={{
                        fontSize: " 2.1rem",
                        padding: "0",
                        transform: "translateY(-1px)",
                      }}
                    />
                  </Badge>
                </button>
              )}
            </BasketToggle>
          </li>
        </ul>
      </div>
      {isSearching && (
        <div className="mobile-navigation-sec ">
          <SearchBar ref={searchEl} style={{ width: "100%" }} />
        </div>
      )}
      <nav
        style={{
          position: "inherit",
          top: " 0em",
          left: isMenuOpen ? 0 : "-100%",
          transitionDuration: "300ms",
          backgroundColor: "white",
          width: "90vw",
          height: "100dvh",
          zIndex: "1000",
          overflowY: "scroll",
          overflowX: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: " 0.8rem 2rem",
            borderBottom: "solid 1px #cacaca",
          }}
        >
          {isMenOpen || isWomenOpen ? (
            <svg
              onClick={() => {
                setIsMenOpen(false);
                setIsWomenOpen(false);
              }}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="feather feather-chevron-left"
            >
              <title>Left</title>
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          ) : (
            <img
              alt="Logo"
              src={logo}
              style={{ width: "12rem", height: "4rem", objectFit: "cover" }}
            />
          )}{" "}
          <button
            onClick={closeMenu}
            style={{ all: "unset", cursor: "pointer" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.3"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="feather feather-x"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <ul className="menu-links">
          <li>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0 3rem 0 1rem",
                cursor: "pointer",
              }}
              onClick={() => setIsWomenOpen(true)}
            >
              <h4 style={{ margin: 0 }}>Women</h4>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="feather feather-chevron-right"
              >
                <title>Right</title>
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </li>
          <li>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0 3rem 0 1rem",
                cursor: "pointer",
              }}
              onClick={() => setIsMenOpen(true)}
            >
              <h4 style={{ margin: 0 }}>Men</h4>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="feather feather-chevron-right"
              >
                <title>Right</title>
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </li>
          <li>
            <Link
              to="/about-us"
              onClick={() => closeMenu()}
              style={{ fontWeight: 700, marginLeft: "1rem" }}
            >
              About us
            </Link>
          </li>
        </ul>
        <ul
          className="menu-links"
          style={{
            position: "absolute",
            left: isMenOpen ? 0 : "100vw",
            transitionDuration: "300ms",
            top: 0,
            width: "100%",
            top: "5rem",
            backgroundColor: "white",
            height: "100%",
            zIndex: 10,
          }}
        >
          <li>
            <Link onClick={closeMenu} to="/men">
              View All Men
            </Link>
          </li>
          <li>
            <Link onClick={closeMenu} to="/store/men/essential">
              Essentials
            </Link>
          </li>
          <li>
            <Link onClick={closeMenu} to="/type/men/t-shirt">
              T-shrits
            </Link>
          </li>
          <li>
            <Link onClick={closeMenu} to="/type/men/hoodies-&-sweatshrits">
              Hoodies & Sweatshrits
            </Link>
          </li>
          <li>
            <Link onClick={closeMenu} to="/type/men/jacket">
              Jacket
            </Link>
          </li>

          <li>
            <Link onClick={closeMenu} to="/type/men/sweatpants-&-pants">
              Sweatpants & Pants
            </Link>
          </li>
        </ul>
        <ul
          className="menu-links"
          style={{
            position: "absolute",
            left: isWomenOpen ? 0 : "100vw",
            transitionDuration: "300ms",
            top: 0,
            width: "100%",
            top: "5rem",
            backgroundColor: "white",
            height: "100%",
            zIndex: 10,
          }}
        >
          <li>
            <Link onClick={closeMenu} to="/women">
              View All Women
            </Link>
          </li>
          <li>
            <Link onClick={closeMenu} to="/store/women/essential">
              Essentials
            </Link>
          </li>
          <li>
            <Link onClick={closeMenu} to="/type/women/t-shirt">
              T-shrits
            </Link>
          </li>
          <li>
            <Link onClick={closeMenu} to="/type/women/hoodies-&-sweatshrits">
              Hoodies & Sweatshrits
            </Link>
          </li>
          <li>
            <Link onClick={closeMenu} to="/type/women/jacket">
              Jacket
            </Link>
          </li>

          <li>
            <Link onClick={closeMenu} to="/type/women/sweatpants-&-pants">
              Sweatpants & Pants
            </Link>
          </li>
          <li>
            <Link onClick={closeMenu} to="/type/women/leggings">
              Leggings
            </Link>
          </li>

          <li>
            <Link onClick={closeMenu} to="/type/women/active-wear">
              Active wear
            </Link>
          </li>
        </ul>
        <section style={{ overflow: "hidden", height: " 95dvh; " }}>
          <div
            style={{
              width: "99%",
              marginBottom: "8rem",
              gap: 0,
            }}
          >
            <br />
            <br />
            <ProductShowcaseGrid
              products={essentialProducts}
              skeletonCount={6}
              title={"Essentials"}
              infinite={false}
              center={false}
              to={ROUTE.ESSENTIAL_PRODUCTS}
            />
          </div>
        </section>
        <div class="social-links">
          <ul style={{ display: "flex", gap: "1rem" }}>
            <li>
              <a
                aria-label="Facebook"
                class="facebook"
                target="_blank"
                rel="noopener"
              >
                <svg
                  viewBox="0 0 48 48"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Facebook</title>
                  <g
                    stroke="none"
                    stroke-width="1"
                    fill="none"
                    fill-rule="evenodd"
                  >
                    <g
                      transform="translate(-325.000000, -295.000000)"
                      fill="currentColor"
                    >
                      <path d="M350.638355,343 L327.649232,343 C326.185673,343 325,341.813592 325,340.350603 L325,297.649211 C325,296.18585 326.185859,295 327.649232,295 L370.350955,295 C371.813955,295 373,296.18585 373,297.649211 L373,340.350603 C373,341.813778 371.813769,343 370.350955,343 L358.119305,343 L358.119305,324.411755 L364.358521,324.411755 L365.292755,317.167586 L358.119305,317.167586 L358.119305,312.542641 C358.119305,310.445287 358.701712,309.01601 361.70929,309.01601 L365.545311,309.014333 L365.545311,302.535091 C364.881886,302.446808 362.604784,302.24957 359.955552,302.24957 C354.424834,302.24957 350.638355,305.625526 350.638355,311.825209 L350.638355,317.167586 L344.383122,317.167586 L344.383122,324.411755 L350.638355,324.411755 L350.638355,343 L350.638355,343 Z"></path>
                    </g>
                  </g>
                </svg>
              </a>
            </li>

            <li>
              <a
                aria-label="Instagram"
                class="instagram"
                target="_blank"
                rel="noopener"
                href="https://www.instagram.com/urbanfit.lb/"
              >
                <svg
                  viewBox="0 0 48 48"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Instagram</title>
                  <defs></defs>
                  <g
                    stroke="none"
                    stroke-width="1"
                    fill="none"
                    fill-rule="evenodd"
                  >
                    <g
                      transform="translate(-642.000000, -295.000000)"
                      fill="currentColor"
                    >
                      <path d="M666.000048,295 C659.481991,295 658.664686,295.027628 656.104831,295.144427 C653.550311,295.260939 651.805665,295.666687 650.279088,296.260017 C648.700876,296.873258 647.362454,297.693897 646.028128,299.028128 C644.693897,300.362454 643.873258,301.700876 643.260017,303.279088 C642.666687,304.805665 642.260939,306.550311 642.144427,309.104831 C642.027628,311.664686 642,312.481991 642,319.000048 C642,325.518009 642.027628,326.335314 642.144427,328.895169 C642.260939,331.449689 642.666687,333.194335 643.260017,334.720912 C643.873258,336.299124 644.693897,337.637546 646.028128,338.971872 C647.362454,340.306103 648.700876,341.126742 650.279088,341.740079 C651.805665,342.333313 653.550311,342.739061 656.104831,342.855573 C658.664686,342.972372 659.481991,343 666.000048,343 C672.518009,343 673.335314,342.972372 675.895169,342.855573 C678.449689,342.739061 680.194335,342.333313 681.720912,341.740079 C683.299124,341.126742 684.637546,340.306103 685.971872,338.971872 C687.306103,337.637546 688.126742,336.299124 688.740079,334.720912 C689.333313,333.194335 689.739061,331.449689 689.855573,328.895169 C689.972372,326.335314 690,325.518009 690,319.000048 C690,312.481991 689.972372,311.664686 689.855573,309.104831 C689.739061,306.550311 689.333313,304.805665 688.740079,303.279088 C688.126742,301.700876 687.306103,300.362454 685.971872,299.028128 C684.637546,297.693897 683.299124,296.873258 681.720912,296.260017 C680.194335,295.666687 678.449689,295.260939 675.895169,295.144427 C673.335314,295.027628 672.518009,295 666.000048,295 Z M666.000048,299.324317 C672.40826,299.324317 673.167356,299.348801 675.69806,299.464266 C678.038036,299.570966 679.308818,299.961946 680.154513,300.290621 C681.274771,300.725997 682.074262,301.246066 682.91405,302.08595 C683.753934,302.925738 684.274003,303.725229 684.709379,304.845487 C685.038054,305.691182 685.429034,306.961964 685.535734,309.30194 C685.651199,311.832644 685.675683,312.59174 685.675683,319.000048 C685.675683,325.40826 685.651199,326.167356 685.535734,328.69806 C685.429034,331.038036 685.038054,332.308818 684.709379,333.154513 C684.274003,334.274771 683.753934,335.074262 682.91405,335.91405 C682.074262,336.753934 681.274771,337.274003 680.154513,337.709379 C679.308818,338.038054 678.038036,338.429034 675.69806,338.535734 C673.167737,338.651199 672.408736,338.675683 666.000048,338.675683 C659.591264,338.675683 658.832358,338.651199 656.30194,338.535734 C653.961964,338.429034 652.691182,338.038054 651.845487,337.709379 C650.725229,337.274003 649.925738,336.753934 649.08595,335.91405 C648.246161,335.074262 647.725997,334.274771 647.290621,333.154513 C646.961946,332.308818 646.570966,331.038036 646.464266,328.69806 C646.348801,326.167356 646.324317,325.40826 646.324317,319.000048 C646.324317,312.59174 646.348801,311.832644 646.464266,309.30194 C646.570966,306.961964 646.961946,305.691182 647.290621,304.845487 C647.725997,303.725229 648.246066,302.925738 649.08595,302.08595 C649.925738,301.246066 650.725229,300.725997 651.845487,300.290621 C652.691182,299.961946 653.961964,299.570966 656.30194,299.464266 C658.832644,299.348801 659.59174,299.324317 666.000048,299.324317 Z M666.000048,306.675683 C659.193424,306.675683 653.675683,312.193424 653.675683,319.000048 C653.675683,325.806576 659.193424,331.324317 666.000048,331.324317 C672.806576,331.324317 678.324317,325.806576 678.324317,319.000048 C678.324317,312.193424 672.806576,306.675683 666.000048,306.675683 Z M666.000048,327 C661.581701,327 658,323.418299 658,319.000048 C658,314.581701 661.581701,311 666.000048,311 C670.418299,311 674,314.581701 674,319.000048 C674,323.418299 670.418299,327 666.000048,327 Z M681.691284,306.188768 C681.691284,307.779365 680.401829,309.068724 678.811232,309.068724 C677.22073,309.068724 675.931276,307.779365 675.931276,306.188768 C675.931276,304.598171 677.22073,303.308716 678.811232,303.308716 C680.401829,303.308716 681.691284,304.598171 681.691284,306.188768 Z"></path>
                    </g>
                  </g>
                </svg>
              </a>
            </li>

            <li>
              <a
                aria-label="WhatsApp"
                class="whatsapp"
                target="_blank"
                rel="noopener"
                href="https://api.whatsapp.com/send?phone=96171108084"
              >
                <svg
                  aria-hidden="true"
                  focusable="false"
                  role="presentation"
                  class="icon svg-whatsapp"
                  viewBox="0 0 30.667 30.667"
                  fill="currentColor"
                >
                  <path d="M30.667,14.939c0,8.25-6.74,14.938-15.056,14.938c-2.639,0-5.118-0.675-7.276-1.857L0,30.667l2.717-8.017 c-1.37-2.25-2.159-4.892-2.159-7.712C0.559,6.688,7.297,0,15.613,0C23.928,0.002,30.667,6.689,30.667,14.939z M15.61,2.382 c-6.979,0-12.656,5.634-12.656,12.56c0,2.748,0.896,5.292,2.411,7.362l-1.58,4.663l4.862-1.545c2,1.312,4.393,2.076,6.963,2.076 c6.979,0,12.658-5.633,12.658-12.559C28.27,8.016,22.59,2.382,15.61,2.382z M23.214,18.38c-0.094-0.151-0.34-0.243-0.708-0.427 c-0.367-0.184-2.184-1.069-2.521-1.189c-0.34-0.123-0.586-0.185-0.832,0.182c-0.243,0.367-0.951,1.191-1.168,1.437 c-0.215,0.245-0.43,0.276-0.799,0.095c-0.369-0.186-1.559-0.57-2.969-1.817c-1.097-0.972-1.838-2.169-2.052-2.536 c-0.217-0.366-0.022-0.564,0.161-0.746c0.165-0.165,0.369-0.428,0.554-0.643c0.185-0.213,0.246-0.364,0.369-0.609 c0.121-0.245,0.06-0.458-0.031-0.643c-0.092-0.184-0.829-1.984-1.138-2.717c-0.307-0.732-0.614-0.611-0.83-0.611 c-0.215,0-0.461-0.03-0.707-0.03S9.897,8.215,9.56,8.582s-1.291,1.252-1.291,3.054c0,1.804,1.321,3.543,1.506,3.787 c0.186,0.243,2.554,4.062,6.305,5.528c3.753,1.465,3.753,0.976,4.429,0.914c0.678-0.062,2.184-0.885,2.49-1.739 C23.307,19.268,23.307,18.533,23.214,18.38z"></path>
                </svg>
              </a>
            </li>
          </ul>
        </div>
      </nav>
      <div
        onClick={closeMenu}
        style={{
          position: "inherit",
          width: "100vw",
          height: "100dvh",
          top: 0,
          left: isMenuOpen ? 0 : "-100%",
          zIndex: 999,
          backgroundColor: "#222222a0",
        }}
      />
    </nav>
  );
};

Navigation.propTypes = {
  isAuthenticating: PropType.bool.isRequired,
  basketLength: PropType.number.isRequired,
  disabledPaths: PropType.arrayOf(PropType.string).isRequired,
  user: PropType.oneOfType([PropType.bool, PropType.object]).isRequired,
};

export default Navigation;
