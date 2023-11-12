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
      <img
        src="https://thegivingmovement.com/cdn/shop/files/DESKTOP_754060f7-785f-4301-91e1-29c41d7bcddd_1296x.jpg?v=1679580629"
        className="contact-banner"
        alt=""
      />
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
            <div className="rte ">
              <h4>Phone Number</h4>
              <p>WhatsApp - +961 711 08 084</p>
              <h4>Customer service email</h4>
              <p>
                <a href="mailto:customer-service@urbanfitlb.com">
                  customer-service@urbanfitlb.com
                </a>
              </p>
              <p>Available everyday, 9AM-9PM UAE time</p>
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
                  href="https://forms.office.com/e/AhRbtiU2hU"
                  target="_blank"
                  title="https://forms.office.com/e/AhRbtiU2hU"
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
