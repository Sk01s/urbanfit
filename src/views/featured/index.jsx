import { MessageDisplay } from "@/components/common";
import { ProductShowcaseGrid } from "@/components/product";
import { useDocumentTitle, useSeasonalProducts, useScrollTop } from "@/hooks";
import bannerImg from "@/images/banner-guy.png";
import { ProductGrid } from "@/components/product";
import React from "react";

const FeaturedProducts = () => {
  useDocumentTitle("Featured Products | Urbanfit");
  useScrollTop();

  const { seasonalProducts, fetchSeasonalProducts, isLoading, error } =
    useSeasonalProducts();

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
        <div className="display" style={{ marginTop: "5rem" }}>
          {error && !isLoading ? (
            <MessageDisplay
              message={error}
              action={fetchSeasonalProducts}
              buttonLabel="Try Again"
            />
          ) : (
            <ProductGrid products={seasonalProducts} skeletonCount={6} />
          )}
        </div>
      </div>
    </main>
  );
};

export default FeaturedProducts;
