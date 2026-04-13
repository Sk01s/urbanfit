import React from "react";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { AppliedFilters, ProductGrid, ProductList } from "@/components/product";
import {
  useDocumentTitle,
  useScrollTop,
  useSiteTexts,
} from "@/hooks";
import { SortModel } from "@/components/common";
import { useState } from "react";
import { useEffect } from "react";
import { useProducts } from "@/hooks";
import { MessageDisplay } from "@/components/common";

const BestSeller = () => {
  const { pathname } = useLocation();
  useScrollTop();
  useDocumentTitle("Shop | Urbanfit");
  const { getCategoryTitle } = useSiteTexts();

  const { products, fetchProducts, error, isLoading } = useProducts();

  const [filteredProducts, setFilterdProducts] = useState(products);
  const sortProducts = (products) => {
    setFilterdProducts(products);
  };
  useEffect(() => {
    setFilterdProducts(
      products?.filter((product) => product.isBestSeller)
    );
  }, [pathname, products]);
  return (
    <main className="content">
      <section className="product-list-wrapper">
        <h2 style={{ textTransform: "capitalize", textAlign: "center" }}>
          {getCategoryTitle("best-seller")}
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
              <SortModel
                setProducts={sortProducts}
                products={filteredProducts}
              />
              <ProductGrid products={filteredProducts} skeletonCount={6} />
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default BestSeller;