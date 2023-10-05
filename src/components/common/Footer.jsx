import * as Route from "@/constants/routes";
import logo from "@/images/logo-full.png";
import React from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

const Footer = () => {
  const { pathname } = useLocation();

  const visibleOnlyPath = [
    Route.HOME,
    Route.SHOP,
    Route.FEATURED_PRODUCTS,
    Route.RECOMMENDED_PRODUCTS,
    Route.ACCOUNT,
    Route.ACCOUNT_EDIT,
    Route.SEARCH,
    Route.SIGNIN,
    Route.SIGNOUT,
    Route.SIGNUP,
    Route.FORGOT_PASSWORD,
    Route.CHECKOUT_STEP_1,
    Route.CHECKOUT_STEP_2,
    Route.CHECKOUT_STEP_3,
    Route.VIEW_PRODUCT,
    Route.TERMS,
    Route.ORDER_COMPLETED,
  ];

  return !visibleOnlyPath.includes(pathname) ? null : (
    <footer>
      <div className="list">
        <div className="footer-col-1 footer-column-1 col-12 col-sm-6 col-lg-3">
          <div
            id="nav_menu-3"
            className="wd-widget widget footer-widget  widget_nav_menu"
          >
            <h5 className="widget-title">NEED HELP?</h5>
            <div className="menu-need-help-footer-menu-container">
              <ul id="menu-need-help-footer-menu" className="menu">
                <li
                  id="menu-item-40814"
                  className="menu-item menu-item-type-custom menu-item-object-custom menu-item-40814"
                >
                  <a href="https://shopwithabc.com/faqs/#order-payment">
                    Orders Payment
                  </a>
                </li>
                <li
                  id="menu-item-40815"
                  className="menu-item menu-item-type-custom menu-item-object-custom menu-item-40815"
                >
                  <a href="https://shopwithabc.com/faqs/#order-delivery">
                    Shipping & Delivery
                  </a>
                </li>
                <li
                  id="menu-item-40816"
                  className="menu-item menu-item-type-custom menu-item-object-custom menu-item-40816"
                >
                  <a href="https://shopwithabc.com/faqs/#refund-policy">
                    Returns &amp; Refund Policy
                  </a>
                </li>
                <li
                  id="menu-item-7139"
                  className="menu-item menu-item-type-post_type menu-item-object-page menu-item-7139"
                >
                  <a href="https://shopwithabc.com/contact-us/">Contact Us</a>
                </li>
                <li
                  id="menu-item-40817"
                  className="menu-item menu-item-type-post_type menu-item-object-page menu-item-40817"
                >
                  <a href="https://shopwithabc.com/faqs/">FAQs</a>
                </li>
              </ul>
            </div>
          </div>{" "}
        </div>
        <div className="footer-column footer-col-2 col-12 col-sm-6 col-lg-3">
          <div
            id="nav_menu-5"
            className="wd-widget widget footer-widget  widget_nav_menu"
          >
            <h5 className="widget-title">ABOUT US</h5>
            <div className="menu-about-abc-footer-menu-container">
              <ul id="menu-about-abc-footer-menu" className="menu">
                <li
                  id="menu-item-7183"
                  className="menu-item menu-item-type-post_type menu-item-object-page menu-item-7183"
                >
                  <a href="https://shopwithabc.com/about-us/">Our Story</a>
                </li>
                <li
                  id="menu-item-7181"
                  className="menu-item menu-item-type-custom menu-item-object-custom menu-item-7181"
                >
                  <a href="https://shopwithabc.com/abc-app-download/">
                    Our Impact
                  </a>
                </li>
                <li
                  id="menu-item-7127"
                  className="menu-item menu-item-type-custom menu-item-object-custom menu-item-7127"
                >
                  <a href="https://www.abc.com.lb/Loyalty/HowItWorks%20">
                    Who we are
                  </a>
                </li>
                <li
                  id="menu-item-7128"
                  className="menu-item menu-item-type-custom menu-item-object-custom menu-item-7128"
                >
                  <a href="https://www.abc.com.lb/World">Contact Us</a>
                </li>
              </ul>
            </div>
          </div>{" "}
        </div>
        <div className="footer-column footer-col-3 col-12 col-sm-6 col-lg-3">
          <div
            id="nav_menu-6"
            className="wd-widget widget footer-widget  widget_nav_menu"
          >
            <h5 className="widget-title">LEGAL</h5>
            <div className="menu-legal-footer-menu-container">
              <ul id="menu-legal-footer-menu" className="menu">
                <li
                  id="menu-item-7135"
                  className="menu-item menu-item-type-post_type menu-item-object-page menu-item-7135"
                >
                  <Link to={`${Route.TERMS}`}>Terms &amp; Conditions</Link>
                </li>
                <li
                  id="menu-item-7138"
                  className="menu-item menu-item-type-post_type menu-item-object-page menu-item-privacy-policy menu-item-7138"
                >
                  <a
                    rel="privacy-policy"
                    href="https://shopwithabc.com/privacy-policy/"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>{" "}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img alt="Footer logo" className="footer-logo" src={logo} />
        <h5>
          &copy;&nbsp;
          {new Date().getFullYear()}
        </h5>
      </div>
    </footer>
  );
};

export default Footer;
