import React, { useState, useRef, useCallback, useEffect } from "react";

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

const parseColor = (hex) => {
  if (!hex || typeof hex !== "string" || !hex.startsWith("#") || hex.length < 7) return { r: 0, g: 0, b: 0 };
  return {
    r: parseInt(hex.slice(1, 3), 16) || 0,
    g: parseInt(hex.slice(3, 5), 16) || 0,
    b: parseInt(hex.slice(5, 7), 16) || 0,
  };
};

const LabelEditor = ({ label, onChange, previewImageUrl }) => {
  const current = { ...defaultLabel, ...label };
  const [localText, setLocalText] = useState(current.text || "");
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef(null);
  const debounceTimerRef = useRef(null);

  useEffect(() => {
    setLocalText(current.text || "");
  }, [current.text]);

  const debouncedOnChange = useCallback((newLabel) => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      onChange(newLabel);
    }, 300);
  }, [onChange]);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setLocalText(newText);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      onChange({ ...current, text: newText });
    }, 400);
  };

  const handleStyleChange = (field, value) => {
    const updated = { ...current, style: { ...current.style, [field]: value } };
    onChange(updated);
  };

  const handleToggleEnabled = () => {
    onChange({ ...current, enabled: !current.enabled });
  };

  const handleMouseDown = useCallback((e) => {
    if (!current.enabled) return;
    e.preventDefault();
    setDragging(true);
  }, [current.enabled]);

  const handleMouseMove = useCallback(
    (e) => {
      if (!dragging) return;
      const rect = containerRef.current.getBoundingClientRect();
      let x = ((e.clientX - rect.left) / rect.width) * 100;
      let y = ((e.clientY - rect.top) / rect.height) * 100;
      x = Math.max(0, Math.min(100, x));
      y = Math.max(0, Math.min(100, y));
      onChange({ ...current, position: { x, y } });
    },
    [dragging, current, onChange]
  );

  const handleMouseUp = useCallback(() => {
    setDragging(false);
  }, []);

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [dragging, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  const { r, g, b } = parseColor(current.style?.bgColor);
  const opacity = current.style?.bgOpacity ?? 0.7;
  const bgOpacityPercent = Math.round(opacity * 100);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <label className="normal-label" style={{ fontWeight: 600, fontSize: "1.3rem" }}>
          Label Overlay
        </label>
        <button
          type="button"
          onClick={handleToggleEnabled}
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
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <label className="normal-label" style={{ fontSize: "1.2rem", minWidth: "60px" }}>Text:</label>
            <input
              type="text"
              value={localText}
              onChange={handleTextChange}
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
              <label className="normal-label" style={{ fontSize: "1.2rem" }}>Font Size:</label>
              <input
                type="number"
                min={10}
                max={48}
                value={current.style?.fontSize ?? 16}
                onChange={(e) => handleStyleChange("fontSize", parseInt(e.target.value) || 16)}
                style={{ width: "70px", padding: "4px", borderRadius: "4px", border: "1px solid #ccc" }}
              />
            </div>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <label className="normal-label" style={{ fontSize: "1.2rem" }}>Text Color:</label>
              <input
                type="color"
                value={current.style?.color || "#ffffff"}
                onChange={(e) => handleStyleChange("color", e.target.value)}
                style={{ width: "36px", height: "28px", cursor: "pointer" }}
              />
            </div>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <label className="normal-label" style={{ fontSize: "1.2rem" }}>BG Color:</label>
              <input
                type="color"
                value={current.style?.bgColor || "#000000"}
                onChange={(e) => handleStyleChange("bgColor", e.target.value)}
                style={{ width: "36px", height: "28px", cursor: "pointer" }}
              />
            </div>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <label className="normal-label" style={{ fontSize: "1.2rem" }}>BG Opacity:</label>
              <input
                type="range"
                min={0}
                max={100}
                value={bgOpacityPercent}
                onChange={(e) => handleStyleChange("bgOpacity", parseInt(e.target.value) / 100)}
                style={{ flex: 1 ,padding:0}}
              />
              <span style={{ fontSize: "1.2rem", minWidth: "36px" }}>
                {bgOpacityPercent}%
              </span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <label className="normal-label" style={{ fontSize: "1.2rem" }}>Position (drag label on preview):</label>
            <span style={{ fontSize: "1.2rem", color: "#666" }}>
              X: {Math.round(current.position?.x ?? 50)}% Y: {Math.round(current.position?.y ?? 90)}%
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
                  left: `${current.position?.x ?? 50}%`,
                  top: `${current.position?.y ?? 90}%`,
                  transform: "translate(-50%, -50%)",
                  color: current.style?.color || "#ffffff",
                  fontSize: `${current.style?.fontSize || 16}px`,
                  backgroundColor: `rgba(${r}, ${g}, ${b}, ${opacity})`,
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