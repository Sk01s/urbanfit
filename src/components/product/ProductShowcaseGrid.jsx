/* eslint-disable react/forbid-prop-types */
import { FeaturedProduct } from "@/components/product";
import PropType from "prop-types";
import React, { useRef, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

const ProductShowcase = ({ products, skeletonCount, title, titleStyle }) => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const getPercentage = () => {
    if (window.innerWidth <= 700) {
      return 50;
    } else if (window.innerWidth <= 800) {
      return 40;
    } else if (window.innerWidth <= 1000) {
      return 35;
    } else {
      return 30;
    }
  };
  const handleNextSlide = () => {
    if (currentIndex < products.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(products.length - 1);
    }
  };

  return (
    <div className="">
      <div className="display-header">
        <button
          onClick={handlePrevSlide}
          style={{
            background: "rgba(255, 255, 255, 0)",
            border: "none",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="feather feather-chevron-left"
          >
            <title>Left</title>
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <h1 style={titleStyle}>{title}</h1>
        <button
          onClick={handleNextSlide}
          style={{
            background: "rgba(255, 255, 255, 0)",
            border: "none",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="feather feather-chevron-right"
          >
            <title>Right</title>
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
      <Carousel
        showArrows={false}
        showIndicators={false}
        selectedItem={currentIndex}
        centerMode={true} // Enable center mode
        centerSlidePercentage={getPercentage()} // Adjust this percentage as needed
        emulateTouch={true}
        swipeable={true}
        onSwipeEnd={() => setCurrentIndex(0)}
      >
        {products.length === 0
          ? new Array(skeletonCount).fill({}).map((product, index) => (
              <FeaturedProduct
                // eslint-disable-next-line react/no-array-index-key
                key={`product-skeleton ${index}`}
                product={product}
              />
            ))
          : products.map((product) => (
              <FeaturedProduct key={product.id} product={product} />
            ))}
      </Carousel>
    </div>
  );
};

ProductShowcase.defaultProps = {
  skeletonCount: 4,
};

ProductShowcase.propTypes = {
  products: PropType.array.isRequired,
  skeletonCount: PropType.number,
};

export default ProductShowcase;
