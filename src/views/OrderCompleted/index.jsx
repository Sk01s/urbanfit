import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import party from "party-js";

const Index = () => {
  const data = useLocation();
  const { email, lastName, firstName } = data.state.address;
  useEffect(() => {
    const celebration = setInterval(() => {
      party.confetti(document.body);
    }, 3000);
    return () => clearInterval(celebration);
  }, []);
  return (
    <main
      style={{
        paddingBlock: "4rem",
        color: "rgb(38, 75, 108)",
      }}
    >
      Thank You for Your Order! Your order has been received successfully.{" "}
      <br />
      <br />
      We'll keep you updated on the progress, Further details will be sent to
      your email at {email}
      <br />
      <br />
      Please note that your items will be delivered within 2 - 5 working days.
      <br />
      <br />
      if you have any questions, feel free to reach out. Thank you {
        firstName
      }{" "}
      {lastName} for choosing us!
    </main>
  );
};

export default Index;
