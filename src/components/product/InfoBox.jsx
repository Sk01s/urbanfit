import React, { useState } from "react";

const InfoBox = ({ title, description, open }) => {
  const [expanded, setExpanded] = useState(() => open);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <div className={`info-box ${expanded ? "" : "closed"}`}>
      <div className="info-header" onClick={toggleExpand}>
        <div
          style={{
            display: "flex",
            gap: "2rem",
            alignItems: "center",
          }}
        >
          {title}
        </div>
        <div className={`arrow ${expanded ? "up" : "down"}`}>
          <svg
            fill="#000000"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 330 330"
            width={10}
            height={10}
          >
            <path
              id="XMLID_225_"
              d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393
	c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393
	s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"
            />
          </svg>
        </div>
      </div>

      <div
        className={`info-content `}
        style={{
          maxHeight: expanded ? "300px" : "0",
          visibility: expanded ? "visible" : "hidden",
          opacity: expanded ? 1 : 0,
        }}
      >
        {description}
      </div>
    </div>
  );
};

export default InfoBox;
