import React from "react";
import PropTypes from "prop-types";
import { useScrollTop } from "@/hooks";

function index(props) {
  useScrollTop();
  return (
    <div
      className="privacy-policy"
      style={{ marginTop: "9rem", width: "90vw", marginInline: "auto" }}
    >
      <h1>Privacy Policy</h1>

      <p>
        This Privacy Policy describes how Urbanfit our collects, uses, and
        shares personal information when you use our website and services.
      </p>

      <h2>Information We Collect</h2>
      <p>
        We collect information you provide directly to us when you make a
        purchase, register for an account, or otherwise interact with our
        website. This information may include your name, email address, shipping
        address, and payment information.
      </p>

      <h2>How We Use Your Information</h2>
      <p>
        We may use the information we collect for various purposes, including:
      </p>
      <ul>
        <li>Process and fulfill orders</li>
        <li>Send order confirmations and updates</li>
        <li>Respond to your inquiries and provide customer support</li>
        <li>Improve our products and services</li>
        <li>Send promotional and marketing communications</li>
      </ul>

      <h2>Information Sharing</h2>
      <p>
        We do not share your personal information with third parties, except as
        necessary to process your order or as required by law.
      </p>

      <h2>Your Choices</h2>
      <p>
        You can access, update, or delete your personal information by
        contacting us.
      </p>

      <h2>Security</h2>
      <p>
        We take reasonable steps to protect your personal information, but no
        method of transmission over the internet or electronic storage is 100%
        secure.
      </p>

      <h2>Changes to This Privacy Policy</h2>
      <p>
        We may update this Privacy Policy to reflect changes to our practices or
        for other operational, legal, or regulatory reasons. Please check this
        page periodically for any updates.
      </p>

      <h2>Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, please contact us
        at customer-service@urbanfitlb.com
      </p>
    </div>
  );
}

index.propTypes = {};

export default index;
