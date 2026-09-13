import { LoadingOutlined, PrinterOutlined } from "@ant-design/icons";
import { useDocumentTitle, useScrollTop } from "@/hooks";
import { displayActionMessage } from "@/helpers/utils";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import firebase from "@/services/firebase";
import PackingSlipDoc from "./PackingSlipDoc";

const SinglePackingSlip = () => {
  useDocumentTitle("Packing Slip | Urbanfit Admin");
  useScrollTop();
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const autoPrinted = useRef(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const snapshot = await firebase.getOrder(orderId);
        if (snapshot.exists) {
          setOrder({ id: orderId, ...snapshot.data() });
        } else {
          displayActionMessage("Order not found", "error");
        }
      } catch (err) {
        console.error("Failed to load order:", err);
        displayActionMessage("Failed to load order", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  // Open the print dialog once the slip is ready.
  useEffect(() => {
    if (!loading && order && !autoPrinted.current) {
      autoPrinted.current = true;
      const timer = setTimeout(() => window.print(), 400);
      return () => clearTimeout(timer);
    }
  }, [loading, order]);

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
        }}
      >
        <h2 style={{ margin: 0 }}>Packing Slip</h2>
        <button
          className="button"
          onClick={() => window.print()}
          type="button"
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <PrinterOutlined /> Print
        </button>
      </div>

      {loading ? (
        <div className="loader" style={{ minHeight: "40dvh" }}>
          <LoadingOutlined style={{ fontSize: "2rem" }} />
        </div>
      ) : order ? (
        <PackingSlipDoc order={order} />
      ) : (
        <p style={{ textAlign: "center" }}>Order not found.</p>
      )}
    </div>
  );
};

export default SinglePackingSlip;
