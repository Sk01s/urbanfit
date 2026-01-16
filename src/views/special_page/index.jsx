import { MessageDisplay } from "@/components/common";
import { ProductGrid } from "@/components/product";
import { useDocumentTitle, useProducts, useScrollTop } from "@/hooks";
import firebase from "@/services/firebase";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

const SpecialPage = () => {
  useScrollTop();
  const { id } = useParams();
  const { products } = useProducts();
  const [page, setPage] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const snapshot = await firebase.getSpecialPage(id);
        if (!snapshot.exists) {
          setError("Special page not found.");
          return;
        }
        setPage({ id: snapshot.id, ...snapshot.data() });
      } catch (err) {
        setError(err?.message || "Failed to load special page.");
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [id]);

  useDocumentTitle(page?.title ? `${page.title} | Urbanfit` : "Special Page");

  const selectedProducts = useMemo(() => {
    if (!page?.productIds?.length) return [];
    return page.productIds
      .map((productId) => products.find((product) => product.id === productId))
      .filter(Boolean);
  }, [page, products]);

  if (error) {
    return (
      <main className="content">
        <MessageDisplay message={error} />
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="content">
        <div className="loader">
          <h3>Loading...</h3>
        </div>
      </main>
    );
  }

  return (
    <main className="content" style={{ display: "block" }}>
      <div className="banner" style={{ marginBottom: "4rem" }}>
        <div className="banner-desc">
          <h1>{page?.title}</h1>
        </div>
        {page?.bannerUrl && (
          <div className="banner-img">
            <img src={page.bannerUrl} alt={page?.title} />
          </div>
        )}
      </div>
      <section className="product-list-wrapper">
        {selectedProducts.length === 0 ? (
          <MessageDisplay message="No products found." />
        ) : (
          <ProductGrid products={selectedProducts} />
        )}
      </section>
    </main>
  );
};

export default SpecialPage;
