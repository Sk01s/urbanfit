import React, { useEffect, useState } from "react";
import firebase from "@/services/firebase";
import { useDispatch } from "react-redux";
import { BasketItem } from "@/components/basket";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { LoadingOutlined } from "@ant-design/icons";

const UserOrdersTab = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState();
  const dispatch = useDispatch();
  useEffect(() => {
    const get = async () => {
      setLoading(true);
      await firebase
        .getUserOrders()
        .then((res) => res.docs.map((doc) => doc.data()))
        .then((orders) => setOrders(orders));
      setLoading(false);
    };
    get();
  }, []);
  return (
    <div className="loader" style={{ minHeight: "80dvh" }}>
      <h3>My Orders</h3>
      <ol style={{ padding: 0 }}>
        {loading ? (
          <LoadingOutlined />
        ) : orders?.length ? (
          orders?.map((item, index) => {
            return (
              <li
                style={{
                  marginBottom: "1rem",
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                key={index}
              >
                <h4 style={{ fontWeight: 400 }}>
                  {index + 1}. Order Id : #{item.id.split("-")[0]}
                </h4>
                <Link
                  style={{
                    border: "solid 1px ",
                    display: "flex",
                    placeItems: "center",
                    borderRadius: "1.5rem",
                    padding: "1rem 1.4rem",
                    fontSize: "1.3rem",
                    // maxHeight: "5rem",
                  }}
                  to={`/order/${item.id}`}
                >
                  view Order
                </Link>
              </li>
            );
          })
        ) : (
          <strong style={{ textAlign: "center" }}>
            <p className="text-subtle">You don&apos;t have any orders</p>
            <Link
              to="/shop"
              style={{ marginInline: "auto" }}
              className="button"
            >
              shop now
            </Link>
          </strong>
        )}
      </ol>
    </div>
  );
};

export default UserOrdersTab;
