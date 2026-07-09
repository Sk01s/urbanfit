import React, { useState } from "react";
import PropType from "prop-types";

const ColorChooserV2 = ({ colors, selectedColor, onSelectedColorChange }) => {
  const setColor = (color) => {
    onSelectedColorChange(color);
  };
  return (
    <div className="color-chooser" style={{gap:"1rem"}}>
      {colors.map(({ color, name }) => (
        <div
          key={color}
          className={selectedColor === color ? "color-item color-item-selected" : "color-item"}
          onClick={() => setColor(color)}
          role="presentation"
          style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", margin: "0 8px", cursor: "pointer" }}
        >
          <div
          className={"color-circle"}
            style={{
              backgroundColor: color,
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              border: selectedColor === color ? "3px solid #000" : "2px solid transparent",
              transition: "border-color 0.2s",
            }}
          />
          {name && (
            <span style={{ fontSize: "0.75rem", marginTop: "4px", color: "#555" }}>
              {name}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

ColorChooserV2.propTypes = {
  colors: PropType.arrayOf(
    PropType.shape({
      color: PropType.string.isRequired,
      name: PropType.string,
    })
  ).isRequired,
  selectedColor: PropType.string,
  onSelectedColorChange: PropType.func.isRequired,
};

export default ColorChooserV2;