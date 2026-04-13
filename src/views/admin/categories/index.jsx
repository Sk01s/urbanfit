import { Boundary } from "@/components/common";
import { displayActionMessage } from "@/helpers/utils";
import { useDocumentTitle, useScrollTop, useSiteImages, useSiteTexts } from "@/hooks";
import firebase from "@/services/firebase";
import React, { useEffect, useState } from "react";
import { SITE_IMAGES } from "@/config/siteImages";

const CATEGORY_CARDS = [
  { key: "category-card-1", titleKey: "cool-men", route: "/cool/men", label: "Category Card 1", flag: "isCool" },
  { key: "category-card-2", titleKey: "luxury-men", route: "/luxury/men", label: "Category Card 2", flag: "isLuxuryMen" },
  { key: "category-card-4", titleKey: "new-none", route: "/new/none", label: "Category Card 4", flag: "isNewMen" },
  { key: "category-card-5", titleKey: "luxury-women", route: "/luxury/women", label: "Category Card 5", flag: "isLuxuryWomen" },
  { key: "category-card-6", titleKey: "new-women", route: "/new/women", label: "Category Card 6", flag: "isNewWomen" },
  { key: "category-card-7", titleKey: "best-seller", route: "/best-seller", label: "Category Card 7", flag: "isBestSeller" },
];

const SECTION_TITLES = [
  { titleKey: "essential", label: "Essentials Section", route: "/essential", flag: "isEssential" },
];

const AdminCategories = () => {
  useDocumentTitle("Categories | Urbanfit Admin");
  useScrollTop();
  const { getImageUrl } = useSiteImages();
  const { categoryTitles, isLoading, refreshTitles } = useSiteTexts();
  const [editingKey, setEditingKey] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [savingKey, setSavingKey] = useState("");

  const handleEdit = (titleKey) => {
    setEditingKey(titleKey);
    setEditValue(categoryTitles[titleKey] || "");
  };

  const handleCancel = () => {
    setEditingKey(null);
    setEditValue("");
  };

  const handleSave = async (titleKey) => {
    setSavingKey(titleKey);
    try {
      await firebase.setCategoryPage(titleKey, { title: editValue });
      refreshTitles();
      displayActionMessage("Title saved.", "success");
      setEditingKey(null);
      setEditValue("");
    } catch (error) {
      displayActionMessage(error?.message || "Failed to save title.", "error");
    } finally {
      setSavingKey("");
    }
  };

  return (
    <Boundary>
      <div className="product-admin-header" style={{ justifyContent: "space-between" }}>
        <div>
          <h3 className="product-admin-header-title">Category Cards</h3>
          <p style={{ color: "#666", marginTop: "0.5rem", fontSize: "1.3rem" }}>
            Edit the page title shown on each category card&apos;s destination page
          </p>
        </div>
      </div>
      <div className="product-admin-items">
        {isLoading ? (
          <div className="loader">
            <h3>Loading...</h3>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "2rem",
            }}
          >
            {CATEGORY_CARDS.map((card) => {
              const imageUrl = getImageUrl(card.key);
              const isEditing = editingKey === card.titleKey;
              const isSaving = savingKey === card.titleKey;

              return (
                <div
                  key={card.key}
                  style={{
                    border: "1px solid #e5e5e5",
                    borderRadius: "12px",
                    padding: "1.5rem",
                    backgroundColor: "#fff",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 600 }}>{card.label}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      {card.flag && (
                        <span style={{ fontSize: "1.1rem", color: "#888", fontFamily: "monospace" }}>
                          {card.flag}
                        </span>
                      )}
                      <a
                        href={card.route}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: "1.2rem", color: "#1890ff" }}
                      >
                        {card.route}
                      </a>
                    </div>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      borderRadius: "8px",
                      overflow: "hidden",
                      backgroundColor: "#f5f5f5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={card.label}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <span style={{ color: "#999" }}>No image</span>
                    )}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label className="normal-label" style={{ fontWeight: 600, fontSize: "1.3rem" }}>Page Title</label>
                    {isEditing ? (
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          disabled={isSaving}
                          style={{
                            flex: 1,
                            padding: "6px 10px",
                            borderRadius: "4px",
                            border: "1px solid #ccc",
                            fontSize: "1.3rem",
                          }}
                        />
                        <button
                          type="button"
                          className="button button-small"
                          onClick={handleCancel}
                          disabled={isSaving}
                          style={{ border: "1px solid #ccc" }}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="button button-small"
                          onClick={() => handleSave(card.titleKey)}
                          disabled={isSaving}
                          style={{ backgroundColor: "#28a745", color: "#fff", border: "none", opacity: isSaving ? 0.7 : 1 }}
                        >
                          {isSaving ? "Saving..." : "Save"}
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <span style={{ fontSize: "1.4rem", color: "#333", flex: 1 }}>
                          {categoryTitles[card.titleKey] || "Untitled"}
                        </span>
                        <button
                          type="button"
                          className="button button-small"
                          onClick={() => handleEdit(card.titleKey)}
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="product-admin-header" style={{ justifyContent: "space-between", marginTop: "3rem" }}>
        <div>
          <h3 className="product-admin-header-title">Section Titles</h3>
          <p style={{ color: "#666", marginTop: "0.5rem", fontSize: "1.3rem" }}>
            Edit section titles displayed across the site
          </p>
        </div>
      </div>
      <div className="product-admin-items">
        {isLoading ? (
          <div className="loader">
            <h3>Loading...</h3>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "2rem",
            }}
          >
            {SECTION_TITLES.map((section) => {
              const isEditing = editingKey === section.titleKey;
              const isSaving = savingKey === section.titleKey;

              return (
                <div
                  key={section.titleKey}
                  style={{
                    border: "1px solid #e5e5e5",
                    borderRadius: "12px",
                    padding: "1.5rem",
                    backgroundColor: "#fff",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 600 }}>{section.label}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      {section.flag && (
                        <span style={{ fontSize: "1.1rem", color: "#888", fontFamily: "monospace" }}>
                          {section.flag}
                        </span>
                      )}
                      <a
                        href={section.route}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: "1.2rem", color: "#1890ff" }}
                      >
                        {section.route}
                      </a>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label className="normal-label" style={{ fontWeight: 600, fontSize: "1.3rem" }}>Section Title</label>
                    {isEditing ? (
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          disabled={isSaving}
                          style={{
                            flex: 1,
                            padding: "6px 10px",
                            borderRadius: "4px",
                            border: "1px solid #ccc",
                            fontSize: "1.3rem",
                          }}
                        />
                        <button
                          type="button"
                          className="button button-small"
                          onClick={handleCancel}
                          disabled={isSaving}
                          style={{ border: "1px solid #ccc" }}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="button button-small"
                          onClick={() => handleSave(section.titleKey)}
                          disabled={isSaving}
                          style={{ backgroundColor: "#28a745", color: "#fff", border: "none", opacity: isSaving ? 0.7 : 1 }}
                        >
                          {isSaving ? "Saving..." : "Save"}
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <span style={{ fontSize: "1.4rem", color: "#333", flex: 1 }}>
                          {categoryTitles[section.titleKey] || "Untitled"}
                        </span>
                        <button
                          type="button"
                          className="button button-small"
                          onClick={() => handleEdit(section.titleKey)}
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Boundary>
  );
};

export default AdminCategories;