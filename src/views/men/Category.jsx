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


const Category = (props) => {
  const { category, sex } = useParams();
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
      product?.sex?.toLocaleLowerCase() === sex.toLocaleLowerCase() &&
      product.categories.toLocaleLowerCase() === category.toLocaleLowerCase()
  );
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
  if (category === "seasonal-collection") {
    filteredProducts = seasonalProducts.filter(
      (product) => product.sex.toLocaleLowerCase() === sex.toLocaleLowerCase()
    );
  }
  if (category === "essential") {
    filteredProducts = essentialProducts.filter(
      (product) => product.sex.toLocaleLowerCase() === sex.toLocaleLowerCase()
    );
  }
  console.log(filteredProducts);
  return (
    <main className="content">
      <section className="product-list-wrapper">
        <ProductList {...store}>
          <ProductGrid products={filteredProducts} />
        </ProductList>
      </section>
    </main>
  );
};

export default Category;
