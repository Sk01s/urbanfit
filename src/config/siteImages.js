import bannerGirl from "@/images/banner-girl.png";
import bannerGirlAlt from "@/images/banner-girl-1.png";
import bannerGuy from "@/images/banner-guy.png";
import defaultAvatar from "@/images/defaultAvatar.svg";
import defaultBanner from "@/images/defaultBanner.jpg";
import logoFull from "@/images/logo-full.png";

export const SITE_IMAGES = [
  {
    key: "nav-women-1",
    label: "Navigation women promo",
    defaultUrl: "/nav-women-1.jpg",
  },
  {
    key: "logo-full",
    label: "Main logo",
    defaultUrl: logoFull,
  },
  {
    key: "preloader-logo",
    label: "Preloader logo",
    defaultUrl: "/static/logo-full.png",
  },
  // {
  //   key: "banner-guy",
  //   label: "Category banner (guy)",
  //   defaultUrl: bannerGuy,
  // },
  // {
  //   key: "banner-girl",
  //   label: "Homepage banner (girl)",
  //   defaultUrl: bannerGirl,
  // },
  // {
  //   key: "banner-girl-alt",
  //   label: "Essentials banner (girl alt)",
  //   defaultUrl: bannerGirlAlt,
  // },
  // {
  //   key: "default-avatar",
  //   label: "Default user avatar",
  //   defaultUrl: defaultAvatar,
  // },
  // {
  //   key: "default-banner",
  //   label: "Default user banner",
  //   defaultUrl: defaultBanner,
  // },
  // {
  //   key: "checkout-creditcards",
  //   label: "Checkout credit cards",
  //   defaultUrl: "/static/creditcards.png",
  //   cssVariable: true,
  // },
  {
    key: "landing-video-1",
    label: "Landing desktop video",
    defaultUrl: "/video-1.mp4",
    mediaType: "video",
  },
  {
    key: "landing-bg",
    label: "Landing background",
    defaultUrl: "/landing-bg.webp",
  },
  {
    key: "mobile-1",
    label: "Landing mobile preview 1",
    defaultUrl: "/mobile-1.jpeg",
  },
  {
    key: "mobile-2",
    label: "Landing mobile preview 2",
    defaultUrl: "/mobile-2.JPG",
  },
  {
    key: "contact-us-banner",
    label: "Contact page banner",
    defaultUrl: "/contact-us.jpg",
  },
  // {
  //   key: "urbanfit-stamp",
  //   label: "Order completed logo stamp",
  //   defaultUrl: "/urbanfitpng-removebg-preview.png",
  // },
  {
    key: "category-card-1",
    label: "Category card 1",
    defaultUrl: "/category-card-1.jpg",
  },
  {
    key: "category-card-2",
    label: "Category card 2",
    defaultUrl: "/category-card-2.jpg",
  },
  {
    key: "category-card-3",
    label: "Category card 3",
    defaultUrl: "/category-card-3.jpg",
  },
  {
    key: "category-card-4",
    label: "Category card 4",
    defaultUrl: "/category-card-4.jpg",
  },
  {
    key: "category-card-5",
    label: "Category card 5",
    defaultUrl: "/category-card-5.jpg",
  },
  {
    key: "category-card-6",
    label: "Category card 6",
    defaultUrl: "/category-card-6.jpg",
  },
  {
    key: "category-card-7",
    label: "Category card 7",
    defaultUrl: "/category-card-7.jpg",
  },
  {
    key: "men-card-1",
    label: "Men collection card 1",
    defaultUrl: "/men-card-1.jpg",
  },
  {
    key: "men-card-2",
    label: "Men collection card 2",
    defaultUrl: "/men-card-2.jpg",
  },
  {
    key: "men-card-3",
    label: "Men collection card 3",
    defaultUrl: "/men-card-3.jpg",
  },
  {
    key: "men-card-4",
    label: "Men collection card 4",
    defaultUrl: "/men-card-4.jpg",
  },
  {
    key: "men-card-5",
    label: "Men collection card 5",
    defaultUrl: "/card-5.jpg",
  },
  {
    key: "women-card-1",
    label: "Women collection card 1",
    defaultUrl: "/women-card-1.jpg",
  },
  {
    key: "women-card-2",
    label: "Women collection card 2",
    defaultUrl: "/women-card-2.jpg",
  },
  {
    key: "women-card-3",
    label: "Women collection card 3",
    defaultUrl: "/women-card-3.jpg",
  },
  {
    key: "women-card-4",
    label: "Women collection card 4",
    defaultUrl: "/women-card-4.jpg",
  },
  {
    key: "women-card-5",
    label: "Women collection card 5",
    defaultUrl: "/women-card-5.png",
  },
  // {
  //   key: "our-story-1",
  //   label: "About page background",
  //   defaultUrl: "/our-story-1.png",
  //   cssVariable: true,
  // },
];

export const SITE_IMAGE_DEFAULTS = SITE_IMAGES.reduce((acc, image) => {
  acc[image.key] = image.defaultUrl;
  return acc;
}, {});

export const getStoredLabelOverlay = (key) => {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const stored = JSON.parse(localStorage.getItem("siteImageLabels") || "{}");
    return stored[key] || null;
  } catch (error) {
    return null;
  }
};

export const getStoredSiteImageUrl = (key) => {
  if (typeof window === "undefined") {
    return SITE_IMAGE_DEFAULTS[key] || "";
  }
  try {
    const stored = JSON.parse(localStorage.getItem("siteImages") || "{}");
    return stored[key] || SITE_IMAGE_DEFAULTS[key] || "";
  } catch (error) {
    return SITE_IMAGE_DEFAULTS[key] || "";
  }
};
