// import { useDidMount } from "@/hooks";
// import { useEffect, useState } from "react";
// import firebase from "@/services/firebase";

// const useEssentialProducts = (itemsCount) => {
//   const [essentialProducts, setEssentialProducts] = useState(
//     JSON.parse(localStorage.getItem("essentials")) || []
//   );
//   const [isLoading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const didMount = useDidMount(true);

//   const fetchEssentialProducts = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const docs = await firebase.getEsssentialProducts(itemsCount);

//       if (docs.empty) {
//         if (didMount) {
//           setError("No Essential products found.");
//           setLoading(false);
//         }
//       } else {
//         const items = [];

//         docs.forEach((snap) => {
//           const data = snap.data();
//           items.push({ id: snap.ref.id, ...data });
//         });

//         if (didMount) {
//           localStorage.setItem("essentials", JSON.stringify(items));
//           setEssentialProducts(items);
//           setLoading(false);
//         }
//       }
//     } catch (e) {
//       if (didMount) {
//         setError("Failed to get Essential products");
//         setLoading(false);
//       }
//     }
//   };

//   useEffect(() => {
//     if (essentialProducts.length === 0 && didMount) {
//       fetchEssentialProducts();
//     }
//   }, []);

//   return {
//     essentialProducts,
//     fetchEssentialProducts,
//     isLoading,
//     error,
//   };
// };

import { useDidMount } from "@/hooks";
import { useEffect, useState } from "react";
import firebase from "@/services/firebase";
import useProducts from "./useProducts";

const useSeasonalProducts = (itemsCount) => {
  const { products, isLoading, error, fetchProducts } = useProducts();
  const [essentialProducts, setSeasonalProducts] = useState(
    JSON.parse(localStorage.getItem("seasonals")) ||
      products.filter((item) => item.isSeasonal) ||
      []
  );

  const [seasonalError, setError] = useState(error);
  const [seasonalLoading, setLoading] = useState(isLoading);
  const didMount = useDidMount(true);

  const fetchEssentialProducts = async () => {
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
    if (essentialProducts.length === 0 && didMount) {
      fetchEssentialProducts();
    }
  }, []);

  return {
    essentialProducts,
    fetchEssentialProducts,
    isLoading: seasonalLoading,
    error: seasonalError,
  };
};

export default useSeasonalProducts;
