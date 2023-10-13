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
    videoUrl:
      "https://house-fastly-signed-eu-west-1-prod.brightcovecdn.com/media/v1/pmp4/static/clear/1268729919001/44fb1ed0-9a76-4f2a-87b3-fbbfbd87e778/e27d090d-28a7-4312-8e26-d54a696e92fe/main.mp4?fastly_token=NjcwOTQ4ZTdfNzVjN2I5YTI0MDY2MjAyNGUwMWY3Nzg4OWY3ZjIzNDQxMWZmZGI1ZjhlNjcyZjMyOWFkOTg2ODk4NGI5MjMzZl8vL2hvdXNlLWZhc3RseS1zaWduZWQtZXUtd2VzdC0xLXByb2QuYnJpZ2h0Y292ZWNkbi5jb20vbWVkaWEvdjEvcG1wNC9zdGF0aWMvY2xlYXIvMTI2ODcyOTkxOTAwMS80NGZiMWVkMC05YTc2LTRmMmEtODdiMy1mYmJmYmQ4N2U3NzgvZTI3ZDA5MGQtMjhhNy00MzEyLThlMjYtZDU0YTY5NmU5MmZlL21haW4ubXA0",
  },
  {
    videoUrl:
      "https://house-fastly-signed-eu-west-1-prod.brightcovecdn.com/media/v1/pmp4/static/clear/1268729919001/9dbda366-67d9-434b-b6d8-0dfad1f2fb58/6bfbfb62-fd1e-43f7-b68a-97b432ecca11/main.mp4?fastly_token=NjcwOTQ4ZWFfZGMxZDJmZmQ2NjdlNjNkZTUyZTdjYmQ5YzliOTYzZGI1MWVlMzI2MTMxMzkwMTcwMmZhODBjNzNmOThkMzUxN18vL2hvdXNlLWZhc3RseS1zaWduZWQtZXUtd2VzdC0xLXByb2QuYnJpZ2h0Y292ZWNkbi5jb20vbWVkaWEvdjEvcG1wNC9zdGF0aWMvY2xlYXIvMTI2ODcyOTkxOTAwMS85ZGJkYTM2Ni02N2Q5LTQzNGItYjZkOC0wZGZhZDFmMmZiNTgvNmJmYmZiNjItZmQxZS00M2Y3LWI2OGEtOTdiNDMyZWNjYTExL21haW4ubXA0",
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
  const isSmall = window.innerWidth <= 728;
  useEffect(() => {
    timerArray.current[currentSlide].classList.add("active");

    return () => {
      timerArray.current[currentSlide].classList.remove("active");
      // playerRef.current.player.handlePause();
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
              config={{
                file: {
                  attributes: {
                    style: {
                      width: "", // Override the width of the inner video element
                    },
                  },
                },
              }}
              muted={true}
              playing={true}
              width="100%"
              height="auto"
              style={{
                position: currentSlide === index ? "relative" : "initial",
              }}
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
