import { AppliedFilters, ProductGrid, ProductList } from "@/components/product";
import { useDocumentTitle, useScrollTop } from "@/hooks";
import { useProductsV2 } from "@/experimental/hooks";
import { expandProductForDisplay } from "@/experimental/helpers/getProductVariant";
import React, { useMemo, useState, useEffect } from "react";
import { SortModel } from "@/components/common";
import { MessageDisplay } from "@/components/common";

const Shop = () => {
  useDocumentTitle("Shop | Urbanfit");
  useScrollTop();
  const { products, fetchProducts, isLoading, error } = useProductsV2();

  const expandedProducts = useMemo(
    () => products.flatMap((p) => expandProductForDisplay(p)),
    [products]
  );
  const [filteredProducts, setFilteredProducts] = useState(expandedProducts);
  useEffect(() => {
    setFilteredProducts(expandedProducts);
  }, [expandedProducts]);

  return (
    <main className="content">
      <section className="product-list-wrapper">
        <h2 style={{ textAlign: "center" }}> Products</h2>
        <p style={{ color: "#343a40", textAlign: "center" }}>
          {expandedProducts.length} products
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
            <SortModel setProducts={setFilteredProducts} products={filteredProducts} />
            <ProductGrid products={filteredProducts} isLoading={isLoading} />
          </>
        )}
      </section>
    </main>
  );
};

export default Shop;