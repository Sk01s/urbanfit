// Meta (Facebook) Pixel helper for Urbanfit SPA.
// Centralizes fbq access so events are safe when ad-blockers / SSR / missing ID.

export const getMetaPixelId = () => {
  // Runtime override (e.g. set in console / tag manager) takes precedence,
  // then Vite build-time env, then placeholder.
  if (typeof window !== "undefined" && window.__META_PIXEL_ID__) {
    return String(window.__META_PIXEL_ID__).trim();
  }
  const envId = import.meta.env.VITE_META_PIXEL_ID;
  if (envId && !String(envId).includes("VITE_META_PIXEL_ID")) {
    return String(envId).trim();
  }
  return "YOUR_PIXEL_ID";
};

export const META_PIXEL_ID = getMetaPixelId();

export const isPixelConfigured = () => {
  const id = getMetaPixelId();
  if (!id) return false;
  if (id.includes("VITE_META_PIXEL_ID")) return false;
  if (id === "YOUR_PIXEL_ID") return false;
  return /^\d+$/.test(id);
};

const getFbq = () => {
  if (typeof window === "undefined") return null;
  return window.fbq || null;
};

// Initialise the pixel at runtime (SPA safety net in addition to index.html base code).
// Safe to call multiple times.
export const initMetaPixel = () => {
  const pixelId = getMetaPixelId();
  if (!isPixelConfigured()) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.warn(
        "[MetaPixel] VITE_META_PIXEL_ID is not set — pixel events skipped."
      );
    }
    return false;
  }
  const fbq = getFbq();
  if (!fbq) return false;
  try {
    fbq("init", pixelId);
  } catch (e) {
    // ignore — base snippet queues calls
  }
  return true;
};

export const trackPageView = () => {
  const fbq = getFbq();
  if (!fbq) return;
  try {
    fbq("track", "PageView");
  } catch (e) {
    // ignore
  }
};

export const trackMetaEvent = (eventName, params = {}) => {
  const fbq = getFbq();
  if (!fbq) return;
  try {
    if (params && Object.keys(params).length > 0) {
      fbq("track", eventName, params);
    } else {
      fbq("track", eventName);
    }
  } catch (e) {
    // ignore
  }
};

// ---- Standard e-commerce events (Meta naming) ----

export const trackViewContent = (product) => {
  if (!product) return;
  const price = Number(product.price) || 0;
  trackMetaEvent("ViewContent", {
    content_ids: [product.id],
    content_type: "product",
    content_name: product.name,
    value: price,
    currency: "USD",
  });
};

export const trackAddToCart = (product, quantity = 1) => {
  if (!product) return;
  const price = Number(
    product.onSale && product.percentage
      ? Number(product.price) * (1 - Number(product.percentage) / 100)
      : product.price
  );
  trackMetaEvent("AddToCart", {
    content_ids: [product.id],
    content_type: "product",
    content_name: product.name,
    value: price * (quantity || 1),
    currency: "USD",
  });
};

export const trackAddToWishlist = (product) => {
  if (!product) return;
  trackMetaEvent("AddToWishlist", {
    content_ids: [product.id],
    content_type: "product",
    content_name: product.name,
    value: Number(product.price) || 0,
    currency: "USD",
  });
};

export const trackInitiateCheckout = (basket = [], subtotal = 0) => {
  trackMetaEvent("InitiateCheckout", {
    content_ids: (basket || []).map((p) => p.id),
    num_items: (basket || []).length,
    value: Number(subtotal) || 0,
    currency: "USD",
  });
};

export const trackPurchase = (order = {}, valueOverride) => {
  const items = order.items || order.basket || [];
  const value =
    typeof valueOverride === "number"
      ? valueOverride
      : Number(order.total || order.subtotal || 0) || 0;
  trackMetaEvent("Purchase", {
    content_ids: items.map((p) => p.id),
    content_type: "product",
    num_items: items.length,
    value,
    currency: "USD",
  });
};

export const trackCompleteRegistration = () => {
  trackMetaEvent("CompleteRegistration");
};

export const trackSearch = (searchString) => {
  trackMetaEvent("Search", {
    search_string: searchString || "",
  });
};

export const trackContact = () => {
  trackMetaEvent("Contact");
};
