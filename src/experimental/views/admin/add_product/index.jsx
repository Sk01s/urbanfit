import { LoadingOutlined } from "@ant-design/icons";
import { useDocumentTitle, useScrollTop } from "@/hooks";
import React, { lazy, Suspense, useState } from "react";
import { withRouter } from "react-router-dom";
import { useDispatch } from "react-redux";
import firebaseV2 from "@/experimental/services/firebaseV2";
import { setAllProductsV2 } from "@/experimental/redux/actions/productV2Actions";

const ProductFormV2 = lazy(() => import("../components/ProductFormV2"));

const V2AddProduct = ({ history }) => {
  useScrollTop();
  useDocumentTitle("Add New Product (V2) | Urbanfit");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  const onSubmit = async (product) => {
    const { originalQuantities, ...productData } = product;
    setIsSubmitting(true);
    try {
      await firebaseV2.addProductV2(productData.id, productData);
      localStorage.removeItem("productsV2");
      dispatch(setAllProductsV2([]));
      history.goBack();
    } catch (err) {
      console.error("Error adding product:", err);
      alert("Error adding product: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="product-form-container">
      <h2>Add New Product (V2 — Color Variants)</h2>
      <Suspense
        fallback={
          <div className="loader" style={{ minHeight: "80dvh" }}>
            <h6>Loading ... </h6>
            <br />
            <LoadingOutlined />
          </div>
        }
      >
        <ProductFormV2
          isLoading={isSubmitting}
          onSubmit={onSubmit}
          product={{
            name: "",
            categories: "",
            type: { name: "", categories: "" },
            sex: "",
            price: 0,
            description: "",
            keywords: [],
            relative: [],
            onSale: false,
            percentage: 0,
            priority: 0,
            isSeasonal: false,
            isEssential: false,
isCool: false,
             isNewMen: false,
             isNewWomen: false,
             isLuxuryMen: false,
             isLuxuryWomen: false,
             isBestSeller: false,
            colors: [],
            sharedImages: [],
          }}
        />
      </Suspense>
    </div>
  );
};

export default withRouter(V2AddProduct);