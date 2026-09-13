import { LoadingOutlined, PrinterOutlined } from "@ant-design/icons";
import { useDocumentTitle, useScrollTop } from "@/hooks";
import { displayActionMessage } from "@/helpers/utils";
import React, { useEffect, useRef, useState } from "react";
import firebase from "@/services/firebase";
import PackingSlipDoc from "./PackingSlipDoc";

// Prints every pending (not delivered, not cancelled) order, oldest first —
// one slip per printed page. This is the "morning packing run" view.
const BulkPackingSlips = () => {
  useDocumentTitle("Pending Packing Slips | Urbanfit Admin");
  useScrollTop();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const autoPrinted = useRef(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await firebase.getOrders();
        const pending = res.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((order) => !order.cancelled && !order.fulfillment)
          .sort((a, b) => {
            const timeA =
              a.date && typeof a.date.toDate === "function"
                ? a.date.toDate().getTime()
                : new Date(a.date).getTime();
            const timeB =
              b.date && typeof b.date.toDate === "function"
                ? b.date.toDate().getTime()
                : new Date(b.date).getTime();
            return timeA - timeB;
          });
        setOrders(pending);
      } catch (err) {
        console.error("Failed to load orders:", err);
        displayActionMessage("Failed to load orders", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Open the print dialog once all slips are rendered.
  useEffect(() => {
    if (!loading && orders.length > 0 && !autoPrinted.current) {
      autoPrinted.current = true;
      const timer = setTimeout(() => window.print(), 600);
      return () => clearTimeout(timer);
    }
  }, [loading, orders]);

  return (
    <div className="packing-slip-print" style={{ padding: "20px" }}>
      <div
        className="no-print"
        style={{
          maxWidth: "760px",
          margin: "0 auto 1.5rem",
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <h2 style={{ margin: 0 }}>
          Pending Packing Slips ({orders.length})
        </h2>
        {orders.length > 0 && (
          <button
            className="button"
            onClick={() => window.print()}
            type="button"
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <PrinterOutlined /> Print all ({orders.length})
          </button>
        )}
      </div>

      {loading ? (
        <div className="loader" style={{ minHeight: "40dvh" }}>
          <LoadingOutlined style={{ fontSize: "2rem" }} />
        </div>
      ) : orders.length === 0 ? (
        <p style={{ textAlign: "center" }}>
          No pending orders — nothing to pack. 🎉
        </p>
      ) : (
        orders.map((order) => <PackingSlipDoc key={order.id} order={order} />)
      )}
    </div>
  );
};

export default BulkPackingSlips;
