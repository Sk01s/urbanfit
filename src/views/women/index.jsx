import React from "react";
import { useSeason, useScrollTop, useSiteImages } from "@/hooks";
import { Link } from "react-router-dom";
const index = () => {
  useScrollTop();
  const season = useSeason();
  const { getImageUrl } = useSiteImages();

  return (
    <main className="content">
      <div
        className="category-container"
        style={{
          width: "100%",
        }}
      >
        <div className="category-gender">
          <Link
            to={"/store/women/tops"}
            className="category-card"
            style={{ backgroundImage: `url(${getImageUrl("women-card-1")})` }}
          >
            <div>
              <h3>Tops</h3>
              <button className="button">Shop Now</button>
            </div>
          </Link>
          <Link
            to={"/store/women/bottoms"}
            className="category-card"
            style={{ backgroundImage: `url(${getImageUrl("women-card-2")})` }}
          >
            <div>
              <h3>Bottoms</h3>
              <button className="button">Shop Now</button>
            </div>
          </Link>
          <Link
            to={"/store/women/active"}
            className="category-card"
            style={{ backgroundImage: `url(${getImageUrl("women-card-3")})` }}
          >
            <div>
              <h3>Active</h3>
              <button className="button">Shop Now</button>
            </div>
          </Link>
          <Link
            to={"/store/women/essential"}
            className="category-card"
            style={{ backgroundImage: `url(${getImageUrl("women-card-4")})` }}
          >
            <div>
              <h3>Essentials</h3>
              <button className="button">Shop Now</button>
            </div>
          </Link>
        </div>
        {/* <Link
          to={"/store/women/seasonal-collection"}
          className="category-card"
          style={{
            backgroundImage: "url('/women-card-5.jpg')",
            aspectRatio: "auto",
            height: "60rem",
          }}
        >
          <div>
            <h3>{season}</h3>
            <button className="button">Shop Now</button>
          </div>
        </Link> */}
      </div>
    </main>
  );
};

export default index;
