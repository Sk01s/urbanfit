import { LoadingOutlined } from "@ant-design/icons";
import { Boundary, MessageDisplay } from "@/components/common";
import { ProductGrid } from "@/components/product";
import { useDocumentTitle, useScrollTop } from "@/hooks";
import { useProductsV2 } from "@/experimental/hooks";
import { expandProductForDisplay } from "@/experimental/helpers/getProductVariant";
import React, { useMemo } from "react";

const SearchV2 = ({ match }) => {
  const searchKey = match?.params?.searchKey || "";
  useDocumentTitle(`Search: ${searchKey} | Urbanfit`);
  useScrollTop();
  const { products, isLoading } = useProductsV2();

  const results = useMemo(() => {
    if (!searchKey.trim()) return [];
    const q = searchKey.trim().toLowerCase();
    const filtered = products.filter(
      (p) =>
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.name_lower && p.name_lower.includes(q)) ||
        (p.categories && p.categories.toLowerCase().includes(q)) ||
        (p.type?.name && p.type.name.toLowerCase().includes(q)) ||
        (p.sex && p.sex.toLowerCase().includes(q)) ||
        (p.keywords && p.keywords.some((k) => k.toLowerCase().includes(q)))
    );
    return filtered.flatMap((p) => expandProductForDisplay(p));
  }, [products, searchKey]);

  if (results.length === 0 && !isLoading) {
    return (
      <main className="content">
        <MessageDisplay
          message="No products found."
          desc="Try using correct filters or keyword."
        />
      </main>
    );
  }

  return (
    <Boundary>
      <main className="content">
        <section className="product-list-wrapper product-list-search">
          {!isLoading && (
            <div className="product-list-header">
              <div className="product-list-header-title">
                <h5>
                  {`Found ${results.length} ${results.length > 1 ? "products" : "product"} with keyword ${searchKey}`}
                </h5>
              </div>
            </div>
          )}
          <ProductGrid products={results} isLoading={isLoading} />
        </section>
      </main>
    </Boundary>
  );
};

export default SearchV2;