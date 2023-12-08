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
    videoUrl: "/video-1.mp4",
    mobileUrl: "/mobile-2.mp4",
    mobile: {
      width: 480,
      height: 848,
    },
  },
  {
    imgUrl: "/landing-bg.webp",
    mobileUrl: "/mobile-1.mp4",
    mobile: {
      width: 448,
      height: 848,
    },
  },
  // Add more slides as needed
];

const updateInterval = 70; // Update every 10 milliseconds

function calcVideoHeight(aspectRatio) {
  const windowWidth = window.innerWidth;
  // const windowAspectRatio = windowWidth / window.innerHeight;
  const videoAspectRatio = aspectRatio.width / aspectRatio.height;
  const difference = window.innerWidth / aspectRatio.width;

  let videoHeight = aspectRatio.height * difference;
  console.log(videoHeight);
  return videoHeight;
}
const VideoSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const playerRef = useRef(null);
  const timerArray = useRef([]);

  const handleSlideChange = (newSlide) => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };
  const [isSmall, setSmall] = useState(window.innerWidth <= 728);
  const [isBig, setBig] = useState(window.innerWidth >= 1200);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setSmall(window.innerWidth <= 728);
      setBig(window.innerWidth >= 1200);
    });
    timerArray.current[currentSlide].classList.add("active");

    return () => {
      timerArray.current[currentSlide]?.classList.remove("active");
      // playerRef.current.player.handlePause();
    };
  }, [currentSlide]);

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight: isSmall
          ? calcVideoHeight({
              width: 480,
              height: 848,
            })
          : "auto",
        backgroundColor: "#333",
      }}
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
            {slide.videoUrl || isSmall ? (
              <>
                <ReactPlayer
                  ref={playerRef}
                  url={isSmall ? slide.mobileUrl : slide.videoUrl}
                  controls={false}
                  loop={true}
                  config={{
                    file: {
                      attributes: {
                        style: {
                          width: isBig ? "100vw" : "100%", // Override the width of the inner video element
                        },
                      },
                    },
                  }}
                  muted={true}
                  playing={true}
                  width={isSmall ? "100vw" : "100%"}
                  height="auto"
                  style={{
                    position: currentSlide === index ? "relative" : "initial",
                    zIndex: currentSlide === index ? "1" : "0",
                  }}
                  playsinline
                />
                <div style={{ display: "none" }}>
                  <video
                    controls={false}
                    ref={(video) => (playerRef.current = video)}
                    width={isSmall ? "auto" : "100%"}
                  >
                    <source src={slide.videoUrl} type="video/mp4" />
                  </video>
                </div>
              </>
            ) : (
              <div>
                <img src={slide.imgUrl} style={{ width: "100%" }} />
              </div>
            )}

            <div
              className=""
              style={{
                position: "absolute",
                left: `${30 + 20 * index}%`,
                top: "70%",
                translate: "-50% -50%",
                zIndex: 2,
              }}
            >
              {/* <h1
                className="text-thin"
                style={{ fontSize: isSmall ? "2.2rem" : "3rem" }}
              >
                Welcome to <span className="text-thin-light">Urbanfit</span>
              </h1> */}

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
