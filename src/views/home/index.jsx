import { ArrowRightOutlined } from "@ant-design/icons";
import { MessageDisplay } from "@/components/common";
import { ProductShowcaseGrid } from "@/components/product";
import {
  FEATURED_PRODUCTS,
  RECOMMENDED_PRODUCTS,
  SHOP,
} from "@/constants/routes";
import {
  useDocumentTitle,
  useFeaturedProducts,
  useRecommendedProducts,
  useScrollTop,
} from "@/hooks";
import bannerImg from "@/images/banner-girl.png";
import React from "react";
import { Link } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";
import { selectFilter } from "@/selectors/selector";
import { AppliedFilters } from "@/components/product";
import { ProductGrid, ProductList } from "@/components/product";
import { typeOptions } from "@/constants/constants";

const Home = () => {
  useDocumentTitle("urbanfit | Home");
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

  const {
    featuredProducts,
    fetchFeaturedProducts,
    isLoading: isLoadingFeatured,
    error: errorFeatured,
  } = useFeaturedProducts(6);
  const {
    recommendedProducts,
    fetchRecommendedProducts,
    isLoading: isLoadingRecommended,
    error: errorRecommended,
  } = useRecommendedProducts(6);

  return (
    <main className="content">
      <div className="home">
        <div className="banner">
          <div className="banner-desc">
            <h1 className="text-thin">
              Welcome to <span className="text-thin-light">Urbanfit</span>
            </h1>
            <p>
              Our collection features unique designs that are sure to make you
              stand out from the crowd. Whether you’re looking for a casual
              t-shirt or a cozy hoodie, we’ve got you covered.
            </p>
            <br />
            <Link to={SHOP} className="button">
              Shop Now &nbsp;
              <ArrowRightOutlined />
            </Link>
          </div>
          <div className="banner-img">
            <img src={bannerImg} alt="" />
          </div>
        </div>

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
          {errorFeatured && !isLoadingFeatured ? (
            <MessageDisplay
              message={errorFeatured}
              action={fetchFeaturedProducts}
              buttonLabel="Try Again"
            />
          ) : (
            <ProductShowcaseGrid
              title={"Featured Products"}
              products={featuredProducts}
              skeletonCount={6}
            />
          )}
        </div>
        <div
          className="display "
          style={{
            marginTop: "8rem",
            display: "flex",
            gap: "1rem",
            flexDirection: "column",
            marginInline: "auto",
          }}
        >
          {errorRecommended && !isLoadingRecommended ? (
            <MessageDisplay
              message={errorRecommended}
              action={fetchRecommendedProducts}
              buttonLabel="Try Again"
            />
          ) : (
            <ProductShowcaseGrid
              title={"Recommended Products"}
              products={recommendedProducts}
              skeletonCount={6}
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
