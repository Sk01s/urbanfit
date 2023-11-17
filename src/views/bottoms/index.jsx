/* eslint-disable react/jsx-props-no-spreading */
import { AppliedFilters, ProductGrid, ProductList } from "@/components/product";
import { useDocumentTitle, useScrollTop } from "@/hooks";
import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { selectFilter } from "@/selectors/selector";
import bannerImg from "@/images/banner-guy.png";
import { useProducts } from "@/hooks";
import { useEffect } from "react";
import { SortModel } from "@/components/common";

const CategoryDisplay = () => {
  useDocumentTitle("Bottoms | Urbanfit");
  useScrollTop();

  const { products, fetchProducts, error, isLoading } = useProducts();

  const [filteredProducts, setFilterdProducts] = useState(products);
  const sortProducts = (products) => {
    setFilterdProducts(products);
  };
  const categoryProduct = products.filter(
    (product) => product.categories === "Bottoms"
  );
  useEffect(() => {
    setFilterdProducts(
      products.filter((product) => product.categories === "Bottoms")
    );
  }, [pathname, products]);
  return (
    <main className="content" style={{ display: "block" }}>
      <div className="banner" style={{ marginBottom: "4rem" }}>
        <div className="banner-desc">
          <h1>Bottoms</h1>
        </div>
        <div className="banner-img">
          <img src={bannerImg} alt="" />
        </div>
      </div>
      <section className="product-list-wrapper">
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

export default CategoryDisplay;
