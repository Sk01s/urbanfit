import * as Route from "@/constants/routes";
import logo from "@/images/logo-full.png";
import React from "react";
import { useLocation } from "react-router-dom";

const Footer = () => {
  const { pathname } = useLocation();

  return (
    <footer className="footer">
      {/* <div className="">
        <img alt="Footer logo" className="footer-logo" src={logo} />
        <h5>
          &copy;&nbsp;
          {new Date().getFullYear()}
        </h5>
      </div> */}
      <div class="footer-col-1 footer-column-1 col-12 col-sm-6 col-lg-3">
        <div
          id="nav_menu-3"
          class="wd-widget widget footer-widget  widget_nav_menu"
        >
          <h5 class="widget-title">NEED HELP?</h5>
          <div class="menu-need-help-footer-menu-container">
            <ul id="menu-need-help-footer-menu" class="menu">
              <li
                id="menu-item-40814"
                class="menu-item menu-item-type-custom menu-item-object-custom menu-item-40814"
              >
                <a href="https://shopwithabc.com/faqs/#order-payment">
                  Orders Payment
                </a>
              </li>
              <li
                id="menu-item-40815"
                class="menu-item menu-item-type-custom menu-item-object-custom menu-item-40815"
              >
                <a href="https://shopwithabc.com/faqs/#order-delivery">
                  Orders Delivery
                </a>
              </li>
              <li
                id="menu-item-40816"
                class="menu-item menu-item-type-custom menu-item-object-custom menu-item-40816"
              >
                <a href="https://shopwithabc.com/faqs/#refund-policy">
                  Returns &amp; Refund Policy
                </a>
              </li>
              <li
                id="menu-item-7139"
                class="menu-item menu-item-type-post_type menu-item-object-page menu-item-7139"
              >
                <a href="https://shopwithabc.com/contact-us/">Contact Us</a>
              </li>
              <li
                id="menu-item-40817"
                class="menu-item menu-item-type-post_type menu-item-object-page menu-item-40817"
              >
                <a href="https://shopwithabc.com/faqs/">FAQs</a>
              </li>
            </ul>
          </div>
        </div>{" "}
      </div>
      <div className="footer-col-2">
        <img alt="Footer logo" className="footer-logo" src={logo} />
        <h5>
          &copy;&nbsp;
          {new Date().getFullYear()}
        </h5>
      </div>
      <div className="footer-col-3">
        <strong></strong>
      </div>
    </footer>
  );
};

export default Footer;
