import React, { useState } from "react";
import PropType from "prop-types";

const ColorVariantEditor = ({ variant, index, onChange, onRemove, onImageChange, onGalleryChange, onGalleryRemove, isFileLoading, disabled }) => {
  const sizeKeys = ["xs", "sm", "md", "lg", "xl"];
  const sizeLabels = { xs: "XS", sm: "S", md: "M", lg: "L", xl: "XL" };

  const handleChange = (field, value) => {
    if (disabled) return;
    const updated = { ...variant };
    if (field.startsWith("quantities.")) {
      const sizeKey = field.replace("quantities.", "");
      updated.quantities = { ...updated.quantities, [sizeKey]: parseInt(value, 10) || 0 };
    } else {
      updated[field] = value;
    }
    onChange(index, updated);
  };

  return (
    <div style={{ border: "2px solid #e0e0e0", borderRadius: "12px", padding: "1.5rem", marginBottom: "1.5rem", background: "#fafafa", opacity: disabled ? 0.6 : 1, pointerEvents: disabled ? "none" : "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h4 style={{ margin: 0 }}>Color Variant {index + 1}</h4>
        {index > 0 && (
          <button type="button" onClick={() => onRemove(index)} style={{ background: "#ff4d4f", color: "#fff", border: "none", borderRadius: "6px", padding: "6px 16px", cursor: "pointer" }}>
            Remove
          </button>
        )}
      </div>

      <div className="d-flex" style={{ gap: "1rem", marginBottom: "1rem" }}>
        <div className="product-form-field" style={{ flex: 0 }}>
          <label className="label-input" style={{ position: "relative", top: "0", fontSize: "0.85rem" }}>Color</label>
          <input
            type="color"
            value={variant.color || "#000000"}
            onChange={(e) => handleChange("color", e.target.value)}
            disabled={disabled}
            style={{ width: "50px", height: "40px", padding: "2px", border: "1px solid #ccc", borderRadius: "6px", cursor: "pointer" }}
          />
        </div>
        <div className="product-form-field" style={{ flex: 1 }}>
          <label className="label-input" style={{ position: "relative", top: "0", fontSize: "0.85rem" }}>Color Name</label>
          <input
            type="text"
            value={variant.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="e.g. Red, Navy Blue"
            className="input-form"
            disabled={disabled}
            style={{ marginTop: "0.5rem" }}
          />
        </div>
      </div>

      <div className="product-form-field" style={{ marginBottom: "1rem" }}>
        <span className="d-block padding-s">Thumbnail Image (per color)</span>
        {!isFileLoading && !disabled && (
          <label htmlFor={`variant-thumb-${index}`} style={{ cursor: "pointer", color: "#666", fontSize: "0.85rem" }}>
            <input
              hidden
              id={`variant-thumb-${index}`}
              type="file"
              accept="image/*"
              onChange={(e) => onImageChange(index, e)}
            />
            Choose Image
          </label>
        )}
        {(variant.image || variant._imagePreview) && (
          <div style={{ marginTop: "0.5rem" }}>
            <img
              alt=""
              src={variant._imagePreview || variant.image}
              style={{ maxWidth: "120px", maxHeight: "120px", objectFit: "contain", borderRadius: "8px" }}
            />
          </div>
        )}
      </div>

      <div className="product-form-field" style={{ marginBottom: "1rem" }}>
        <span className="d-block padding-s">Gallery Images (per color)</span>
        {!isFileLoading && !disabled && (
          <label htmlFor={`variant-gallery-${index}`} style={{ cursor: "pointer", color: "#666", fontSize: "0.85rem" }}>
            <input
              hidden
              id={`variant-gallery-${index}`}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => onGalleryChange(index, e)}
            />
            Choose Images
          </label>
        )}
        <div className="product-form-collection" style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.5rem" }}>
          {(variant.imageCollection || []).map((img) => (
            <div className="product-form-collection-image" key={img.id} style={{ position: "relative" }}>
              <img alt="" src={img.url} loading="lazy" style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "6px" }} />
              <button
                type="button"
                onClick={() => onGalleryRemove(index, img.id)}
                style={{ position: "absolute", top: "-6px", right: "-6px", borderRadius: "50%", backgroundColor: "black", color: "white", border: "none", width: "20px", height: "20px", fontSize: "10px", cursor: "pointer" }}
              >
                X
              </button>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "0.5rem" }}>
        <span className="d-block padding-s" style={{ fontWeight: 600 }}>Quantities per Size</span>
      </div>
      <div className="d-flex" style={{ gap: "1rem", flexWrap: "wrap" }}>
        {sizeKeys.map((size) => (
          <div key={size} className="product-form-field" style={{ flex: 1, minWidth: "80px" }}>
            <label className="normal-label" style={{ display: "block", fontSize: "1rem", fontWeight: 600, color: "#343120",marginLeft:"1rem", marginBottom: "0.25rem" }}>
              {sizeLabels[size]}
            </label>
            <input
              type="number"
              min="0"
              value={variant.quantities?.[size] ?? 0}
              onChange={(e) => handleChange(`quantities.${size}`, e.target.value)}
              className="input-form"
              disabled={disabled}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

ColorVariantEditor.propTypes = {
  variant: PropType.shape({
    color: PropType.string,
    name: PropType.string,
    image: PropType.string,
    _imagePreview: PropType.string,
    imageCollection: PropType.array,
    quantities: PropType.object,
  }).isRequired,
  index: PropType.number.isRequired,
  onChange: PropType.func.isRequired,
  onRemove: PropType.func.isRequired,
  onImageChange: PropType.func.isRequired,
  onGalleryChange: PropType.func.isRequired,
  onGalleryRemove: PropType.func.isRequired,
  isFileLoading: PropType.bool,
  disabled: PropType.bool,
};

export default ColorVariantEditor;