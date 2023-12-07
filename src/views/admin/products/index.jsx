/* eslint-disable react/jsx-props-no-spreading */
import { Boundary } from "@/components/common";
import { AppliedFilters, ProductList } from "@/components/product";
import { useDocumentTitle, useScrollTop } from "@/hooks";
import React from "react";
import { useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import { selectFilter } from "@/selectors/selector";
import { ProductsNavbar } from "../components";
import ProductsTable from "../components/ProductsTable";
import { useProducts } from "@/hooks";
import { SortModel } from "@/components/common";
import { useState } from "react";
import { ProductGrid } from "@/components/product";
import { useEffect } from "react";

const Products = () => {
  useDocumentTitle("Product List | Urbanfit Admin");
  useScrollTop();

  const { products, fetchProducts, error, isLoading } = useProducts();
  const [filteredProducts, setFilterdProducts] = useState(products);

  const sortProducts = (products) => {
    setFilterdProducts(products);
  };

  return (
    <Boundary>
      <ProductsNavbar
        productsCount={products.length}
        totalProductsCount={products.total}
      />
      <div className="product-admin-items">
        {error && !isLoading ? (
          <MessageDisplay
            message={error}
            action={fetchProducts}
            buttonLabel="Try Again"
          />
        ) : (
          <>
            <ProductsTable filteredProducts={products} />
          </>
        )}
      </div>
    </Boundary>
  );
};

export default withRouter(Products);
