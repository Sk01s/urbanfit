/* eslint-disable react/forbid-prop-types */
import { FeaturedProduct } from "@/components/product";
import PropType from "prop-types";
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const ProductShowcase = ({ products, skeletonCount }) => {
  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "0",
    slidesToShow: 1,
    speed: 500,
    variableWidth: true,
    prevArrow: <></>,
    nextArrow: <></>,
  };

  return (
    <Slider {...settings}>
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
