import { ArrowRightOutlined } from "@ant-design/icons";
import { MessageDisplay } from "@/components/common";
import { ProductShowcaseGrid } from "@/components/product";
import {
  SEASONAL_PRODUCTS,
  ESSENTIAL_PRODUCTS,
  SHOP,
} from "@/constants/routes";
import {
  useDocumentTitle,
  useSeasonalProducts,
  useEssentialProducts,
  useScrollTop,
  useSeason,
} from "@/hooks";
import bannerImg from "@/images/banner-girl.png";
import React from "react";
import { Link } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";
import { selectFilter } from "@/selectors/selector";
import { AppliedFilters } from "@/components/product";
import { ProductGrid, ProductList } from "@/components/product";
import { categories } from "@/constants/constants";
import { Landing } from "@/components/common";
import { useEffect } from "react";
import firebase from "@/services/firebase";
import { CategoryCards } from "@/components/common";

const Home = () => {
  useDocumentTitle("Urbanfit | Home");
  useScrollTop();
  const store = useSelector(
    (state) => ({
      filteredProducts: selectFilter(state.products.items, state.filter),
      products: state.products,
      requestStatus: state.app.requestStatus,
      isLoading: state.app.loading,
    }),
    shallowEqual
  );
  const season = useSeason();

  const {
    seasonalProducts,
    fetchSeasonalProducts,
    isLoading: isLoadingSeasonal,
    error: errorSeasonal,
  } = useSeasonalProducts(6);
  const {
    essentialProducts,
    fetchEssentialProducts,
    isLoading: isLoadingEssential,
    error: errorEssentail,
  } = useEssentialProducts(6);

  useEffect(() => {
    return () =>
      (document.getElementsByClassName("content")[0].style.padding =
        "10rem 2rem");
  }, []);
  return (
    <main className="content" style={{ padding: 0 }}>
      <div className="home">
        {/* <div className="banner">
          <div className="banner-desc">
            <h1 className="text-thin">
              Welcome to <span className="text-thin-light">Urbanfit</span>
            </h1>
            <p>
              Our collection features unique designs that are sure to make you
              stand out from the crowd. Whether you’re looking for a casual
              t-shrit or a cozy hoodie, we’ve got you covered.
            </p>
            <br />
            <Link to={SHOP} className="button">
              Shop Now &nbsp;
              <ArrowRightOutlined />
            </Link>
          </div>
        </div> */}
        <Landing />

        <div
          className="display product-display-grid"
          style={{
            marginTop: "4rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            marginInline: "auto",
          }}
        >
          {errorSeasonal && !isLoadingSeasonal ? (
            <MessageDisplay
              message={errorSeasonal}
              action={fetchSeasonalProducts}
              buttonLabel="Try Again"
            />
          ) : (
            <ProductShowcaseGrid
              title={
                season === "End of season" ? season : season + " collection"
              }
              products={seasonalProducts}
              skeletonCount={6}
              to={SEASONAL_PRODUCTS}
              high
            />
          )}
        </div>
        <CategoryCards />
        <div
          className="display "
          style={{
            marginTop: "1rem",
            display: "flex",
            gap: "1rem",
            flexDirection: "column",
            marginInline: "auto",
            marginBottom: "0",
          }}
        >
          {errorEssentail && !isLoadingEssential ? (
            <MessageDisplay
              message={errorEssentail}
              action={fetchEssentialProducts}
              buttonLabel="Try Again"
            />
          ) : (
            <ProductShowcaseGrid
              title={"Essentials"}
              products={essentialProducts}
              skeletonCount={6}
              to={ESSENTIAL_PRODUCTS}
              high
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
