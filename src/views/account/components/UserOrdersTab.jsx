import React, { useEffect, useState } from "react";
import firebase from "@/services/firebase";
import { useDispatch } from "react-redux";
import { BasketItem } from "@/components/basket";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

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
      <ol>
        {orders ? (
          orders?.map((item, index) => {
            return (
              <li style={{ marginBottom: "1rem" }}>
                <Link to={`/order/${item.id}`} style={{ fontWeight: 400 }}>
                  Order Id : #{item.id.split("-")[0]}
                </Link>
              </li>
            );
          })
        ) : (
          <strong>
            <span className="text-subtle">You don&apos;t have any orders</span>
            <button>shop now</button>
          </strong>
        )}
      </ol>
    </div>
  );
};

export default UserOrdersTab;
