/* eslint-disable jsx-a11y/label-has-associated-control */
import { CheckOutlined, LoadingOutlined } from "@ant-design/icons";
import { ImageLoader } from "@/components/common";
import {
  CustomColorInput,
  CustomCreatableSelect,
  CustomInput,
  CustomTextarea,
} from "@/components/formik";
import { Field, FieldArray, Form, Formik } from "formik";
import { useFileHandler } from "@/hooks";
import PropType from "prop-types";
import React from "react";
import * as Yup from "yup";
import { categories, type } from "@/constants/constants";
import { useState } from "react";
import { ProductRelative } from "@/components/product";
import { CustomDate } from "@/components/formik";
import dayjs from "dayjs";
// Default type names that I used. You can use what you want

const FormSchema = Yup.object().shape({
  code: Yup.string()
    .required("promo code is required.")
    .max(60, "promo name must only be less than 60 characters."),
  percentage: Yup.number()
    .max(100, "the percentage can't exeed 100")
    .min(1, "the percentage can't be less than 1")
    .required("percentage is required"),
  max: Yup.number()
    .positive("max quantity is invalid.")
    .required("max quantity  is required."),
  startDate: Yup.date().required("max quantity  is required."),
  endDate: Yup.date().required("max quantity  is required."),
  // uses: Yup.number()
  //   .min(0, "number is invalid.")
  //   .integer(" quantity should be an integer.")
  //   .required(" quantity is required."),
});

const PromoForm = ({ onSubmit, isLoading }) => {
  const initFormikValues = {
    code: "",
    endDate: new Date(),
    startDate: new Date(),
    max: 1,
    percentage: 1,
  };

  const onSubmitForm = (form) => {
    onSubmit({
      ...form,
      startDate: form.startDate.getTime(),
      endDate: form.endDate.getTime(),
      uses: 0,
      orders: [],
      dateAdded: new Date().getTime(),
    });
  };

  return (
    <div>
      <Formik
        initialValues={initFormikValues}
        validateOnChange
        validationSchema={FormSchema}
        onSubmit={onSubmitForm}
      >
        {({ values, setValues }) => (
          <Form className="product-form">
            <div className="product-form-inputs">
              <div className="d-flex">
                <div className="product-form-field">
                  <Field
                    disabled={isLoading}
                    name="code"
                    type="text"
                    label="* Promo code"
                    placeholder=""
                    component={CustomInput}
                  />
                </div>
                &nbsp;
              </div>

              <div className="d-flex">
                <div className="product-form-field">
                  <Field
                    disabled={isLoading}
                    name="max"
                    id="max"
                    type="number"
                    label="* Max uses"
                    component={CustomInput}
                  />
                </div>
                &nbsp;
              </div>
              <div className="d-flex">
                <div className="product-form-field">
                  <Field
                    disabled={isLoading}
                    name="percentage"
                    type="number"
                    id="percentage"
                    label="* Percentage"
                    component={CustomInput}
                  />
                </div>
              </div>
              <div className="d-flex">
                &nbsp;
                <div className="product-form-field">
                  <CustomDate
                    propName="startDate"
                    values={values}
                    setValues={setValues}
                    value={values.startDate}
                    name="Start Date"
                  />
                </div>
              </div>
              <div className="d-flex">
                &nbsp;
                <div className="product-form-field">
                  <CustomDate
                    propName="endDate"
                    value={values.endDate}
                    values={values}
                    setValues={setValues}
                    name="End Date"
                    comparedTo={values.startDate}
                  />
                </div>
              </div>

              <br />

              <br />

              <br />
              <br />
              <br />
              <div className="product-form-field product-form-submit">
                <button className="button" disabled={isLoading} type="submit">
                  {isLoading ? <LoadingOutlined /> : <CheckOutlined />}
                  &nbsp;
                  {isLoading ? "Saving Promo" : "Save Promo"}
                </button>
              </div>
            </div>
            {/* ----THUBMNAIL ---- */}
            {/* <div className="product-form-file">
              <div className="product-form-field">
                <span className="d-block padding-s">* Thumbnail</span>
                {!isFileLoading && (
                  <label htmlFor="product-input-file">
                    <input
                      disabled={isLoading}
                      hidden
                      id="product-input-file"
                      onChange={(e) =>
                        onFileChange(e, { name: "image", type: "single" })
                      }
                      readOnly={isLoading}
                      type="file"
                    />
                    Choose Image
                  </label>
                )}
              </div>
              <div className="product-form-image-wrapper">
                {(imageFile.image.url || product.image) && (
                  <ImageLoader
                    alt=""
                    className="product-form-image-preview"
                    src={imageFile.image.url || product.image}
                  />
                )}
              </div>
            </div> */}
          </Form>
        )}
      </Formik>
    </div>
  );
};

PromoForm.propTypes = {
  onSubmit: PropType.func.isRequired,
  isLoading: PropType.bool.isRequired,
};

export default PromoForm;
