import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import firebase from "@/services/firebase";

const useProduct = (id) => {
  const storeProduct = useSelector((state) =>
    state.products.items.find((item) => item.id === id)
  );

  const [product, setProduct] = useState(storeProduct);
  const [isLoading, setLoading] = useState(!storeProduct);
  const [error, setError] = useState(null);

  console.log("[useProduct] DEBUG:", {
    id,
    storeProduct: storeProduct ? { name: storeProduct.name, hasImageCollection: !!storeProduct.imageCollection, hasAvailableColors: !!storeProduct.availableColors } : null,
    product: product ? { name: product.name, hasImageCollection: !!product.imageCollection, hasAvailableColors: !!product.availableColors } : null,
    isLoading,
    error,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (!storeProduct) {
          setLoading(true);
          const doc = await firebase.getSingleProduct(id);
          if (!cancelled) {
            if (doc.exists) {
              const data = { ...doc.data(), id: doc.ref.id };
              setProduct(data);
              setLoading(false);
            } else {
              setLoading(false);
              setError("Product not found.");
            }
          }
        } else {
          setProduct(storeProduct);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setLoading(false);
          setError(err?.message || "Something went wrong.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, storeProduct]);

  return { product, isLoading, error };
};

export default useProduct;
