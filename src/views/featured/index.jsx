import { MessageDisplay } from "@/components/common";
import { ProductShowcaseGrid, ProductGrid } from "@/components/product";
import { useDocumentTitle, useScrollTop } from "@/hooks";
import { useSeason } from "@/hooks";
import { useProductsV2 } from "@/experimental/hooks";
import { expandProductForDisplay } from "@/experimental/helpers/getProductVariant";
import React, { useMemo } from "react";

const FeaturedProducts = () => {
  const seasonal = useSeason();
  useDocumentTitle(`${seasonal} Collection | Urbanfit`);
  useScrollTop();

  const { products, fetchProducts, isLoading, error } = useProductsV2();

  const seasonalProducts = useMemo(
    () => products.filter((p) => p.isSeasonal).flatMap((p) => expandProductForDisplay(p)),
    [products]
  );

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
              action={fetchProducts}
              buttonLabel="Try Again"
            />
          ) : (
            <ProductGrid products={seasonalProducts} isLoading={isLoading} />
          )}
        </div>
      </div>
    </main>
  );
};

export default FeaturedProducts;