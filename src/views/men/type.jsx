import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { AppliedFilters, ProductGrid, ProductList } from "@/components/product";
import { useDocumentTitle, useScrollTop } from "@/hooks";
import { SortModel, MessageDisplay } from "@/components/common";
import { useProductsV2 } from "@/experimental/hooks";
import { expandProductForDisplay } from "@/experimental/helpers/getProductVariant";

const TypeCategory = (props) => {
  const { pathname } = useLocation();
  const { type, sex } = useParams();
  useScrollTop();
  useDocumentTitle("Shop | Urbanfit");

  const { products, fetchProducts, error, isLoading } = useProductsV2();

  const filteredProducts = useMemo(
    () =>
      products
        .filter(
          (p) =>
            p?.type?.name?.toLocaleLowerCase().replaceAll(" ", "-") ===
              type?.toLocaleLowerCase() &&
            p?.sex?.toLocaleLowerCase() === sex?.toLocaleLowerCase()
        )
        .flatMap((p) => expandProductForDisplay(p)),
    [products, type, sex]
  );
  const [sortedProducts, setSortedProducts] = useState(filteredProducts);
  useEffect(() => {
    setSortedProducts(filteredProducts);
  }, [filteredProducts]);

  return (
    <main className="content">
      <section className="product-list-wrapper">
        <h2 style={{ textTransform: "capitalize", textAlign: "center" }}>
          {sex}'s {type}
        </h2>
        <p style={{ color: "#343a40", textAlign: "center" }}>
          {filteredProducts.length} products
        </p>
        <div className="display" style={{ marginTop: "5rem" }}>
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
        </div>
      </section>
    </main>
  );
};

export default TypeCategory;