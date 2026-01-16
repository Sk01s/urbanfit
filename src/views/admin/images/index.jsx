import { Boundary } from "@/components/common";
import { SITE_IMAGES } from "@/config/siteImages";
import { displayActionMessage } from "@/helpers/utils";
import { useDocumentTitle, useScrollTop, useSiteImages } from "@/hooks";
import firebase from "@/services/firebase";
import React, { useEffect, useState } from "react";

const AdminImages = () => {
  useDocumentTitle("Media Library | Urbanfit Admin");
  useScrollTop();
  const { getImageUrl, isLoading, refreshImages, updateImage } =
    useSiteImages();
  const [uploadingKey, setUploadingKey] = useState("");
  const [activeFilter, setActiveFilter] = useState("image");

  useEffect(() => {
    refreshImages();
  }, [refreshImages]);

  const handleUpload = async (event, image) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadingKey(image.key);
    try {
      const url = await firebase.storeSiteImage(image.key, file);
      const updatedAt = Date.now();
      await firebase.setSiteImage(image.key, {
        url,
        label: image.label,
        updatedAt,
      });
      updateImage(image.key, url);
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
                <div style={{ fontWeight: 600 }}>{asset.label}</div>
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
                  }}
                >
                  {activeFilter === "video" ? (
                    <video
                      controls
                      src={getImageUrl(asset.key)}
                      style={{ width: "100%", height: "100%" }}
                    />
                  ) : (
                    <img
                      src={getImageUrl(asset.key)}
                      alt={asset.label}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "1rem",
                  }}
                >
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
