import { useScrollTop } from "@/hooks";
import React from "react";

const index = () => {
  useScrollTop();
  return (
    <div
      className="terms-page"
      style={{
        marginTop: "9rem",
        marginInline: "auto",
      }}
    >
      <h2>Terms and Conditions</h2>
      <p>
        <strong>Last Updated:</strong> 11/07/2023
      </p>

      <ol>
        <li>
          <strong>Acceptance of Terms:</strong> This website,
          www.urbanfitlb.com, is operated by UrbanFit Clothing ("we," "us," or
          "our"). By accessing or using our site, you agree to comply with and
          be bound by the following terms and conditions. Please read these
          Terms of Service carefully before accessing or using our website.
        </li>

        <li>
          <strong>Use of the Website:</strong>
          <ol type="a">
            <li>
              You must be at least 18 years old or have the consent of a legal
              guardian to use this website.
            </li>
            <li>
              You agree to provide accurate and current information when using
              the Website, including when creating an account.
            </li>
            <li>
              You are responsible for maintaining the confidentiality of your
              account information and password.
            </li>
          </ol>
        </li>

        <li>
          <strong>Online Store Terms:</strong> By agreeing to these Terms of
          Service, you represent that you are at least the age of majority in
          your state or province of residence.
          <ol type="a">
            <li>
              You may not use our products for any illegal or unauthorized
              purpose.
            </li>
            <li>
              You must not transmit any worms or viruses or any code of a
              destructive nature.
            </li>
            <li>
              A breach or violation of any of the Terms will result in an
              immediate termination of your Services.
            </li>
          </ol>
        </li>
      </ol>

      <p>
        <strong>Contact Information:</strong> Questions about the Terms of
        Service should be sent to us at{" "}
        <a href="mailto:customer-service@urbanfitlb.com">
          customer-service@urbanfitlb.com
        </a>
      </p>
    </div>
  );
};

export default index;
