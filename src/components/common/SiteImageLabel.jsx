import React from "react";

const parseColor = (hex) => {
  if (!hex || typeof hex !== "string" || !hex.startsWith("#") || hex.length < 7) return { r: 0, g: 0, b: 0 };
  return {
    r: parseInt(hex.slice(1, 3), 16) || 0,
    g: parseInt(hex.slice(3, 5), 16) || 0,
    b: parseInt(hex.slice(5, 7), 16) || 0,
  };
};

const SiteImageLabel = ({ labelOverlay }) => {
  if (!labelOverlay || !labelOverlay.enabled || !labelOverlay.text) return null;

  const { r, g, b } = parseColor(labelOverlay.style?.bgColor);
  const opacity = labelOverlay.style?.bgOpacity ?? 0.7;

  return (
    <div
      style={{
        position: "absolute",
        left: `${labelOverlay.position?.x ?? 50}%`,
        top: `${labelOverlay.position?.y ?? 90}%`,
        transform: "translate(-50%, -50%)",
        color: labelOverlay.style?.color || "#ffffff",
        fontSize: `${labelOverlay.style?.fontSize || 16}px`,
        backgroundColor: `rgba(${r}, ${g}, ${b}, ${opacity})`,
        padding: "4px 12px",
        borderRadius: "4px",
        whiteSpace: "nowrap",
        pointerEvents: "none",
        fontWeight: 600,
        zIndex: 5,
      }}
    >
      {labelOverlay.text}
    </div>
  );
};

export default SiteImageLabel;