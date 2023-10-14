/* eslint-disable jsx-a11y/label-has-associated-control */
import {
  CustomInput,
  CustomMobileInput,
  CustomCreatableSelect,
} from "@/components/formik";
import { Field, useFormikContext } from "formik";
import React from "react";
import { countries } from "@/constants/constants";

const ShippingForm = () => {
  const { values } = useFormikContext();
  return (
    <div className="checkout-shipping-wrapper">
      <div className="checkout-shipping-form">
        <div className="checkout-fieldset">
          <div className="d-block checkout-field">
            <Field
              name="fullname"
              type="text"
              label="Full name"
              component={CustomInput}
              style={{ textTransform: "capitalize" }}
            />
          </div>
          <div className="d-block checkout-field">
            <Field
              name="email"
              type="email"
              label="Email"
              component={CustomInput}
            />
          </div>
        </div>
        <div className="checkout-fieldset">
          <div className="d-block checkout-field">
            <Field
              name="street"
              type="text"
              label="Street"
              component={CustomInput}
            />
          </div>
          <div className="d-block checkout-field">
            <Field
              name="city"
              type="text"
              label="City"
              component={CustomInput}
            />
          </div>
        </div>
        <div className="checkout-fieldset">
          <div className="d-block checkout-field">
            <Field
              name="building"
              type="text"
              label="Building"
              component={CustomInput}
            />
          </div>
          <div className="d-block checkout-field">
            <Field
              name="floor"
              type="text"
              label="Floor"
              component={CustomInput}
            />
          </div>
        </div>
        <div className="checkout-fieldset">
          <div className="d-block checkout-field">
            <Field
              name="nearby"
              type="text"
              label="Near by"
              component={CustomInput}
            />
          </div>
          <div className="d-block checkout-field">
            <CustomMobileInput name="mobile" defaultValue={values.mobile} />
          </div>
          <div className="d-block">
            <div className="product-form-field" style={{}}>
              <CustomCreatableSelect
                defaultValue={{
                  label: "lebanon",
                  value: "lebanon",
                }}
                name="categories"
                iid="categories"
                options={countries}
                label="Countries"
              />
            </div>
          </div>
        </div>
        <div className="checkout-fieldset">
          <Field name="isInternational">
            {({ field, form, meta }) => (
              <div className="checkout-field">
                {meta.touched && meta.error ? (
                  <span className="label-input label-error">{meta.error}</span>
                ) : (
                  // eslint-disable-next-line jsx-a11y/label-has-associated-control
                  <label className="label-input" htmlFor={field.name}>
                    Shipping Option
                  </label>
                )}
                <div className="checkout-checkbox-field">
                  <input
                    checked={field.value}
                    id={field.name}
                    onChange={(e) => {
                      form.setValues({
                        ...form.values,
                        [field.name]: e.target.checked,
                      });
                    }}
                    value={meta.value}
                    type="checkbox"
                  />
                  <label className="d-flex w-100" htmlFor={field.name}>
                    <h5 className="d-flex-grow-1 margin-0">
                      &nbsp; International Shipping &nbsp;
                      <span className="text-subtle">7-14 days</span>
                    </h5>
                    <h4 className="margin-0">$50.00</h4>
                  </label>
                </div>
              </div>
            )}
          </Field>
        </div>
      </div>
    </div>
  );
};

export default ShippingForm;
