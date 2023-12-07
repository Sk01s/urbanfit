import React, { useState, useEffect } from "react";

const newsItems = [
  "EASY RETURNS",
  "3-5 DAYS DELIVERY",
  "SAME DAY DELIVERY (Express Service)",
  // "World wide Delivery (DHL)",
  "Wear the change Be URBANFIT!",
];
const delay = 4000;
const handleScroll = () => {
  const scrollY = window.scrollY;
  const maxScroll = 100; // Adjust this value to control the scroll threshold

  // Calculate the opacity based on the scroll position
  const opacity = Math.min(scrollY / maxScroll, 1);

  return opacity;
};
function NewsDisplay() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [scrollOpacity, setScrollOpacity] = useState(handleScroll());

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % newsItems.length);
        setIsFading(false);
      }, 500); // Adjust the duration of the fade (in milliseconds)
    }, delay);

    return () => clearInterval(interval);
  }, []);

  // useEffect(() => {
  //   const setScroll = () => {
  //     setScrollOpacity(() => handleScroll());
  //   };

  //   window.addEventListener("scroll", setScroll);

  //   return () => {
  //     window.removeEventListener("scroll", setScroll);
  //   };
  // }, []);

  return (
    <div
      className={`news-display `}
      style={
        {
          // backgroundColor: `rgba(255, 255, 255, ${scrollOpacity})`,
          // borderBottom: `solid 1px rgb(238, 238, 238,${scrollOpacity})`,
        }
      }
    >
      <span className={`${isFading ? "fade-out" : "fade-in"}`}>
        {newsItems[currentIndex]}
      </span>
    </div>
  );
}

export default NewsDisplay;
