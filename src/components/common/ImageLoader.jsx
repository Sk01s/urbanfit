import { LoadingOutlined } from "@ant-design/icons";
import PropType from "prop-types";
import React, { useState, useEffect, useRef } from "react";

// Global cache for loaded images to persist across re-renders
const loadedImagesCache = new Set();

const ImageLoader = ({ 
  src, 
  alt, 
  className, 
  draggable = true, 
  style,
  // New props for preventing layout shift
  aspectRatio = null, // e.g., "1/1", "4/3", "16/9"
  minHeight = "200px",
  minWidth = "200px",
  // Lazy loading props
  lazy = true,
}) => {
  const [loaded, setLoaded] = useState(loadedImagesCache.has(src));
  const [isInView, setIsInView] = useState(!lazy);
  const imgRef = useRef(null);
  const containerRef = useRef(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "100px", // Start loading 100px before image enters viewport
        threshold: 0.01,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [lazy, src]);

  const onLoad = () => {
    loadedImagesCache.add(src);
    setLoaded(true);
  };

  // Container styles to prevent layout shift
  const containerStyles = {
    position: "relative",
    minHeight: aspectRatio ? "auto" : minHeight,
    minWidth: minWidth,
    aspectRatio: aspectRatio || undefined,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: loaded ? "transparent" : "#f5f5f5",
    overflow: "hidden",
    ...style,
  };

  return (
    <div ref={containerRef} style={containerStyles}>
      {!loaded && (
        <LoadingOutlined
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "24px",
            color: "#999",
          }}
        />
      )}
      {isInView && (
        <img
          ref={imgRef}
          alt={alt || ""}
          className={`${className || ""} ${
            loaded ? "is-img-loaded" : "is-img-loading"
          }`}
          onLoad={onLoad}
          src={src}
          draggable={draggable}
          loading={lazy ? "lazy" : "eager"}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.3s ease-in-out",
          }}
        />
      )}
    </div>
  );
};

ImageLoader.defaultProps = {
  className: "image-loader",
  aspectRatio: null,
  minHeight: "200px",
  minWidth: "200px",
  lazy: true,
};

ImageLoader.propTypes = {
  src: PropType.string.isRequired,
  alt: PropType.string,
  className: PropType.string,
  aspectRatio: PropType.string,
  minHeight: PropType.string,
  minWidth: PropType.string,
  lazy: PropType.bool,
};

export default ImageLoader;
