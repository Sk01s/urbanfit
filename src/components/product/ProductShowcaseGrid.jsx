/* eslint-disable react/forbid-prop-types */
import { FeaturedProduct } from "@/components/product";
import PropType from "prop-types";
import React, { useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const ProductShowcase = ({
  products,
  skeletonCount,
  title,
  titleStyle,
  infinite = true,
  center = true,
}) => {
  const settings = {
    className: "center",
    infinite: true,
    center: true,
    centerPadding: "0",
    slidesToShow: 1,
    speed: 500,
    arrows: false,
    variableWidth: true,
  };

  const sliderRef = useRef(null);

  const goToNext = () => {
    sliderRef.current.slickNext(); // Go to the next slide
  };

  const goToPrevious = () => {
    sliderRef.current.slickPrev(); // Go to the previous slide
  };

  return (
    <>
      <div className="display-header">
        <button
          onClick={goToPrevious}
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
          onClick={goToNext}
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
      <Slider ref={sliderRef} {...settings}>
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
      </Slider>
    </>
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
