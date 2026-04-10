import React, { useState } from "react";
import { PlusOutlined, EyeOutlined, CloudUploadOutlined } from "@ant-design/icons";
import { useLandingSlides } from "@/hooks";
import SlideCard from "./SlideCard";
import SlidePreviewModal from "./SlidePreviewModal";
import { displayActionMessage } from "@/helpers/utils";

const SlideManager = () => {
  const {
    slides,
    isLoading,
    addSlide,
    updateSlide,
    deleteSlide,
    reorderSlides,
    publishChanges,
    hasAnyDraftChanges,
  } = useLandingSlides();
  const [uploadingKey, setUploadingKey] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [adding, setAdding] = useState(false);

  const handleAddSlide = async () => {
    setAdding(true);
    try {
      await addSlide({});
      displayActionMessage("Slide added.", "success");
    } catch (err) {
      displayActionMessage("Failed to add slide.", "error");
    } finally {
      setAdding(false);
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      await updateSlide(id, data);
    } catch (err) {
      displayActionMessage("Failed to update slide.", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSlide(id);
      displayActionMessage("Slide deleted.", "success");
    } catch (err) {
      displayActionMessage("Failed to delete slide.", "error");
    }
  };

  const handleMoveUp = async (index) => {
    if (index <= 0) return;
    const newOrder = [...slides.map((s) => s.id)];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    try {
      await reorderSlides(newOrder);
      displayActionMessage("Slide moved up.", "success");
    } catch (err) {
      displayActionMessage("Failed to reorder slides.", "error");
    }
  };

  const handleMoveDown = async (index) => {
    if (index >= slides.length - 1) return;
    const newOrder = [...slides.map((s) => s.id)];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    try {
      await reorderSlides(newOrder);
      displayActionMessage("Slide moved down.", "success");
    } catch (err) {
      displayActionMessage("Failed to reorder slides.", "error");
    }
  };

  const handlePublishAll = async () => {
    if (!window.confirm("Publish all draft changes to the live site?")) return;
    setPublishing(true);
    try {
      await publishChanges();
      displayActionMessage("All changes published!", "success");
    } catch (err) {
      displayActionMessage("Failed to publish changes.", "error");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}
      >
        <h3 style={{ margin: 0, fontSize: "1.6rem" }}>
          Landing Page Slides
        </h3>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={handleAddSlide}
            className="button button-small"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              opacity: adding ? 0.6 : 1,
            }}
            disabled={adding}
          >
            <PlusOutlined />
            {adding ? "Adding..." : "Add Slide"}
          </button>
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="button button-small"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              backgroundColor: "#17a2b8",
              color: "#fff",
              border: "none",
            }}
          >
            <EyeOutlined />
            Preview Draft
          </button>
          {hasAnyDraftChanges && (
            <button
              type="button"
              onClick={handlePublishAll}
              className="button button-small"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                backgroundColor: "#28a745",
                color: "#fff",
                border: "none",
                opacity: publishing ? 0.6 : 1,
              }}
              disabled={publishing}
            >
              <CloudUploadOutlined />
              {publishing ? "Publishing..." : "Publish All Changes"}
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="loader">
          <h3>Loading slides...</h3>
        </div>
      ) : slides.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "3rem",
            color: "#777",
          }}
        >
          <p style={{ fontSize: "1.4rem" }}>No slides yet.</p>
          <p style={{ fontSize: "1.2rem" }}>
            Click "Add Slide" to create your first landing slide.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {slides.map((slide, index) => (
            <SlideCard
              key={slide.id}
              slide={slide}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              uploadingKey={uploadingKey}
              setUploadingKey={setUploadingKey}
              onMoveUp={() => handleMoveUp(index)}
              onMoveDown={() => handleMoveDown(index)}
              isFirst={index === 0}
              isLast={index === slides.length - 1}
            />
          ))}
        </div>
      )}

      <SlidePreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
      />
    </div>
  );
};

export default SlideManager;