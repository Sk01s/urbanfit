import { useCallback, useEffect, useMemo, useState } from "react";
import firebase from "@/services/firebase";

const FALLBACK_TYPES = [
  { id: "t-shrit", name: "T-shrit", categories: "Tops", sex: ["men", "women"], order: 1 },
  { id: "hoodies-sweatshrits", name: "Hoodies & Sweatshrits", categories: "Tops", sex: ["men", "women"], order: 2 },
  { id: "sweatpants-pants", name: "Sweatpants & Pants", categories: "Bottoms", sex: ["men", "women"], order: 3 },
  { id: "leggings", name: "Leggings", categories: "Bottoms", sex: ["women"], order: 4 },
  { id: "active-wear", name: "Active wear", categories: "Active", sex: ["women"], order: 5 },
];

let typesCache = null;

const useTypes = () => {
  const [types, setTypes] = useState(typesCache || FALLBACK_TYPES);
  const [isLoading, setIsLoading] = useState(!typesCache);

  const fetchTypes = useCallback(async () => {
    setIsLoading(true);
    try {
      const snapshot = await firebase.getTypes();
      if (snapshot.empty) {
        setTypes(FALLBACK_TYPES);
        typesCache = FALLBACK_TYPES;
      } else {
        const items = [];
        snapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() });
        });
        items.sort((a, b) => (a.order || 99) - (b.order || 99));
        setTypes(items);
        typesCache = items;
      }
    } catch (err) {
      console.error("Failed to load types:", err);
      setTypes(FALLBACK_TYPES);
      typesCache = FALLBACK_TYPES;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!typesCache) {
      fetchTypes();
    }
  }, [fetchTypes]);

  const slugify = (name) =>
    name.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "-");

  const typesForSex = useCallback(
    (sex) => types.filter((t) => t.sex && t.sex.includes(sex)),
    [types]
  );

  const typeOptions = useMemo(
    () =>
      types.map((t) => ({
        value: { categories: t.categories, name: t.name },
        label: t.name,
      })),
    [types]
  );

  return { types, isLoading, fetchTypes, typesForSex, slugify, typeOptions };
};

export default useTypes;