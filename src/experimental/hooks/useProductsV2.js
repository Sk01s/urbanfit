import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import firebaseV2 from "@/experimental/services/firebaseV2";
import { setAllProductsV2 } from "@/experimental/redux/actions/productV2Actions";

const useProductsV2 = () => {
  const dispatch = useDispatch();
  const reduxProducts = useSelector((state) => state.productsV2.items);
  const prevReduxProductsRef = useRef(reduxProducts);
  const hasFetched = useRef(false);

  const [products, setProducts] = useState(
    JSON.parse(localStorage.getItem("productsV2")) || []
  );
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const { docs } = await firebaseV2.getProductsV2All();
      if (docs.empty) {
        setError("No products found.");
        setLoading(false);
        return;
      }

      const items = [];
      docs.forEach((snap) => {
        const data = snap.data();
        items.push({ id: snap.ref.id, ...data });
      });

      localStorage.setItem("productsV2", JSON.stringify(items));
      setProducts(items);
      dispatch(setAllProductsV2(items));
      hasFetched.current = true;
      setLoading(false);
    } catch (e) {
      console.log(e);
      setError("Failed to get products");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    } else if (products.length > 0 && reduxProducts.length === 0) {
      dispatch(setAllProductsV2(products));
    }
  }, []);

  useEffect(() => {
    const prev = prevReduxProductsRef.current;
    const curr = reduxProducts;

    if (hasFetched.current && prev !== curr && prev.length > 0) {
      const prevIds = new Set(prev.map((p) => p.id));
      const currIds = new Set(curr.map((p) => p.id));

      const added = curr.filter((p) => !prevIds.has(p.id));
      const removedIds = [...prevIds].filter((id) => !currIds.has(id));

      if (added.length > 0 || removedIds.length > 0) {
        setProducts((prevLocal) => {
          let updated = [...prevLocal];

          added.forEach((p) => {
            if (!updated.find((up) => up.id === p.id)) {
              updated = [...updated, p];
            }
          });

          if (removedIds.length > 0) {
            updated = updated.filter((p) => !removedIds.includes(p.id));
          }

          localStorage.setItem("productsV2", JSON.stringify(updated));
          return updated;
        });
      }

      const currMap = new Map(curr.map((p) => [p.id, p]));
      let hasEdits = false;
      const editedLocal = products.map((p) => {
        const reduxProduct = currMap.get(p.id);
        if (
          reduxProduct &&
          JSON.stringify(reduxProduct) !== JSON.stringify(p)
        ) {
          hasEdits = true;
          return reduxProduct;
        }
        return p;
      });

      if (hasEdits) {
        setProducts((prevLocal) => {
          const updated = prevLocal.map((p) => {
            const reduxProduct = currMap.get(p.id);
            if (
              reduxProduct &&
              JSON.stringify(reduxProduct) !== JSON.stringify(p)
            ) {
              return reduxProduct;
            }
            return p;
          });
          localStorage.setItem("productsV2", JSON.stringify(updated));
          return updated;
        });
      }
    }

    prevReduxProductsRef.current = curr;
  }, [reduxProducts]);

  return {
    products,
    fetchProducts,
    isLoading,
    error,
  };
};

export default useProductsV2;