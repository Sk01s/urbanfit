import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { LoadingOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { ADMIN_DASHBOARD } from "@/constants/routes";
import { displayActionMessage } from "@/helpers/utils";
import { useDocumentTitle, useScrollTop } from "@/hooks";

const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:3001";

const AdminVerify = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState("");
  const inputRefs = useRef([]);
  const history = useHistory();

  const { auth, profile } = useSelector((state) => ({
    auth: state.auth,
    profile: state.profile,
  }));

  useScrollTop();
  useDocumentTitle("Admin Verification | Urbanfit");

  // Check if already verified
  useEffect(() => {
    const checkVerification = async () => {
      if (!auth?.id) return;

      try {
        const response = await fetch(
          `${BACKEND_API_URL}/api/admin/verification-status/${auth.id}`
        );
        const data = await response.json();

        if (data.verified) {
          // Store verification in localStorage
          localStorage.setItem(
            "adminVerification",
            JSON.stringify({
              verified: true,
              expiresAt: data.expiresAt,
            })
          );
          history.push(ADMIN_DASHBOARD);
        }
      } catch (err) {
        console.error("Failed to check verification status:", err);
      }
    };

    checkVerification();
  }, [auth?.id, history]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const sendOtp = async () => {
    if (!auth?.id || !profile?.email) {
      setError("User information not available. Please try signing in again.");
      return;
    }

    setSending(true);
    setError("");

    try {
      const response = await fetch(`${BACKEND_API_URL}/api/admin/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminId: auth.id,
          adminEmail: profile.email,
          adminName: profile.fullname,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send OTP");
      }

      setOtpSent(true);
      setCountdown(60); // 60 seconds before resend
      displayActionMessage("Verification code sent to your email", "success");
    } catch (err) {
      setError(err.message);
      displayActionMessage(err.message, "error");
    } finally {
      setSending(false);
    }
  };

  const verifyOtp = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${BACKEND_API_URL}/api/admin/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminId: auth.id,
          otp: otpValue,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to verify OTP");
      }

      // Store verification in localStorage
      localStorage.setItem(
        "adminVerification",
        JSON.stringify({
          verified: true,
          expiresAt: data.verificationExpiresAt,
        })
      );

      displayActionMessage("Verification successful!", "success");
      history.push(ADMIN_DASHBOARD);
    } catch (err) {
      setError(err.message);
      displayActionMessage(err.message, "error");
      // Clear OTP on error
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (value && index === 5 && newOtp.every((digit) => digit)) {
      setTimeout(() => verifyOtp(), 100);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = [...otp];
      pastedData.split("").forEach((digit, index) => {
        if (index < 6) newOtp[index] = digit;
      });
      setOtp(newOtp);
      if (pastedData.length === 6) {
        inputRefs.current[5]?.focus();
      }
    }
  };

  // Redirect if not admin
  if (!auth || auth.role !== "ADMIN") {
    history.push("/");
    return null;
  }

  return (
    <div className="auth-content" style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ maxWidth: "450px", width: "100%", padding: "40px", background: "#fff", borderRadius: "16px", boxShadow: "0 4px 24px rgba(0,0,0,0.1)" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ 
            width: "80px", 
            height: "80px", 
            background: "linear-gradient(135deg, #1f2937 0%, #374151 100%)", 
            borderRadius: "16px", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            margin: "0 auto 20px"
          }}>
            <LockOutlined style={{ fontSize: "36px", color: "#fff" }} />
          </div>
          <h2 style={{ margin: "0 0 8px", fontSize: "24px", fontWeight: "700", color: "#111827" }}>
            Admin Verification
          </h2>
          <p style={{ margin: "0", color: "#6b7280", fontSize: "14px" }}>
            Secure access to the admin dashboard
          </p>
        </div>

        {!otpSent ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ 
              background: "#f3f4f6", 
              borderRadius: "12px", 
              padding: "20px", 
              marginBottom: "24px" 
            }}>
              <MailOutlined style={{ fontSize: "24px", color: "#6b7280", marginBottom: "12px" }} />
              <p style={{ margin: "0", color: "#374151", fontSize: "14px" }}>
                We'll send a verification code to:
              </p>
              <p style={{ margin: "8px 0 0", color: "#111827", fontWeight: "600" }}>
                {profile?.email}
              </p>
            </div>
            
            <button
              className="button"
              onClick={sendOtp}
              disabled={sending}
              style={{ 
                width: "100%", 
                padding: "14px", 
                fontSize: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
              }}
            >
              {sending ? (
                <>
                  <LoadingOutlined /> Sending...
                </>
              ) : (
                "Send Verification Code"
              )}
            </button>
          </div>
        ) : (
          <div>
            <p style={{ textAlign: "center", color: "#6b7280", marginBottom: "24px", fontSize: "14px" }}>
              Enter the 6-digit code sent to <strong>{profile?.email}</strong>
            </p>

            <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "24px" }}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  disabled={loading}
                  style={{
                    width: "50px",
                    height: "56px",
                    textAlign: "center",
                    fontSize: "24px",
                    fontWeight: "600",
                    border: "2px solid #e5e7eb",
                    borderRadius: "12px",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#3b82f6";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e5e7eb";
                  }}
                />
              ))}
            </div>

            {error && (
              <div style={{ 
                background: "#fef2f2", 
                color: "#dc2626", 
                padding: "12px", 
                borderRadius: "8px", 
                marginBottom: "16px",
                fontSize: "14px",
                textAlign: "center"
              }}>
                {error}
              </div>
            )}

            <button
              className="button"
              onClick={verifyOtp}
              disabled={loading || otp.some((digit) => !digit)}
              style={{ 
                width: "100%", 
                padding: "14px", 
                fontSize: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginBottom: "16px"
              }}
            >
              {loading ? (
                <>
                  <LoadingOutlined /> Verifying...
                </>
              ) : (
                "Verify Code"
              )}
            </button>

            <div style={{ textAlign: "center" }}>
              {countdown > 0 ? (
                <p style={{ color: "#6b7280", fontSize: "14px", margin: "0" }}>
                  Resend code in {countdown}s
                </p>
              ) : (
                <button
                  onClick={sendOtp}
                  disabled={sending}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#3b82f6",
                    cursor: "pointer",
                    fontSize: "14px",
                    textDecoration: "underline",
                  }}
                >
                  {sending ? "Sending..." : "Resend Code"}
                </button>
              )}
            </div>
          </div>
        )}

        <div style={{ 
          marginTop: "32px", 
          padding: "16px", 
          background: "#fef3c7", 
          borderRadius: "8px",
          fontSize: "12px",
          color: "#92400e",
          textAlign: "center"
        }}>
          <strong>Security Notice:</strong> This verification is required every 2 days for admin access. The code expires in 20 minutes.
        </div>
      </div>
    </div>
  );
};

export default AdminVerify;
