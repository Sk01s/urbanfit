import { Footer, Navigation, NewsDisplay, PromoPopup } from "@/components/common";
import * as ROUTES from "@/constants/routes";
import { createBrowserHistory } from "history";
import React, { useState } from "react";
import { Route, Router, Switch } from "react-router-dom";
import * as view from "@/views";
import AdminRoute from "./AdminRoute";
import ClientRoute from "./ClientRoute";
import PublicRoute from "./PublicRoute";
import Terms from "./../components/terms/index";
import { SpeedInsights } from "@vercel/speed-insights/react";
import v2Enabled from "@/experimental/featureFlag";

import { Basket } from "@/components/basket";
import BasketV2 from "@/experimental/components/basket/BasketV2";

import ViewProductV2 from "@/experimental/views/view_product";
import ShopV2 from "@/experimental/views/shop";
import CheckOutStep1V2 from "@/experimental/views/checkout/step1";
import CheckOutStep2V2 from "@/experimental/views/checkout/step2";
import CheckOutStep3V2 from "@/experimental/views/checkout/step3";
import V2AddProduct from "@/experimental/views/admin/add_product";
import V2EditProduct from "@/experimental/views/admin/edit_product";

export const history = createBrowserHistory();

const AppRouter = () => {
  const [accepeted, setAccepeted] = useState(localStorage.getItem("terms"));
  return (
    <Router history={history}>
      <>
        <SpeedInsights />
        <NewsDisplay />
        <Navigation />
        {v2Enabled ? <BasketV2 /> : <Basket />}
        {!accepeted && <Terms setAccepeted={setAccepeted} />}
        <PromoPopup />
        <Switch>
          <Route component={view.Search} exact path={ROUTES.SEARCH} />
          <Route component={view.About} exact path={ROUTES.ABOUT_US} />
          <Route component={view.Home} exact path={ROUTES.HOME} />
          <Route component={v2Enabled ? ShopV2 : view.Shop} exact path={ROUTES.SHOP} />
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
          <Route component={view.Sex} exact path={ROUTES.SEX} />
          <Route
            component={view.SexCategory}
            exact
            path={ROUTES.SEX_CATEGORY}
          />
          <Route component={view.Cool} exact path={ROUTES.COOL} />
          <Route component={view.Luxury} exact path={ROUTES.LUXURY} />
          <Route component={view.New} exact path={ROUTES.NEW} />
          <Route
            component={view.TypeCategory}
            exact
            path={ROUTES.TYPE_CATEGORY}
          />
          <Route component={view.Wish} exact path={ROUTES.WISH} />
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
          <Route
            component={v2Enabled ? ViewProductV2 : view.ViewProduct}
            path={ROUTES.VIEW_PRODUCT}
          />
          <Route component={view.SpecialPage} path={ROUTES.SPECIAL_PAGE} />
          <ClientRoute
            component={view.UserAccount}
            exact
            path={ROUTES.ACCOUNT}
          />
          <ClientRoute
            component={view.UserViewOrder}
            path={ROUTES.USER_VIEW_ORDER}
          />
          <ClientRoute
            component={view.EditAccount}
            exact
            path={ROUTES.ACCOUNT_EDIT}
          />
          <ClientRoute
            component={v2Enabled ? CheckOutStep1V2 : view.CheckOutStep1}
            path={ROUTES.CHECKOUT_STEP_1}
          />
          <ClientRoute
            component={v2Enabled ? CheckOutStep2V2 : view.CheckOutStep2}
            path={ROUTES.CHECKOUT_STEP_2}
          />
          <ClientRoute
            component={v2Enabled ? CheckOutStep3V2 : view.CheckOutStep3}
            path={ROUTES.CHECKOUT_STEP_3}
          />
          <AdminRoute
            component={view.Dashboard}
            exact
            path={ROUTES.ADMIN_DASHBOARD}
          />
          <AdminRoute
            component={view.AdminImages}
            exact
            path={ROUTES.ADMIN_IMAGES}
          />
          <AdminRoute
            component={view.AdminCategories}
            exact
            path={ROUTES.ADMIN_CATEGORIES}
          />
          <AdminRoute
            component={view.AdminTypes}
            exact
            path={ROUTES.ADMIN_TYPES}
          />
          <AdminRoute
            component={view.SpecialPages}
            exact
            path={ROUTES.ADMIN_SPECIAL_PAGES}
          />
          <AdminRoute
            component={view.AddSpecialPage}
            exact
            path={ROUTES.ADD_SPECIAL_PAGE}
          />
          <AdminRoute
            component={view.EditSpecialPage}
            path={`${ROUTES.EDIT_SPECIAL_PAGE}/:id`}
          />
          <AdminRoute
            component={view.Orders}
            exact
            path={ROUTES.ADMIN_ORDERS}
          />
          <AdminRoute component={view.Products} path={ROUTES.ADMIN_PRODUCTS} />
          <AdminRoute
            component={v2Enabled ? V2AddProduct : view.AddProduct}
            path={ROUTES.ADD_PRODUCT}
          />
          <AdminRoute component={view.AddPromo} path={ROUTES.ADD_PROMO} />
          <AdminRoute component={view.OrderView} path={ROUTES.ORDER_DETAILS} />
          <AdminRoute component={view.Promo} path={ROUTES.PROMO} />
          <AdminRoute
            component={v2Enabled ? V2EditProduct : view.EditProduct}
            path={`${ROUTES.EDIT_PRODUCT}/:id`}
          />
          <AdminRoute
            component={view.AdminPromoPopup}
            exact
            path={ROUTES.ADMIN_PROMO_POPUP}
          />
          <AdminRoute
            component={view.AdminSettings}
            exact
            path={ROUTES.ADMIN_SETTINGS}
          />
          <Route
            component={view.AdminVerify}
            exact
            path={ROUTES.ADMIN_OTP_VERIFY}
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