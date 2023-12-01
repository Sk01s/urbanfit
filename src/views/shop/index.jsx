/* eslint-disable react/jsx-props-no-spreading */
import { AppliedFilters, ProductGrid, ProductList } from "@/components/product";
import { useDocumentTitle, useScrollTop } from "@/hooks";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { selectFilter } from "@/selectors/selector";
import { SortModel } from "@/components/common";
import { useProducts } from "@/hooks";

const Shop = () => {
  const { products, fetchProducts, error, isLoading } = useProducts();
  const [filteredProducts, setFilterdProducts] = useState(products || []);
  const sortProducts = (products) => {
    setFilterdProducts(products);
  };
  return (
    <main className="content">
      <section className="product-list-wrapper">
        <h2 style={{ textAlign: "center" }}> Products</h2>
        <p style={{ color: "#343a40", textAlign: "center" }}>
          {products.length} products
        </p>
        <br />
        {error && !isLoading ? (
          <MessageDisplay
            message={error}
            action={fetchProducts}
            buttonLabel="Try Again"
          />
        ) : (
          <>
            <SortModel setProducts={sortProducts} products={filteredProducts} />
            <ProductGrid products={filteredProducts} skeletonCount={6} />
          </>
        )}
      </section>
    </main>
  );
};

export default Shop;
