import React from "react";
import { useSeason } from "@/hooks";
import { Link } from "react-router-dom";
const index = () => {
  const season = useSeason();

  return (
    <main className="content">
      <div
        className="category-container"
        style={{
          width: "100%",
        }}
      >
        <div
          style={{
            width: "100%",
            gap: "2rem",
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill,minmax(200px,calc(50% - 1rem)))",
            marginBottom: "2rem",
          }}
        >
          <Link to={"/store/women/tops"} className="category-card">
            <div>
              <p>Tops</p>
              <button>Shop Now</button>
            </div>
          </Link>
          <Link to={"/store/women/bottoms"} className="category-card">
            <div>
              <p>Bottoms</p>
              <button>Shop Now</button>
            </div>
          </Link>
          <Link to={"/store/women/active"} className="category-card">
            <div>
              <p>Active</p>
              <button>Shop Now</button>
            </div>
          </Link>
          <Link to={"/store/women/essential"} className="category-card">
            <div>
              <p>Essential</p>
              <button>Shop Now</button>
            </div>
          </Link>
        </div>
        <Link to={"/store/women/seasonal-collection"} className="category-card">
          <div>
            <p>{season}</p>
            <button>Shop Now</button>
          </div>
        </Link>
      </div>
    </main>
  );
};

export default index;
