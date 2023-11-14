import { useScrollTop } from "@/hooks";
import React from "react";

const about = () => {
  useScrollTop();
  return (
    <main className="content">
      <div
        style={{
          marginTop: "4rem",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          width: "100%",
          gap: "2rem",
        }}
      >
        <h2>Our Story</h2>
        <div className="about-banner" />
      </div>
      <div className="about-section">
        {/* <div className="text">
          <h2>
            Our 2023 goals. An empowering year of positivity. Here's our plan.
          </h2>
          <p>
            In January 2023, we crossed $4 million in donations – all of which
            goes directly to Dubai Cares and Harmony House India to change the
            lives of little ones. For this year, we hope to multiply our impact,
            together, and change even more people’s lives.
          </p>
        </div>
        <div className="image" /> */}
      </div>
    </main>
  );
};

export default about;
