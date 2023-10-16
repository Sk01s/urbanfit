import { FeaturedProduct } from "@/components/product";
import PropType from "prop-types";
import React, { useRef } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
const ProductShowcase = ({
  products,
  skeletonCount,
  title,
  titleStyle,
  center = true,
  to = "",
}) => {
  const settings = {
    infinite: true,
    centerMode: center,
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
      <div className="display-header" style={{ marginBottom: to || "2rem" }}>
        <button
          onClick={goToPrevious}
          style={{
            background: "rgba(255, 255, 255, 0)",
            border: "none",
            translate: "0 0.6rem",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#000"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
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
            translate: "0 0.6rem",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#000"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <title>Right</title>
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
      {to && (
        <Link
          to={to}
          style={{
            textAlign: "center",
            color: "#5b9bbe",
            fontSize: "1.2rem",
            textDecoration: "underline",
            marginInline: "auto",
            display: "block",
            marginTop: ".4rem",
            marginBottom: "1.6rem",
          }}
        >
          VIEW ALL
        </Link>
      )}
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
