import React, { useState, useEffect, useRef } from "react";
import { Carousel } from "react-responsive-carousel";
import ReactPlayer from "react-player";

const slides = [
  {
    videoUrl: "/2- What is Middleware.mp4",
  },
  {
    videoUrl: "/1- Introduction.mp4",
  },
  // Add more slides as needed
];

const slideDuration = 3000; // 3 seconds in milliseconds

const updateInterval = 70; // Update every 10 milliseconds

const VideoSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [played, setPlayed] = useState(0);
  const playerRef = useRef(null);

  const handleSlideChange = (newSlide) => {
    if (playerRef.current) {
      playerRef.current.seekTo(0, "seconds"); // Reset video to start
    }
    setCurrentSlide(newSlide);
    setPlayed(0); // Reset the played percentage
  };

  useEffect(() => {
    let intervalId;
    let startData = new Date();
    if (playerRef.current) {
      intervalId = setInterval(() => {
        const currentDate = new Date();
        const currentTime = currentDate - startData;
        const percentage = currentTime / (slideDuration / 1000) / 10;

        setPlayed(percentage);
      }, updateInterval);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [currentSlide]);

  return (
    <Carousel
      showArrows={false}
      showThumbs={false}
      selectedItem={currentSlide}
      onChange={handleSlideChange}
      interval={slideDuration}
      infiniteLoop={true}
      autoPlay={true} // 3 seconds autoplay
      showStatus={false}
      showIndicators={false}
    >
      {slides.map((slide, index) => (
        <div key={index}>
          <ReactPlayer
            ref={playerRef}
            url={slide.videoUrl}
            controls={false}
            loop={true}
            muted={true}
            playing={true}
            width="100%"
            height="auto"
          />
          <div>Time played: {played.toFixed(2)}%</div>
        </div>
      ))}
    </Carousel>
  );
};

export default VideoSlider;
