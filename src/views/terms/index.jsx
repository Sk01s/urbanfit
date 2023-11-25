import { useScrollTop } from "@/hooks";
import React from "react";

const TermsAndConditions = () => {
  useScrollTop();
  const styles = {
    body: {
      fontFamily: "Arial, sans-serif",
      lineHeight: 1.6,
      margin: "20px",
      color: "#333",
      maxWidth: "1000px",
      width: "90vw",
      marginInline: "auto",
    },
    h2: {
      textAlign: "center",
      color: "#333",
    },

    h3: {
      fontSize: "1.5rem",
    },
    p: {
      marginInline: "2.5rem",
      color: "#555",
      fontWeight: "400",
    },
    ol: {
      marginBottom: "20px",
    },
    li: {
      fontWeight: "400",
      color: "#555",
    },
    strong: {
      color: "#555",
    },
    a: {
      color: "#007bff",
      textDecoration: "none",
    },
    aHover: {
      textDecoration: "underline",
    },
  };

  return (
    <div style={styles.body}>
      <h2 style={styles.h2}>Terms and Conditions</h2>

      <h3 style={styles.h3}>1. Acceptance of Terms:</h3>
      <p style={styles.p}>
        This website, www.urbanfitlb.com, is operated by UrbanFit Clothing
        ("we," "us," or "our"). By accessing or using our site, you agree to
        comply with and be bound by the following terms and conditions. Please
        read these Terms of Service carefully before accessing or using our
        website.
      </p>

      <h3 style={styles.h3}>2. Use of the Website:</h3>
      <ol style={styles.ol}>
        <li style={styles.li}>
          You must be at least 18 years old or have the consent of a legal
          guardian to use this website.
        </li>
        <li style={styles.li}>
          You agree to provide accurate and current information when using the
          Website, including when creating an account.
        </li>
        <li style={styles.li}>
          You are responsible for maintaining the confidentiality of your
          account information and password.
        </li>
      </ol>

      <h3 style={styles.h3}>3. Online Store Terms:</h3>
      <p style={styles.p}>
        By agreeing to these Terms of Service, you represent that you are at
        least the age of majority in your state or province of residence.
      </p>
      <ol style={styles.ol}>
        <li style={styles.li}>
          You may not use our products for any illegal or unauthorized purpose.
        </li>
        <li style={styles.li}>
          You must not transmit any worms or viruses or any code of a
          destructive nature.
        </li>
        <li style={styles.li}>
          A breach or violation of any of the Terms will result in an immediate
          termination of your Services.
        </li>
      </ol>

      <h3 style={styles.h3}>4. General Conditions:</h3>
      <ol style={styles.ol}>
        <li style={styles.li}>
          We reserve the right to refuse service to anyone for any reason at any
          time.
        </li>
        <li style={styles.li}>
          Your content (excluding credit card information) may be transferred
          unencrypted.
        </li>
        <li style={styles.li}>
          You agree not to reproduce, duplicate, copy, sell, resell, or exploit
          any portion of the Service without express written permission.
        </li>
        <li style={styles.li}>
          Headings used in this agreement are for convenience only and will not
          limit or otherwise affect these Terms.
        </li>
      </ol>

      <h3 style={styles.h3}>
        5. Accuracy, Completeness, and Timeliness of Information:
      </h3>
      <ol style={styles.ol}>
        <li style={styles.li}>
          We are not responsible if information made available on this site is
          not accurate, complete, or current.
        </li>
        <li style={styles.li}>
          The material on this site is provided for general information only and
          should not be relied upon without consulting primary, more accurate
          sources.
        </li>
      </ol>

      <h3 style={styles.h3}>6. Modifications to the Service and Prices:</h3>
      <ol style={styles.ol}>
        <li style={styles.li}>
          Prices for our products are subject to change without notice.
        </li>
        <li style={styles.li}>
          We reserve the right to modify or discontinue the Service without
          notice at any time.
        </li>
      </ol>

      <h3 style={styles.h3}>7. Products or Services:</h3>
      <ol style={styles.ol}>
        <li style={styles.li}>
          We reserve the right to limit the sales of our products or Services to
          any person or geographic region.
        </li>
        <li style={styles.li}>
          We do not warrant that the quality of any products, services,
          information, or other material purchased will meet your expectations.
        </li>
      </ol>

      <h3 style={styles.h3}>8. Accuracy of Billing and Account Information:</h3>
      <ol style={styles.ol}>
        <li style={styles.li}>
          We reserve the right to refuse any order you place with us.
        </li>
        <li style={styles.li}>
          You agree to provide current, complete, and accurate purchase and
          account information.
        </li>
      </ol>

      <h3 style={styles.h3}>9. Optional Tools:</h3>
      <ol style={styles.ol}>
        <li style={styles.li}>
          We may provide access to third-party tools without monitoring or
          control.
        </li>
        <li style={styles.li}>
          Use of optional third-party tools is at your own risk.
        </li>
      </ol>

      <h3 style={styles.h3}>10. Third-Party Links:</h3>
      <ol style={styles.ol}>
        <li style={styles.li}>
          Certain content, products, and services may include materials from
          third-parties.
        </li>
        <li style={styles.li}>
          We are not responsible for third-party websites or materials.
        </li>
      </ol>

      <h3 style={styles.h3}>
        11. User Comments, Feedback, and Other Submissions:
      </h3>
      <ol style={styles.ol}>
        <li style={styles.li}>
          Submissions may be used by us without restriction.
        </li>
        <li style={styles.li}>
          We may monitor, edit, or remove content that violates these Terms.
        </li>
      </ol>

      <h3 style={styles.h3}>12. Personal Information:</h3>
      <p style={styles.p}>
        Your submission of personal information through the store is governed by
        our Privacy Policy.
      </p>

      <h3 style={styles.h3}>13. Errors, Inaccuracies, and Omissions:</h3>
      <p style={styles.p}>
        We reserve the right to correct errors, inaccuracies, or omissions and
        to change or update information.
      </p>

      <h3 style={styles.h3}>14. Prohibited Uses:</h3>
      <p style={styles.p}>
        You are prohibited from using the site for any unlawful purpose or to
        violate any laws.
      </p>

      <h3 style={styles.h3}>
        15. Disclaimer of Warranties; Limitation of Liability:
      </h3>
      <ol style={styles.ol}>
        <li style={styles.li}>
          We do not guarantee uninterrupted, timely, secure, or error-free use
          of the service.
        </li>
        <li style={styles.li}>
          Our liability is limited to the maximum extent permitted by law.
        </li>
      </ol>

      <h3 style={styles.h3}>16. Indemnification:</h3>
      <p style={styles.p}>
        You agree to indemnify and hold us harmless from any claim or demand,
        including reasonable attorneys' fees.
      </p>

      <h3 style={styles.h3}>17. Severability:</h3>
      <p style={styles.p}>
        If any provision is determined to be unlawful, void, or unenforceable,
        the remaining provisions shall remain enforceable.
      </p>

      <h3 style={styles.h3}>18. Termination:</h3>
      <p style={styles.p}>
        The obligations and liabilities of the parties incurred prior to the
        termination date shall survive.
      </p>

      <h3 style={styles.h3}>19. Entire Agreement:</h3>
      <p style={styles.p}>
        These Terms of Service constitute the entire agreement and understanding
        between you and us.
      </p>

      <h3 style={styles.h3}>20. Changes to Terms of Service:</h3>
      <p style={styles.p}>
        We reserve the right to update, change, or replace any part of these
        Terms of Service.
      </p>

      <h3 style={styles.h3}>21. Contact Information:</h3>
      <p style={styles.p}>
        Questions about the Terms of Service should be sent to us at{" "}
        <a href="mailto:customer-service@urbanfitlb.com" style={styles.a}>
          customer-service@urbanfitlb.com
        </a>
      </p>

      <p style={styles.p}>
        <strong>Last Updated: 11/07/2023</strong>
      </p>
    </div>
  );
};

export default TermsAndConditions;
