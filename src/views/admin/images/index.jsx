import { EditOutlined, CloseOutlined } from "@ant-design/icons";
import { Boundary } from "@/components/common";
import { SITE_IMAGES, SITE_IMAGE_DEFAULTS } from "@/config/siteImages";
import { displayActionMessage } from "@/helpers/utils";
import { useDocumentTitle, useScrollTop, useSiteImages } from "@/hooks";
import firebase from "@/services/firebase";
import React, { useEffect, useState, useCallback } from "react";
import LabelEditor from "./LabelEditor";
import SlideManager from "./SlideManager";

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
  const [labelOverlays, setLabelOverlays] = useState({});
  const [editingLabelKey, setEditingLabelKey] = useState(null);
  const [localLabel, setLocalLabel] = useState(null);
  const [savingLabel, setSavingLabel] = useState("");

  useEffect(() => {
    refreshImages();
  }, [refreshImages]);

  useEffect(() => {
    const loadLabelOverlays = async () => {
      try {
        const snapshot = await firebase.getSiteImages();
        const overlays = {};
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.labelOverlay) {
            overlays[doc.id] = data.labelOverlay;
          }
        });
        setLabelOverlays(overlays);
      } catch (error) {
        console.error("Failed to load label overlays:", error);
      }
    };
    loadLabelOverlays();
  }, []);

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

  const handleEditLabel = (key) => {
    const existing = labelOverlays[key] || null;
    setLocalLabel(
      existing ? JSON.parse(JSON.stringify(existing)) : { enabled: false, text: "", position: { x: 50, y: 90 }, style: { color: "#ffffff", fontSize: 16, bgColor: "#000000", bgOpacity: 0.7 } }
    );
    setEditingLabelKey(key);
  };

  const handleLabelSave = async () => {
    if (!editingLabelKey || !localLabel) return;
    setSavingLabel(editingLabelKey);
    try {
      await firebase.setSiteImage(editingLabelKey, { labelOverlay: localLabel });
      setLabelOverlays((prev) => ({
        ...prev,
        [editingLabelKey]: localLabel,
      }));
      displayActionMessage("Label saved.", "success");
    } catch (error) {
      displayActionMessage(error?.message || "Failed to save label.", "error");
    } finally {
      setSavingLabel("");
      setEditingLabelKey(null);
      setLocalLabel(null);
    }
  };

  const hexToRgb = (hex) => {
    if (!hex || typeof hex !== "string" || !hex.startsWith("#") || hex.length < 7) return { r: 0, g: 0, b: 0 };
    return {
      r: parseInt(hex.slice(1, 3), 16) || 0,
      g: parseInt(hex.slice(3, 5), 16) || 0,
      b: parseInt(hex.slice(5, 7), 16) || 0,
    };
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
          <button
            type="button"
            onClick={() => setActiveFilter("landing-slides")}
            className={`button button-small ${
              activeFilter === "landing-slides" ? "" : "button-muted"
            }`}
          >
            Landing Slides
          </button>
        </div>
      </div>
      <div className="product-admin-items">
        {activeFilter === "landing-slides" ? (
          <SlideManager />
        ) : isLoading ? (
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
                  {labelOverlays[asset.key]?.enabled && labelOverlays[asset.key]?.text && (() => {
                    const lbl = labelOverlays[asset.key];
                    const { r, g, b } = hexToRgb(lbl.style?.bgColor);
                    const opacity = lbl.style?.bgOpacity ?? 0.7;
                    return (
                      <div
                        style={{
                          position: "absolute",
                          left: `${lbl.position?.x ?? 50}%`,
                          top: `${lbl.position?.y ?? 90}%`,
                          transform: "translate(-50%, -50%)",
                          color: lbl.style?.color || "#ffffff",
                          fontSize: `${lbl.style?.fontSize || 16}px`,
                          backgroundColor: `rgba(${r}, ${g}, ${b}, ${opacity})`,
                          padding: "4px 12px",
                          borderRadius: "4px",
                          whiteSpace: "nowrap",
                          pointerEvents: "none",
                          fontWeight: 600,
                          zIndex: 5,
                        }}
                      >
                        {lbl.text}
                      </div>
                    );
                  })()}
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
                    <button
                      type="button"
                      onClick={() => handleEditLabel(asset.key)}
                      disabled={savingLabel === asset.key}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        padding: "4px 12px",
                        borderRadius: "20px",
                        border: `2px solid ${labelOverlays[asset.key]?.enabled ? "#722ed1" : "#adb5bd"}`,
                        backgroundColor: labelOverlays[asset.key]?.enabled ? "#722ed1" : "transparent",
                        color: labelOverlays[asset.key]?.enabled ? "#fff" : "#6c757d",
                        fontSize: "1.2rem",
                        fontWeight: 600,
                        cursor: savingLabel === asset.key ? "not-allowed" : "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <EditOutlined /> {savingLabel === asset.key ? "Saving..." : "Label"}
                    </button>
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
      {/* Label Editor Modal */}
      {editingLabelKey && localLabel && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => { setEditingLabelKey(null); setLocalLabel(null); }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              padding: "2rem",
              maxWidth: "700px",
              width: "90%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ margin: 0, fontSize: "1.6rem" }}>Label Settings</h3>
              <button type="button" onClick={() => { setEditingLabelKey(null); setLocalLabel(null); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.8rem", color: "#666" }}>
                <CloseOutlined />
              </button>
            </div>
            <LabelEditor
              label={localLabel}
              onChange={(newLabel) => setLocalLabel(newLabel)}
              previewImageUrl={getCacheBustedUrl(editingLabelKey)}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1.5rem" }}>
              <button type="button" onClick={() => { setEditingLabelKey(null); setLocalLabel(null); }} className="button button-small" style={{ border: "1px solid #ccc" }}>
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLabelSave}
                disabled={savingLabel === editingLabelKey}
                className="button button-small"
                style={{ backgroundColor: "#28a745", color: "#fff", border: "none", cursor: savingLabel === editingLabelKey ? "not-allowed" : "pointer", opacity: savingLabel === editingLabelKey ? 0.7 : 1 }}
              >
                {savingLabel === editingLabelKey ? "Saving..." : "Save Label"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Boundary>
  );
};

export default AdminImages;
