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

const DEFAULT_LABEL = {
  enabled: false,
  text: "",
  position: { x: 50, y: 90 },
  style: {
    color: "#ffffff",
    fontSize: 16,
    bgColor: "#000000",
    bgOpacity: 0.7,
  },
};

const FALLBACK_SLIDES = [
  {
    id: "__fallback_1",
    order: 0,
    desktopUrl: "/video-1.mp4",
    mobileUrl: "/mobile-1.jpeg",
    desktopMediaType: "video",
    mobileMediaType: "image",
    label: { ...DEFAULT_LABEL },
    visible: true,
    publishedDesktopUrl: "/video-1.mp4",
    publishedMobileUrl: "/mobile-1.jpeg",
    publishedDesktopMediaType: "video",
    publishedMobileMediaType: "image",
    publishedLabel: { ...DEFAULT_LABEL },
    publishedVisible: true,
    publishedOrder: 0,
    hasDraftChanges: false,
  },
  {
    id: "__fallback_2",
    order: 1,
    desktopUrl: "/landing-bg.webp",
    mobileUrl: "/mobile-2.JPG",
    desktopMediaType: "image",
    mobileMediaType: "image",
    label: { ...DEFAULT_LABEL },
    visible: true,
    publishedDesktopUrl: "/landing-bg.webp",
    publishedMobileUrl: "/mobile-2.JPG",
    publishedDesktopMediaType: "image",
    publishedMobileMediaType: "image",
    publishedLabel: { ...DEFAULT_LABEL },
    publishedVisible: true,
    publishedOrder: 1,
    hasDraftChanges: false,
  },
];

const LandingSlidesContext = createContext({
  slides: [],
  publishedSlides: [],
  isLoading: false,
  error: null,
  addSlide: () => {},
  updateSlide: () => {},
  deleteSlide: () => {},
  reorderSlides: () => {},
  publishChanges: () => {},
  refreshSlides: () => {},
  hasAnyDraftChanges: false,
});

export const LandingSlidesProvider = ({ children }) => {
  const [slides, setSlides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSlides = useCallback(async () => {
    setIsLoading(true);
    try {
      const snapshot = await firebase.getLandingSlides();
      const loaded = [];
      snapshot.forEach((doc) => {
        loaded.push({ id: doc.id, ...doc.data() });
      });
      loaded.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      if (loaded.length === 0) {
        setSlides(FALLBACK_SLIDES);
      } else {
        setSlides(loaded);
      }
      setError(null);
    } catch (err) {
      setError(err?.message || "Failed to load landing slides.");
      setSlides(FALLBACK_SLIDES);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSlides();
  }, [loadSlides]);

  const addSlide = useCallback(async (slideData) => {
    const maxOrder = slides.reduce(
      (max, s) => Math.max(max, s.order ?? 0),
      -1
    );
    const newSlide = {
      order: maxOrder + 1,
      desktopUrl: "",
      mobileUrl: "",
      desktopMediaType: "image",
      mobileMediaType: "image",
      label: { ...DEFAULT_LABEL },
      visible: true,
      publishedDesktopUrl: "",
      publishedMobileUrl: "",
      publishedDesktopMediaType: "image",
      publishedMobileMediaType: "image",
      publishedLabel: { ...DEFAULT_LABEL },
      publishedVisible: true,
      publishedOrder: maxOrder + 1,
      hasDraftChanges: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      ...slideData,
    };

    const docRef = await firebase.addLandingSlide(newSlide);
    setSlides((prev) => [...prev, { id: docRef.id, ...newSlide }]);
    return docRef.id;
  }, [slides]);

  const updateSlide = useCallback(async (id, data) => {
    const updateData = { ...data, updatedAt: Date.now(), hasDraftChanges: true };
    await firebase.updateLandingSlide(id, updateData);
    setSlides((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updateData } : s))
    );
  }, []);

  const deleteSlide = useCallback(async (id) => {
    await firebase.deleteLandingSlide(id);
    setSlides((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const reorderSlides = useCallback(async (orderedIds) => {
    await firebase.reorderLandingSlides(orderedIds);
    setSlides((prev) => {
      const map = {};
      prev.forEach((s) => {
        map[s.id] = s;
      });
      return orderedIds.map((id, index) => ({
        ...map[id],
        order: index,
        hasDraftChanges: true,
      }));
    });
  }, []);

  const publishChanges = useCallback(async () => {
    await firebase.publishLandingSlides();
    setSlides((prev) =>
      prev.map((s) => ({
        ...s,
        publishedDesktopUrl: s.desktopUrl,
        publishedMobileUrl: s.mobileUrl,
        publishedDesktopMediaType: s.desktopMediaType || "image",
        publishedMobileMediaType: s.mobileMediaType || "image",
        publishedLabel: s.label || { ...DEFAULT_LABEL },
        publishedVisible: s.visible !== undefined ? s.visible : true,
        publishedOrder: s.order ?? 0,
        hasDraftChanges: false,
      }))
    );
  }, []);

  const publishSlide = useCallback(async (id) => {
    const slide = slides.find((s) => s.id === id);
    if (!slide) return;
    const updateData = {
      publishedDesktopUrl: slide.desktopUrl,
      publishedMobileUrl: slide.mobileUrl,
      publishedDesktopMediaType: slide.desktopMediaType || "image",
      publishedMobileMediaType: slide.mobileMediaType || "image",
      publishedLabel: slide.label || { ...DEFAULT_LABEL },
      publishedVisible: slide.visible !== undefined ? slide.visible : true,
      publishedOrder: slide.order ?? 0,
      hasDraftChanges: false,
      updatedAt: Date.now(),
    };
    await firebase.updateLandingSlide(id, updateData);
    setSlides((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updateData } : s))
    );
  }, [slides]);

  const publishedSlides = useMemo(
    () =>
      slides
        .filter((s) => s.publishedVisible !== false && s.publishedDesktopUrl)
        .sort(
          (a, b) => (a.publishedOrder ?? 0) - (b.publishedOrder ?? 0)
        ),
    [slides]
  );

  const draftSlides = useMemo(
    () =>
      slides
        .filter((s) => s.desktopUrl)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [slides]
  );

  const hasAnyDraftChanges = useMemo(
    () => slides.some((s) => s.hasDraftChanges),
    [slides]
  );

  const value = useMemo(
    () => ({
      slides,
      publishedSlides,
      draftSlides,
      isLoading,
      error,
      addSlide,
      updateSlide,
      deleteSlide,
      reorderSlides,
      publishChanges,
      publishSlide,
      refreshSlides: loadSlides,
      hasAnyDraftChanges,
    }),
    [
      slides,
      publishedSlides,
      draftSlides,
      isLoading,
      error,
      addSlide,
      updateSlide,
      deleteSlide,
      reorderSlides,
      publishChanges,
      publishSlide,
      loadSlides,
      hasAnyDraftChanges,
    ]
  );

  return (
    <LandingSlidesContext.Provider value={value}>
      {children}
    </LandingSlidesContext.Provider>
  );
};

LandingSlidesProvider.propTypes = {
  children: PropType.node.isRequired,
};

export const useLandingSlides = () => useContext(LandingSlidesContext);