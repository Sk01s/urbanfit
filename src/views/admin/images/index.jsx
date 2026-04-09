import { Boundary } from "@/components/common";
import { SITE_IMAGES, SITE_IMAGE_DEFAULTS } from "@/config/siteImages";
import { displayActionMessage } from "@/helpers/utils";
import { useDocumentTitle, useScrollTop, useSiteImages } from "@/hooks";
import firebase from "@/services/firebase";
import React, { useEffect, useState, useCallback } from "react";

const AdminImages = () => {
  useDocumentTitle("Media Library | Urbanfit Admin");
  useScrollTop();
  const { getImageUrl, isLoading, refreshImages, updateImage, deleteImage } =
    useSiteImages();
  const [uploadingKey, setUploadingKey] = useState("");
  const [deletingKey, setDeletingKey] = useState("");
  const [activeFilter, setActiveFilter] = useState("image");
  const [imageVersions, setImageVersions] = useState({});
  const [imageDimensions, setImageDimensions] = useState({});

  useEffect(() => {
    refreshImages();
  }, [refreshImages]);

  // Load image dimensions when images change
  const loadImageDimensions = useCallback((key, url) => {
    if (!url) return;
    
    const img = new Image();
    img.onload = () => {
      setImageDimensions((prev) => ({
        ...prev,
        [key]: { width: img.naturalWidth, height: img.naturalHeight },
      }));
    };
    img.onerror = () => {
      setImageDimensions((prev) => ({
        ...prev,
        [key]: null,
      }));
    };
    img.src = url;
  }, []);

  // Load dimensions for all images when component mounts or images change
  useEffect(() => {
    SITE_IMAGES.forEach((asset) => {
      if (asset.mediaType !== "video") {
        const url = getImageUrl(asset.key);
        if (url) {
          loadImageDimensions(asset.key, url);
        }
      }
    });
  }, [getImageUrl, loadImageDimensions, imageVersions]);

  // Generate a cache-busting URL for an image
  const getCacheBustedUrl = useCallback(
    (key) => {
      const baseUrl = getImageUrl(key);
      if (!baseUrl) return "";
      const version = imageVersions[key] || "";
      if (version && !baseUrl.includes("?")) {
        return `${baseUrl}?v=${version}`;
      } else if (version) {
        return `${baseUrl}&v=${version}`;
      }
      return baseUrl;
    },
    [getImageUrl, imageVersions]
  );

  // Check if the current URL is a custom upload (not the default)
  const isCustomUpload = useCallback(
    (key) => {
      const currentUrl = getImageUrl(key);
      const defaultUrl = SITE_IMAGE_DEFAULTS[key];
      return currentUrl && currentUrl !== defaultUrl;
    },
    [getImageUrl]
  );

  const handleUpload = async (event, image) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadingKey(image.key);
    try {
      const url = await firebase.storeSiteImage(image.key, file, true);
      const updatedAt = Date.now();
      await firebase.setSiteImage(image.key, {
        url,
        label: image.label,
        updatedAt,
      });
      updateImage(image.key, url);
      // Force cache bust by updating version
      setImageVersions((prev) => ({
        ...prev,
        [image.key]: Date.now(),
      }));
      // Reload dimensions for the new image
      loadImageDimensions(image.key, url);
      displayActionMessage(`${image.label} updated.`, "success");
    } catch (error) {
      displayActionMessage(
        error?.message || "Failed to update site image.",
        "error"
      );
    } finally {
      setUploadingKey("");
      event.target.value = "";
    }
  };

  const handleDelete = async (image) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${image.label}" from cloud storage? This will revert to the default image.`
      )
    ) {
      return;
    }

    setDeletingKey(image.key);
    try {
      await deleteImage(image.key);
      // Force cache bust
      setImageVersions((prev) => ({
        ...prev,
        [image.key]: Date.now(),
      }));
      displayActionMessage(
        `${image.label} deleted. Reverted to default.`,
        "success"
      );
    } catch (error) {
      displayActionMessage(
        error?.message || "Failed to delete image.",
        "error"
      );
    } finally {
      setDeletingKey("");
    }
  };

  const handleViewOriginal = (key) => {
    const url = getImageUrl(key);
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Boundary>
      <div
        className="product-admin-header"
        style={{ justifyContent: "space-between" }}
      >
        <div>
          <h3 className="product-admin-header-title">Media Library</h3>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            type="button"
            onClick={() => setActiveFilter("image")}
            className={`button button-small ${
              activeFilter === "image" ? "" : "button-muted"
            }`}
          >
            Images
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("video")}
            className={`button button-small ${
              activeFilter === "video" ? "" : "button-muted"
            }`}
          >
            Videos
          </button>
        </div>
      </div>
      <div className="product-admin-items">
        {isLoading ? (
          <div className="loader">
            <h3>Loading images...</h3>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "2rem",
            }}
          >
            {SITE_IMAGES.filter((asset) => {
              const assetType = asset.mediaType || "image";
              return assetType === activeFilter;
            }).map((asset) => (
              <div
                key={asset.key}
                style={{
                  border: "1px solid #e5e5e5",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  backgroundColor: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 600 }}>{asset.label}</span>
                  {asset.mediaType !== "video" && imageDimensions[asset.key] && (
                    <span
                      style={{
                        fontSize: "1.1rem",
                        color: "#555",
                        backgroundColor: "#f0f0f0",
                        padding: "2px 8px",
                        borderRadius: "4px",
                      }}
                    >
                      {imageDimensions[asset.key].width} x {imageDimensions[asset.key].height}
                    </span>
                  )}
                </div>
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "4 / 3",
                    borderRadius: "8px",
                    overflow: "hidden",
                    backgroundColor: "#f5f5f5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  {activeFilter === "video" ? (
                    <video
                      controls
                      src={getCacheBustedUrl(asset.key)}
                      style={{ width: "100%", height: "100%" }}
                    />
                  ) : (
                    <img
                      src={getCacheBustedUrl(asset.key)}
                      alt={asset.label}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  )}
                  {/* View Original Button Overlay */}
                  <button
                    type="button"
                    onClick={() => handleViewOriginal(asset.key)}
                    style={{
                      position: "absolute",
                      top: "8px",
                      right: "8px",
                      background: "rgba(0, 0, 0, 0.6)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      padding: "4px 8px",
                      fontSize: "1.1rem",
                      cursor: "pointer",
                    }}
                    title="View original size"
                  >
                    View Original
                  </button>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "0.5rem",
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <label
                      className="button button-small"
                      style={{ cursor: "pointer", marginBottom: 0 }}
                    >
                      {uploadingKey === asset.key ? "Uploading..." : "Replace"}
                      <input
                        type="file"
                        accept={activeFilter === "video" ? "video/*" : "image/*"}
                        disabled={uploadingKey === asset.key}
                        onChange={(event) => handleUpload(event, asset)}
                        style={{ display: "none" }}
                      />
                    </label>
                    {isCustomUpload(asset.key) && (
                      <button
                        type="button"
                        className="button button-small"
                        style={{
                          backgroundColor: "#dc3545",
                          color: "#fff",
                          border: "none",
                          cursor:
                            deletingKey === asset.key
                              ? "not-allowed"
                              : "pointer",
                          opacity: deletingKey === asset.key ? 0.7 : 1,
                        }}
                        disabled={deletingKey === asset.key}
                        onClick={() => handleDelete(asset)}
                      >
                        {deletingKey === asset.key ? "Deleting..." : "Delete"}
                      </button>
                    )}
                  </div>
                  <span style={{ fontSize: "1.2rem", color: "#777" }}>
                    {asset.key}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Boundary>
  );
};

export default AdminImages;
