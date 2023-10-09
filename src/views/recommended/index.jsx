import { MessageDisplay } from "@/components/common";
import { ProductShowcaseGrid } from "@/components/product";
import { useDocumentTitle, useEssentialProducts, useScrollTop } from "@/hooks";
import bannerImg from "@/images/banner-girl-1.png";
import { ProductGrid } from "@/components/product";
import React from "react";

const EssentialProducts = () => {
  useDocumentTitle("Essential Products | Urbanfit");
  useScrollTop();

  const { essentialProducts, fetchEssentialProducts, isLoading, error } =
    useEssentialProducts();

  return (
    <main className="content">
      <div className="featured">
        <div className="banner">
          <div className="banner-desc">
            <h1>Essential Products</h1>
          </div>
          <div className="banner-img">
            <img src={bannerImg} alt="" />
          </div>
        </div>
        <div className="display">
          {error && !isLoading ? (
            <MessageDisplay
              message={error}
              action={fetchEssentialProducts}
              buttonLabel="Try Again"
            />
          ) : (
            <ProductGrid products={essentialProducts} skeletonCount={6} />
          )}
        </div>
      </div>
    </main>
  );
};

export default EssentialProducts;
