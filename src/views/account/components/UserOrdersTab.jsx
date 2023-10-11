import React, { useEffect, useState } from "react";
import firebase from "@/services/firebase";
import { useDispatch } from "react-redux";
import { BasketItem } from "@/components/basket";

const UserOrdersTab = () => {
  const [orders, setOrders] = useState();
  const dispatch = useDispatch();
  useEffect(() => {
    firebase
      .getUserOrders()
      .then((res) => res.docs.map((doc) => doc.data()))
      .then((orders) => setOrders(orders));
  }, []);
  return (
    <div className="loader" style={{ minHeight: "80dvh" }}>
      <h3>My Orders</h3>
      {orders ? (
        orders?.map((item) => {
          return <div>hi</div>;
        })
      ) : (
        <strong>
          <span className="text-subtle">You don&apos;t have any orders</span>
          <button>shop now</button>
        </strong>
      )}
    </div>
  );
};

export default UserOrdersTab;
