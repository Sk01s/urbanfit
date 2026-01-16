import { LoadingOutlined } from "@ant-design/icons";
import { useDocumentTitle, useScrollTop } from "@/hooks";
import { displayActionMessage } from "@/helpers/utils";
import firebase from "@/services/firebase";
import React, { lazy, Suspense, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { ADMIN_SPECIAL_PAGES } from "@/constants/routes";

const SpecialPageForm = lazy(() => import("../components/SpecialPageForm"));

const EditSpecialPage = () => {
  useDocumentTitle("Edit Special Page | Urbanfit");
  useScrollTop();
  const history = useHistory();
  const { id } = useParams();
  const [page, setPage] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [isFetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const snapshot = await firebase.getSpecialPage(id);
        if (snapshot.exists) {
          setPage({ id: snapshot.id, ...snapshot.data() });
        }
      } catch (error) {
        displayActionMessage(
          error?.message || "Failed to load special page.",
          "error"
        );
      } finally {
        setFetching(false);
      }
    };

    fetchPage();
  }, [id]);

  const onSubmit = async (updates) => {
    try {
      setLoading(true);
      await firebase.editSpecialPage(updates.id, updates);
      displayActionMessage("Special page updated.", "success");
      history.push(ADMIN_SPECIAL_PAGES);
    } catch (error) {
      displayActionMessage(
        error?.message || "Failed to update special page.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form-container">
      <h2>Edit Special Page</h2>
      {isFetching ? (
        <div className="loader" style={{ minHeight: "80dvh" }}>
          <h6>Loading ... </h6>
          <br />
          <LoadingOutlined />
        </div>
      ) : (
        page && (
          <Suspense
            fallback={
              <div className="loader" style={{ minHeight: "80dvh" }}>
                <h6>Loading ... </h6>
                <br />
                <LoadingOutlined />
              </div>
            }
          >
            <SpecialPageForm
              isLoading={isLoading}
              onSubmit={onSubmit}
              page={page}
              isEditing
            />
          </Suspense>
        )
      )}
    </div>
  );
};

export default EditSpecialPage;
