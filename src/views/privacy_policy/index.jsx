import { useScrollTop } from "@/hooks";
import React from "react";

const PrivacyPolicy = () => {
  useScrollTop();
  return (
    <div className="privacy-container">
      <h2 className="privacy-heading" style={{ textAlign: "center" }}>
        Privacy Policy
      </h2>
      <p className="privacy-paragraph">
        This Privacy Statement shall govern and apply to anyone accessing or
        using the websites located at{" "}
        <a href="www.urbanfitlb.com" className="privacy-link">
          www.urbanfitlb.com
        </a>{" "}
        (the "Website"), owned and operated by UrbanFit Clothing ("we," "us," or
        "our"). This Privacy Policy outlines the types of personal information
        we collect, how we use it, and the choices you have regarding your
        information.
      </p>

      <h3 className="privacy-heading">1. Information We Collect:</h3>
      <p className="privacy-paragraph">
        a. <strong>Personal Information:</strong> We may collect personal
        information such as your name, email address, shipping address, and
        payment details when you make a purchase on our website.
      </p>
      <p className="privacy-paragraph">
        b. <strong>Automatically Collected Information:</strong> We may
        automatically collect certain information about your device, browsing
        actions, and patterns. This may include your IP address, browser type,
        referring/exit pages, and operating system.
      </p>

      <h3 className="privacy-heading">2. How We Use Your Information:</h3>
      <p className="privacy-paragraph">
        a. <strong>Order Processing:</strong> We use your personal information
        to process and fulfill your orders, including shipping and payment
        processing.
      </p>
      <p className="privacy-paragraph">
        b. <strong>Communications:</strong> With your consent, we may use your
        email address to send you promotional materials, newsletters, or updates
        about our products and services.
      </p>
      <p className="privacy-paragraph">
        c. <strong>Analytics:</strong> We may use automatically-collected
        information for analytics purposes to improve the functionality and user
        experience of our website.
      </p>

      <h3 className="privacy-heading">3. Sharing Your Information:</h3>
      <p className="privacy-paragraph">
        a. <strong>Third-Party Service Providers:</strong> We may share your
        information with third-party service providers who assist us in
        operating our website, conducting our business, or servicing you.
      </p>
      <p className="privacy-paragraph">
        b. <strong>Legal Compliance:</strong> We may disclose your information
        as required by law or if we believe that disclosure is necessary to
        protect our rights, protect your safety or the safety of others,
        investigate fraud, or comply with a judicial proceeding, court order, or
        legal process.
      </p>

      <h3 className="privacy-heading">4. Your Choices:</h3>
      <p className="privacy-paragraph">
        a. <strong>Opt-Out:</strong> You may opt out of receiving promotional
        emails by following the instructions in the emails or by contacting us
        directly.
      </p>
      <p className="privacy-paragraph">
        b. <strong>Access and Update:</strong> You may access and update your
        personal information by logging into your account on our website.
      </p>

      <h3 className="privacy-heading">5. Security:</h3>
      <p className="privacy-paragraph">
        We implement reasonable security measures to protect the security of
        your personal information.
      </p>

      <h3 className="privacy-heading">6. Changes to This Privacy Policy:</h3>
      <p className="privacy-paragraph">
        We may update our Privacy Policy from time to time. Any changes will be
        posted on this page with an updated effective date.
      </p>

      <h3 className="privacy-heading">7. Contact Us:</h3>
      <p className="privacy-paragraph">
        If you have any questions about this Privacy Policy, please contact us
        at{" "}
        <a
          href="mailto:customer-service@urbanfitlb.com"
          className="privacy-link"
        >
          customer-service@urbanfitlb.com
        </a>
      </p>

      <p className="privacy-paragraph">
        By using our website, you agree to the terms of this Privacy Policy
      </p>
    </div>
  );
};

export default PrivacyPolicy;
