import React from "react";
import PropTypes from "prop-types";
import { useScrollTop } from "@/hooks";

function index(props) {
  useScrollTop();
  return (
    <div
      className="privacy"
      style={{ marginTop: "9rem", width: "90vw", marginInline: "auto" }}
    >
      <h2>Privacy Policy</h2>

      <p>
        This Privacy Statement shall govern and apply to anyone accessing or
        using the websites located at{" "}
        <a href="https://www.urbanfitlb.com" target="_blank">
          www.urbanfitlb.com
        </a>{" "}
        (the "Website"), owned and operated by UrbanFit Clothing ("we," "us," or
        "our"). This Privacy Policy outlines the types of personal information
        we collect, how we use it, and the choices you have regarding your
        information.
      </p>

      <h2>1. Information We Collect:</h2>

      <ol>
        <li>
          <p>
            <strong>a. Personal Information:</strong>
          </p>
          <p>
            We may collect personal information such as your name, email
            address, shipping address, and payment details when you make a
            purchase on our website.
          </p>
        </li>
        <li>
          <p>
            <strong>b. Automatically Collected Information:</strong>
          </p>
          <p>
            We may automatically collect certain information about your device,
            browsing actions, and patterns. This may include your IP address,
            browser type, referring/exit pages, and operating system.
          </p>
        </li>
      </ol>

      <h2>2. How We Use Your Information:</h2>

      <ol>
        <li>
          <p>
            <strong>a. Order Processing:</strong>
          </p>
          <p>
            We use your personal information to process and fulfill your orders,
            including shipping and payment processing.
          </p>
        </li>
        <li>
          <p>
            <strong>b. Communications:</strong>
          </p>
          <p>
            With your consent, we may use your email address to send you
            promotional materials, newsletters, or updates about our products
            and services.
          </p>
        </li>
        <li>
          <p>
            <strong>c. Analytics:</strong>
          </p>
          <p>
            We may use automatically-collected information for analytics
            purposes to improve the functionality and user experience of our
            website.
          </p>
        </li>
      </ol>

      <p>
        <strong>
          By using our website, you agree to the terms of this Privacy Policy.
        </strong>
      </p>

      <h2>7. Contact Us:</h2>

      <p>
        If you have any questions about this Privacy Policy, please contact us
        at{" "}
        <a href="mailto:customer-service@urbanfitlb.com">
          customer-service@urbanfitlb.com
        </a>
      </p>
    </div>
  );
}

index.propTypes = {};

export default index;
