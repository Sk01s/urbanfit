import { LoadingOutlined, SaveOutlined, SettingOutlined } from "@ant-design/icons";
import { displayActionMessage } from "@/helpers/utils";
import { useDocumentTitle, useScrollTop } from "@/hooks";
import React, { useEffect, useState } from "react";
import firebaseInstance from "@/services/firebase";
import { useHistory } from "react-router-dom";
import { PROMO } from "@/constants/routes";

const AdminPromoPopup = () => {
  useScrollTop();
  useDocumentTitle("Promo Popup Settings | Urbanfit Admin");
  const history = useHistory();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    enabled: false,
    startDate: "",
    endDate: "",
    text: "",
    promoCode: "",
    percentage: 10,
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const snapshot = await firebaseInstance.getPromoPopupSettings();
        if (snapshot.exists) {
          const data = snapshot.data();
          const toLocalDatetime = (ts) => {
            const d = new Date(ts);
            const pad = (n) => String(n).padStart(2, "0");
            return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
          };
          setSettings({
            enabled: data.enabled ?? false,
            startDate: data.startDate ? toLocalDatetime(data.startDate) : "",
            endDate: data.endDate ? toLocalDatetime(data.endDate) : "",
            text: data.text || "",
            promoCode: data.promoCode || "",
            percentage: data.percentage ?? 10,
          });
        }
      } catch (err) {
        console.error("Failed to load promo popup settings:", err);
        displayActionMessage("Failed to load settings", "error");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleSave = async () => {
    if (!settings.startDate || !settings.endDate) {
      displayActionMessage("Start and end dates are required", "error");
      return;
    }
    if (!settings.text.trim()) {
      displayActionMessage("Text is required", "error");
      return;
    }
    if (!settings.promoCode.trim()) {
      displayActionMessage("Promo code is required", "error");
      return;
    }
    if (!settings.percentage || settings.percentage < 1 || settings.percentage > 100) {
      displayActionMessage("Percentage must be between 1 and 100", "error");
      return;
    }

    if (new Date(settings.startDate) >= new Date(settings.endDate)) {
      displayActionMessage("End date must be after start date", "error");
      return;
    }

    setSaving(true);
    try {
      const code = settings.promoCode.trim();
      const startDate = new Date(settings.startDate).getTime();
      const endDate = new Date(settings.endDate).getTime();

      await firebaseInstance.setPromoPopupSettings({
        enabled: settings.enabled,
        startDate,
        endDate,
        text: settings.text.trim(),
        promoCode: code,
        percentage: Number(settings.percentage),
        updatedAt: Date.now(),
      });

      const existing = await firebaseInstance.getPromo(code);
      if (!existing.exists) {
        await firebaseInstance.addPromo(code, {
          code,
          percentage: Number(settings.percentage),
          max: 999999,
          uses: 0,
          startDate,
          endDate,
          orders: [],
          dateAdded: Date.now(),
        });
      }

      displayActionMessage("Promo popup settings saved!", "success");
      history.push(PROMO);
    } catch (err) {
      console.error("Failed to save settings:", err);
      displayActionMessage(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="loader" style={{ minHeight: "400px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <LoadingOutlined style={{ fontSize: "32px" }} />
        <span style={{ marginLeft: "12px" }}>Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="product-admin-items" style={{ padding: "20px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ display: "flex", alignItems: "center", gap: "12px", margin: "0 0 8px" }}>
          <SettingOutlined />
          Promo Popup Settings
        </h2>
        <p style={{ color: "#6b7280", margin: "0" }}>
          Configure the promo popup that appears on page load, sign-in, and checkout.
        </p>
      </div>

      <div style={{ background: "#fff", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <div style={{ background: "#f9fafb", borderRadius: "8px", padding: "20px" }}>
          <div style={{ display: "flex",  justifyContent: "space-between", marginBottom: "20px", paddingBottom: "20px", borderBottom: "1px solid #e5e7eb" }}>
            <div>
              <label style={{ fontWeight: "500", fontSize: "15px", color: "#111827", background: "transparent", border: "none" }}>
                Enable Promo Popup
              </label>
              <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "13px" }}>
                Show the promo popup to users on your site
              </p>
            </div>
            <label style={{ position: "relative", display: "inline-block", width: "52px", height: "28px" }}>
              <input
                type="checkbox"
                checked={settings.enabled}
                onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span style={{
                position: "absolute", cursor: "pointer", top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: settings.enabled ? "#7c3aed" : "#d1d5db", transition: "0.3s", borderRadius: "1.25rem",
              }}>
                <span style={{
                  position: "absolute", height: "22px", width: "22px",
                  left: settings.enabled ? "27px" : "3px", bottom: "3px",
                  backgroundColor: "white", transition: "0.3s", borderRadius: "50%",
                }} />
              </span>
            </label>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontWeight: "500", fontSize: "15px", color: "#111827", display: "block", marginBottom: "8px", background: "transparent", border: "none" }}>
              Start Date & Time
            </label>
            <input
              type="datetime-local"
              value={settings.startDate}
              onChange={(e) => setSettings({ ...settings, startDate: e.target.value })}
              style={{
                width: "100%", padding: "10px 14px", fontSize: "14px",
                border: "2px solid #e5e7eb", borderRadius: "8px", outline: "none",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontWeight: "500", fontSize: "15px", color: "#111827", display: "block", marginBottom: "8px", background: "transparent", border: "none" }}>
              End Date & Time
            </label>
            <input
              type="datetime-local"
              value={settings.endDate}
              onChange={(e) => setSettings({ ...settings, endDate: e.target.value })}
              style={{
                width: "100%", padding: "10px 14px", fontSize: "14px",
                border: "2px solid #e5e7eb", borderRadius: "8px", outline: "none",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontWeight: "500", fontSize: "15px", color: "#111827", display: "block", marginBottom: "8px", background: "transparent", border: "none" }}>
              Promo Text
            </label>
            <textarea
              value={settings.text}
              onChange={(e) => setSettings({ ...settings, text: e.target.value })}
              rows={3}
              placeholder="e.g. Get 20% off your first order! Use code below."
              style={{
                width: "100%", padding: "10px 14px", fontSize: "14px",
                border: "2px solid #e5e7eb", borderRadius: "8px", outline: "none", resize: "vertical",
                fontFamily: "inherit",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontWeight: "500", fontSize: "15px", color: "#111827", display: "block", marginBottom: "8px", background: "transparent", border: "none" }}>
              Promo Code
            </label>
            <input
              type="text"
              value={settings.promoCode}
              onChange={(e) => setSettings({ ...settings, promoCode: e.target.value })}
              placeholder="e.g. POPUP20"
              style={{
                width: "100%", padding: "10px 14px", fontSize: "14px",
                border: "2px solid #e5e7eb", borderRadius: "8px", outline: "none",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontWeight: "500", fontSize: "15px", color: "#111827", display: "block", marginBottom: "8px", background: "transparent", border: "none" }}>
              Discount Percentage
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="number"
                min="1"
                max="100"
                value={settings.percentage}
                onChange={(e) => setSettings({ ...settings, percentage: Math.min(100, Math.max(1, Number(e.target.value) || 0)) })}
                style={{
                  width: "100px", padding: "10px 14px", fontSize: "16px", fontWeight: "500",
                  border: "2px solid #e5e7eb", borderRadius: "8px", outline: "none",
                }}
              />
              <span style={{ color: "#6b7280", fontSize: "14px" }}>%</span>
            </div>
          </div>
        </div>

        <button
          className="button"
          onClick={handleSave}
          disabled={saving}
          style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 24px", fontSize: "15px", marginTop: "20px" }}
        >
          {saving ? <><LoadingOutlined /> Saving...</> : <><SaveOutlined /> Save Promo Popup Settings</>}
        </button>
      </div>
    </div>
  );
};

export default AdminPromoPopup;
