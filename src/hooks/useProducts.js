import { useDidMount } from "@/hooks";
import { useEffect, useState } from "react";
import firebase from "@/services/firebase";

const useProducts = () => {
  const [products, setProducts] = useState(
    JSON.parse(localStorage.getItem("products")) || []
  );
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const didMount = useDidMount(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const { docs } = await firebase.getProductsAll();
      if (docs.empty) {
        if (didMount) {
          setError("No Essential products found.");
          setLoading(false);
        }
      } else {
        const items = [];

        docs.forEach((snap) => {
          const data = snap.data();
          items.push({ id: snap.ref.id, ...data });
        });

        if (didMount) {
          setProducts(items);
          setLoading(false);
        }
      }
    } catch (e) {
      console.log(e);
      if (didMount) {
        setError("Failed to get products");
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (products.length === 0 && didMount) {
      fetchProducts();
    }
  }, []);

  return {
    products,
    fetchProducts,
    isLoading,
    error,
  };
};

export default useProducts;
