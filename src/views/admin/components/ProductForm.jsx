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
import firebaseInstance from "@/services/firebase";
import { useProducts } from "@/hooks";
import { arraysHaveSameValues } from "@/helpers/utils";
// Default type names that I used. You can use what you want

const FormSchema = Yup.object().shape({
  name: Yup.string()
    .required("Product name is required.")
    .max(60, "Product name must only be less than 60 characters."),
  categories: Yup.string().required("Categories name is required."),
  type: Yup.object().shape({
    name: Yup.string().required("name is required"),
    categories: Yup.string().required("categories is required"),
  }),
  sex: Yup.string().required(" Sex is required.  😉"),
  price: Yup.number()
    .positive("Price is invalid.")
    .required("Price is required."),
  description: Yup.string().required("Description is required."),
  xlQuantity: Yup.number()
    .min(0, "number is invalid.")
    .integer(" quantity should be an integer.")
    .required(" quantity is required."),
  lgQuantity: Yup.number()
    .min(0, "number is invalid.")
    .integer(" quantity should be an integer.")
    .required(" quantity is required."),
  smQuantity: Yup.number()
    .min(0, "number is invalid.")
    .integer(" quantity should be an integer.")
    .required(" quantity is required."),
  xsQuantity: Yup.number()
    .min(0, "number is invalid.")
    .integer(" quantity should be an integer.")
    .required(" quantity is required."),
  keywords: Yup.array().of(Yup.string()),
  relative: Yup.array()
    .of(Yup.string())
    .min(0, "Please enter at least 1 keyword for this product."),
  onSale: Yup.boolean(),
  percentage: Yup.number()
    .min(0, "percentage should be postive")
    .max(100, "should not exeed 100"),

  priority: Yup.number().min(-1).max(1).required("Set priority "),
  isSeasonal: Yup.boolean(),
  isEssential: Yup.boolean(),
  isCool: Yup.boolean(),
  isLuxury: Yup.boolean(),
  isNew: Yup.boolean(),
  availableColors: Yup.array()
    .of(Yup.string().required())
    .min(1, "Please add a default color for this product."),
});

const ProductForm = ({ product, onSubmit, isLoading, isEditing }) => {
  const initFormikValues = {
    name: product?.name || "",
    categories: product?.categories || "",
    type: product?.type || { name: "", categories: "" },
    sex: product?.sex || "",
    price: product?.price || 0,
    onSale: product?.onSale || false,
    percentage: product?.percentage || 0,
    priority: product?.priority || 0,
    xlQuantity: product?.xlQuantity || 0,
    lgQuantity: product?.lgQuantity || 0,
    mdQuantity: product?.mdQuantity || 0,
    smQuantity: product?.smQuantity || 0,
    xsQuantity: product?.xsQuantity || 0,
    description: product?.description || "",
    keywords: product?.keywords || [],
    relative: product?.relative || [],
    isSeasonal: product?.isSeasonal || false,
    isEssential: product?.isEssential || false,
    isCool: product?.isCool || false,
    isNew: product?.isNew || false,
    isLuxury: product?.isLuxury || false,
    availableColors: product?.availableColors || [],
  };

  const { imageFile, isFileLoading, onFileChange, removeImage } =
    useFileHandler({
      image: {},
      imageCollection: product?.imageCollection || [],
    });

  const { products } = useProducts();
  const onSubmitForm = async (form) => {
    if (imageFile.image.file || product.imageUr || isEditing) {
      const productId = product.id || (await firebaseInstance.generateKey());
      // const setRelatives = (relativeIdArray) =>
      //   relativeIdArray.length === 0
      //     ? []
      //     : relativeIdArray.map(async (id) => {
      //         if (productId === id) return;
      //         const currentProduct = products.find(
      //           (product) => product.id === id
      //         );
      //         const relatives = [...relativeIdArray, productId].filter(
      //           (itemId) => id !== itemId
      //         );

      //         if (arraysHaveSameValues(currentProduct.relative, relatives)) {
      //           return;
      //         }
      //         currentProduct.relative = relatives;
      //         await firebaseInstance.editProduct(
      //           currentProduct.id,
      //           currentProduct
      //         );
      //       });
      // setRelatives(form.relative || []);
      // if (product.relative) {
      //   product.relative.map(async (productId) => {
      //     if (form.relative.includes(productId)) return;
      //     const currentProduct = products.find(
      //       (product) => product.id === productId
      //     );
      //     currentProduct.relative = [];
      //     await firebaseInstance.editProduct(currentProduct.id, currentProduct);
      //   });
      // }
      onSubmit({
        id: productId,
        ...form,
        totalQuantity:
          form.xlQuantity +
          form.mdQuantity +
          form.lgQuantity +
          form.smQuantity +
          form.xsQuantity,
        // due to firebase function billing policy, let's add lowercase version
        // of name here instead in firebase functions
        name_lower: form.name.toLowerCase(),
        dateAdded: new Date().getTime(),
        image: imageFile.image.file || product.image,
        imageCollection: imageFile.imageCollection,
      });
    } else {
      // eslint-disable-next-line no-alert
      alert("Product thumbnail image is required.");
    }
  };
  const priority = (value) => {
    if (value === 0) return "Normal";
    if (value === 1) return "High";
    if (value === -1) return "Low";
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
                    name="name"
                    type="text"
                    label="* Product Name"
                    placeholder="fuck you omar"
                    style={{ textTransform: "capitalize" }}
                    component={CustomInput}
                  />
                </div>
                &nbsp;
              </div>
              <div className="d-flex">
                <div className="product-form-field">
                  <CustomCreatableSelect
                    defaultValue={{
                      label: values.categories,
                      value: values.categories,
                    }}
                    name="categories"
                    iid="categories"
                    options={categories}
                    disabled={isLoading}
                    placeholder="Select/Create Categories"
                    label="* Categories"
                  />
                </div>
              </div>
              <div className="d-flex">
                <div className="product-form-field">
                  <CustomCreatableSelect
                    defaultValue={{
                      label: values.type.name,
                      value: values.type,
                    }}
                    name="type"
                    iid="type"
                    options={type}
                    disabled={isLoading}
                    placeholder="Select/Create Type"
                    label="* Type"
                  />
                </div>
                <div className="product-form-field">
                  <CustomCreatableSelect
                    defaultValue={{
                      label: values.sex,
                      value: values.sex,
                    }}
                    name="sex"
                    iid="sex"
                    options={[
                      { value: "Men", label: "Men" },
                      { value: "Women", label: "Women" },
                    ]}
                    disabled={isLoading}
                    placeholder="Select/Create Sex"
                    label="* Sex"
                  />
                </div>
              </div>
              <div className="d-flex">
                <div className="product-form-field">
                  <Field
                    disabled={isLoading}
                    name="description"
                    id="description"
                    rows={3}
                    label="* Product Description"
                    component={CustomTextarea}
                  />
                </div>
              </div>
              <div className="d-flex">
                <div className="product-form-field">
                  <Field
                    disabled={isLoading}
                    name="price"
                    id="price"
                    type="number"
                    label="* Price"
                    component={CustomInput}
                  />
                </div>
                &nbsp;
                <div className="product-form-field">
                  <Field
                    disabled={isLoading}
                    name="xlQuantity"
                    type="number"
                    id="xlQuantity"
                    label="* Xl Quantity"
                    component={CustomInput}
                  />
                </div>
              </div>
              <div className="d-flex">
                <div className="product-form-field">
                  <Field
                    disabled={isLoading}
                    name="lgQuantity"
                    id="lgQuantity"
                    type="number"
                    label="* Lg Quantity"
                    component={CustomInput}
                  />
                </div>
                &nbsp;
                <div className="product-form-field">
                  <Field
                    disabled={isLoading}
                    name="mdQuantity"
                    type="number"
                    id="mdQuantity"
                    label="* Md Quantity"
                    component={CustomInput}
                  />
                </div>
              </div>
              <div className="d-flex">
                <div className="product-form-field">
                  <Field
                    disabled={isLoading}
                    name="smQuantity"
                    id="smQuantity"
                    type="number"
                    label="* Sm Quantity"
                    component={CustomInput}
                  />
                </div>
                &nbsp;
                <div className="product-form-field">
                  <Field
                    disabled={isLoading}
                    name="xsQuantity"
                    type="number"
                    id="xsQuantity"
                    label="* Xs Quantity"
                    component={CustomInput}
                  />
                </div>
              </div>
              <div className="d-flex">
                <div className="product-form-field">
                  <CustomCreatableSelect
                    defaultValue={values.keywords.map((key) => ({
                      value: key,
                      label: key,
                    }))}
                    name="keywords"
                    iid="keywords"
                    isMulti
                    disabled={isLoading}
                    placeholder="Create/Select Keywords"
                    label="* Keywords"
                    creatable={true}
                  />
                </div>
                &nbsp;
                {/* <div className="product-form-field">
                  <CustomCreatableSelect
                    defaultValue={values.keywords.map((key) => ({
                      value: key,
                      label: key,
                    }))}
                    name="sizes"
                    iid="sizes"
                    type="text"
                    isMulti
                    disabled={isLoading}
                    placeholder="Create/Select Sizes"
                    label="* Sizes (Millimeter)"
                  />
                </div> */}
              </div>
              <div className="d-flex">
                <div className="product-form-field">
                  <CustomCreatableSelect
                    defaultValue={{
                      label: values.onSale ? "yes" : "no",
                      value: values.onSale,
                    }}
                    name="onSale"
                    iid="onSale"
                    options={[
                      { label: "yes", value: true },
                      { label: "no", value: false },
                    ]}
                    disabled={isLoading}
                    placeholder="on Sale"
                    label="* On Sale"
                  />
                </div>
                &nbsp;
              </div>
              <div className="d-flex">
                <div className="product-form-field">
                  <CustomCreatableSelect
                    defaultValue={{
                      label: priority(values.priority),
                      value: values.priority,
                    }}
                    name="priority"
                    iid="priority"
                    options={[
                      { value: 1, label: "High" },
                      { value: 0, label: "Normal" },
                      { value: -1, label: "Low" },
                    ]}
                    disabled={isLoading}
                    label="* Priority"
                  />
                </div>
              </div>
              <div className="d-flex">
                <div className="product-form-field">
                  <Field
                    disabled={!values.onSale}
                    name="percentage"
                    id="percentage"
                    type="number"
                    label="* Sale percentage"
                    component={CustomInput}
                  />
                </div>
              </div>
              <div className="product-form-field">
                <FieldArray
                  name="availableColors"
                  disabled={isLoading}
                  component={CustomColorInput}
                />
              </div>
              <div className="product-form-field">
                <span className="d-block padding-s">Image Collection</span>
                {!isFileLoading && (
                  <label htmlFor="product-input-file-collection">
                    <input
                      disabled={isLoading}
                      hidden
                      id="product-input-file-collection"
                      multiple
                      onChange={(e) =>
                        onFileChange(e, {
                          name: "imageCollection",
                          type: "multiple",
                        })
                      }
                      readOnly={isLoading}
                      type="file"
                    />
                    Choose Images
                  </label>
                )}
              </div>
              <div className="product-form-collection">
                <>
                  {imageFile.imageCollection.length >= 1 &&
                    imageFile.imageCollection.map((image) => (
                      <div
                        className="product-form-collection-image"
                        key={image.id}
                      >
                        <ImageLoader alt="" src={image.url} />
                        <button
                          className="product-form-delete-image"
                          onClick={() =>
                            removeImage({
                              id: image.id,
                              name: "imageCollection",
                            })
                          }
                          title="Delete Image"
                          type="button"
                          style={{
                            borderRadius: "50%",
                            backgroundColor: "black",
                            aspectRatio: "1",
                            color: "white",
                          }}
                        >
                          X
                        </button>
                      </div>
                    ))}
                </>
              </div>
              <br />
              <div className="d-flex">
                <ProductRelative values={values} />
              </div>
              <br />

              <div className="d-flex">
                <div className="product-form-field">
                  <input
                    checked={values.isSeasonal}
                    className=""
                    id="Seasonal"
                    onChange={(e) =>
                      setValues({ ...values, isSeasonal: e.target.checked })
                    }
                    type="checkbox"
                  />
                  <label htmlFor="Seasonal">
                    <h5 className="d-flex-grow-1 margin-0">
                      &nbsp; Add to Seasonal &nbsp;
                    </h5>
                  </label>
                </div>
                <div className="product-form-field">
                  <input
                    checked={values.isEssential}
                    className=""
                    id="essentails"
                    onChange={(e) =>
                      setValues({
                        ...values,
                        isEssential: e.target.checked,
                      })
                    }
                    type="checkbox"
                  />
                  <label htmlFor="essentails">
                    <h5 className="d-flex-grow-1 margin-0">
                      &nbsp; Add to Essential &nbsp;
                    </h5>
                  </label>
                </div>
              </div>
              <div className="d-flex">
                <div className="product-form-field">
                  <input
                    checked={values.isLuxury}
                    className=""
                    id="luxury"
                    onChange={(e) =>
                      setValues({
                        ...values,
                        isLuxury: e.target.checked,
                      })
                    }
                    type="checkbox"
                  />
                  <label htmlFor="luxury">
                    <h5 className="d-flex-grow-1 margin-0">
                      &nbsp; Add to Luxury &nbsp;
                    </h5>
                  </label>
                </div>
                <div className="product-form-field">
                  <input
                    checked={values.isCool}
                    className=""
                    id="cool"
                    onChange={(e) =>
                      setValues({
                        ...values,
                        isCool: e.target.checked,
                      })
                    }
                    type="checkbox"
                  />
                  <label htmlFor="cool">
                    <h5 className="d-flex-grow-1 margin-0">
                      &nbsp; Add to Cool &nbsp;
                    </h5>
                  </label>
                </div>
              </div>
              <div className="d-flex">
                <div className="product-form-field">
                  <input
                    checked={values.isNew}
                    className=""
                    id="new"
                    onChange={(e) =>
                      setValues({
                        ...values,
                        isNew: e.target.checked,
                      })
                    }
                    type="checkbox"
                  />
                  <label htmlFor="new">
                    <h5 className="d-flex-grow-1 margin-0">
                      &nbsp; Add to New &nbsp;
                    </h5>
                  </label>
                </div>
              </div>
              <br />
              <br />
              <br />
              <div className="product-form-field product-form-submit">
                <button className="button" disabled={isLoading} type="submit">
                  {isLoading ? <LoadingOutlined /> : <CheckOutlined />}
                  &nbsp;
                  {isLoading ? "Saving Product" : "Save Product"}
                </button>
              </div>
            </div>
            {/* ----THUBMNAIL ---- */}
            <div className="product-form-file">
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
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

ProductForm.propTypes = {
  product: PropType.shape({
    name: PropType.string,
    categories: PropType.string,
    type: PropType.string,
    sex: PropType.string,
    price: PropType.number,
    xlQuantity: PropType.number,
    lgQuantity: PropType.number,
    smQuantity: PropType.number,
    xsQuantity: PropType.number,
    description: PropType.string,
    keywords: PropType.arrayOf(PropType.string),
    relative: PropType.arrayOf(PropType.string),
    imageCollection: PropType.arrayOf(PropType.object),
    image: PropType.string,
    imageUrl: PropType.string,
    isSeasonal: PropType.bool,
    isEssential: PropType.bool,
    availableColors: PropType.arrayOf(PropType.string),
  }).isRequired,
  onSubmit: PropType.func.isRequired,
  isLoading: PropType.bool.isRequired,
};

export default ProductForm;
