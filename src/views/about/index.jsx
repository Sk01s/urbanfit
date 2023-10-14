import { useScrollTop } from "@/hooks";
import React from "react";

const about = () => {
  useScrollTop();
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h2>Coming Soon</h2>
    </div>
  );
};

export default about;
