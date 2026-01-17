import { useFormikContext } from "formik";
import { displayMoney } from "@/helpers/utils";
import { shipping as defaultShipping } from "@/constants/constants";
import PropType from "prop-types";
import React, { useState, useEffect } from "react";

const BACKEND_API_URL =
  import.meta.env.VITE_BACKEND_API_URL || "http://localhost:3001";

const ShippingTotal = ({ subtotal }) => {
  const { values } = useFormikContext();
  const [shippingRate, setShippingRate] = useState(defaultShipping);
  const [loading, setLoading] = useState(false);

  // Fetch shipping rate when city changes
  useEffect(() => {
    const fetchShippingRate = async () => {
      if (!values.city) {
        setShippingRate(defaultShipping);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `${BACKEND_API_URL}/api/shipping/rate/${encodeURIComponent(values.city)}`
        );
        const data = await response.json();

        if (data.success) {
          setShippingRate(data.rate);
        } else {
          setShippingRate(defaultShipping);
        }
      } catch (error) {
        console.error("Failed to fetch shipping rate:", error);
        setShippingRate(defaultShipping);
      } finally {
        setLoading(false);
      }
    };

    // Debounce the fetch to avoid too many requests while typing
    const timeoutId = setTimeout(fetchShippingRate, 300);
    return () => clearTimeout(timeoutId);
  }, [values.city]);

  return (
    <div className="checkout-total d-flex-end padding-right-m">
      <table>
        <tbody>
          <tr>
            <td>
              <span className="d-block margin-0 padding-right-s text-right">
                Shipping{values.city && ` (${values.city})`}: &nbsp;
              </span>
            </td>
            <td>
              <h4 className="basket-total-amount text-subtle text-right margin-0 ">
                {loading ? "..." : displayMoney(shippingRate)}
              </h4>
            </td>
          </tr>
          <tr>
            <td>
              <span className="d-block margin-0 padding-right-s text-right">
                Subtotal: &nbsp;
              </span>
            </td>
            <td>
              <h4 className="basket-total-amount text-subtle text-right margin-0">
                {displayMoney(subtotal)}
              </h4>
            </td>
          </tr>
          <tr>
            <td>
              <span className="d-block margin-0 padding-right-s text-right">
                Total: &nbsp;
              </span>
            </td>
            <td>
              <h2 className="basket-total-amount text-right">
                {displayMoney(Number(subtotal) + shippingRate)}
              </h2>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

ShippingTotal.propTypes = {
  subtotal: PropType.number.isRequired,
};

export default ShippingTotal;
