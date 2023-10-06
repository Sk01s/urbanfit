import { MessageDisplay } from "@/components/common";
import { ProductShowcaseGrid } from "@/components/product";
import { useDocumentTitle, useFeaturedProducts, useScrollTop } from "@/hooks";
import bannerImg from "@/images/banner-guy.png";
import { ProductGrid } from "@/components/product";
import React from "react";

const FeaturedProducts = () => {
  useDocumentTitle("Featured Products | urbanfit");
  useScrollTop();

  const { featuredProducts, fetchFeaturedProducts, isLoading, error } =
    useFeaturedProducts();

  return (
    <main className="content">
      <div className="featured">
        <div className="banner">
          <div className="banner-desc">
            <h1>Featured Products</h1>
          </div>
          <div className="banner-img">
            <img src={bannerImg} alt="" />
          </div>
        </div>
        <div className="display">
          {error && !isLoading ? (
            <MessageDisplay
              message={error}
              action={fetchFeaturedProducts}
              buttonLabel="Try Again"
            />
          ) : (
            <ProductGrid products={featuredProducts} skeletonCount={6} />
          )}
        </div>
      </div>
    </main>
  );
};

export default FeaturedProducts;
