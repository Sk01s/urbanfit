import { useProductsV2 } from "@/experimental/hooks";
import { useDocumentTitle, useScrollTop, useDidMount } from "@/hooks";
import React, { useState } from "react";
import { ProductShowcaseGrid } from "@/components/product";
import { expandProductForDisplay } from "@/experimental/helpers/getProductVariant";

const ShopV2 = () => {
  useDocumentTitle("Shop | Urbanfit");
  useScrollTop();
  const { products, isLoading, error, fetchProducts } = useProductsV2();
  const didMount = useDidMount();

  const normalizedProducts = products.flatMap((p) => expandProductForDisplay(p));

  return (
    <main>
      {error && !isLoading ? (
        <div className="container">
          <p>{error}</p>
          <button onClick={fetchProducts}>Try Again</button>
        </div>
      ) : (
        <ProductShowcaseGrid
          products={normalizedProducts}
          skeletonCount={6}
          title="Shop (V2 Beta)"
          to={false}
        />
      )}
    </main>
  );
};

export default ShopV2;