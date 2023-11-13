import React from "react";
import {
  useLocation,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { AppliedFilters, ProductGrid, ProductList } from "@/components/product";
import {
  useDocumentTitle,
  useSeasonalProducts,
  useEssentialProducts,
  useScrollTop,
  useSeason,
} from "@/hooks";
import { shallowEqual, useSelector } from "react-redux";
import { selectFilter } from "@/selectors/selector";
import { SortModel } from "@/components/common";
import { useState } from "react";
import { useEffect } from "react";

const TypeCategory = (props) => {
  const { pathname } = useLocation();
  const { type, sex } = useParams();
  useScrollTop();
  useDocumentTitle("Shop | Urbanfit");
  const store = useSelector(
    (state) => ({
      filteredProducts: selectFilter(state.products.items, state.filter),
      products: state.products,
      requestStatus: state.app.requestStatus,
      isLoading: state.app.loading,
    }),
    shallowEqual
  );
  const [filteredProducts, setFilterdProducts] = useState(
    store.products?.items?.filter(
      (product) =>
        product?.type?.name?.toLocaleLowerCase().replaceAll(" ", "-") ===
          type.toLocaleLowerCase() &&
        product.sex.toLocaleLowerCase() === sex.toLocaleLowerCase()
    )
  );
  const sortProducts = (products) => {
    setFilterdProducts(products);
  };
  useEffect(() => {
    setFilterdProducts(
      store.products?.items?.filter(
        (product) =>
          product?.type?.name?.toLocaleLowerCase().replaceAll(" ", "-") ===
            type.toLocaleLowerCase() &&
          product.sex.toLocaleLowerCase() === sex.toLocaleLowerCase()
      )
    );
  }, [pathname]);
  console.log(filteredProducts);
  return (
    <main className="content">
      <section className="product-list-wrapper">
        <h2 style={{ textTransform: "capitalize", textAlign: "center" }}>
          {sex}'s {type}
        </h2>
        <p style={{ color: "#343a40", textAlign: "center" }}>
          {filteredProducts.length} products
        </p>
        <ProductList {...store}>
          <SortModel setProducts={sortProducts} products={filteredProducts} />
          <ProductGrid products={filteredProducts} />
        </ProductList>
      </section>
    </main>
  );
};

export default TypeCategory;
