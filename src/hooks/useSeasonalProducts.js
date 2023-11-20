import { useDidMount } from "@/hooks";
import { useEffect, useState } from "react";
import firebase from "@/services/firebase";

const useSeasonalProducts = (itemsCount) => {
  const [seasonalProducts, setSeasonalProducts] = useState(
    JSON.parse(localStorage.getItem("seasonals")) || []
  );
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const didMount = useDidMount(true);

  const fetchSeasonalProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const docs = await firebase.getSeasonalProducts(itemsCount);

      if (docs.empty) {
        if (didMount) {
          setError("No Seasonal products found.");
          setLoading(false);
        }
      } else {
        const items = [];

        docs.forEach((snap) => {
          const data = snap.data();
          items.push({ id: snap.ref.id, ...data });
        });

        if (didMount) {
          localStorage.setItem("seasonals", JSON.stringify(items));
          setSeasonalProducts(items);
          setLoading(false);
        }
      }
    } catch (e) {
      if (didMount) {
        setError("Failed to fetch featured products");
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (seasonalProducts.length === 0 && didMount) {
      fetchSeasonalProducts();
    }
  }, []);

  return {
    seasonalProducts,
    fetchSeasonalProducts,
    isLoading,
    error,
  };
};

export default useSeasonalProducts;
