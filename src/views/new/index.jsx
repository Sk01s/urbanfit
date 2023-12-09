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
import { MessageDisplay } from "@/components/common";

const Luxury = (props) => {
  const { pathname } = useLocation();
  const { sex } = useParams();
  useScrollTop();
  useDocumentTitle("Shop | Urbanfit");

  const { products, fetchProducts, error, isLoading } = useProducts();

  const [filteredProducts, setFilterdProducts] = useState(products);
  const sortProducts = (products) => {
    setFilterdProducts(products);
  };
  useEffect(() => {
    setFilterdProducts(
      sex === "none"
        ? products?.filter((product) => product.isNew)
        : products?.filter(
            (product) =>
              product.isNew &&
              product.sex.toLocaleLowerCase() === sex.toLocaleLowerCase()
          )
    );
  }, [pathname, products]);
  return (
    <main className="content">
      <section className="product-list-wrapper">
        <h2 style={{ textTransform: "capitalize", textAlign: "center" }}>
          {sex === "women" ? "Comfort Sets" : "Just Landed"}
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

export default Luxury;
