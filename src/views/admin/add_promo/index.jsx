import { LoadingOutlined } from "@ant-design/icons";
import { useDocumentTitle, useScrollTop } from "@/hooks";
import React, { lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import { addProduct } from "@/redux/actions/productActions";
import firebaseInstance from "@/services/firebase";

const PromoForm = lazy(() => import("../components/PromoForm"));

const AddProduct = () => {
  useScrollTop();
  useDocumentTitle("Add New Promo | Urbanfit");
  const isLoading = useSelector((state) => state.app.loading);
  const dispatch = useDispatch();

  const onSubmit = (promo) => {
    const res = firebaseInstance.addPromo(
      firebaseInstance.generateKey(),
      promo
    );
  };

  return (
    <div className="product-form-container">
      <h2>Add New Promo</h2>
      <Suspense
        fallback={
          <div className="loader" style={{ minHeight: "80dvh" }}>
            <h6>Loading ... </h6>
            <br />
            <LoadingOutlined />
          </div>
        }
      >
        <PromoForm isLoading={isLoading} onSubmit={onSubmit}
         />
      </Suspense>
    </div>
  );
};

export default withRouter(AddProduct);
