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

  useEffect(() => {
    let cancelled = false;
    // Always revalidate against Firestore (stale-while-revalidate):
    // show the cached store product instantly, then overwrite with fresh
    // data so price/image edits become visible on every device.
    setError(null);
    if (storeProduct) {
      setProduct((prev) =>
        prev?.id === storeProduct.id &&
        JSON.stringify(prev) === JSON.stringify(storeProduct)
          ? prev
          : storeProduct
      );
      setLoading(false);
    } else {
      setLoading(true);
    }
    (async () => {
      try {
        const doc = await firebase.getSingleProduct(id);
        if (!cancelled) {
          if (doc.exists) {
            const data = { ...doc.data(), id: doc.ref.id };
            setProduct((prev) =>
              JSON.stringify(prev) === JSON.stringify(data) ? prev : data
            );
            setLoading(false);
          } else if (!storeProduct) {
            setLoading(false);
            setError("Product not found.");
          } else {
            setLoading(false);
          }
        }
      } catch (err) {
        if (!cancelled) {
          // Keep showing cached product on network failure.
          if (!storeProduct) {
            setLoading(false);
            setError(err?.message || "Something went wrong.");
          } else {
            setLoading(false);
          }
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
