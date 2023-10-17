import { Basket } from "@/components/basket";
import { Footer, Navigation } from "@/components/common";
import * as ROUTES from "@/constants/routes";
import { createBrowserHistory } from "history";
import React, { useState } from "react";
import { Route, Router, Switch, Link } from "react-router-dom";
import * as view from "@/views";
import AdminRoute from "./AdminRoute";
import ClientRoute from "./ClientRoute";
import PublicRoute from "./PublicRoute";
import Terms from "./../components/terms/index";
import { createPortal } from "react-dom";
// Revert back to history v4.10.0 because
// v5.0 breaks navigation
export const history = createBrowserHistory();

const AppRouter = () => {
  console.log(view.OrderView);
  const [accepeted, setAccepeted] = useState(localStorage.getItem("terms"));
  return (
    <Router history={history}>
      <>
        <Navigation />
        <Basket />
        {!accepeted && <Terms setAccepeted={setAccepeted} />}
        <Switch>
          <Route component={view.Search} exact path={ROUTES.SEARCH} />
          <Route component={view.About} exact path={ROUTES.ABOUT_US} />
          <Route component={view.Home} exact path={ROUTES.HOME} />
          <Route component={view.Shop} exact path={ROUTES.SHOP} />
          <Route
            component={view.FeaturedProducts}
            exact
            path={ROUTES.SEASONAL_PRODUCTS}
          />
          <Route component={view.FAQS} exact path={ROUTES.FAQS} />
          <Route
            component={view.EssentialProducts}
            exact
            path={ROUTES.ESSENTIAL_PRODUCTS}
          />
          <Route component={view.Categories} exact path={ROUTES.CATEGORIES} />
          <Route component={view.Tops} exact path={ROUTES.TOPS} />
          <Route component={view.Bottoms} exact path={ROUTES.BOTTOMS} />
          <Route component={view.Hoodies} exact path={ROUTES.HOODIES_SWEATS} />
          <Route component={view.Jackets} exact path={ROUTES.JACKETS} />
          <Route component={view.Sets} exact path={ROUTES.SETS} />
          <Route component={view.Privacy} exact path={ROUTES.PRIVACY} />
          <Route component={view.Men} exact path={ROUTES.MEN} />
          <Route component={view.Women} exact path={ROUTES.WOMEN} />
          <Route
            component={view.SexCategory}
            exact
            path={ROUTES.SEX_CATEGORY}
          />
          <Route
            component={view.TypeCategory}
            exact
            path={ROUTES.TYPE_CATEGORY}
          />
          <Route component={view.Contact} exact path={ROUTES.CONTACT_US} />
          <Route
            component={view.OrderCompleted}
            path={ROUTES.ORDER_COMPLETED}
          />
          <PublicRoute component={view.SignUp} path={ROUTES.SIGNUP} />

          <PublicRoute component={view.SignIn} exact path={ROUTES.SIGNIN} />
          <PublicRoute
            component={view.ForgotPassword}
            path={ROUTES.FORGOT_PASSWORD}
          />

          <Route component={view.ViewProduct} path={ROUTES.VIEW_PRODUCT} />
          <ClientRoute
            component={view.UserAccount}
            exact
            path={ROUTES.ACCOUNT}
          />
          <ClientRoute
            component={view.EditAccount}
            exact
            path={ROUTES.ACCOUNT_EDIT}
          />
          <ClientRoute
            component={view.CheckOutStep1}
            path={ROUTES.CHECKOUT_STEP_1}
          />
          <ClientRoute
            component={view.CheckOutStep2}
            path={ROUTES.CHECKOUT_STEP_2}
          />
          <ClientRoute
            component={view.CheckOutStep3}
            path={ROUTES.CHECKOUT_STEP_3}
          />
          <AdminRoute
            component={view.Dashboard}
            exact
            path={ROUTES.ADMIN_DASHBOARD}
          />
          <AdminRoute
            component={view.Orders}
            exact
            path={ROUTES.ADMIN_ORDERS}
          />
          <AdminRoute component={view.Products} path={ROUTES.ADMIN_PRODUCTS} />
          <AdminRoute component={view.AddProduct} path={ROUTES.ADD_PRODUCT} />
          <AdminRoute component={view.OrderView} path={ROUTES.ORDER_DETAILS} />
          <AdminRoute
            component={view.EditProduct}
            path={`${ROUTES.EDIT_PRODUCT}/:id`}
          />
          <PublicRoute component={view.Terms} path={ROUTES.TERMS} />
          <PublicRoute component={view.PageNotFound} />
        </Switch>
        <Footer />
      </>
    </Router>
  );
};

export default AppRouter;
