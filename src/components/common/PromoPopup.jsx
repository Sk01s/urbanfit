import Modal from "@/components/common/Modal";
import { CHECKOUT_STEP_1, CHECKOUT_STEP_2, CHECKOUT_STEP_3 } from "@/constants/routes";
import { setPromo } from "@/redux/actions/checkoutActions";
import { hidePromoPopup } from "@/redux/actions/miscActions";
import firebaseInstance from "@/services/firebase";
import { useSiteImages } from "@/hooks";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const CHECKOUT_ROUTES = [CHECKOUT_STEP_1, CHECKOUT_STEP_2, CHECKOUT_STEP_3];

const canShow = (s) => {
  if (!s || !s.enabled) return false;
  const now = Date.now();
  return now >= s.startDate && now <= s.endDate;
};

const isDismissed = (s) => {
  if (!s) return true;
  return localStorage.getItem("promoPopupDismissed") === String(s.updatedAt);
};

const dismiss = (s) => {
  if (s) {
    localStorage.setItem("promoPopupDismissed", String(s.updatedAt));
  }
};

const PromoPopup = () => {
  const dispatch = useDispatch();
  const { getImageUrl } = useSiteImages();
  const { pathname } = useLocation();
  const promoPopupVisible = useSelector((state) => state.app.promoPopupVisible);
  const auth = useSelector((state) => state.auth);

  const [settings, setSettings] = useState(null);
  const [visible, setVisible] = useState(false);
  const prevAuthRef = useRef(auth);
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    firebaseInstance.getPromoPopupSettings().then((snapshot) => {
      if (snapshot.exists) {
        const data = snapshot.data();
        setSettings(data);
        if (canShow(data) && !isDismissed(data)) {
          setVisible(true);
        }
      } else {
        setSettings({ enabled: false });
      }
    }).catch((err) => {
      console.error("PromoPopup fetch error:", err);
      setSettings({ enabled: false });
    });
  }, []);

  useEffect(() => {
    if (!promoPopupVisible || !settings) return;
    if (canShow(settings) && !isDismissed(settings)) {
      setVisible(true);
    }
    dispatch(hidePromoPopup());
  }, [promoPopupVisible, settings, dispatch]);

  useEffect(() => {
    const prev = prevAuthRef.current;
    prevAuthRef.current = auth;
    if (!prev && auth && settings && canShow(settings) && !isDismissed(settings)) {
      setVisible(true);
    }
  }, [auth, settings]);

  useEffect(() => {
    const prev = prevPathRef.current;
    prevPathRef.current = pathname;
    if (CHECKOUT_ROUTES.includes(pathname) && !CHECKOUT_ROUTES.includes(prev) && settings && canShow(settings) && !isDismissed(settings)) {
      setVisible(true);
    }
  }, [pathname, settings]);

  const handleClose = () => {
    setVisible(false);
    dispatch(hidePromoPopup());
    dismiss(settings);
  };

  const handleApply = () => {
    if (!settings) return;
    dispatch(setPromo({ code: settings.promoCode, percentage: settings.percentage }));
    handleClose();
  };

  return (
    <Modal isOpen={visible} onRequestClose={handleClose}>
      <div style={{
        display: "flex",
        flexDirection: "column",

        gap: "1.5rem",
        padding: "2rem",
        textAlign: "center",
        maxWidth: "400px",
      }}>
        <button
          onClick={handleClose}
          type="button"
          style={{
            position: "absolute",
            top: "0.5rem",
            right: "0.5rem",
            background: "none",
            border: "none",
            fontSize: "1.8rem",
            cursor: "pointer",
            color: "#666",
            lineHeight: 1,
          }}
        >
          &times;
        </button>

        <img
          src={getImageUrl("logo-full")}
          alt="Logo"
          style={{ maxWidth: "180px", height: "auto" ,textAlign: "center", marginInline: "auto"}}
        />

        {settings?.text && (
          <p style={{ fontSize: "1.1rem", color: "#333", margin: 0, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
            {settings.text}
          </p>
        )}

        {settings?.promoCode && (
          <button
            onClick={handleApply}
            type="button"
            style={{
              background: "#06030c",
              color: "#fff",
              border: "none",
              borderRadius: "2px",
              padding: "12px 32px",
              fontSize: "1.4rem",
              fontWeight: "700",
              letterSpacing: "2px",
              cursor: "pointer",
              textTransform: "uppercase",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => { e.target.style.background = "#000000"; }}
            onMouseLeave={(e) => { e.target.style.background = "#0c0616"; }}
          >
            {settings.promoCode}
          </button>
        )}

        {settings?.percentage > 0 && (
          <span style={{ fontSize: "0.9rem", color: "#6b7280" }}>
            {settings.percentage}% off — click the code to apply
          </span>
        )}

        <button
          onClick={handleClose}
          type="button"
          className="button button-border button-border-gray button-small"
          style={{ fontSize: "1rem" }}
        >
          No thanks
        </button>
      </div>
    </Modal>
  );
};

export default PromoPopup;
