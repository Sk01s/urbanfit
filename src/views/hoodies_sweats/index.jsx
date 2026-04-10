/* eslint-disable react/jsx-props-no-spreading */
import { AppliedFilters, ProductGrid, ProductList } from "@/components/product";
import { useDocumentTitle, useScrollTop, useSiteImages } from "@/hooks";
import { SiteImageLabel } from "@/components/common";
import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { selectFilter } from "@/selectors/selector";
import { useLocation } from "react-router-dom";
import { SortModel } from "@/components/common";
import { useProducts } from "@/hooks";

const CategoryDisplay = () => {
  useDocumentTitle("Hoodies & Sweats | Urbanfit");
  useScrollTop();
  const { getImageUrl, getLabelOverlay } = useSiteImages();
  const { pathname } = useLocation();
  const { products, fetchProducts, error, isLoading } = useProducts();

  const [filteredProducts, setFilterdProducts] = useState(products);
  const sortProducts = (products) => {
    setFilterdProducts(products);
  };

  useEffect(() => {
    setFilterdProducts(
      products.filter((product) => product.categories === "Hoodies & Sweats")
    );
  }, [pathname, products]);
  return (
    <main className="content" style={{ display: "block" }}>
      <div className="banner" style={{ marginBottom: "4rem" }}>
        <div className="banner-desc">
          <h1>Hoodies & Sweats</h1>
        </div>
        <div className="banner-img" style={{ position: "relative" }}>
          <img src={getImageUrl("banner-guy")} alt="" />
          <SiteImageLabel labelOverlay={getLabelOverlay("banner-guy")} />
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
