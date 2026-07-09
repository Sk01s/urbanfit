import React, { useMemo, useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { ArrowRightOutlined } from "@ant-design/icons";
import { SHOP } from "@/constants/routes";
import { useSiteImages, useLandingSlides } from "@/hooks";
import SiteImageLabel from "./SiteImageLabel";

const parseColor = (hex) => {
  if (!hex || typeof hex !== "string") return { r: 0, g: 0, b: 0 };
  const h = hex.startsWith("#") ? hex.slice(1) : hex;
  return {
    r: parseInt(h.substring(0, 2), 16) || 0,
    g: parseInt(h.substring(2, 4), 16) || 0,
    b: parseInt(h.substring(4, 6), 16) || 0,
  };
};

const LabelOverlay = ({ label, isSmall }) => {
  if (!label || !label.enabled || !label.text) return null;
  const { r, g, b } = parseColor(label.style?.bgColor);
  const opacity = label.style?.bgOpacity ?? 0.7;

  return (
    <div
      style={{
        position: "absolute",
        left: `${label.position?.x ?? 50}%`,
        top: `${label.position?.y ?? 90}%`,
        transform: "translate(-50%, -50%)",
        color: label.style?.color || "#ffffff",
        fontSize: isSmall
          ? `${Math.max((label.style?.fontSize || 16) * 0.7, 12)}px`
          : `${label.style?.fontSize || 16}px`,
        backgroundColor: `rgba(${r}, ${g}, ${b}, ${opacity})`,
        padding: "6px 16px",
        borderRadius: "4px",
        whiteSpace: "nowrap",
        fontWeight: 600,
        zIndex: 3,
        pointerEvents: "none",
      }}
    >
      {label.text}
    </div>
  );
};

const VideoSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const playerRef = useRef(null);
  const timerArray = useRef([]);
  const { getImageUrl, getLabelOverlay } = useSiteImages();
  const { slides: allSlides, draftSlides } = useLandingSlides();

  const isPreview = useMemo(() => {
    try {
      return new URLSearchParams(window.location.search).has("preview");
    } catch {
      return false;
    }
  }, []);

  const activeSlides = isPreview ? draftSlides : allSlides.filter((s) => s.publishedVisible !== false && s.publishedDesktopUrl);

  const dynamicSlides = useMemo(() => {
    if (!activeSlides || activeSlides.length === 0) return null;

    return activeSlides.map((slide) => {
      const desktopUrl = isPreview
        ? slide.desktopUrl
        : slide.publishedDesktopUrl;
      const mobileUrl = isPreview
        ? slide.mobileUrl
        : slide.publishedMobileUrl;
      const desktopMediaType = isPreview
        ? (slide.desktopMediaType || "image")
        : (slide.publishedDesktopMediaType || "image");
      const mobileMediaType = isPreview
        ? (slide.mobileMediaType || "image")
        : (slide.publishedMobileMediaType || "image");
      const label = isPreview
        ? slide.label
        : slide.publishedLabel;

      return {
        desktop: {
          url: desktopUrl,
          img: desktopMediaType === "image",
        },
        mobile: {
          url: mobileUrl,
          img: mobileMediaType === "image",
        },
        label: label || { enabled: false, text: "", position: { x: 50, y: 90 }, style: {} },
      };
    });
  }, [activeSlides, isPreview]);

  const fallbackSlides = useMemo(
    () => [
      {
        desktop: {
          url: getImageUrl("landing-video-1"),
          img: false,
        },
        mobile: {
          url: getImageUrl("mobile-1"),
          img: true,
        },
        label: { enabled: false, text: "" },
        adminLabelOverlay: getLabelOverlay("landing-video-1"),
      },
      {
        desktop: {
          url: getImageUrl("landing-bg"),
          img: true,
        },
        mobile: {
          url: getImageUrl("mobile-2"),
          img: true,
        },
        label: { enabled: false, text: "" },
        adminLabelOverlay: getLabelOverlay("landing-bg"),
      },
    ],
    [getImageUrl, getLabelOverlay]
  );

  const slides = dynamicSlides || fallbackSlides;

  const handleSlideChange = (newSlide) => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };
  const [isSmall, setSmall] = useState(window.innerWidth <= 728);

  useEffect(() => {
    const handleResize = () => {
      setSmall(window.innerWidth <= 728);
    };
    window.addEventListener("resize", handleResize);
    timerArray.current[currentSlide]?.classList.add("active");

    return () => {
      window.removeEventListener("resize", handleResize);
      timerArray.current[currentSlide]?.classList.remove("active");
    };
  }, [currentSlide]);

  return (
    <div className="landing-slider">
      {isPreview && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: "#faad14",
            color: "#000",
            textAlign: "center",
            padding: "4px 0",
            fontSize: "1.2rem",
            fontWeight: 600,
            zIndex: 100,
          }}
        >
          DRAFT PREVIEW - Changes not yet published
        </div>
      )}
      <Slider
        arrows={false}
        dots={false}
        afterChange={handleSlideChange}
        infinite={true}
        autoplaySpeed={5000}
        autoplay={true}
      >
        {slides.map((slide, index) => (
          <div key={index}>
            <div style={{ position: "relative", width: "100vw", overflow: "hidden" }}>
              {isSmall ? (
                slide.mobile.img ? (
                  <img
                    src={slide.mobile.url}
                    style={{
                      width: "100%",
                      display: "block",
                      objectFit: "cover",
                      objectPosition: "top center",
                    }}
                    alt="landing image"
                  />
                ) : (
                  <div style={{ width: "100%" }}>
                    <ReactPlayer
                      playIcon={<></>}
                      ref={playerRef}
                      url={slide.mobile.url}
                      controls={false}
                      loop={true}
                      muted={true}
                      playing={true}
                      width="100%"
                      height="auto"
                      playsinline
                    />
                  </div>
                )
              ) : slide.desktop.img ? (
                <img
                  src={slide.desktop.url}
                  style={{
                    width: "100%",
                    display: "block",
                    objectFit: "cover",
                    objectPosition: "top center",
                    minHeight: "60vh",
                  }}
                  alt="landing image"
                />
              ) : (
                <div style={{ width: "100%" }}>
                  <ReactPlayer
                    playIcon={<></>}
                    ref={playerRef}
                    url={slide.desktop.url}
                    controls={false}
                    loop={true}
                    muted={true}
                    playing={true}
                    width="100%"
                    height="auto"
                    playsinline
                  />
                </div>
              )}

              <LabelOverlay label={slide.label} isSmall={isSmall} />
              <SiteImageLabel labelOverlay={slide.adminLabelOverlay} />

              <div
                style={{
                  position: "absolute",
                  left: `${30 + 20 * index}%`,
                  top: "90%",
                  translate: "-50% -50%",
                  zIndex: 2,
                }}
              >
                <br />
                <Link to={SHOP} className="button">
                  Shop Now &nbsp;
                  <ArrowRightOutlined />
                </Link>
              </div>
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
          zIndex: 5,
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