import React from "react";
import { useSeason } from "@/hooks";
import { Link } from "react-router-dom";
import { useScrollTop } from "@/hooks";
const index = () => {
  useScrollTop();
  const season = useSeason();

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
            style={{ backgroundImage: "url('/women-card-1.jpg')" }}
          >
            <div>
              <h3>Tops</h3>
              <button className="button">Shop Now</button>
            </div>
          </Link>
          <Link
            to={"/store/women/bottoms"}
            className="category-card"
            style={{ backgroundImage: "url('/women-card-2.jpg')" }}
          >
            <div>
              <h3>Bottoms</h3>
              <button className="button">Shop Now</button>
            </div>
          </Link>
          <Link
            to={"/store/women/active"}
            className="category-card"
            style={{ backgroundImage: "url('/women-card-3.jpg')" }}
          >
            <div>
              <h3>Active</h3>
              <button className="button">Shop Now</button>
            </div>
          </Link>
          <Link
            to={"/store/women/essential"}
            className="category-card"
            style={{ backgroundImage: "url('/women-card-4.jpg')" }}
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
