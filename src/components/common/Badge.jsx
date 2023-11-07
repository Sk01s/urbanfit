import PropType from "prop-types";
import React from "react";

const Badge = ({ count, children, style }) => (
  <div className="badge">
    {children}
    {count >= 1 && (
      <span className="badge-count" style={style}>
        {count}
      </span>
    )}
  </div>
);

Badge.propTypes = {
  count: PropType.number.isRequired,
  children: PropType.oneOfType([PropType.arrayOf(PropType.node), PropType.node])
    .isRequired,
};

export default Badge;
