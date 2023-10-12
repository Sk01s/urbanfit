import React, { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { ArrowRightOutlined } from "@ant-design/icons";
import {
  SEASONAL_PRODUCTS,
  ESSENTIAL_PRODUCTS,
  SHOP,
} from "@/constants/routes";
const slides = [
  {
    videoUrl: "/2- What is Middleware.mp4",
  },
  {
    videoUrl: "/1- Introduction.mp4",
  },
  // Add more slides as needed
];

const updateInterval = 70; // Update every 10 milliseconds

const VideoSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const playerRef = useRef(null);
  const timerArray = useRef([]);

  const handleSlideChange = (newSlide) => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    timerArray.current[currentSlide].classList.add("active");

    return () => {
      console.log(playerRef.current.player);
      timerArray.current[currentSlide].classList.remove("active");
      playerRef.current.player.handlePause();
    };
  }, [currentSlide]);

  const playerConfig = {
    youtube: {
      playerVars: {
        disablekb: 1, // Disable keyboard controls
        controls: 0, // Disable YouTube controls
      },
    },
  };

  return (
    <div
      style={{ position: "relative", maxHeight: "85vh", overflow: "hidden" }}
    >
      <Slider
        arrows={false}
        dots={false}
        selectedItem={currentSlide}
        afterChange={handleSlideChange}
        infinite={true}
        autoplaySpeed={5000}
        autoplay={true}
      >
        {slides.map((slide, index) => (
          <div key={index} style={{ position: "relative" }}>
            <ReactPlayer
              ref={playerRef}
              url={slide.videoUrl}
              controls={false}
              loop={true}
              config={playerConfig}
              muted={true}
              playing={true}
              width="100%"
              height="auto"
              
            />
            <div
              className=""
              style={{
                position: "absolute",
                left: `${30 + 20 * index}%`,
                top: "50%",
                translate: "-50% -50%",
              }}
            >
              <h1 className="text-thin">
                Welcome to <span className="text-thin-light">Urbanfit</span>
              </h1>

              <br />
              <Link to={SHOP} className="button">
                Shop Now &nbsp;
                <ArrowRightOutlined />
              </Link>
            </div>
          </div>
        ))}
      </Slider>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          width: "30rem",
          position: "absolute",
          left: "50%",
          translate: "-50%",
          bottom: "1rem",
        }}
      >
        {slides.map((_, index) => (
          <div
            key={index}
            ref={(e) => (timerArray.current[index] = e)}
            className="timer"
          />
        ))}
      </div>
    </div>
  );
};

export default VideoSlider;
