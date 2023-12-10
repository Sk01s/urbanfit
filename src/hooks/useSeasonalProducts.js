import { useDidMount } from "@/hooks";
import { useEffect, useState } from "react";
import firebase from "@/services/firebase";
import useProducts from "./useProducts";

const useSeasonalProducts = (itemsCount) => {
  const { products, isLoading, error, fetchProducts } = useProducts();
  const [seasonalProducts, setSeasonalProducts] = useState(
    JSON.parse(localStorage.getItem("seasonals")) ||
      products.filter((item) => item.isSeasonal) ||
      []
  );

  const [seasonalError, setError] = useState(error);
  const [seasonalLoading, setLoading] = useState(isLoading);
  const didMount = useDidMount(true);

  const fetchSeasonalProducts = async () => {
    try {
      if (!isLoading && products.length === 0) {
        fetchProducts();
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    setSeasonalProducts(products.filter((item) => item.isSeasonal));
  }, [products]);
  useEffect(() => {
    setError(error);
  }, [error]);
  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (seasonalProducts.length === 0 && didMount) {
      fetchSeasonalProducts();
    }
  }, []);

  return {
    seasonalProducts,
    fetchSeasonalProducts,
    isLoading: seasonalLoading,
    error: seasonalError,
  };
};

export default useSeasonalProducts;
