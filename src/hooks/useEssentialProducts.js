import { useDidMount } from "@/hooks";
import { useEffect, useState } from "react";
import firebase from "@/services/firebase";

const useEssentialProducts = (itemsCount) => {
  const [essentialProducts, setEssentialProducts] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const didMount = useDidMount(true);

  const fetchEssentialProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const docs = await firebase.getEsssentialProducts(itemsCount);

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
          setEssentialProducts(items);
          setLoading(false);
        }
      }
    } catch (e) {
      if (didMount) {
        setError("Failed to get Essential products");
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (essentialProducts.length === 0 && didMount) {
      fetchEssentialProducts();
    }
  }, []);

  return {
    essentialProducts,
    fetchEssentialProducts,
    isLoading,
    error,
  };
};

export default useEssentialProducts;
