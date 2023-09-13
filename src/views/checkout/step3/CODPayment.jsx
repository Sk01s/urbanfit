/* eslint-disable jsx-a11y/label-has-associated-control */
import { useFormikContext } from "formik";
import React from "react";

const CODPayment = () => {
  const { values, setValues } = useFormikContext();

  return (
    <div
      className={`checkout-fieldset-collapse ${
        values.type === "COD" ? "is-selected-payment" : ""
      }`}
    >
      <div className="checkout-field margin-0">
        <div className="checkout-checkbox-field">
          <input
            checked={values.type === "COD"}
            id="modeCOD"
            name="type"
            onChange={(e) => {
              if (e.target.checked) {
                setValues({ ...values, type: "COD" });
              }
            }}
            type="radio"
          />
          <label className="d-flex w-100" htmlFor="modeCOD">
            <div className="d-flex-grow-1 margin-left-s">
              <h4 className="margin-0">Cash on delivery</h4>
              <span className="text-subtle d-block margin-top-s">
                Pay easily, fast and secure with Cash on delivery.
              </span>
            </div>

          </label>
        </div>
      </div>
    </div>
  );
};

export default CODPayment;
