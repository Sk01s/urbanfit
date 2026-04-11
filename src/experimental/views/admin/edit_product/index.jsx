import { LoadingOutlined } from "@ant-design/icons";
import { useDocumentTitle, useScrollTop } from "@/hooks";
import PropType from "prop-types";
import React, { lazy, Suspense, useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { Redirect } from "react-router-dom";
import { useDispatch } from "react-redux";
import firebaseV2 from "@/experimental/services/firebaseV2";
import { setAllProductsV2 } from "@/experimental/redux/actions/productV2Actions";

const ProductFormV2 = lazy(() => import("../components/ProductFormV2"));

const V2EditProduct = ({ match, history }) => {
  useDocumentTitle("Edit Product (V2) | Urbanfit");
  useScrollTop();
  const [product, setProduct] = useState(null);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const doc = await firebaseV2.getSingleProductV2(match.params.id);
        if (doc.exists) {
          setProduct({ id: doc.ref.id, ...doc.data() });
        } else {
          setError("Product not found");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoadingProduct(false);
      }
    };
    fetchProduct();
  }, [match.params.id]);

  const onSubmit = async (updates) => {
    const { id, originalQuantities, ...productData } = updates;
    setIsSubmitting(true);
    try {
      await firebaseV2.updateProductV2(id, productData);
      localStorage.removeItem("productsV2");
      dispatch(setAllProductsV2([]));
      history.goBack();
    } catch (err) {
      console.error("Error updating product:", err);
      alert("Error updating product: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return <Redirect to="/admin/products" />;
  }

  return (
    <div className="product-form-container">
      <h2>Edit Product (V2 — Color Variants)</h2>
      {isLoadingProduct ? (
        <div className="loader" style={{ minHeight: "80dvh" }}>
          <h6>Loading ... </h6>
          <br />
          <LoadingOutlined />
        </div>
      ) : product ? (
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
            product={product}
            isEditing={true}
          />
        </Suspense>
      ) : (
        <p>Product not found.</p>
      )}
    </div>
  );
};

V2EditProduct.propTypes = {
  match: PropType.shape({
    params: PropType.shape({
      id: PropType.string,
    }),
  }).isRequired,
};

export default withRouter(V2EditProduct);