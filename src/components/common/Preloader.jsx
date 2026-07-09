import React from "react";
import { getStoredSiteImageUrl, getStoredLabelOverlay } from "@/config/siteImages";
import SiteImageLabel from "./SiteImageLabel";

const Preloader = () => {
  const logoLabel = getStoredLabelOverlay("preloader-logo");
  return (
    <div className="preloader">
      <svg className="logo-symbol" viewBox="0 0 41.25 41.25">
        <circle cx="20.62" cy="20.62" r="20.62" />
        <circle className="fill-white" cx="29.97" cy="14.93" r="6.58" />
      </svg>
      <div style={{ position: "relative", display: "inline-block" }}>
        <img alt="Urbanfit logo" src={getStoredSiteImageUrl("preloader-logo")} />
        <SiteImageLabel labelOverlay={logoLabel} />
      </div>
    </div>
  );
};

export default Preloader;
