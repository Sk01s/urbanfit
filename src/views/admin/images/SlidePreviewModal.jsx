import React from "react";
import { CloseOutlined } from "@ant-design/icons";

const SlidePreviewModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const previewUrl = `${window.location.origin}${window.location.pathname}?preview=1`;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        zIndex: 10000,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.75rem 1.5rem",
          backgroundColor: "#1a1a1a",
          color: "#fff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <h3 style={{ margin: 0, fontSize: "1.6rem" }}>
            Preview (Draft Changes)
          </h3>
          <span
            style={{
              fontSize: "1.2rem",
              color: "#faad14",
              backgroundColor: "rgba(250, 173, 20, 0.15)",
              padding: "2px 10px",
              borderRadius: "4px",
            }}
          >
            Draft Preview - changes not yet published
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "#fff",
            cursor: "pointer",
            fontSize: "2rem",
            display: "flex",
            alignItems: "center",
          }}
        >
          <CloseOutlined />
        </button>
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          overflow: "auto",
          backgroundColor: "#2a2a2a",
          padding: "1rem",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1400px",
            height: "100%",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
            backgroundColor: "#fff",
          }}
        >
          <iframe
            src={previewUrl}
            title="Landing page preview"
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              minHeight: "80vh",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SlidePreviewModal;