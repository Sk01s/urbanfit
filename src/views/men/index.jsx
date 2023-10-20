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
        <div className="category-gender">
          <Link to={"/store/men/tops"} className="category-card">
            <div>
              <h3>Tops</h3>
              <button className="button">Shop Now</button>
            </div>
          </Link>
          <Link to={"/store/men/bottoms"} className="category-card">
            <div>
              <h3>Bottoms</h3>
              <button className="button">Shop Now</button>
            </div>
          </Link>
          <Link to={"/store/men/active"} className="category-card">
            <div>
              <h3>Active</h3>
              <button className="button">Shop Now</button>
            </div>
          </Link>
          <Link to={"/store/men/essential"} className="category-card">
            <div>
              <h3>Essential</h3>
              <button className="button">Shop Now</button>
            </div>
          </Link>
        </div>
        <Link to={"/store/men/seasonal-collection"} className="category-card">
          <div>
            <h3>{season}</h3>
            <button className="button">Shop Now</button>
          </div>
        </Link>
      </div>
    </main>
  );
};

export default index;
