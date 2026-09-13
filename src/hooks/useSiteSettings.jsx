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

export const DEFAULT_WHATSAPP_NUMBER = "96176875941";

export const sanitizeWhatsappNumber = (value = "") =>
  String(value || "").replace(/\D/g, "");

// Format digits for display. Lebanese numbers (961 + 8 digits) render as
// "+961 76 875 941". Others fall back to "+<digits>".
export const formatWhatsappDisplay = (digits = "") => {
  const clean = sanitizeWhatsappNumber(digits);
  if (!clean) return "";
  const lbMatch = clean.match(/^961(\d{2})(\d{3})(\d{3})$/);
  if (lbMatch) {
    return `+961 ${lbMatch[1]} ${lbMatch[2]} ${lbMatch[3]}`;
  }
  return `+${clean}`;
};

export const buildWhatsappLink = (digits = "") => {
  const clean = sanitizeWhatsappNumber(digits);
  if (!clean) return "";
  return `https://api.whatsapp.com/send?phone=${clean}`;
};

const SiteSettingsContext = createContext({
  whatsappNumber: DEFAULT_WHATSAPP_NUMBER,
  whatsappEnabled: true,
  whatsappLink: buildWhatsappLink(DEFAULT_WHATSAPP_NUMBER),
  whatsappDisplay: formatWhatsappDisplay(DEFAULT_WHATSAPP_NUMBER),
  isLoading: false,
  refreshSettings: () => {},
});

const STORAGE_KEY = "siteSettingsGeneral";

export const SiteSettingsProvider = ({ children }) => {
  const getInitialState = () => {
    const fallback = {
      whatsappNumber: DEFAULT_WHATSAPP_NUMBER,
      whatsappEnabled: true,
    };
    if (typeof window === "undefined") return fallback;
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      return {
        whatsappNumber:
          sanitizeWhatsappNumber(stored.whatsappNumber) ||
          DEFAULT_WHATSAPP_NUMBER,
        whatsappEnabled: stored.whatsappEnabled !== false,
      };
    } catch (error) {
      return fallback;
    }
  };

  const [settings, setSettings] = useState(getInitialState);
  const [isLoading, setIsLoading] = useState(true);

  const loadSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const snapshot = await firebase.getGeneralSettings();
      if (snapshot.exists) {
        const data = snapshot.data() || {};
        const next = {
          whatsappNumber:
            sanitizeWhatsappNumber(data.whatsappNumber) ||
            DEFAULT_WHATSAPP_NUMBER,
          whatsappEnabled: data.whatsappEnabled !== false,
        };
        setSettings(next);
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        }
      }
    } catch (err) {
      console.error("Failed to load site settings:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const value = useMemo(
    () => ({
      whatsappNumber: settings.whatsappNumber,
      whatsappEnabled: settings.whatsappEnabled,
      whatsappLink: buildWhatsappLink(settings.whatsappNumber),
      whatsappDisplay: formatWhatsappDisplay(settings.whatsappNumber),
      isLoading,
      refreshSettings: loadSettings,
    }),
    [settings, isLoading, loadSettings]
  );

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

SiteSettingsProvider.propTypes = {
  children: PropType.node.isRequired,
};

export const useSiteSettings = () => useContext(SiteSettingsContext);
