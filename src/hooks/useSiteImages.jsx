import PropType from "prop-types";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import firebase from "@/services/firebase";
import { SITE_IMAGES, SITE_IMAGE_DEFAULTS } from "@/config/siteImages";

const SiteImagesContext = createContext({
  images: SITE_IMAGE_DEFAULTS,
  isLoading: false,
  error: null,
  getImageUrl: () => "",
  updateImage: () => {},
  refreshImages: () => {},
});

export const SiteImagesProvider = ({ children }) => {
  const getInitialImages = () => {
    if (typeof window === "undefined") {
      return SITE_IMAGE_DEFAULTS;
    }
    try {
      const stored = JSON.parse(localStorage.getItem("siteImages") || "{}");
      return {
        ...SITE_IMAGE_DEFAULTS,
        ...stored,
      };
    } catch (error) {
      return SITE_IMAGE_DEFAULTS;
    }
  };

  const [images, setImages] = useState(getInitialImages);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const applyCssVariables = useCallback((nextImages) => {
    SITE_IMAGES.filter((image) => image.cssVariable).forEach(({ key }) => {
      const url = nextImages[key] || SITE_IMAGE_DEFAULTS[key];
      if (url) {
        document.documentElement.style.setProperty(
          `--site-image-${key}`,
          `url("${url}")`
        );
      }
    });
  }, []);

  const loadImages = useCallback(async () => {
    setIsLoading(true);
    try {
      const snapshot = await firebase.getSiteImages();
      const loadedImages = {};
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data?.url) {
          loadedImages[doc.id] = data.url;
        }
      });
      setImages((prev) => {
        const mergedImages = {
          ...SITE_IMAGE_DEFAULTS,
          ...prev,
          ...loadedImages,
        };
        if (typeof window !== "undefined") {
          localStorage.setItem("siteImages", JSON.stringify(mergedImages));
        }
        return mergedImages;
      });
      setError(null);
    } catch (err) {
      setError(err?.message || "Failed to load site images.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  useEffect(() => {
    applyCssVariables(images);
  }, [applyCssVariables, images]);

  const updateImage = useCallback((key, url) => {
    setImages((prev) => {
      const next = {
        ...prev,
        [key]: url,
      };
      if (typeof window !== "undefined") {
        localStorage.setItem("siteImages", JSON.stringify(next));
      }
      return next;
    });
  }, []);

  const getImageUrl = useCallback(
    (key) => images[key] || SITE_IMAGE_DEFAULTS[key] || "",
    [images]
  );

  const value = useMemo(
    () => ({
      images,
      isLoading,
      error,
      getImageUrl,
      updateImage,
      refreshImages: loadImages,
    }),
    [error, getImageUrl, images, isLoading, loadImages, updateImage]
  );

  return (
    <SiteImagesContext.Provider value={value}>
      {children}
    </SiteImagesContext.Provider>
  );
};

SiteImagesProvider.propTypes = {
  children: PropType.node.isRequired,
};

export const useSiteImages = () => useContext(SiteImagesContext);
