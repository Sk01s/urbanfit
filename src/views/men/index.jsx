import React from "react";
import { useSeason, useScrollTop, useSiteImages, useSiteTexts } from "@/hooks";
import { SiteImageLabel } from "@/components/common";
import { Link } from "react-router-dom";
const index = () => {
  useScrollTop();
  const season = useSeason();
  const { getImageUrl, getLabelOverlay } = useSiteImages();
  const { getCategoryTitle } = useSiteTexts();

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
            to={"/store/men/tops"}
            className="category-card"
            style={{ backgroundImage: `url(${getImageUrl("men-card-1")})` }}
          >
            <div>
              <h3>Tops</h3>
              <button className="button">Shop Now</button>
            </div>
            <SiteImageLabel labelOverlay={getLabelOverlay("men-card-1")} />
          </Link>
          <Link
            to={"/store/men/bottoms"}
            className="category-card"
            style={{ backgroundImage: `url(${getImageUrl("men-card-2")})` }}
          >
            <div>
              <h3>Bottoms</h3>
              <button className="button">Shop Now</button>
            </div>
            <SiteImageLabel labelOverlay={getLabelOverlay("men-card-2")} />
          </Link>
          <Link
            to={"/store/men/active"}
            className="category-card"
            style={{ backgroundImage: `url(${getImageUrl("men-card-3")})` }}
          >
            <div>
              <h3>Active</h3>
              <button className="button">Shop Now</button>
            </div>
            <SiteImageLabel labelOverlay={getLabelOverlay("men-card-3")} />
          </Link>
          <Link
            to={"/store/men/essential"}
            className="category-card"
            style={{ backgroundImage: `url(${getImageUrl("men-card-4")})` }}
          >
            <div>
              <h3>{getCategoryTitle("essential")}</h3>
              <button className="button">Shop Now</button>
            </div>
            <SiteImageLabel labelOverlay={getLabelOverlay("men-card-4")} />
          </Link>
        </div>
        {/* <Link
          to={"/store/men/seasonal-collection"}
          className="category-card"
          style={{
            backgroundImage: "url('/card-5.jpg')",
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
