import React, { useState, useEffect } from "react";
import {
  LoadingOutlined,
  SaveOutlined,
  SettingOutlined,
  MailOutlined,
  CarOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { displayActionMessage } from "@/helpers/utils";
import { useDocumentTitle, useScrollTop } from "@/hooks";

const BACKEND_API_URL =
  import.meta.env.VITE_BACKEND_API_URL || "http://localhost:3001";

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingShipping, setSavingShipping] = useState(false);
  const [settings, setSettings] = useState({
    delayHours: 12,
    enabled: true,
  });
  const [shippingSettings, setShippingSettings] = useState({
    rates: [],
    defaultRate: 5,
    enabled: true,
  });
  const [newCity, setNewCity] = useState("");
  const [newRate, setNewRate] = useState("");

  useScrollTop();
  useDocumentTitle("Settings | Admin | Urbanfit");

  // Fetch current settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Fetch both wishlist and shipping settings in parallel
        const [wishlistRes, shippingRes] = await Promise.all([
          fetch(`${BACKEND_API_URL}/api/admin/settings/wishlist-email`),
          fetch(`${BACKEND_API_URL}/api/shipping/rates`),
        ]);

        const wishlistData = await wishlistRes.json();
        const shippingData = await shippingRes.json();

        if (wishlistData.success && wishlistData.data) {
          setSettings(wishlistData.data);
        }
        if (shippingData.success && shippingData.data) {
          // Ensure rates array exists and has proper structure
          setShippingSettings({
            rates: shippingData.data.rates || [],
            defaultRate: shippingData.data.defaultRate ?? 5,
            enabled: shippingData.data.enabled !== false,
          });
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

  const handleSaveWishlist = async () => {
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
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save settings");
      }

      displayActionMessage("Wishlist settings saved!", "success");
    } catch (err) {
      console.error("Failed to save settings:", err);
      displayActionMessage(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveShipping = async () => {
    setSavingShipping(true);

    try {
      const response = await fetch(
        `${BACKEND_API_URL}/api/admin/shipping/rates`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(shippingSettings),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save shipping rates");
      }

      displayActionMessage("Shipping rates saved!", "success");
    } catch (err) {
      console.error("Failed to save shipping rates:", err);
      displayActionMessage(err.message, "error");
    } finally {
      setSavingShipping(false);
    }
  };

  const handleAddCity = async () => {
    if (!newCity.trim() || !newRate) {
      displayActionMessage("Please enter both city name and rate", "info");
      return;
    }

    const rate = parseFloat(newRate);
    if (isNaN(rate) || rate < 0) {
      displayActionMessage("Please enter a valid rate", "error");
      return;
    }

    // Check if city already exists
    const existingIndex = shippingSettings.rates.findIndex(
      (r) => r.city.toLowerCase().trim() === newCity.toLowerCase().trim(),
    );

    const newRates = [...shippingSettings.rates];
    if (existingIndex >= 0) {
      newRates[existingIndex].rate = rate;
    } else {
      newRates.push({ city: newCity.trim(), rate });
    }

    setShippingSettings({ ...shippingSettings, rates: newRates });
    setNewCity("");
    setNewRate("");
    displayActionMessage(
      existingIndex >= 0 ? "Rate updated" : "City added",
      "success",
    );
  };

  const handleDeleteCity = (cityToDelete) => {
    const newRates = shippingSettings.rates.filter(
      (r) => r.city.toLowerCase() !== cityToDelete.toLowerCase(),
    );
    setShippingSettings({ ...shippingSettings, rates: newRates });
    displayActionMessage("City removed", "info");
  };

  const handleRateChange = (city, newRateValue) => {
    // Allow empty input for user to type
    if (newRateValue === "" || newRateValue === undefined) {
      const newRates = shippingSettings.rates.map((r) =>
        r.city === city ? { ...r, rate: 0 } : r,
      );
      setShippingSettings({ ...shippingSettings, rates: newRates });
      return;
    }

    const rate = parseFloat(newRateValue);
    if (isNaN(rate) || rate < 0) return;

    const newRates = shippingSettings.rates.map((r) =>
      r.city === city ? { ...r, rate } : r,
    );
    setShippingSettings({ ...shippingSettings, rates: newRates });
  };

  if (loading) {
    return (
      <div
        className="loader"
        style={{
          minHeight: "400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LoadingOutlined style={{ fontSize: "32px" }} />
        <span style={{ marginLeft: "12px" }}>Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="product-admin-items" style={{ padding: "20px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h2
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            margin: "0 0 8px",
          }}
        >
          <SettingOutlined />
          Admin Settings
        </h2>
        <p style={{ color: "#6b7280", margin: "0" }}>
          Configure email notifications, shipping rates, and other system
          settings
        </p>
      </div>

      {/* Shipping Rates Settings */}
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          <div>
            <h3 style={{ margin: "0", fontSize: "18px", fontWeight: "600" }}>
              Shipping Rates
            </h3>
            <p
              style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "14px" }}
            >
              Set shipping prices per city/region
            </p>
          </div>
        </div>

        <div
          style={{
            background: "#f9fafb",
            borderRadius: "8px",
            padding: "20px",
            marginBottom: "20px",
          }}
        >
          {/* Default Rate */}
          <div
            style={{
              marginBottom: "20px",
              paddingBottom: "20px",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <label
              style={{
                fontWeight: "500",
                fontSize: "15px",
                color: "#111827",
                display: "block",
                marginBottom: "8px",
                background: "transparent",
                border: "none",
              }}
            >
              Default Shipping Rate
            </label>
            <p
              style={{ margin: "0 0 12px", color: "#6b7280", fontSize: "13px" }}
            >
              This rate is used when the customer's city is not in the list
              below
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "#6b7280" }}>$</span>
              <input
                type="number"
                min="0"
                step="0.5"
                value={shippingSettings.defaultRate}
                onChange={(e) =>
                  setShippingSettings({
                    ...shippingSettings,
                    defaultRate: parseFloat(e.target.value) || 0,
                  })
                }
                onFocus={(e) => (e.target.style.borderColor = "#059669")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                style={{
                  width: "100px",
                  padding: "10px 14px",
                  fontSize: "16px",
                  fontWeight: "500",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
              />
            </div>
          </div>

          {/* City Rates List */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                fontWeight: "500",
                fontSize: "15px",
                color: "#111827",
                display: "block",
                marginBottom: "12px",
                background: "transparent",
                border: "none",
              }}
            >
              City-Specific Rates
            </label>

            {shippingSettings.rates.length === 0 ? (
              <p
                style={{
                  color: "#9ca3af",
                  fontSize: "14px",
                  textAlign: "center",
                  padding: "20px",
                }}
              >
                No city rates configured. Add cities below.
              </p>
            ) : (
              <div style={{ display: "grid", gap: "8px" }}>
                {shippingSettings.rates.map((rate, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      background: "#fff",
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <span
                      style={{ flex: 1, fontWeight: "500", color: "#111827" }}
                    >
                      {rate.city}
                    </span>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span style={{ color: "#6b7280" }}>$</span>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={rate.rate}
                        onChange={(e) =>
                          handleRateChange(rate.city, e.target.value)
                        }
                        onFocus={(e) =>
                          (e.target.style.borderColor = "#059669")
                        }
                        onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                        style={{
                          width: "80px",
                          padding: "8px 12px",
                          fontSize: "14px",
                          border: "1px solid #e5e7eb",
                          borderRadius: "6px",
                          outline: "none",
                          transition: "border-color 0.2s",
                        }}
                      />
                    </div>
                    <button
                      onClick={() => handleDeleteCity(rate.city)}
                      onMouseEnter={(e) => {
                        e.target.style.background = "#fef2f2";
                        e.target.style.transform = "scale(1.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = "none";
                        e.target.style.transform = "scale(1)";
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#ef4444",
                        cursor: "pointer",
                        padding: "8px",
                        borderRadius: "6px",
                        transition: "all 0.2s",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <DeleteOutlined />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add New City */}
          <div
            style={{
              background: "#fff",
              padding: "16px",
              borderRadius: "8px",
              border: "1px dashed #d1d5db",
            }}
          >
            <label
              style={{
                fontWeight: "500",
                fontSize: "14px",
                color: "#374151",
                display: "block",
                marginBottom: "12px",
                background: "transparent",
                border: "none",
              }}
            >
              Add New City
            </label>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <input
                type="text"
                placeholder="City name"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddCity()}
                onFocus={(e) => (e.target.style.borderColor = "#059669")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                style={{
                  flex: "1",
                  minWidth: "150px",
                  padding: "10px 14px",
                  fontSize: "14px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
              />
              <div
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <span style={{ color: "#6b7280" }}>$</span>
                <input
                  type="number"
                  placeholder="Rate"
                  min="0"
                  step="0.5"
                  value={newRate}
                  onChange={(e) => setNewRate(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddCity()}
                  onFocus={(e) => (e.target.style.borderColor = "#059669")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                  style={{
                    width: "80px",
                    padding: "10px 14px",
                    fontSize: "14px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                />
              </div>
              <button
                onClick={handleAddCity}
                onMouseEnter={(e) => (e.target.style.background = "#047857")}
                onMouseLeave={(e) => (e.target.style.background = "#059669")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "10px 16px",
                  background: "#059669",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "background 0.2s",
                }}
              >
                <PlusOutlined /> Add
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          className="button"
          onClick={handleSaveShipping}
          disabled={savingShipping}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 24px",
            fontSize: "15px",
          }}
        >
          {savingShipping ? (
            <>
              <LoadingOutlined /> Saving...
            </>
          ) : (
            <>
              <SaveOutlined /> Save Shipping Rates
            </>
          )}
        </button>
      </div>

      {/* Wishlist Email Settings */}
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          <div>
            <h3 style={{ margin: "0", fontSize: "18px", fontWeight: "600" }}>
              Wishlist Reminder Emails
            </h3>
            <p
              style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "14px" }}
            >
              Configure when to send reminder emails for wishlist items
            </p>
          </div>
        </div>

        <div
          style={{
            background: "#f9fafb",
            borderRadius: "8px",
            padding: "20px",
            marginBottom: "20px",
          }}
        >
          {/* Enable/Disable Toggle */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "20px",
              paddingBottom: "20px",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <div>
              <label
                style={{
                  fontWeight: "500",
                  fontSize: "15px",
                  color: "#111827",
                  background: "transparent",
                  border: "none",
                }}
              >
                Enable Wishlist Reminders
              </label>
              <p
                style={{
                  margin: "4px 0 0",
                  color: "#6b7280",
                  fontSize: "13px",
                }}
              >
                Send email reminders to users about items in their wishlist
              </p>
            </div>
            <label
              style={{
                position: "relative",
                display: "inline-block",
                width: "52px",
                height: "28px",
                borderRadius: "28px",
                border: "none",
              }}
            >
              <input
                type="checkbox"
                checked={settings.enabled}
                onChange={(e) =>
                  setSettings({ ...settings, enabled: e.target.checked })
                }
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span
                style={{
                  position: "absolute",
                  cursor: "pointer",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: settings.enabled ? "#7c3aed" : "#d1d5db",
                  transition: "0.3s",
                  borderRadius: "1.25rem",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    content: "",
                    height: "22px",
                    width: "22px",
                    left: settings.enabled ? "27px" : "3px",
                    bottom: "3px",
                    backgroundColor: "white",
                    transition: "0.3s",
                    borderRadius: "50%",
                  }}
                />
              </span>
            </label>
          </div>

          {/* Delay Hours Setting */}
          <div>
            <label
              style={{
                display: "block",
                fontWeight: "500",
                fontSize: "15px",
                color: "#111827",
                marginBottom: "8px",
                background: "transparent",
                border: "none",
              }}
            >
              Delay Before Sending (hours)
            </label>
            <p
              style={{ margin: "0 0 12px", color: "#6b7280", fontSize: "13px" }}
            >
              How many hours after adding an item to the wishlist should the
              reminder be sent?
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <input
                type="number"
                min="1"
                max="168"
                value={settings.delayHours}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    delayHours: Math.max(
                      1,
                      Math.min(168, parseInt(e.target.value) || 12),
                    ),
                  })
                }
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
              <span style={{ color: "#6b7280", fontSize: "14px" }}>hours</span>
            </div>
            <div
              style={{
                marginTop: "12px",
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >
              {[6, 12, 24, 48, 72].map((hours) => (
                <button
                  key={hours}
                  onClick={() =>
                    setSettings({ ...settings, delayHours: hours })
                  }
                  disabled={!settings.enabled}
                  style={{
                    padding: "6px 12px",
                    fontSize: "13px",
                    border:
                      settings.delayHours === hours
                        ? "2px solid #7c3aed"
                        : "1px solid #d1d5db",
                    borderRadius: "6px",
                    background:
                      settings.delayHours === hours ? "#f5f3ff" : "#fff",
                    color:
                      settings.delayHours === hours ? "#7c3aed" : "#374151",
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
        <div
          style={{
            background: "#f0f9ff",
            border: "1px solid #bae6fd",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "20px",
          }}
        >
          <p style={{ margin: "0", color: "#0369a1", fontSize: "14px" }}>
            <strong>Note:</strong> Reminder emails are only sent to logged-in
            users who have an email address in their profile. Each item only
            triggers one reminder email when first added to the wishlist.
          </p>
        </div>

        {/* Save Button */}
        <button
          className="button"
          onClick={handleSaveWishlist}
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
              <SaveOutlined /> Save Email Settings
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;
