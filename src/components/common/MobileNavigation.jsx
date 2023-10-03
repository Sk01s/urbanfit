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
import { useSelector } from "react-redux";
import { ShoppingOutlined, SearchOutlined } from "@ant-design/icons";

const Navigation = (props) => {
  const { isAuthenticating, basketLength, disabledPaths, user } = props;
  const { pathname } = useLocation();
  const [isSearching, setIsSearching] = useState(false);
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
  const basketDisabledpathnames = [
    ROUTE.CHECKOUT_STEP_1,
    ROUTE.CHECKOUT_STEP_2,
    ROUTE.CHECKOUT_STEP_3,
    ROUTE.SIGNIN,
    ROUTE.SIGNUP,
    ROUTE.FORGOT_PASSWORD,
  ];
  return (
    <nav className="mobile-navigation">
      <div className="mobile-navigation-main">
        <SearchOutlined
          className="searchbar-icon"
          onClick={(e) => {
            e.bubbles = false;
            setIsSearching((prev) => !prev);
          }}
        />
        <Link
          className="mobile-navigation-logo"
          onClick={onClickLink}
          to={HOME}
        >
          <img alt="Logo" src={logo} style={{}} />
        </Link>
        <ul className="mobile-navigation-menu">
          {user ? (
            <li className="mobile-navigation-item">
              <UserNav />
            </li>
          ) : (
            <>
              {pathname !== SIGNIN && (
                <li className="mobile-navigation-item">
                  <Link
                    className="navigation-menu-link"
                    onClick={onClickLink}
                    to={SIGNIN}
                  >
                    Sign In
                  </Link>
                </li>
              )}
            </>
          )}
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
                    <ShoppingOutlined style={{ fontSize: "2.4rem" }} />
                  </Badge>
                </button>
              )}
            </BasketToggle>
          </li>
        </ul>
      </div>
      {isSearching && (
        <div className="mobile-navigation-sec ">
          <SearchBar ref={searchEl} />
          <FiltersToggle>
            <button className="button-link button-small" type="button">
              <i className="fa fa-filter" />
            </button>
          </FiltersToggle>
        </div>
      )}
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
