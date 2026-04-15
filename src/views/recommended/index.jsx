import { MessageDisplay } from "@/components/common";
import { ProductGrid } from "@/components/product";
import { useDocumentTitle, useEssentialProducts, useScrollTop, useSiteTexts } from "@/hooks";
import { useProductsV2 } from "@/experimental/hooks";
import { expandProductForDisplay } from "@/experimental/helpers/getProductVariant";
import React, { useMemo } from "react";

const EssentialProducts = () => {
  useDocumentTitle("Essential Products | Urbanfit");
  useScrollTop();
  const { getCategoryTitle } = useSiteTexts();

  const { products, fetchProducts, isLoading, error } = useProductsV2();

  const essentialProducts = useMemo(
    () => products.filter((p) => p.isEssential).flatMap((p) => expandProductForDisplay(p)),
    [products]
  );

  return (
    <main className="content">
      <div className="featured">
        <div className="banner">
          <div className="banner-desc">
            <h1>{getCategoryTitle("essential")}</h1>
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
            <ProductGrid products={essentialProducts} isLoading={isLoading} />
          )}
        </div>
      </div>
    </main>
  );
};

export default EssentialProducts;