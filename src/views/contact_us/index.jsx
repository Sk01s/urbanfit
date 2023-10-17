import React from "react";
import emailjs from "@emailjs/browser";
import { useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
const Contact = () => {
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
    <main className="content">
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          width: "70%",
          marginInline: "auto",
        }}
        onSubmit={handleSubmit}
      >
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
        <button disabled={loading} className="button">
          {loading ? <LoadingOutlined /> : "Send"}
        </button>
        <div style={{ color: "green", textAlign: "center" }}>{message}</div>
        <div style={{ color: "red", textAlign: "center" }}>{error}</div>
      </form>
    </main>
  );
};

export default Contact;
