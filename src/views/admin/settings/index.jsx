import React, { useState, useEffect } from "react";
import { LoadingOutlined, SaveOutlined, SettingOutlined, MailOutlined } from "@ant-design/icons";
import { displayActionMessage } from "@/helpers/utils";
import { useDocumentTitle, useScrollTop } from "@/hooks";

const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:3001";

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    delayHours: 12,
    enabled: true,
  });

  useScrollTop();
  useDocumentTitle("Settings | Admin | Urbanfit");

  // Fetch current settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(
          `${BACKEND_API_URL}/api/admin/settings/wishlist-email`
        );
        const data = await response.json();

        if (data.success) {
          setSettings(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch settings:", err);
        displayActionMessage("Failed to load settings", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);

    try {
      const response = await fetch(
        `${BACKEND_API_URL}/api/admin/settings/wishlist-email`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(settings),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save settings");
      }

      displayActionMessage("Settings saved successfully!", "success");
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
          Admin Settings
        </h2>
        <p style={{ color: "#6b7280", margin: "0" }}>
          Configure email notifications and other system settings
        </p>
      </div>

      {/* Wishlist Email Settings */}
      <div style={{ 
        background: "#fff", 
        borderRadius: "12px", 
        padding: "24px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        marginBottom: "24px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
          <div style={{ 
            width: "48px", 
            height: "48px", 
            background: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)", 
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <MailOutlined style={{ fontSize: "24px", color: "#fff" }} />
          </div>
          <div>
            <h3 style={{ margin: "0", fontSize: "18px", fontWeight: "600" }}>
              Wishlist Reminder Emails
            </h3>
            <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "14px" }}>
              Configure when to send reminder emails for wishlist items
            </p>
          </div>
        </div>

        <div style={{ 
          background: "#f9fafb", 
          borderRadius: "8px", 
          padding: "20px",
          marginBottom: "20px"
        }}>
          {/* Enable/Disable Toggle */}
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between",
            marginBottom: "20px",
            paddingBottom: "20px",
            borderBottom: "1px solid #e5e7eb"
          }}>
            <div>
              <label style={{ fontWeight: "500", fontSize: "15px", color: "#111827" }}>
                Enable Wishlist Reminders
              </label>
              <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "13px" }}>
                Send email reminders to users about items in their wishlist
              </p>
            </div>
            <label style={{ 
              position: "relative", 
              display: "inline-block", 
              width: "52px", 
              height: "28px" 
            }}>
              <input
                type="checkbox"
                checked={settings.enabled}
                onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span style={{
                position: "absolute",
                cursor: "pointer",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: settings.enabled ? "#7c3aed" : "#d1d5db",
                transition: "0.3s",
                borderRadius: "28px",
              }}>
                <span style={{
                  position: "absolute",
                  content: "",
                  height: "22px",
                  width: "22px",
                  left: settings.enabled ? "27px" : "3px",
                  bottom: "3px",
                  backgroundColor: "white",
                  transition: "0.3s",
                  borderRadius: "50%",
                }} />
              </span>
            </label>
          </div>

          {/* Delay Hours Setting */}
          <div>
            <label style={{ 
              display: "block", 
              fontWeight: "500", 
              fontSize: "15px", 
              color: "#111827",
              marginBottom: "8px"
            }}>
              Delay Before Sending (hours)
            </label>
            <p style={{ margin: "0 0 12px", color: "#6b7280", fontSize: "13px" }}>
              How many hours after adding an item to the wishlist should the reminder be sent?
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <input
                type="number"
                min="1"
                max="168"
                value={settings.delayHours}
                onChange={(e) => setSettings({ 
                  ...settings, 
                  delayHours: Math.max(1, Math.min(168, parseInt(e.target.value) || 12)) 
                })}
                disabled={!settings.enabled}
                style={{
                  width: "100px",
                  padding: "10px 14px",
                  fontSize: "16px",
                  fontWeight: "500",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  outline: "none",
                  opacity: settings.enabled ? 1 : 0.5,
                }}
              />
              <span style={{ color: "#6b7280", fontSize: "14px" }}>
                hours
              </span>
            </div>
            <div style={{ marginTop: "12px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {[6, 12, 24, 48, 72].map((hours) => (
                <button
                  key={hours}
                  onClick={() => setSettings({ ...settings, delayHours: hours })}
                  disabled={!settings.enabled}
                  style={{
                    padding: "6px 12px",
                    fontSize: "13px",
                    border: settings.delayHours === hours ? "2px solid #7c3aed" : "1px solid #d1d5db",
                    borderRadius: "6px",
                    background: settings.delayHours === hours ? "#f5f3ff" : "#fff",
                    color: settings.delayHours === hours ? "#7c3aed" : "#374151",
                    cursor: settings.enabled ? "pointer" : "not-allowed",
                    opacity: settings.enabled ? 1 : 0.5,
                  }}
                >
                  {hours < 24 ? `${hours}h` : `${hours / 24}d`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div style={{ 
          background: "#f0f9ff", 
          border: "1px solid #bae6fd",
          borderRadius: "8px", 
          padding: "16px",
          marginBottom: "20px"
        }}>
          <p style={{ margin: "0", color: "#0369a1", fontSize: "14px" }}>
            <strong>Note:</strong> Reminder emails are only sent to logged-in users who have an email address in their profile. 
            Each item only triggers one reminder email when first added to the wishlist.
          </p>
        </div>

        {/* Save Button */}
        <button
          className="button"
          onClick={handleSave}
          disabled={saving}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 24px",
            fontSize: "15px",
          }}
        >
          {saving ? (
            <>
              <LoadingOutlined /> Saving...
            </>
          ) : (
            <>
              <SaveOutlined /> Save Settings
            </>
          )}
        </button>
      </div>

      {/* Future settings sections can be added here */}
      <div style={{ 
        background: "#f9fafb", 
        borderRadius: "12px", 
        padding: "40px",
        textAlign: "center",
        border: "2px dashed #e5e7eb"
      }}>
        <p style={{ color: "#9ca3af", margin: "0", fontSize: "14px" }}>
          More settings coming soon...
        </p>
      </div>
    </div>
  );
};

export default AdminSettings;
