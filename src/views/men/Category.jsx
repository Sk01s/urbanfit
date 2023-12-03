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
import { useProducts } from "@/hooks";

const Category = (props) => {
  const { pathname } = useLocation();
  const { category, sex } = useParams();
  const [name, setName] = useState(category);
  useScrollTop();
  useDocumentTitle("Shop | Urbanfit");

  const { products, fetchProducts, error, isLoading } = useProducts();
  let [filteredProducts, setFilterdProducts] = useState(() =>
    products?.filter(
      (product) =>
        product?.sex?.toLocaleLowerCase() === sex.toLocaleLowerCase() &&
        product.categories.toLocaleLowerCase() === category.toLocaleLowerCase()
    )
  );
  useEffect(() => {
    setFilterdProducts(
      products?.filter(
        (product) =>
          product?.sex?.toLocaleLowerCase() === sex.toLocaleLowerCase() &&
          product.categories.toLocaleLowerCase() ===
            category.toLocaleLowerCase()
      )
    );
  }, [pathname, products]);
  const sortProducts = (products) => {
    setFilterdProducts(products);
  };
  const {
    seasonalProducts,
    fetchSeasonalProducts,
    isLoading: isLoadingSeasonal,
    error: errorSeasonal,
  } = useSeasonalProducts(6);
  const {
    essentialProducts,
    fetchEssentialProducts,
    isLoading: isLoadingEssential,
    error: errorEssentail,
  } = useEssentialProducts(6);
  useEffect(() => {
    if (category === "seasonal-collection") {
      setFilterdProducts(
        seasonalProducts.filter(
          (product) =>
            product.sex.toLocaleLowerCase() === sex.toLocaleLowerCase()
        )
      );
    }
    if (category === "essential") {
      setName("essentials");
      setFilterdProducts(
        essentialProducts.filter(
          (product) =>
            product.sex.toLocaleLowerCase() === sex.toLocaleLowerCase()
        )
      );
    }

    // return () => {
    //   second;
    // };
  }, [essentialProducts, seasonalProducts, pathname]);

  return (
    <main className="content">
      <section className="product-list-wrapper">
        <h2 style={{ textTransform: "capitalize", textAlign: "center" }}>
          {sex}'s {name}
        </h2>
        <p style={{ color: "#343a40", textAlign: "center" }}>
          {filteredProducts.length} products
        </p>
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

export default Category;
