/* eslint-disable jsx-a11y/label-has-associated-control */
import { CheckOutlined, LoadingOutlined } from "@ant-design/icons";
import { ImageLoader, MessageDisplay } from "@/components/common";
import { CustomCreatableSelect, CustomInput } from "@/components/formik";
import { useProducts } from "@/hooks";
import firebase from "@/services/firebase";
import { Field, Form, Formik } from "formik";
import PropType from "prop-types";
import React, { useEffect } from "react";
import * as Yup from "yup";
import { useFileHandler } from "@/hooks";


const FormSchema = Yup.object().shape({
  title: Yup.string().required("Title is required."),
  gender: Yup.string().required("Gender is required."),
  productIds: Yup.array()
    .of(Yup.string())
    .min(1, "Select at least one product."),
});

const SpecialPageForm = ({ page, onSubmit, isLoading, isEditing }) => {
  const { products, fetchProducts, error, isLoading: isProductsLoading } =
    useProducts();
  const { imageFile, isFileLoading, onFileChange } = useFileHandler({
    banner: {},
  });

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [products.length, fetchProducts]);

  const initFormikValues = {
    title: page?.title || "",
    gender: page?.gender || "",
    productIds: page?.productIds || [],
  };


  const onSubmitForm = async (values) => {
    const pageId = page?.id || (await firebase.generateSpecialPageKey());
    let bannerUrl = page?.bannerUrl || "";

    if (imageFile.banner?.file) {
      bannerUrl = await firebase.storeSpecialPageImage(
        pageId,
        imageFile.banner.file
      );
    }

    if (!bannerUrl) {
      alert("Banner image is required.");
      return;
    }

    onSubmit({
      id: pageId,
      title: values.title,
      gender: values.gender,
      productIds: values.productIds,
      bannerUrl,
      createdAt: page?.createdAt || Date.now(),
      updatedAt: Date.now(),
    });
  };

  const toggleProduct = (values, setFieldValue, productId) => {
    const selected = values.productIds.includes(productId);
    const next = selected
      ? values.productIds.filter((id) => id !== productId)
      : [...values.productIds, productId];
    setFieldValue("productIds", next);
  };

  return (
    <Formik
      initialValues={initFormikValues}
      validateOnChange
      validationSchema={FormSchema}
      onSubmit={onSubmitForm}
    >
      {({ values, setFieldValue }) => (
        <Form className="product-form">
          <div className="product-form-inputs">
            <div className="d-flex">
              <div className="product-form-field">
                <Field
                  component={CustomInput}
                  disabled={isLoading}
                  name="title"
                  type="text"
                  label="* Page Title"
                  placeholder="Special collection"
                />
              </div>
            </div>
            <div className="d-flex">
              <div className="product-form-field">
                <CustomCreatableSelect
                  defaultValue={
                    values.gender
                      ? { label: values.gender, value: values.gender }
                      : null
                  }
                  name="gender"
                  iid="special-page-gender"
                  options={[
                    { value: "Men", label: "Men" },
                    { value: "Women", label: "Women" },
                  ]}
                  disabled={isLoading}
                  placeholder="Select Gender"
                  label="* Gender"
                />
              </div>
            </div>
            <div className="product-form-field">
              <span className="d-block padding-s">Banner Image</span>
              {!isFileLoading && (
                <label htmlFor="special-page-banner">
                  <input
                    disabled={isLoading}
                    hidden
                    id="special-page-banner"
                    onChange={(event) =>
                      onFileChange(event, { name: "banner", type: "single" })
                    }
                    readOnly={isLoading}
                    type="file"
                    accept="image/*"
                  />
                  Choose Image
                </label>
              )}
            </div>
            <div className="product-form-image-wrapper">
              {(imageFile.banner?.url || page?.bannerUrl) && (
                <ImageLoader
                  alt=""
                  className="product-form-image-preview"
                  src={imageFile.banner?.url || page?.bannerUrl}
                />
              )}
            </div>
            <div style={{ marginTop: "2rem" }}>
              <div className="display-header" style={{ marginBottom: "1rem" }}>
                <h1>Select Products</h1>
              </div>
              {error && !isProductsLoading ? (
                <MessageDisplay
                  message={error}
                  action={fetchProducts}
                  buttonLabel="Try Again"
                />
              ) : (
                <div className="product-grid">
                  {products.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      className="product-display"
                      onClick={() =>
                        toggleProduct(values, setFieldValue, product.id)
                      }
                      style={{
                        border: values.productIds.includes(product.id)
                          ? "2px solid #111"
                          : "1px solid #e5e5e5",
                        background: "transparent",
                      }}
                    >
                      <div className="product-display-img">
                        <ImageLoader
                          className="product-card-img"
                          src={product.image}
                          draggable={false}
                        />
                      </div>
                      <div className="product-display-details">
                        <h4>{product.name}</h4>
                        <p>{product.categories}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="product-form-field product-form-submit">
              <button className="button" disabled={isLoading} type="submit">
                {isLoading ? <LoadingOutlined /> : <CheckOutlined />}
                &nbsp;
                {isLoading
                  ? "Saving Page"
                  : isEditing
                  ? "Save Page"
                  : "Create Page"}
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

SpecialPageForm.propTypes = {
  page: PropType.shape({
    id: PropType.string,
    title: PropType.string,
    gender: PropType.string,
    productIds: PropType.arrayOf(PropType.string),
    bannerUrl: PropType.string,
    createdAt: PropType.number,
  }),
  onSubmit: PropType.func.isRequired,
  isLoading: PropType.bool.isRequired,
  isEditing: PropType.bool,
};

SpecialPageForm.defaultProps = {
  page: null,
  isEditing: false,
};

export default SpecialPageForm;
