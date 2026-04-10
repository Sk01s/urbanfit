import React, { useState } from "react";
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  DeleteOutlined,
  EditOutlined,
  CheckOutlined,
  DownOutlined,
  UpOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import { displayActionMessage } from "@/helpers/utils";
import firebase from "@/services/firebase";
import LabelEditor from "./LabelEditor";

const SlideCard = ({ slide, onUpdate, onDelete, uploadingKey, setUploadingKey, onMoveUp, onMoveDown, isFirst, isLast }) => {
  const [expanded, setExpanded] = useState(false);
  const [labelExpanded, setLabelExpanded] = useState(false);
  const [saving, setSaving] = useState(false);

  const desktopPreview = slide.desktopUrl || "";
  const mobilePreview = slide.mobileUrl || "";

  const handleVisibilityToggle = async () => {
    try {
      await onUpdate(slide.id, { visible: !slide.visible });
    } catch (err) {
      displayActionMessage("Failed to update visibility.", "error");
    }
  };

  const handleMediaTypeChange = async (field, value) => {
    try {
      await onUpdate(slide.id, { [field]: value });
    } catch (err) {
      displayActionMessage("Failed to update media type.", "error");
    }
  };

  const handleUpload = async (e, field, mediaTypeField) => {
    const file = e.target.files[0];
    if (!file) return;

    const key = `${slide.id}-${field}`;
    setUploadingKey(key);
    try {
      const url = await firebase.storeSiteImage(`landing-slide-${slide.id}-${field}`, file, true);
      const updates = { [field]: url };
      if (mediaTypeField && file.type.startsWith("video/")) {
        updates[mediaTypeField] = "video";
      } else if (mediaTypeField && file.type.startsWith("image/")) {
        updates[mediaTypeField] = "image";
      }
      await onUpdate(slide.id, updates);
      displayActionMessage("Media uploaded.", "success");
    } catch (err) {
      displayActionMessage(err?.message || "Failed to upload.", "error");
    } finally {
      setUploadingKey("");
      e.target.value = "";
    }
  };

  const handleLabelChange = async (newLabel) => {
    try {
      await onUpdate(slide.id, { label: newLabel });
    } catch (err) {
      displayActionMessage("Failed to update label.", "error");
    }
  };

  const handlePublish = async () => {
    setSaving(true);
    try {
      const slideData = {
        publishedDesktopUrl: slide.desktopUrl,
        publishedMobileUrl: slide.mobileUrl,
        publishedDesktopMediaType: slide.desktopMediaType || "image",
        publishedMobileMediaType: slide.mobileMediaType || "image",
        publishedLabel: slide.label || { enabled: false, text: "", position: { x: 50, y: 90 }, style: { color: "#fff", fontSize: 16, bgColor: "#000", bgOpacity: 0.7 } },
        publishedVisible: slide.visible !== undefined ? slide.visible : true,
        publishedOrder: slide.order ?? 0,
        hasDraftChanges: false,
      };

      await firebase.updateLandingSlide(slide.id, { ...slideData, updatedAt: Date.now() });
      await onUpdate(slide.id, slideData);
      displayActionMessage("Slide published!", "success");
    } catch (err) {
      displayActionMessage("Failed to publish slide.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        border: `2px solid ${slide.hasDraftChanges ? "#faad14" : "#e5e5e5"}`,
        borderRadius: "12px",
        backgroundColor: "#fff",
        overflow: "hidden",
        transition: "border-color 0.2s",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0.5rem",
          backgroundColor: slide.hasDraftChanges ? "#fffbe6" : "#fafafa",
          gap: "4px",
          borderRight: "1px solid #eee",
        }}
      >
        <button
          type="button"
          onClick={onMoveUp}
          disabled={isFirst}
          style={{
            background: "none",
            border: "1px solid #ccc",
            borderRadius: "4px",
            cursor: isFirst ? "not-allowed" : "pointer",
            opacity: isFirst ? 0.3 : 1,
            padding: "4px 8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.2rem",
            color: "#333",
            transition: "background 0.15s",
          }}
          title="Move up"
        >
          <ArrowUpOutlined />
        </button>
        <span style={{ fontSize: "1.1rem", color: "#888", fontWeight: 600 }}>
          {(slide.order ?? 0) + 1}
        </span>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={isLast}
          style={{
            background: "none",
            border: "1px solid #ccc",
            borderRadius: "4px",
            cursor: isLast ? "not-allowed" : "pointer",
            opacity: isLast ? 0.3 : 1,
            padding: "4px 8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.2rem",
            color: "#333",
            transition: "background 0.15s",
          }}
          title="Move down"
        >
          <ArrowDownOutlined />
        </button>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1rem 1.5rem",
            backgroundColor: slide.hasDraftChanges ? "#fffbe6" : "#fafafa",
            cursor: "pointer",
          }}
          onClick={() => setExpanded(!expanded)}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontWeight: 600, fontSize: "1.3rem" }}>
              Slide
            </span>
            {!slide.visible && (
              <span
                style={{
                  backgroundColor: "#dc3545",
                  color: "#fff",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  fontSize: "1.1rem",
                }}
              >
                Hidden
              </span>
            )}
            {slide.hasDraftChanges && (
              <span
                style={{
                  backgroundColor: "#faad14",
                  color: "#000",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  fontSize: "1.1rem",
                }}
              >
                Unpublished changes
              </span>
            )}
            {slide.label?.enabled && (
              <span
                style={{
                  backgroundColor: "#28a745",
                  color: "#fff",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  fontSize: "1.1rem",
                }}
              >
                Label
              </span>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {expanded ? <UpOutlined /> : <DownOutlined />}
          </div>
        </div>

        {expanded && (
          <div
            style={{
              padding: "0 1.5rem 1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: "2 1 300px" }}>
                <div
                  style={{
                    fontWeight: 600,
                    marginBottom: "0.5rem",
                    fontSize: "1.2rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>Desktop Media</span>
                  <select
                    value={slide.desktopMediaType || "image"}
                    onChange={(e) => handleMediaTypeChange("desktopMediaType", e.target.value)}
                    style={{
                      fontSize: "1.1rem",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                    }}
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "16 / 9",
                    backgroundColor: "#f5f5f5",
                    borderRadius: "8px",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  {desktopPreview ? (
                    slide.desktopMediaType === "video" ? (
                      <video
                        src={desktopPreview}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        muted
                        autoPlay
                        loop
                        playsInline
                      />
                    ) : (
                      <img
                        src={desktopPreview}
                        alt="Desktop preview"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    )
                  ) : (
                    <span style={{ color: "#999" }}>No media uploaded</span>
                  )}
                </div>
                <label
                  className="button button-small"
                  style={{
                    cursor: "pointer",
                    marginTop: "0.5rem",
                    display: "inline-block",
                    opacity: uploadingKey === `${slide.id}-desktopUrl` ? 0.6 : 1,
                  }}
                >
                  {uploadingKey === `${slide.id}-desktopUrl`
                    ? "Uploading..."
                    : "Upload Desktop Media"}
                  <input
                    type="file"
                    accept={slide.desktopMediaType === "video" ? "video/*" : "image/*"}
                    disabled={!!uploadingKey}
                    onChange={(e) => handleUpload(e, "desktopUrl", "desktopMediaType")}
                    style={{ display: "none" }}
                  />
                </label>
              </div>

              <div style={{ flex: "1 1 180px" }}>
                <div
                  style={{
                    fontWeight: 600,
                    marginBottom: "0.5rem",
                    fontSize: "1.2rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>Mobile Media</span>
                  <select
                    value={slide.mobileMediaType || "image"}
                    onChange={(e) => handleMediaTypeChange("mobileMediaType", e.target.value)}
                    style={{
                      fontSize: "1.1rem",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                    }}
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "9 / 16",
                    maxHeight: "250px",
                    backgroundColor: "#f5f5f5",
                    borderRadius: "8px",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  {mobilePreview ? (
                    slide.mobileMediaType === "video" ? (
                      <video
                        src={mobilePreview}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        muted
                        autoPlay
                        loop
                        playsInline
                      />
                    ) : (
                      <img
                        src={mobilePreview}
                        alt="Mobile preview"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    )
                  ) : (
                    <span style={{ color: "#999", textAlign: "center", padding: "0.5rem" }}>
                      No media uploaded
                    </span>
                  )}
                </div>
                <label
                  className="button button-small"
                  style={{
                    cursor: "pointer",
                    marginTop: "0.5rem",
                    display: "inline-block",
                    opacity: uploadingKey === `${slide.id}-mobileUrl` ? 0.6 : 1,
                  }}
                >
                  {uploadingKey === `${slide.id}-mobileUrl`
                    ? "Uploading..."
                    : "Upload Mobile Media"}
                  <input
                    type="file"
                    accept={slide.mobileMediaType === "video" ? "video/*" : "image/*"}
                    disabled={!!uploadingKey}
                    onChange={(e) => handleUpload(e, "mobileUrl", "mobileMediaType")}
                    style={{ display: "none" }}
                  />
                </label>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                flexWrap: "wrap",
                paddingTop: "0.5rem",
                borderTop: "1px solid #eee",
              }}
            >
              <button
                type="button"
                onClick={handleVisibilityToggle}
                className="button button-small"
                style={{
                  backgroundColor: slide.visible ? "#28a745" : "#6c757d",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                {slide.visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                {slide.visible ? "Visible" : "Hidden"}
              </button>

              <button
                type="button"
                onClick={() => setLabelExpanded(!labelExpanded)}
                className="button button-small"
                style={{
                  backgroundColor: slide.label?.enabled ? "#28a745" : "#6c757d",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <EditOutlined />
                Label Settings
              </button>

              {slide.hasDraftChanges && (
                <button
                  type="button"
                  onClick={handlePublish}
                  className="button button-small"
                  style={{
                    backgroundColor: "#1890ff",
                    color: "#fff",
                    border: "none",
                    cursor: saving ? "not-allowed" : "pointer",
                    opacity: saving ? 0.7 : 1,
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                  disabled={saving}
                >
                  <CheckOutlined />
                  {saving ? "Publishing..." : "Publish Changes"}
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Are you sure you want to delete this slide?")) {
                    onDelete(slide.id);
                  }
                }}
                className="button button-small"
                style={{
                  backgroundColor: "#dc3545",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  marginLeft: "auto",
                }}
              >
                <DeleteOutlined />
                Delete Slide
              </button>
            </div>

            {labelExpanded && (
              <div
                style={{
                  borderTop: "1px solid #eee",
                  paddingTop: "1rem",
                }}
              >
                <LabelEditor
                  label={slide.label}
                  onChange={(newLabel) => handleLabelChange(newLabel)}
                  previewImageUrl={
                    slide.desktopMediaType === "video"
                      ? slide.mobileUrl || ""
                      : slide.desktopUrl || ""
                  }
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SlideCard;