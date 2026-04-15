import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { AppliedFilters, ProductGrid, ProductList } from "@/components/product";
import { useDocumentTitle, useScrollTop, useSiteTexts } from "@/hooks";
import { SortModel, MessageDisplay } from "@/components/common";
import { useProductsV2 } from "@/experimental/hooks";
import { expandProductForDisplay } from "@/experimental/helpers/getProductVariant";

const Cool = (props) => {
  const { pathname } = useLocation();
  const { sex } = useParams();
  useScrollTop();
  useDocumentTitle("Cool | Urbanfit");
  const { getCategoryTitle } = useSiteTexts();
  const titleKey = `cool-${sex || "men"}`;

  const { products, fetchProducts, error, isLoading } = useProductsV2();

  const filteredProducts = useMemo(
    () => products.filter((p) => p.isCool).flatMap((p) => expandProductForDisplay(p)),
    [products]
  );
  const [sortedProducts, setSortedProducts] = useState(filteredProducts);
  useEffect(() => {
    setSortedProducts(filteredProducts);
  }, [filteredProducts]);

  return (
    <main className="content">
      <section className="product-list-wrapper">
        <h2 style={{ textTransform: "capitalize", textAlign: "center" }}>
          {getCategoryTitle(titleKey)}
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

export default Cool;