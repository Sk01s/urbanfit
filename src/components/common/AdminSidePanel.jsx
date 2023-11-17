import { ADMIN_PRODUCTS, ADMIN_ORDERS, PROMO } from "@/constants/routes";

import React from "react";
import { NavLink } from "react-router-dom";

const SideNavigation = () => (
  <aside className="sidenavigation">
    <div className="sidenavigation-wrapper">
      <div className="sidenavigation-item">
        <NavLink
          activeClassName="sidenavigation-menu-active"
          className="sidenavigation-menu"
          to={ADMIN_PRODUCTS}
        >
          Products
        </NavLink>
      </div>
      <div className="sidenavigation-item">
        <NavLink
          to={ADMIN_ORDERS}
          activeClassName="sidenavigation-menu-active"
          className="sidenavigation-menu my-0"
        >
          Orders
        </NavLink>
      </div>
      <div className="sidenavigation-item">
        <NavLink
          to={PROMO}
          activeClassName="sidenavigation-menu-active"
          className="sidenavigation-menu my-0"
        >
          Promo
        </NavLink>
      </div>
    </div>
  </aside>
);

export default SideNavigation;
