import { Boundary, MessageDisplay } from "@/components/common";
import { ProductsNavbar } from "@/views/admin/components";
import { useDocumentTitle, useScrollTop, useSpecialPages } from "@/hooks";
import { ADD_SPECIAL_PAGE, EDIT_SPECIAL_PAGE } from "@/constants/routes";
import { displayActionMessage } from "@/helpers/utils";
import firebase from "@/services/firebase";
import React from "react";
import { Link } from "react-router-dom";

const SpecialPages = () => {
  useDocumentTitle("Special Pages | Urbanfit Admin");
  useScrollTop();
  const { specialPages, fetchSpecialPages, isLoading, error } =
    useSpecialPages();

  const handleDelete = async (page) => {
    const shouldDelete = window.confirm(
      `Delete special page "${page.title}"?`
    );
    if (!shouldDelete) return;

    try {
      await firebase.removeSpecialPage(page.id);
      displayActionMessage("Special page deleted.", "success");
      fetchSpecialPages();
    } catch (deleteError) {
      displayActionMessage(
        deleteError?.message || "Failed to delete special page.",
        "error"
      );
    }
  };

  return (
    <Boundary>
      <ProductsNavbar
        name="Special Pages"
        to={ADD_SPECIAL_PAGE}
        productsCount={specialPages.length}
        totalProductsCount={specialPages.length}
      />
      <div className="product-admin-items">
        {error && !isLoading ? (
          <MessageDisplay
            message={error}
            action={fetchSpecialPages}
            buttonLabel="Try Again"
          />
        ) : (
          <div>
            {specialPages.length > 0 && (
              <div className="grid grid-product grid-count-5">
                <div className="grid-col">
                  <h5>Title</h5>
                </div>
                <div className="grid-col">
                  <h5>Gender</h5>
                </div>
                <div className="grid-col">
                  <h5>Items</h5>
                </div>
                <div className="grid-col">
                  <h5>Edit</h5>
                </div>
                <div className="grid-col">
                  <h5>Delete</h5>
                </div>
              </div>
            )}
            {specialPages.length === 0 ? (
              <div className="loader">
                <h3>No special pages yet.</h3>
              </div>
            ) : (
              specialPages.map((page) => (
                <div key={page.id} className="grid grid-product grid-count-5">
                  <div className="grid-col">
                    <h5>{page.title}</h5>
                  </div>
                  <div className="grid-col">
                    <h5>{page.gender}</h5>
                  </div>
                  <div className="grid-col">
                    <h5>{page.productIds?.length || 0}</h5>
                  </div>
                  <div className="grid-col">
                    <Link
                      className="button button-small"
                      to={`${EDIT_SPECIAL_PAGE}/${page.id}`}
                    >
                      Edit
                    </Link>
                  </div>
                  <div className="grid-col">
                    <button
                      type="button"
                      className="button button-small button-muted"
                      onClick={() => handleDelete(page)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </Boundary>
  );
};

export default SpecialPages;
