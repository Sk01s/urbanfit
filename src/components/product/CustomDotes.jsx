import React from "react";
import { ColorChooser, ImageLoader, MessageDisplay } from "@/components/common";

const CustomDots = ({ currentSlide, onDotClick, imageCollection }) => {
  const dots = imageCollection.map((image, index) => (
    <div
      className="product-modal-image-collection-wrapper"
      key={image.id}
      onClick={() => {
        onDotClick(index);
        console.log(index);
      }}
      role="presentation"
    >
      <ImageLoader
        className={`product-modal-image-collection-img ${
          currentSlide === index ? "active" : ""
        }`}
        src={image.url}
      />
    </div>
  ));

  return <div className="product-modal-image-collection">{dots}</div>;
};

export default CustomDots;
