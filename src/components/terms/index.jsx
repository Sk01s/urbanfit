import { Route, Router, Switch, Link } from "react-router-dom";
import React from "react";

const Index = (props) => {
  const { setAccepeted } = props;
  return (
    <div className="terms">
      <div>
        We use cookies to ensure you have the best browsing experience on our
        website. By using our site, you acknowledge that you have read and
        understood our
        <Link to={"/terms-conditions"}>Cookie Policy & Privacy Policy</Link>
      </div>
      <button
        className="bg-primeColor text-white text-lg font-bodyFont w-fit px-2 h-[50px] hover:bg-white duration-300 font-bold hover:text-primeColor"
        onClick={() => {
          localStorage.setItem("terms", true);
          setAccepeted(true);
        }}
      >
        Accept
      </button>
    </div>
  );
};

export default Index;
