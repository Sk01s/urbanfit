/* eslint-disable react/jsx-props-no-spreading */
import { AppliedFilters, ProductGrid, ProductList } from "@/components/product";
import { useDocumentTitle, useScrollTop } from "@/hooks";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { selectFilter } from "@/selectors/selector";
import { SortModel } from "@/components/common";

const Shop = () => {
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
    store.filteredProducts
  );
  const sortProducts = (products) => {
    setFilterdProducts(products);
  };
  return (
    <main className="content">
      <section className="product-list-wrapper">
        <h2 style={{ textAlign: "center" }}> Products</h2>
        <p style={{ color: "#343a40", textAlign: "center" }}>
          {filteredProducts.length} products
        </p>
        <br />
        <AppliedFilters filteredProductsCount={filteredProducts.length} />
        <ProductList {...store}>
          <SortModel setProducts={sortProducts} products={filteredProducts} />
          <ProductGrid products={filteredProducts} />
        </ProductList>
      </section>
    </main>
  );
};

export default Shop;
