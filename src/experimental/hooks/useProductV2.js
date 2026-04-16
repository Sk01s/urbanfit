import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import firebaseV2 from "@/experimental/services/firebaseV2";
import { getProductVariant } from "@/experimental/helpers/getProductVariant";

const useProductV2 = (id) => {
  const location = useLocation();
  const colorFromUrl = new URLSearchParams(location.search).get("color");

  const storeProduct = useSelector((state) =>
    state.productsV2.items.find((item) => item.id === id)
  );

  const [product, setProduct] = useState(storeProduct);
  const [selectedColor, setSelectedColor] = useState(null);
  const [isLoading, setLoading] = useState(!storeProduct);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (!storeProduct) {
          setLoading(true);
          const doc = await firebaseV2.getSingleProductV2(id);
          if (!cancelled) {
            if (doc.exists) {
              const data = { ...doc.data(), id: doc.ref.id };
              setProduct(data);
              if (data.colors && data.colors.length > 0) {
                if (colorFromUrl && data.colors.find((c) => c.color === colorFromUrl)) {
                  setSelectedColor(colorFromUrl);
                } else {
                  setSelectedColor(data.colors[0].color);
                }
              }
              setLoading(false);
            } else {
              setLoading(false);
              setError("Product not found.");
            }
          }
        } else {
          setProduct(storeProduct);
          if (storeProduct.colors && storeProduct.colors.length > 0) {
            if (colorFromUrl && storeProduct.colors.find((c) => c.color === colorFromUrl)) {
              setSelectedColor(colorFromUrl);
            } else {
              setSelectedColor(storeProduct.colors[0].color);
            }
          }
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
  }, [id, storeProduct, colorFromUrl]);

  const variant = useMemo(
    () => (product ? getProductVariant(product, selectedColor) : null),
    [product, selectedColor]
  );

  return {
    product,
    variant,
    selectedColor,
    setSelectedColor,
    isLoading,
    error,
  };
};

export default useProductV2;