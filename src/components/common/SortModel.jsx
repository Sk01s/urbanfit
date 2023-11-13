import React, { useState } from "react";

const SortModel = ({ setProducts, products }) => {
  const [expanded, setExpanded] = useState(false);
  const [sortType, setSortType] = useState();

  const toggleExpand = () => {
    setExpanded(!expanded);
  };
  const sortLowToHigh = () => {
    setSortType("Low to high");

    setProducts([...products.sort((a, b) => a.price - b.price)]);
    setExpanded(false);
  };
  const sortHighToLow = () => {
    setSortType("High to low");
    setProducts([...products.sort((a, b) => b.price - a.price)]);
    setExpanded(false);
  };

  return (
    <div
      className={`info-box ${expanded ? "" : "closed"}`}
      style={{
        width: "18rem",

        border: "none",
        marginLeft: "auto",
        boxShadow: expanded ? "0 6px 12px 1px #0000001f" : "none",
        borderRadius: ".5rem",
      }}
    >
      <div className="info-header" onClick={toggleExpand}>
        <div
          style={{
            display: "flex",
            gap: "2rem",
            alignItems: "center",
          }}
        >
          {sortType || "Sort by"}
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
        <button
          onClick={sortLowToHigh}
          style={{
            all: "unset",
            fontSize: "1.4rem",
            fontWeight: "700",
            marginBottom: "1rem",
            cursor: "pointer",
          }}
        >
          Price - low to high
        </button>
        <button
          onClick={sortHighToLow}
          style={{
            all: "unset",
            fontSize: "1.4rem",
            fontWeight: "700",
            marginBottom: "1rem",
            cursor: "pointer",
          }}
        >
          Price - high to low
        </button>
      </div>
    </div>
  );
};

export default SortModel;
