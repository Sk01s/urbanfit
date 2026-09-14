import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import firebaseV2 from "@/experimental/services/firebaseV2";
import { getProductVariant } from "@/experimental/helpers/getProductVariant";

const useProductV2 = (id) => {
  const storeProduct = useSelector((state) =>
    state.productsV2.items.find((item) => item.id === id)
  );

  const [product, setProduct] = useState(storeProduct);
  const [selectedColor, setSelectedColor] = useState(null);
  const [isLoading, setLoading] = useState(!storeProduct);
  const [error, setError] = useState(null);

  // Reset color selection when navigating to another product.
  useEffect(() => {
    setSelectedColor(null);
  }, [id]);

  useEffect(() => {
    let cancelled = false;
    // Stale-while-revalidate: show cached product instantly, then always
    // fetch fresh so price/image edits show on every device.
    const applyProduct = (data, isFresh) => {
      setProduct((prev) =>
        JSON.stringify(prev) === JSON.stringify(data) ? prev : data
      );
      if (data.colors?.length) {
        const defaultColor = data.colors[0].color;
        if (!isFresh) {
          // Initial cached render: default only if nothing selected yet.
          setSelectedColor((prev) => prev ?? defaultColor);
        } else {
          // Background revalidation: keep the user's choice when it still
          // exists, otherwise fall back to the default color.
          setSelectedColor((prev) =>
            prev && data.colors.some((c) => c.color === prev)
              ? prev
              : defaultColor
          );
        }
      }
      setLoading(false);
    };
    setError(null);
    if (storeProduct) {
      applyProduct(storeProduct, false);
    } else {
      setLoading(true);
    }
    (async () => {
      try {
        const doc = await firebaseV2.getSingleProductV2(id);
        if (!cancelled) {
          if (doc.exists) {
            applyProduct({ ...doc.data(), id: doc.ref.id }, true);
          } else if (!storeProduct) {
            setLoading(false);
            setError("Product not found.");
          } else {
            setLoading(false);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setLoading(false);
          if (!storeProduct) {
            setError(err?.message || "Something went wrong.");
          }
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, storeProduct]);

  const variant = product ? getProductVariant(product, selectedColor) : null;

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