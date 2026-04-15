import { AppliedFilters, ProductGrid, ProductList } from "@/components/product";
import { useDocumentTitle, useScrollTop, useSiteImages } from "@/hooks";
import { SiteImageLabel } from "@/components/common";
import { useProductsV2 } from "@/experimental/hooks";
import { expandProductForDisplay } from "@/experimental/helpers/getProductVariant";
import React, { useMemo } from "react";

const CategoryDisplay = () => {
  useDocumentTitle("Tops | Urbanfit");
  useScrollTop();
  const { getImageUrl, getLabelOverlay } = useSiteImages();

  const { products, isLoading } = useProductsV2();

  const categoryProduct = useMemo(
    () => products.filter((p) => p.categories === "Tops").flatMap((p) => expandProductForDisplay(p)),
    [products]
  );

  return (
    <main className="content" style={{ display: "block" }}>
      <div className="banner" style={{ marginBottom: "4rem" }}>
        <div className="banner-desc">
          <h1>Tops</h1>
        </div>
        <div className="banner-img" style={{ position: "relative" }}>
          <img src={getImageUrl("banner-guy")} alt="" />
          <SiteImageLabel labelOverlay={getLabelOverlay("banner-guy")} />
        </div>
      </div>
      <section className="product-list-wrapper">
        <ProductGrid products={categoryProduct} isLoading={isLoading} />
      </section>
    </main>
  );
};

export default CategoryDisplay;