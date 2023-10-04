import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import party from "party-js";
import firebase from "@/services/firebase";

const Index = () => {
  const data = useLocation();

  const address = data?.state?.address;
  const items = data?.state?.items;
  const payment = data?.state?.payment;
  useEffect(() => {
    const celebration = setInterval(() => {
      party.confetti(document.body);
    }, 3000);
    return () => clearInterval(celebration);
  }, []);
  return (
    <main style={{ marginTop: "4rem" }}>
      <div
        style={{
          display: "flex",
          gap: "2rem",
          justifyContent: "left",
          alignItems: "center",
          width: "100vw",
        }}
      >
        <svg
          width={50}
          height={50}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 50 50"
          fill="none"
          stroke-width="2"
          class="checkmark"
          stroke="#5b9bbe"
        >
          <path
            class="checkmark__circle"
            d="M25 49c13.255 0 24-10.745 24-24S38.255 1 25 1 1 11.745 1 25s10.745 24 24 24z"
          ></path>
          <path
            class="checkmark__check"
            d="M15 24.51l7.307 7.308L35.125 19"
          ></path>
        </svg>
        <div>
          <span>Order Completed</span>
          <p style={{ margin: ".5rem 0 0 0 " }}>
            THANK YOU, {firebase.auth.currentUser.displayName}
          </p>
        </div>
      </div>
      <h3 style={{ maxWidth: "80vw" }}>
        Your order is confirmed You’ll receive an email when your order is
        ready.
      </h3>
      <div
        style={{
          border: "solid 1px",
          padding: "1rem",
          maxWidth: "95vw",
          fontWeight: "lighter",
        }}
      >
        <h3>Order details</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(250px,400px))",
          }}
        >
          <div>
            <h4>Contact information</h4>
            <p>{address?.email || "alsarakibiy@gmail.com"}</p>
          </div>
          <div>
            <h4>Shipping address</h4>
            <div>{address?.city || "birute"}</div>
            <div>{address?.street || "200 street"}</div>
            <div>{address?.building || "afaf building"}</div>
            <div>{address?.floor || "2th floor"}</div>
            <div>{address?.nearby || "Omar store"}</div>
          </div>
          <div>
            <h3>Payment method</h3>
            {(payment === "COD" && "Cash on delivery") || payment}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Index;
