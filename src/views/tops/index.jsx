/* eslint-disable react/jsx-props-no-spreading */
import { AppliedFilters, ProductGrid, ProductList } from "@/components/product";
import { useDocumentTitle, useScrollTop, useSiteImages } from "@/hooks";
import { SiteImageLabel } from "@/components/common";
import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { selectFilter } from "@/selectors/selector";

const CategoryDisplay = () => {
  useDocumentTitle("Tops | Urbanfit");
  useScrollTop();
  const { getImageUrl, getLabelOverlay } = useSiteImages();

  const store = useSelector(
    (state) => ({
      filteredProducts: selectFilter(state.products.items, state.filter),
      products: state.products,
      requestStatus: state.app.requestStatus,
      isLoading: state.app.loading,
    }),
    shallowEqual
  );
  const categoryProduct = store.products.items.filter(
    (product) => product.categories === "Tops"
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
        <AppliedFilters filteredProductsCount={store.filteredProducts.length} />
        <ProductList {...store}>
          <ProductGrid products={categoryProduct} />
        </ProductList>
      </section>
    </main>
  );
};

export default CategoryDisplay;
