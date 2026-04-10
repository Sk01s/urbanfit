import React, { useState, useRef, useCallback } from "react";

const defaultLabel = {
  enabled: false,
  text: "",
  position: { x: 50, y: 90 },
  style: {
    color: "#ffffff",
    fontSize: 16,
    bgColor: "#000000",
    bgOpacity: 0.7,
  },
};

const LabelEditor = ({ label, onChange, previewImageUrl }) => {
  const current = { ...defaultLabel, ...label };
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e) => {
    if (!current.enabled) return;
    e.preventDefault();
    setDragging(true);
    const rect = containerRef.current.getBoundingClientRect();
    dragOffsetRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, [current.enabled]);

  const handleMouseMove = useCallback(
    (e) => {
      if (!dragging) return;
      const rect = containerRef.current.getBoundingClientRect();
      let x = ((e.clientX - rect.left) / rect.width) * 100;
      let y = ((e.clientY - rect.top) / rect.height) * 100;
      x = Math.max(0, Math.min(100, x));
      y = Math.max(0, Math.min(100, y));
      onChange({
        ...current,
        position: { x, y },
      });
    },
    [dragging, current, onChange]
  );

  const handleMouseUp = useCallback(() => {
    setDragging(false);
  }, []);

  React.useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [dragging, handleMouseMove, handleMouseUp]);

  const updateField = (field, value) => {
    onChange({ ...current, [field]: value });
  };

  const updateStyle = (field, value) => {
    onChange({
      ...current,
      style: { ...current.style, [field]: value },
    });
  };

  const bgOpacityPercent = Math.round((current.style.bgOpacity || 0) * 100);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <label style={{ fontWeight: 600, fontSize: "1.3rem" }}>
          Label Overlay
        </label>
        <button
          type="button"
          onClick={() => updateField("enabled", !current.enabled)}
          style={{
            padding: "4px 12px",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
            fontSize: "1.2rem",
            backgroundColor: current.enabled ? "#28a745" : "#6c757d",
            color: "#fff",
          }}
        >
          {current.enabled ? "Enabled" : "Disabled"}
        </button>
      </div>

      {current.enabled && (
        <>
          <div
            style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}
          >
            <label style={{ fontSize: "1.2rem", minWidth: "60px" }}>
              Text:
            </label>
            <input
              type="text"
              value={current.text}
              onChange={(e) => updateField("text", e.target.value)}
              placeholder="Enter label text..."
              style={{
                flex: 1,
                padding: "6px 10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "1.2rem",
              }}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.75rem",
            }}
          >
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <label style={{ fontSize: "1.2rem" }}>Font Size:</label>
              <input
                type="number"
                min={10}
                max={48}
                value={current.style.fontSize}
                onChange={(e) => updateStyle("fontSize", parseInt(e.target.value) || 16)}
                style={{ width: "70px", padding: "4px", borderRadius: "4px", border: "1px solid #ccc" }}
              />
            </div>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <label style={{ fontSize: "1.2rem" }}>Text Color:</label>
              <input
                type="color"
                value={current.style.color}
                onChange={(e) => updateStyle("color", e.target.value)}
                style={{ width: "36px", height: "28px", cursor: "pointer" }}
              />
            </div>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <label style={{ fontSize: "1.2rem" }}>BG Color:</label>
              <input
                type="color"
                value={current.style.bgColor}
                onChange={(e) => updateStyle("bgColor", e.target.value)}
                style={{ width: "36px", height: "28px", cursor: "pointer" }}
              />
            </div>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <label style={{ fontSize: "1.2rem" }}>BG Opacity:</label>
              <input
                type="range"
                min={0}
                max={100}
                value={bgOpacityPercent}
                onChange={(e) => updateStyle("bgOpacity", parseInt(e.target.value) / 100)}
                style={{ flex: 1 }}
              />
              <span style={{ fontSize: "1.2rem", minWidth: "36px" }}>
                {bgOpacityPercent}%
              </span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <label style={{ fontSize: "1.2rem" }}>
              Position (drag label on preview):
            </label>
            <span style={{ fontSize: "1.2rem", color: "#666" }}>
              X: {Math.round(current.position.x)}% Y: {Math.round(current.position.y)}%
            </span>
          </div>

          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "16 / 9",
              backgroundColor: "#222",
              borderRadius: "8px",
              overflow: "hidden",
              cursor: current.enabled ? "crosshair" : "default",
              border: dragging ? "2px solid #4CAF50" : "1px solid #444",
            }}
          >
            {previewImageUrl ? (
              <img
                src={previewImageUrl}
                alt="Slide preview"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                draggable={false}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#666",
                  fontSize: "1.2rem",
                }}
              >
                Upload media to preview
              </div>
            )}
            {current.enabled && current.text && (
              <div
                style={{
                  position: "absolute",
                  left: `${current.position.x}%`,
                  top: `${current.position.y}%`,
                  transform: "translate(-50%, -50%)",
                  color: current.style.color,
                  fontSize: `${current.style.fontSize}px`,
                  backgroundColor: `rgba(${
                    parseInt(current.style.bgColor.slice(1, 3), 16)
                  }, ${
                    parseInt(current.style.bgColor.slice(3, 5), 16)
                  }, ${
                    parseInt(current.style.bgColor.slice(5, 7), 16)
                  }, ${current.style.bgOpacity})`,
                  padding: "4px 12px",
                  borderRadius: "4px",
                  whiteSpace: "nowrap",
                  pointerEvents: "none",
                  fontWeight: 600,
                  zIndex: 5,
                }}
              >
                {current.text}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default LabelEditor;