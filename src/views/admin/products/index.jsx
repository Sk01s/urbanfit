import { Boundary } from "@/components/common";
import { useDocumentTitle, useScrollTop } from "@/hooks";
import React, { useState, useMemo } from "react";
import ProductsTable from "../components/ProductsTable";
import { useProducts } from "@/hooks";
import { ProductsNavbar } from "../components";
import { ReloadOutlined, PlusOutlined } from "@ant-design/icons";
import { ADD_PRODUCT } from "@/constants/routes";
import { useHistory } from "react-router-dom";
import v2Enabled from "@/experimental/featureFlag";
import { useProductsV2 } from "@/experimental/hooks";

const Products = () => {
  useDocumentTitle("Product List | Urbanfit Admin");
  useScrollTop();
  const history = useHistory();

  const v1 = useProducts();
  const v2 = useProductsV2();

  const products = v2Enabled ? v2.products : v1.products;
  const fetchProducts = v2Enabled ? v2.fetchProducts : v1.fetchProducts;
  const error = v2Enabled ? v2.error : v1.error;
  const isLoading = v2Enabled ? v2.isLoading : v1.isLoading;

  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const q = searchQuery.trim().toLowerCase();
    return products.filter(
      (p) =>
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.name_lower && p.name_lower.includes(q)) ||
        (p.categories && p.categories.toLowerCase().includes(q)) ||
        (p.type?.name && p.type.name.toLowerCase().includes(q)) ||
        (p.sex && p.sex.toLowerCase().includes(q)) ||
        (p.keywords && p.keywords.some((k) => k.toLowerCase().includes(q)))
    );
  }, [products, searchQuery]);

  return (
    <Boundary>
      <div className="product-admin-header">
        <h3 className="product-admin-header-title">
          Products &nbsp; ({filteredProducts.length} / {products.length})
        </h3>
        <input
          className="search-input"
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            border: "1px solid #ddd",
            borderRadius: "4px",
            padding: "6px 12px",
            fontSize: "0.9rem",
            width: "220px",
          }}
        />
        &nbsp;
        <button
          className="button-muted button-small"
          onClick={fetchProducts}
          type="button"
          disabled={isLoading}
        >
          <ReloadOutlined spin={isLoading} />
          &nbsp;Refresh
        </button>
        &nbsp;
        <button
          className="button button-small"
          onClick={() => history.push(ADD_PRODUCT)}
          type="button"
        >
          <PlusOutlined />
          &nbsp; Add New
        </button>
      </div>
      <div className="product-admin-items">
        {error && !isLoading ? (
          <div style={{ textAlign: "center", padding: "3rem 0" }}>
            <p style={{ color: "#e74c3c" }}>{error}</p>
            <button className="button button-small" onClick={fetchProducts}>
              Try Again
            </button>
          </div>
        ) : (
          <ProductsTable filteredProducts={filteredProducts} isLoading={isLoading} />
        )}
      </div>
    </Boundary>
  );
};

export default Products;