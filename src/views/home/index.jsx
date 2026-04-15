import { useProductsV2 } from "@/experimental/hooks";
import { expandProductForDisplay } from "@/experimental/helpers/getProductVariant";
import { useDocumentTitle, useSeasonalProducts, useEssentialProducts, useScrollTop, useSeason, useSiteTexts } from "@/hooks";
import { MessageDisplay } from "@/components/common";
import { ProductShowcaseGrid } from "@/components/product";
import { SEASONAL_PRODUCTS, ESSENTIAL_PRODUCTS, SHOP } from "@/constants/routes";
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Landing } from "@/components/common";
import { CategoryCards } from "@/components/common";
import { useEffect } from "react";

const Home = () => {
  useDocumentTitle("Urbanfit | Home");
  useScrollTop();
  const { getCategoryTitle } = useSiteTexts();
  const season = useSeason();

  const { products: allProducts, isLoading: isLoadingV2 } = useProductsV2();

  const {
    seasonalProducts: rawSeasonal,
    fetchSeasonalProducts,
    isLoading: isLoadingSeasonal,
    error: errorSeasonal,
  } = useSeasonalProducts(6);
  const {
    essentialProducts: rawEssential,
    fetchEssentialProducts,
    isLoading: isLoadingEssential,
    error: errorEssentail,
  } = useEssentialProducts(6);

  const seasonalProducts = useMemo(
    () => allProducts.filter((p) => p.isSeasonal).flatMap((p) => expandProductForDisplay(p)),
    [allProducts]
  );
  const essentialProducts = useMemo(
    () => allProducts.filter((p) => p.isEssential).flatMap((p) => expandProductForDisplay(p)),
    [allProducts]
  );

  useEffect(() => {
    return () =>
      (document.getElementsByClassName("content")[0].style.padding =
        "10rem 2rem");
  }, []);

  return (
    <main className="content" style={{ padding: 0 }}>
      <div className="home">
        <Landing />
        <div
          className="display product-display-grid"
          style={{
            marginTop: "4rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            marginInline: "auto",
          }}
        >
          {errorSeasonal && !isLoadingSeasonal ? (
            <MessageDisplay
              message={errorSeasonal}
              action={fetchSeasonalProducts}
              buttonLabel="Try Again"
            />
          ) : (
            <ProductShowcaseGrid
              title={season === "End of season" ? season : season + " collection"}
              products={seasonalProducts}
              skeletonCount={6}
              to={SEASONAL_PRODUCTS}
              high
              isLoading={isLoadingV2 || isLoadingSeasonal}
            />
          )}
        </div>
        <CategoryCards />
        <div
          className="display "
          style={{
            marginTop: "1rem",
            display: "flex",
            gap: "1rem",
            flexDirection: "column",
            marginInline: "auto",
            marginBottom: "0",
          }}
        >
          {errorEssentail && !isLoadingEssential ? (
            <MessageDisplay
              message={errorEssentail}
              action={fetchEssentialProducts}
              buttonLabel="Try Again"
            />
          ) : (
            <ProductShowcaseGrid
              title={getCategoryTitle("essential")}
              products={essentialProducts}
              skeletonCount={6}
              to={ESSENTIAL_PRODUCTS}
              high
              isLoading={isLoadingV2 || isLoadingEssential}
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;