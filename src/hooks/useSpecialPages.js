import { useDidMount } from "@/hooks";
import { useEffect, useState } from "react";
import firebase from "@/services/firebase";

const useSpecialPages = () => {
  const [specialPages, setSpecialPages] = useState(
    JSON.parse(localStorage.getItem("specialPages")) || []
  );
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const didMount = useDidMount(true);

  const fetchSpecialPages = async () => {
    try {
      setLoading(true);
      setError("");
      const snapshot = await firebase.getSpecialPages();
      const items = [];

      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });

      if (didMount) {
        localStorage.setItem("specialPages", JSON.stringify(items));
        setSpecialPages(items);
      }
    } catch (e) {
      if (didMount) {
        setError("Failed to get special pages");
      }
    } finally {
      if (didMount) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (didMount) {
      fetchSpecialPages();
    }
  }, []);

  return {
    specialPages,
    fetchSpecialPages,
    isLoading,
    error,
  };
};

export default useSpecialPages;
