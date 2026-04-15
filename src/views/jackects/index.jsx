import { AppliedFilters, ProductGrid, ProductList } from "@/components/product";
import { useDocumentTitle, useScrollTop, useSiteImages } from "@/hooks";
import { SiteImageLabel, SortModel, MessageDisplay } from "@/components/common";
import { useProductsV2 } from "@/experimental/hooks";
import { expandProductForDisplay } from "@/experimental/helpers/getProductVariant";
import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";

const CategoryDisplay = () => {
  useDocumentTitle("Jackets | Urbanfit");
  useScrollTop();
  const { getImageUrl, getLabelOverlay } = useSiteImages();
  const { pathname } = useLocation();

  const { products, fetchProducts, error, isLoading } = useProductsV2();

  const filteredProducts = useMemo(
    () => products.filter((p) => p.categories === "Jackets").flatMap((p) => expandProductForDisplay(p)),
    [products]
  );
  const [sortedProducts, setSortedProducts] = useState(filteredProducts);
  useEffect(() => {
    setSortedProducts(filteredProducts);
  }, [filteredProducts]);

  return (
    <main className="content" style={{ display: "block" }}>
      <div className="banner" style={{ marginBottom: "4rem" }}>
        <div className="banner-desc">
          <h1>Jackets</h1>
        </div>
        <div className="banner-img" style={{ position: "relative" }}>
          <img src={getImageUrl("banner-guy")} alt="" />
          <SiteImageLabel labelOverlay={getLabelOverlay("banner-guy")} />
        </div>
      </div>
      <section className="product-list-wrapper">
        {error && !isLoading ? (
          <MessageDisplay
            message={error}
            action={fetchProducts}
            buttonLabel="Try Again"
          />
        ) : (
          <>
            <SortModel setProducts={setSortedProducts} products={sortedProducts} />
            <ProductGrid products={sortedProducts} skeletonCount={6} isLoading={isLoading} />
          </>
        )}
      </section>
    </main>
  );
};

export default CategoryDisplay;