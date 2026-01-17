import { Boundary, ImageLoader, MessageDisplay } from "@/components/common";
import { ProductsNavbar } from "@/views/admin/components";
import { useDocumentTitle, useScrollTop, useSpecialPages } from "@/hooks";
import { ADD_SPECIAL_PAGE, EDIT_SPECIAL_PAGE } from "@/constants/routes";
import { displayActionMessage } from "@/helpers/utils";
import firebase from "@/services/firebase";
import React, { useRef } from "react";
import { useHistory } from "react-router-dom";

const SpecialPageItem = ({ page, onDelete }) => {
  const history = useHistory();
  const itemRef = useRef(null);

  const onClickEdit = () => {
    history.push(`${EDIT_SPECIAL_PAGE}/${page.id}`);
  };

  const onDeleteClick = () => {
    itemRef.current.classList.toggle("item-active");
  };

  const onConfirmDelete = () => {
    onDelete(page);
    itemRef.current.classList.remove("item-active");
  };

  const onCancelDelete = () => {
    itemRef.current.classList.remove("item-active");
  };

  return (
    <div className="item item-products" ref={itemRef}>
      <div className="grid grid-count-4">
        <div className="grid-col item-img-wrapper">
          {page.bannerUrl ? (
            <img
              alt={page.title}
              className="item-img"
              src={page.bannerUrl}
              loading="lazy"
            />
          ) : (
            <div
              style={{
                width: 50,
                height: 30,
                background: "#e1e1e1",
                borderRadius: 4,
              }}
            />
          )}
        </div>
        <div className="grid-col">
          <span className="text-overflow-ellipsis">{page.title}</span>
        </div>
        <div className="grid-col">
          <span style={{ textTransform: "capitalize" }}>
            {page.gender || "All"}
          </span>
        </div>
        <div className="grid-col">
          <span>{page.productIds?.length || 0} items</span>
        </div>
      </div>
      <div className="item-action">
        <button
          className="button button-border button-small"
          onClick={onClickEdit}
          type="button"
        >
          Edit
        </button>
        &nbsp;
        <button
          className="button button-border button-small button-danger"
          onClick={onDeleteClick}
          type="button"
        >
          Delete
        </button>
        <div className="item-action-confirm">
          <h5>Are you sure you want to delete this?</h5>
          <button
            className="button button-small button-border"
            onClick={onCancelDelete}
            type="button"
          >
            No
          </button>
          &nbsp;
          <button
            className="button button-small button-danger"
            onClick={onConfirmDelete}
            type="button"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

const SpecialPages = () => {
  useDocumentTitle("Special Pages | Urbanfit Admin");
  useScrollTop();
  const { specialPages, fetchSpecialPages, isLoading, error } =
    useSpecialPages();

  const handleDelete = async (page) => {
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
              <div className="grid grid-product grid-count-4">
                <div className="grid-col">
                  <h5>Banner</h5>
                </div>
                <div className="grid-col">
                  <h5>Title</h5>
                </div>
                <div className="grid-col">
                  <h5>Gender</h5>
                </div>
                <div className="grid-col">
                  <h5>Items</h5>
                </div>
              </div>
            )}
            {specialPages.length === 0 ? (
              <div className="loader">
                <h3>No special pages yet.</h3>
              </div>
            ) : (
              specialPages.map((page) => (
                <SpecialPageItem
                  key={page.id}
                  page={page}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        )}
      </div>
    </Boundary>
  );
};

export default SpecialPages;
