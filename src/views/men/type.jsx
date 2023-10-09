import React from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
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

const TypeCategory = (props) => {
  const { type, sex } = useParams();
  useScrollTop();
  useDocumentTitle("Shop | Urbanfit");
  const store = useSelector(
    (state) => ({
      filteredProducts: selectFilter(state.products.items, state.filter),
      products: state.products,
      requestStatus: state.app.requestStatus,
      isLoading: state.app.loading,
    }),
    shallowEqual
  );
  let filteredProducts = store.products?.items?.filter(
    (product) =>
      product?.type?.name.toLocaleLowerCase?.().replace(" ", "-") ===
        type.toLocaleLowerCase() &&
      product.sex.toLocaleLowerCase() === sex.toLocaleLowerCase()
  );
  -console.log(filteredProducts);
  return (
    <div>hi</div>
    // <main className="content">
    //   <section className="product-list-wrapper">
    //     <ProductList {...store}>
    //       <ProductGrid products={filteredProducts} />
    //     </ProductList>
    //   </section>
    // </main>
  );
};

export default TypeCategory;
