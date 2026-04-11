import { CheckOutlined, LoadingOutlined } from "@ant-design/icons";
import { ImageLoader } from "@/components/common";
import {
  CustomCreatableSelect,
  CustomInput,
  CustomTextarea,
} from "@/components/formik";
import { Field, Form, Formik } from "formik";
import { useFileHandler, useSiteTexts } from "@/hooks";
import PropType from "prop-types";
import React, { useState } from "react";
import * as Yup from "yup";
import { categories } from "@/constants/constants";
import { ProductRelative } from "@/components/product";
import firebaseInstance from "@/services/firebase";
import compressImage from "@/helpers/compressImage";
import { useTypes } from "@/hooks";
import ColorVariantEditor from "./ColorVariantEditor";
import { v4 as uuidv4 } from "uuid";

const FormSchema = Yup.object().shape({
  name: Yup.string()
    .required("Product name is required.")
    .max(60, "Product name must only be less than 60 characters."),
  categories: Yup.string().required("Categories is required."),
  type: Yup.object().shape({
    name: Yup.string().required("name is required"),
    categories: Yup.string().required("categories is required"),
  }),
  sex: Yup.string().required("Sex is required."),
  price: Yup.number()
    .positive("Price is invalid.")
    .required("Price is required."),
  description: Yup.string().required("Description is required."),
  keywords: Yup.array().of(Yup.string()),
  relative: Yup.array().of(Yup.string()),
  onSale: Yup.boolean(),
  percentage: Yup.number()
    .min(0, "percentage should be positive")
    .max(100, "should not exceed 100"),
  priority: Yup.number().min(-1).max(1).required("Set priority"),
  isSeasonal: Yup.boolean(),
  isEssential: Yup.boolean(),
  isCool: Yup.boolean(),
  isLuxury: Yup.boolean(),
  isNew: Yup.boolean(),
});

const defaultColorVariant = () => ({
  color: "#000000",
  name: "",
  image: "",
  _imagePreview: "",
  _imageFile: null,
  imageCollection: [],
  _galleryFiles: [],
  quantities: { xs: 0, sm: 0, md: 0, lg: 0, xl: 0 },
});

const ProductFormV2 = ({ product, onSubmit, isLoading, isEditing }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { getCategoryTitle } = useSiteTexts();
  const [colorVariants, setColorVariants] = useState(
    product?.colors?.length
      ? product.colors.map((c) => ({
          ...c,
          _imagePreview: c.image || "",
          _imageFile: null,
          _galleryFiles: [],
        }))
      : [defaultColorVariant()]
  );

  const {
    imageFile,
    isFileLoading,
    onFileChange,
    removeImage,
  } = useFileHandler({
    image: {},
    sharedImages: product?.sharedImages || [],
  });

  const [sharedImages, setSharedImages] = useState(
    product?.sharedImages || []
  );
  const [sharedGalleryFiles, setSharedGalleryFiles] = useState([]);

  const handleVariantChange = (index, updatedVariant) => {
    const newVariants = [...colorVariants];
    newVariants[index] = updatedVariant;
    setColorVariants(newVariants);
  };

  const handleVariantRemove = (index) => {
    setColorVariants(colorVariants.filter((_, i) => i !== index));
  };

  const addColorVariant = () => {
    setColorVariants([...colorVariants, defaultColorVariant()]);
  };

  const handleVariantImageChange = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener("load", (ev) => {
      const newVariants = [...colorVariants];
      newVariants[index] = {
        ...newVariants[index],
        _imagePreview: ev.target.result,
        _imageFile: file,
      };
      setColorVariants(newVariants);
    });
    reader.readAsDataURL(file);
  };

  const handleVariantGalleryChange = (index, e) => {
    const files = Array.from(e.target.files);
    const newEntries = [];
    for (const file of files) {
      const id = uuidv4();
      newEntries.push({ id, file, _isNew: true });
    }
    const newVariants = [...colorVariants];
    const existingCollection = newVariants[index].imageCollection || [];
    const previewEntries = [];
    let loaded = 0;
    for (const entry of newEntries) {
      const reader = new FileReader();
      reader.addEventListener("load", (ev) => {
        previewEntries.push({ id: entry.id, url: ev.target.result });
        loaded++;
        if (loaded === newEntries.length) {
          const merged = [...existingCollection, ...previewEntries];
          newVariants[index] = {
            ...newVariants[index],
            imageCollection: merged,
            _galleryFiles: [
              ...(newVariants[index]._galleryFiles || []),
              ...newEntries,
            ],
          };
          setColorVariants([...newVariants]);
        }
      });
      reader.readAsDataURL(entry.file);
    }
  };

  const handleVariantGalleryRemove = (index, imageId) => {
    const newVariants = [...colorVariants];
    newVariants[index] = {
      ...newVariants[index],
      imageCollection: (newVariants[index].imageCollection || []).filter(
        (img) => img.id !== imageId
      ),
      _galleryFiles: (newVariants[index]._galleryFiles || []).filter(
        (f) => f.id !== imageId
      ),
    };
    setColorVariants(newVariants);
  };

  const handleSharedGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    const newEntries = [];
    for (const file of files) {
      newEntries.push({ id: uuidv4(), file, _isNew: true });
    }
    setSharedGalleryFiles((prev) => [...prev, ...newEntries]);

    let loaded = 0;
    const previews = [];
    for (const entry of newEntries) {
      const reader = new FileReader();
      reader.addEventListener("load", (ev) => {
        previews.push({ id: entry.id, url: ev.target.result });
        loaded++;
        if (loaded === newEntries.length) {
          setSharedImages((prev) => [...prev, ...previews]);
        }
      });
      reader.readAsDataURL(entry.file);
    }
  };

  const handleSharedGalleryRemove = (imageId) => {
    setSharedImages((prev) => prev.filter((img) => img.id !== imageId));
    setSharedGalleryFiles((prev) => prev.filter((f) => f.id !== imageId));
  };

  const onSubmitForm = async (form) => {
    if (colorVariants.length === 0) {
      alert("Please add at least one color variant.");
      return;
    }
    for (let i = 0; i < colorVariants.length; i++) {
      if (!colorVariants[i].color) {
        alert(`Color variant ${i + 1} is missing a color value.`);
        return;
      }
    }

    setIsSubmitting(true);
    try {

    const productId = product?.id || firebaseInstance.generateKey();

    // Upload thumbnail using v1 storeImage (Backblaze B2)
    let thumbnailUrl = product?.image || "";
    if (imageFile.image?.file) {
      try {
        const compressedThumb = await compressImage(imageFile.image.file);
        thumbnailUrl = await firebaseInstance.storeImage(productId, "products", compressedThumb);
      } catch (err) {
        console.error("Thumbnail upload failed:", err);
        alert("Failed to upload thumbnail image: " + err.message);
        return;
      }
    }

    // Upload shared gallery images
    const processedSharedImages = [];
    for (const img of product?.sharedImages || []) {
      if (!sharedGalleryFiles.find((f) => f.id === img.id)) {
        processedSharedImages.push({ id: img.id, url: img.url });
      }
    }
    for (const entry of sharedGalleryFiles) {
      try {
        const key = firebaseInstance.generateKey();
        const compressedFile = await compressImage(entry.file);
        const url = await firebaseInstance.storeImage(key, "products", compressedFile);
        processedSharedImages.push({ id: entry.id, url });
      } catch (err) {
        console.error("Shared image upload failed:", err);
      }
    }
    // Also include newly picked shared files
    for (const img of sharedImages) {
      if (!processedSharedImages.find((p) => p.id === img.id)) {
        if (img.url && !img._isNew) {
          processedSharedImages.push({ id: img.id, url: img.url });
        }
      }
    }

    // Upload per-variant images
    const processedVariants = [];
    for (const variant of colorVariants) {
      // Variant thumbnail
      let variantImageUrl = variant.image || "";
      if (variant._imageFile) {
        try {
          const compressedVariant = await compressImage(variant._imageFile);
          variantImageUrl = await firebaseInstance.storeImage(
            firebaseInstance.generateKey(),
            "products",
            compressedVariant
          );
        } catch (err) {
          console.error("Variant image upload failed:", err);
        }
      }

      // Variant gallery
      const processedGallery = [];
      // Keep existing gallery images (not new uploads)
      for (const img of variant.imageCollection || []) {
        const galleryFile = (variant._galleryFiles || []).find((f) => f.id === img.id);
        if (galleryFile) {
          try {
            const key = firebaseInstance.generateKey();
            const compressedGallery = await compressImage(galleryFile.file);
            const url = await firebaseInstance.storeImage(key, "products", compressedGallery);
            processedGallery.push({ id: img.id, url });
          } catch (err) {
            console.error("Variant gallery upload failed:", err);
          }
        } else if (img.url && !img._isNew) {
          processedGallery.push({ id: img.id, url: img.url });
        }
      }

      processedVariants.push({
        color: variant.color,
        name: variant.name || variant.color,
        image: variantImageUrl,
        imageCollection: processedGallery,
        quantities: { ...variant.quantities },
      });
    }

    const totalQuantity = processedVariants.reduce(
      (sum, c) => sum + Object.values(c.quantities).reduce((a, b) => a + b, 0),
      0
    );

    const defaultVariant = processedVariants[0] || {};

    onSubmit({
      id: productId,
      ...form,
      name_lower: form.name.toLowerCase(),
      totalQuantity,
      colors: processedVariants,
      sharedImages: processedSharedImages,
      image: thumbnailUrl || defaultVariant.image || "",
      imageCollection: [
        ...processedSharedImages,
        ...defaultVariant.imageCollection,
      ],
      availableColors: processedVariants.map((c) => c.color),
      dateAdded: isEditing ? product.dateAdded : new Date().getTime(),
      ...(isEditing && {
        originalQuantities: {
          xlQuantity: product.xlQuantity || 0,
          lgQuantity: product.lgQuantity || 0,
          mdQuantity: product.mdQuantity || 0,
          smQuantity: product.smQuantity || 0,
          xsQuantity: product.xsQuantity || 0,
          totalQuantity: product.totalQuantity || 0,
        },
      }),
    });
    } finally {
      setIsSubmitting(false);
    }
  };

  const priority = (value) => {
    if (value === 0) return "Normal";
    if (value === 1) return "High";
    if (value === -1) return "Low";
  };

  const busy = isLoading || isSubmitting;
  const { typeOptions } = useTypes();

  const initFormikValues = {
    name: product?.name || "",
    categories: product?.categories || "",
    type: product?.type || { name: "", categories: "" },
    sex: product?.sex || "",
    price: product?.price || 0,
    onSale: product?.onSale || false,
    percentage: product?.percentage || 0,
    priority: product?.priority || 0,
    description: product?.description || "",
    keywords: product?.keywords || [],
    relative: product?.relative || [],
    isSeasonal: product?.isSeasonal || false,
    isEssential: product?.isEssential || false,
    isCool: product?.isCool || false,
    isNew: product?.isNew || false,
    isLuxury: product?.isLuxury || false,
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
                  <Field disabled={isLoading} name="name" type="text" label="* Product Name" placeholder="product name" style={{ textTransform: "capitalize" }} component={CustomInput} />
                </div>
              </div>
              <div className="d-flex">
                <div className="product-form-field">
                  <CustomCreatableSelect defaultValue={{ label: values.categories, value: values.categories }} name="categories" iid="categories" options={categories} disabled={isLoading} placeholder="Select/Create Categories" label="* Categories" />
                </div>
              </div>
              <div className="d-flex">
                <div className="product-form-field">
                  <CustomCreatableSelect defaultValue={{ label: values.type?.name, value: values.type }} name="type" iid="type" options={typeOptions} disabled={busy} placeholder="Select/Create Type" label="* Type" />
                </div>
                <div className="product-form-field">
                  <CustomCreatableSelect defaultValue={{ label: values.sex, value: values.sex }} name="sex" iid="sex" options={[{ value: "Men", label: "Men" }, { value: "Women", label: "Women" }]} disabled={isLoading} placeholder="Select/Create Sex" label="* Sex" />
                </div>
              </div>
              <div className="d-flex">
                <div className="product-form-field">
                  <Field disabled={isLoading} name="description" id="description" rows={3} label="* Product Description" component={CustomTextarea} />
                </div>
              </div>
              <div className="d-flex">
                <div className="product-form-field">
                  <Field disabled={isLoading} name="price" id="price" type="number" label="* Price" component={CustomInput} />
                </div>
              </div>

              {/* Color Variants Section */}
              <div style={{ margin: "2rem 0 1rem 0" }}>
                <h3 style={{ marginBottom: "0.5rem" }}>Color Variants</h3>
                <p style={{ color: "#666", fontSize: "0.85rem", marginBottom: "1rem" }}>
                  Each color variant has its own images and stock quantities per size.
                </p>
                {colorVariants.map((variant, index) => (
                  <ColorVariantEditor
                    key={index}
                    variant={variant}
                    index={index}
                    onChange={handleVariantChange}
                    onRemove={handleVariantRemove}
                    onImageChange={handleVariantImageChange}
                    onGalleryChange={handleVariantGalleryChange}
                    onGalleryRemove={handleVariantGalleryRemove}
                    isFileLoading={isFileLoading}
                    disabled={busy}
                  />
                ))}
                <button type="button" onClick={addColorVariant} className="button" style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  + Add Color Variant
                </button>
              </div>

              {/* Shared Images Section */}
              <div className="product-form-field" style={{ marginBottom: "1rem" }}>
                <span className="d-block padding-s">Shared Images (shown for all colors)</span>
                {!isFileLoading && (
                  <label htmlFor="shared-gallery-input" style={{ cursor: "pointer" }}>
                    <input hidden id="shared-gallery-input" multiple accept="image/*" type="file" onChange={handleSharedGalleryChange} />
                    Choose Images
                  </label>
                )}
              </div>
              <div className="product-form-collection" style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {sharedImages.map((img) => (
                  <div className="product-form-collection-image" key={img.id} style={{ position: "relative" }}>
                    <img alt="" src={img.url} loading="lazy" style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "6px" }} />
                    <button
                      type="button"
                      onClick={() => handleSharedGalleryRemove(img.id)}
                      style={{ position: "absolute", top: "-6px", right: "-6px", borderRadius: "50%", backgroundColor: "black", color: "white", border: "none", width: "20px", height: "20px", fontSize: "10px", cursor: "pointer" }}
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>

              <div className="d-flex">
                <div className="product-form-field">
                  <CustomCreatableSelect defaultValue={values.keywords.map((key) => ({ value: key, label: key }))} name="keywords" iid="keywords" isMulti disabled={isLoading} placeholder="Create/Select Keywords" label="* Keywords" creatable={true} />
                </div>
              </div>
              <div className="d-flex">
                <div className="product-form-field">
                  <CustomCreatableSelect defaultValue={{ label: values.onSale ? "yes" : "no", value: values.onSale }} name="onSale" iid="onSale" options={[{ label: "yes", value: true }, { label: "no", value: false }]} disabled={isLoading} placeholder="on Sale" label="* On Sale" />
                </div>
              </div>
              <div className="d-flex">
                <div className="product-form-field">
                  <CustomCreatableSelect defaultValue={{ label: priority(values.priority), value: values.priority }} name="priority" iid="priority" options={[{ value: 1, label: "High" }, { value: 0, label: "Normal" }, { value: -1, label: "Low" }]} disabled={isLoading} label="* Priority" />
                </div>
              </div>
              <div className="d-flex">
                <div className="product-form-field">
                  <Field disabled={!values.onSale} name="percentage" id="percentage" type="number" label="* Sale percentage" component={CustomInput} />
                </div>
              </div>

              <div className="d-flex">
                <div className="product-form-field">
                  <ProductRelative values={values} admin />
                </div>
              </div>
              <br />
              <div className="d-flex">
                <div className="product-form-field">
                  <input checked={values.isSeasonal} id="Seasonal" onChange={(e) => setValues({ ...values, isSeasonal: e.target.checked })} type="checkbox" />
                  <label htmlFor="Seasonal"><h5>&nbsp; Add to Seasonal &nbsp;</h5></label>
                </div>
                <div className="product-form-field">
                  <input checked={values.isEssential} id="essentials" onChange={(e) => setValues({ ...values, isEssential: e.target.checked })} type="checkbox" />
                  <label htmlFor="essentials"><h5>&nbsp; Add to Essential &nbsp;</h5></label>
                </div>
              </div>
              <div className="d-flex">
                <div className="product-form-field">
                  <input checked={values.isLuxury} id="luxury" onChange={(e) => setValues({ ...values, isLuxury: e.target.checked })} type="checkbox" />
                  <label htmlFor="luxury"><h5>&nbsp; Add to {getCategoryTitle("luxury-men")} &nbsp;</h5></label>
                </div>
                <div className="product-form-field">
                  <input checked={values.isCool} id="cool" onChange={(e) => setValues({ ...values, isCool: e.target.checked })} type="checkbox" />
                  <label htmlFor="cool"><h5>&nbsp; Add to {getCategoryTitle("cool-men")} &nbsp;</h5></label>
                </div>
              </div>
              <div className="d-flex">
                <div className="product-form-field">
                  <input checked={values.isNew} id="new" onChange={(e) => setValues({ ...values, isNew: e.target.checked })} type="checkbox" />
                  <label htmlFor="new"><h5>&nbsp; Add to {getCategoryTitle("new-none")} &nbsp;</h5></label>
                </div>
              </div>
              <br /><br /><br />
              <div className="product-form-field product-form-submit">
                <button className="button" disabled={busy} type="submit">
                  {busy ? <LoadingOutlined /> : <CheckOutlined />}
                  &nbsp; {busy ? "Saving Product" : "Save Product"}
                </button>
              </div>
            </div>
            {/* Thumbnail */}
            <div className="product-form-file">
              <div className="product-form-field">
                <span className="d-block padding-s">* Thumbnail (fallback — each color variant can override)</span>
                {!isFileLoading && (
                  <label htmlFor="product-input-file">
                    <input disabled={busy} hidden id="product-input-file" onChange={(e) => onFileChange(e, { name: "image", type: "single" })} readOnly={busy} type="file" />
                    Choose Image
                  </label>
                )}
              </div>
              <div className="product-form-image-wrapper">
                {(imageFile.image?.url || product?.image) && (
                  <img alt="" className="product-form-image-preview" src={imageFile.image?.url || product?.image} />
                )}
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

ProductFormV2.propTypes = {
  product: PropType.shape({
    id: PropType.string,
    name: PropType.string,
    categories: PropType.string,
    type: PropType.object,
    sex: PropType.string,
    price: PropType.number,
    description: PropType.string,
    keywords: PropType.array,
    relative: PropType.array,
    image: PropType.string,
    onSale: PropType.bool,
    percentage: PropType.number,
    priority: PropType.number,
    isSeasonal: PropType.bool,
    isEssential: PropType.bool,
    isCool: PropType.bool,
    isNew: PropType.bool,
    isLuxury: PropType.bool,
    colors: PropType.array,
    sharedImages: PropType.array,
  }),
  onSubmit: PropType.func.isRequired,
  isLoading: PropType.bool.isRequired,
  isEditing: PropType.bool,
};

ProductFormV2.defaultProps = {
  isEditing: false,
  product: {},
};

export default ProductFormV2;