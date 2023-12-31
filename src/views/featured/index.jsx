import { MessageDisplay } from "@/components/common";
import { ProductShowcaseGrid } from "@/components/product";
import { useDocumentTitle, useSeasonalProducts, useScrollTop } from "@/hooks";
import bannerImg from "@/images/banner-guy.png";
import { ProductGrid } from "@/components/product";
import React from "react";
import { useSeason } from "@/hooks";

const FeaturedProducts = () => {
  const seasonal = useSeason();
  useDocumentTitle(`${seasonal} Collection | Urbanfit`);
  useScrollTop();

  const { seasonalProducts, fetchSeasonalProducts, isLoading, error } =
    useSeasonalProducts();

  return (
    <main className="content">
      <div className="featured">
        <div className="banner">
          <div className="banner-desc">
            <h1>{seasonal} Collection</h1>
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
