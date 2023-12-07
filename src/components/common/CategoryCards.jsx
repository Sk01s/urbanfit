import React, { useRef } from "react";

import { Link } from "react-router-dom/cjs/react-router-dom.min";
import Slider from "react-slick";
const CategoryCards = () => {
  const settings = {
    infinite: true,
    centerMode: false,
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
    <div
    className="card-container"
      style={{
        width: "100%",
        // display: "grid",
        // gridTemplateColumns: "repeat(auto-fill,minmax(23rem,1fr))",
        gap: "2rem",
        padding: "0 2rem",
        marginBlock: "4rem",
      }}
    >
      <div className="display-header" style={{ marginBottom: "2rem" }}>
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
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <title>Left</title>
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <h1>24 / 7 STYLE</h1>
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
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <title>Right</title>
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
      <Slider ref={sliderRef} {...settings}>
        <Link
          to={"/store/men/tops"}
          className="product-display card"
          style={{
            marginInline: ".5rem",
          }}
        >
          <img
            src="/category-card-1.jpg"
            alt=""
            style={{
              width: "100%",
              height: "100%",
              backgroundSize: "cover",
              aspectRatio: "10/16",
              padding: " 0 1rem",
            }}
          />
        </Link>
        <Link
          to={"/store/men/bottoms"}
          className="product-display card"
          style={{
            marginInline: ".5rem",
          }}
        >
          <img
            src="/category-card-2.jpg"
            alt=""
            style={{
              width: "100%",
              height: "100%",
              backgroundSize: "cover",
              padding: " 0 1rem",
            }}
          />
        </Link>
        <Link
          to={"/store/men/active"}
          className="product-display card"
          card
          style={{
            marginInline: ".5rem",
          }}
        >
          <img
            src="/category-card-3.jpg"
            alt=""
            style={{
              width: "100%",
              height: "100%",
              backgroundSize: "cover",
              padding: " 0 1rem",
            }}
          />
        </Link>
        <Link
          to={"/store/men/essential"}
          className="product-display card"
          card
          style={{
            marginInline: ".5rem",
          }}
        >
          <img
            src="/category-card-4.jpg"
            alt=""
            style={{
              width: "100%",
              height: "100%",
              backgroundSize: "cover",
              padding: " 0 1rem",
            }}
          />
        </Link>
        <Link
          to={"/store/men/seasonal-collection"}
          className="product-display card"
          card
          style={{
            marginInline: ".5rem",
          }}
        >
          <img
            src="/category-card-5.jpg"
            alt=""
            style={{
              width: "100%",
              height: "100%",
              backgroundSize: "cover",
              padding: " 0 1rem",
            }}
          />
        </Link>
        <Link
          to={"/store/men/seasonal-collection"}
          className="product-display card"
          card
          style={{
            marginInline: ".5rem",
          }}
        >
          <img
            src="/category-card-6.jpg"
            alt=""
            style={{
              width: "100%",
              height: "100%",
              backgroundSize: "cover",
              padding: " 0 1rem",
            }}
          />
        </Link>
        <Link
          to={"/store/men/seasonal-collection"}
          className="product-display card"
      
          style={{
            marginInline: ".5rem",
          }}
        >
          <img
            src="/category-card-7.jpg"
            alt=""
            style={{
              width: "100%",
              height: "100%",
              backgroundSize: "cover",
              padding: " 0 1rem",
            }}
          />
        </Link>
      </Slider>
    </div>
  );
};

export default CategoryCards;
