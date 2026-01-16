import { LoadingOutlined } from "@ant-design/icons";
import { useDocumentTitle, useScrollTop } from "@/hooks";
import { displayActionMessage } from "@/helpers/utils";
import firebase from "@/services/firebase";
import React, { lazy, Suspense, useState } from "react";
import { useHistory } from "react-router-dom";
import { ADMIN_SPECIAL_PAGES } from "@/constants/routes";

const SpecialPageForm = lazy(() => import("../components/SpecialPageForm"));

const AddSpecialPage = () => {
  useScrollTop();
  useDocumentTitle("Add Special Page | Urbanfit");
  const history = useHistory();
  const [isLoading, setLoading] = useState(false);

  const onSubmit = async (page) => {
    try {
      setLoading(true);
      await firebase.addSpecialPage(page.id, page);
      displayActionMessage("Special page created.", "success");
      history.push(ADMIN_SPECIAL_PAGES);
    } catch (error) {
      displayActionMessage(
        error?.message || "Failed to create special page.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form-container">
      <h2>Add Special Page</h2>
      <Suspense
        fallback={
          <div className="loader" style={{ minHeight: "80dvh" }}>
            <h6>Loading ... </h6>
            <br />
            <LoadingOutlined />
          </div>
        }
      >
        <SpecialPageForm isLoading={isLoading} onSubmit={onSubmit} page={null} />
      </Suspense>
    </div>
  );
};

export default AddSpecialPage;
