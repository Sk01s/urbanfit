import React from "react";
import { categories } from "@/constants/constants";
import { Link } from "react-router-dom";
const Categories = () => {
  return (
    <main className="content">
      <div className="category-container" style={{ width: "100%" }}>
        {categories.map(({ value }, index) => (
          <Link to={"/category/" + value} className="category-card" key={index}>
            {value}
          </Link>
        ))}
      </div>
    </main>
  );
};

export default Categories;
