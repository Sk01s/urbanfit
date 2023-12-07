import React from "react";
import emailjs from "@emailjs/browser";
import { useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { useScrollTop } from "@/hooks";
const Contact = () => {
  useScrollTop();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState();
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    emailjs
      .sendForm(
        "service_vyw8iqt",
        "template_43b1yy7",
        e.target,
        "JPeR2g9TA1pVocFL4"
      )
      .then(() => {
        setMessage("We will reply ASAP");
        e.target.reset();
      })
      .catch(() => setError("Try Again"))
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <main style={{ marginTop: "12rem" }}>
      <h2 style={{ textAlign: "center", marginBottom: 0 }}>Contact Us</h2>
      <img src="/contact-us.jpg" className="contact-banner" alt="" />
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          width: "70%",
          marginInline: "auto",
        }}
        className="contact"
        onSubmit={handleSubmit}
      >
        <h3 style={{ color: "#343a40" }}>Drop us a line</h3>
        <div className="input-group">
          <label
            htmlFor="email"
            className="label-input active"
            style={{ position: "absolute", top: "auto" }}
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="input-form"
            required={true}
          />
        </div>
        <div className="input-group">
          <label
            htmlFor="phone"
            className="label-input active"
            style={{ position: "absolute", top: "auto" }}
          >
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            className="input-form"
            required={true}
          />
        </div>
        <div className="input-group">
          <label
            htmlFor="name"
            className="label-input active"
            style={{ position: "absolute", top: "auto" }}
          >
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            className="input-form"
            required={true}
          />
        </div>
        <div className="input-group">
          <label
            htmlFor="message"
            className="label-input active"
            style={{ position: "absolute", top: "auto" }}
          >
            Message
          </label>
          <textarea
            required={true}
            name="message"
            id="message"
            cols="30"
            rows="3"
            className="input-form"
          ></textarea>
        </div>
        <button
          disabled={loading}
          className="button"
          style={{ width: "fit-content" }}
        >
          {loading ? <LoadingOutlined /> : "Send"}
        </button>
        <div style={{ color: "green", textAlign: "center" }}>{message}</div>
        <div style={{ color: "red", textAlign: "center" }}>{error}</div>
      </form>
      <div className="flexible-layout flexible-layout--align-center valign-middle">
        <div>
          <div
            className="align-center"
            style={{ textAlign: "center", fontSize: "1.3rem" }}
          >
            <div className="rte">
              <p>
                WhatsApp -{" "}
                <a href="https://api.whatsapp.com/send?phone=96176875941">
                  +961 76 875 941
                </a>
              </p>
              <p>
                <a
                  href="mailto:customer-service@urbanfitlb.com"
                  style={{ textDecoration: "underline" }}
                >
                  customer-service@urbanfitlb.com
                </a>
              </p>
              <p>Available everyday, 10AM-5PM (GMT + 2)</p>
              {/* <p>
                <em>
                  <strong>Unresolved Request?</strong>
                </em>
                <strong>
                  <br />
                </strong>
                You can email our Head Of Customer Service personally at{" "}
                <a href="mailto:cshead@thegivingmovement.com">
                  cshead@thegivingmovement.com.
                </a>
              </p> */}
              <p>
                <strong>MARKETING &amp; INFLUENCER COLLABORATIONS</strong>
                <br />
                <a
                  href="https://forms.office.com/r/N1bLFXckU3"
                  target="_blank"
                  title="https://forms.office.com/r/N1bLFXckU3"
                  style={{ textDecoration: "underline" }}
                >
                  Submit a Form
                </a>
              </p>
              {/* <p>
                <strong>WHOLESALE INQUIRIES</strong>
                <br />
                <a
                  href="https://forms.office.com/e/gU2MkQ7c9K"
                  target="_blank"
                  title="https://forms.office.com/e/gU2MkQ7c9K"
                >
                  Submit a Form
                </a>
              </p> */}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Contact;
