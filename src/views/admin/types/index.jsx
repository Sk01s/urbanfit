import { Boundary } from "@/components/common";
import { displayActionMessage } from "@/helpers/utils";
import { useDocumentTitle, useScrollTop, useTypes } from "@/hooks";
import firebase from "@/services/firebase";
import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";

const CATEGORIES = ["Tops", "Bottoms", "Active"];
const SEX_OPTIONS = ["men", "women"];

const typeToSlug = (name) =>
  name.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "-");

const emptyType = () => ({
  name: "",
  categories: "Tops",
  sex: ["men", "women"],
  order: 0,
});

const AdminTypes = () => {
  useDocumentTitle("Types | Urbanfit Admin");
  useScrollTop();
  const { types, isLoading, fetchTypes, slugify } = useTypes();
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyType());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTypes();
  }, [fetchTypes]);

  const handleEdit = (t) => {
    setEditingId(t.id);
    setForm({
      name: t.name,
      categories: t.categories || "Tops",
      sex: Array.isArray(t.sex) ? [...t.sex] : ["men", "women"],
      order: t.order || 0,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(emptyType());
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      displayActionMessage("Name is required", "info");
      return;
    }
    if (form.sex.length === 0) {
      displayActionMessage("Select at least one gender", "info");
      return;
    }
    setSaving(true);
    try {
      if (editingId === "new") {
        const id = slugify(form.name.trim());
        await firebase.addType(id, {
          name: form.name.trim(),
          categories: form.categories,
          sex: form.sex,
          order: form.order || 0,
        });
        displayActionMessage("Type added", "success");
      } else {
        await firebase.updateType(editingId, {
          name: form.name.trim(),
          categories: form.categories,
          sex: form.sex,
          order: form.order || 0,
        });
        displayActionMessage("Type updated", "success");
      }
      setEditingId(null);
      setForm(emptyType());
      fetchTypes();
    } catch (err) {
      displayActionMessage(err.message || "Failed to save", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this type?")) return;
    try {
      await firebase.deleteType(id);
      displayActionMessage("Type deleted", "success");
      fetchTypes();
    } catch (err) {
      displayActionMessage(err.message || "Failed to delete", "error");
    }
  };

  const toggleSex = (sexValue) => {
    setForm((prev) => ({
      ...prev,
      sex: prev.sex.includes(sexValue)
        ? prev.sex.filter((x) => x !== sexValue)
        : [...prev.sex, sexValue],
    }));
  };

  return (
    <Boundary>
      <div className="product-admin-header" style={{ justifyContent: "space-between" }}>
        <h3 className="product-admin-header-title">Product Types</h3>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button className="button-muted button-small" onClick={fetchTypes} type="button" disabled={isLoading}>
            <ReloadOutlined spin={isLoading} /> &nbsp;Refresh
          </button>
          <button
            className="button button-small"
            onClick={() => { setEditingId("new"); setForm(emptyType()); }}
            disabled={editingId === "new"}
            type="button"
          >
            <PlusOutlined /> &nbsp;Add Type
          </button>
        </div>
      </div>

      {editingId === "new" && (
        <div style={{ border: "2px solid #1890ff", borderRadius: "8px", padding: "1.5rem", marginBottom: "1.5rem", background: "#fafafa" }}>
          <h4 style={{ margin: "0 0 1rem" }}>New Type</h4>
          <TypeForm form={form} setForm={setForm} onSave={handleSave} onCancel={handleCancel} saving={saving} toggleSex={toggleSex} />
        </div>
      )}

      {isLoading ? (
        <div className="loader"><h3>Loading...</h3></div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {types.map((t) => (
            <div
              key={t.id}
              style={{
                border: editingId === t.id ? "2px solid #1890ff" : "1px solid #e5e5e5",
                borderRadius: "8px",
                padding: "1rem 1.5rem",
                display: "flex",
                alignItems: editingId === t.id ? "flex-start" : "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "0.75rem",
                background: editingId === t.id ? "#fafafa" : "#fff",
                flexDirection: editingId === t.id ? "column" : "row",
              }}
            >
              {editingId === t.id ? (
                <TypeForm form={form} setForm={setForm} onSave={handleSave} onCancel={handleCancel} saving={saving} toggleSex={toggleSex} />
              ) : (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1 }}>
                    <span style={{ fontWeight: 600, fontSize: "1.4rem" }}>{t.name}</span>
                    <span style={{ background: "#f0f0f0", borderRadius: "4px", padding: "2px 8px", fontSize: "1.2rem" }}>{t.categories}</span>
                    <div style={{ display: "flex", gap: "4px" }}>
                      {(t.sex || []).map((s) => (
                        <span key={s} style={{ background: "#e6f7ff", color: "#1890ff", borderRadius: "4px", padding: "2px 8px", fontSize: "1.2rem" }}>{s}</span>
                      ))}
                    </div>
                    <span style={{ color: "#aaa", fontSize: "1.2rem" }}>/type/{(t.sex || []).join(",")}/{typeToSlug(t.name)}</span>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button type="button" className="button button-small button-border" onClick={() => handleEdit(t)}>
                      <EditOutlined /> Edit
                    </button>
                    <button type="button" className="button button-small button-danger button-border" onClick={() => handleDelete(t.id)}>
                      <DeleteOutlined /> Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
          {types.length === 0 && !isLoading && (
            <p style={{ textAlign: "center", color: "#888", padding: "2rem" }}>No types found. Add one above.</p>
          )}
        </div>
      )}
    </Boundary>
  );
};

const TypeForm = ({ form, setForm, onSave, onCancel, saving, toggleSex }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", width: "100%" }}>
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
      <div style={{ flex: 1, minWidth: "200px" }}>
        <label style={{ display: "block", fontWeight: 600, marginBottom: "0.25rem", fontSize: "1.3rem" }}>Name</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          placeholder="e.g. T-Shirts, Hoodies, Pants"
          style={{ width: "100%", padding: "8px 12px", borderRadius: "4px", border: "1px solid #ccc", fontSize: "1.3rem" }}
        />
      </div>
      <div style={{ flex: 0, minWidth: "150px" }}>
        <label style={{ display: "block", fontWeight: 600, marginBottom: "0.25rem", fontSize: "1.3rem" }}>Category</label>
        <select
          value={form.categories}
          onChange={(e) => setForm((prev) => ({ ...prev, categories: e.target.value }))}
          style={{ width: "100%", padding: "8px 12px", borderRadius: "4px", border: "1px solid #ccc", fontSize: "1.3rem" }}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div style={{ flex: 0, minWidth: "80px" }}>
        <label style={{ display: "block", fontWeight: 600, marginBottom: "0.25rem", fontSize: "1.3rem" }}>Order</label>
        <input
          type="number"
          value={form.order}
          onChange={(e) => setForm((prev) => ({ ...prev, order: parseInt(e.target.value, 10) || 0 }))}
          style={{ width: "100%", padding: "8px 12px", borderRadius: "4px", border: "1px solid #ccc", fontSize: "1.3rem" }}
        />
      </div>
    </div>
    <div>
      <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", fontSize: "1.3rem" }}>Show for</label>
      <div style={{ display: "flex", gap: "1.5rem" }}>
        {SEX_OPTIONS.map((s) => {
          const isSelected = Array.isArray(form.sex) && form.sex.includes(s);
          return (
            <div
              key={s}
              onClick={() => toggleSex(s)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                cursor: "pointer",
                padding: "8px 16px",
                borderRadius: "6px",
                border: isSelected ? "2px solid #1890ff" : "2px solid #d9d9d9",
                background: isSelected ? "#e6f7ff" : "#fff",
                transition: "all 0.2s",
                userSelect: "none",
              }}
            >
              <div
                style={{
                  width: "18px",
                  height: "18px",
                  borderRadius: "3px",
                  border: isSelected ? "none" : "2px solid #d9d9d9",
                  background: isSelected ? "#1890ff" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {isSelected && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span style={{ fontSize: "1.3rem", fontWeight: isSelected ? 600 : 400, color: isSelected ? "#1890ff" : "#666" }}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <button
        type="button"
        className="button button-small"
        onClick={onSave}
        disabled={saving}
        style={{ backgroundColor: "#28a745", color: "#fff", border: "none", opacity: saving ? 0.7 : 1 }}
      >
        {saving ? "Saving..." : "Save"}
      </button>
      <button type="button" className="button button-small button-border" onClick={onCancel} disabled={saving}>
        Cancel
      </button>
    </div>
  </div>
);

export default AdminTypes;