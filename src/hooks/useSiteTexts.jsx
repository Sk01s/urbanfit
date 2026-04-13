import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import firebase from "@/services/firebase";

const DEFAULT_TITLES = {
  "cool-men": "Weekend cool",
  "luxury-men": "Luxury Layers",
  "luxury-women": "Timeless Luxury",
  "new-none": "Just Landed",
  "new-women": "Comfort Sets",
  "best-seller": "Best Seller",
  "essential": "Essentials",
};

const SiteTextsContext = createContext({
  categoryTitles: DEFAULT_TITLES,
  isLoading: false,
  getCategoryTitle: () => "",
  refreshTitles: () => {},
});

export const SiteTextsProvider = ({ children }) => {
  const [categoryTitles, setCategoryTitles] = useState(DEFAULT_TITLES);
  const [isLoading, setIsLoading] = useState(true);

  const loadTitles = useCallback(async () => {
    setIsLoading(true);
    try {
      const snapshot = await firebase.getCategoryPages();
      const titles = {};
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data?.title) {
          titles[doc.id] = data.title;
        }
      });
      setCategoryTitles((prev) => ({
        ...DEFAULT_TITLES,
        ...prev,
        ...titles,
      }));
    } catch (err) {
      console.error("Failed to load category page titles:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTitles();
  }, [loadTitles]);

  const getCategoryTitle = useCallback(
    (key) => categoryTitles[key] || DEFAULT_TITLES[key] || "",
    [categoryTitles]
  );

  const value = useMemo(
    () => ({
      categoryTitles,
      isLoading,
      getCategoryTitle,
      refreshTitles: loadTitles,
    }),
    [categoryTitles, isLoading, getCategoryTitle, loadTitles]
  );

  return (
    <SiteTextsContext.Provider value={value}>
      {children}
    </SiteTextsContext.Provider>
  );
};

export const useSiteTexts = () => useContext(SiteTextsContext);