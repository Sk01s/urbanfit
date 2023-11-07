import React, { useEffect } from "react";

import InfoBox from "@/components/product/InfoBox";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { useScrollTop } from "@/hooks";
const FAQS = () => {
  useScrollTop();
  const { pathname } = useLocation();

  function scrollToSectionWithSpace(id) {
    const section = document.getElementById(id); // Replace 'mySection' with your section's id
    if (section) {
      const offset = 70; // Adjust this value to set the desired space on top
      const sectionPosition =
        section.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({
        top: sectionPosition,
        behavior: "smooth", // For smooth scrolling, you can use 'auto' for instant scrolling
      });
    }
  }

  useEffect(() => {
    const id = window.location.hash.slice(1);
    scrollToSectionWithSpace(id);
  }, [window.location.hash]);
  return (
    <main
      className="content"
      style={{
        flexDirection: "column",
        backgroundColor: "white",
        maxWidth: "90vw",
        marginInline: "auto",
      }}
    >
      <section>
        <h1>FAQS</h1>
      </section>
      <section id="">
        <h2>1. PLACING YOUR ORDER</h2>
        <InfoBox
          title={" How do I place an order at urbanfitlb.com"}
          description={
            <>
              Choose the category that you wish to shop from. <br />
              Select the color, size and quantity as applicable.
              <br /> Add your item(s) to the Cart. <br />
              Click on Checkout when you are satisfied with your
              purchases.Select your payment method (Cash on delivery) and
              complete the order.
            </>
          }
        />
        <InfoBox
          title={"How do I know what products are available to order?"}
          description={
            <>
              All products shown on our website Urbanfitlb.com
              <br />
              are products which are available to purchase by clicking on the
              ‘Add to basket’ button on the product details page.
            </>
          }
        />
        <InfoBox
          title={"Can I change or amend my order after it has been placed?"}
          description={
            <>
              No, If the order has not been shipped from our premises, you
              cannot amend your order.
            </>
          }
        />
        <InfoBox
          title="Can I completely cancel my order if I chose cash on delivery?
  "
          description={
            <>
              {" "}
              Yes, you can cancel your order if it has not been shipped yet.{" "}
              <br />
              Here are the steps to cancel your order: <br /> Go to your
              profile.
              <br /> Click on "View Account." Select "My Orders."
              <br /> Locate the order you want to cancel and click on "Cancel."
              <br />
              Enter your contact number when prompted. <br />
              After requesting cancellation, we will contact you soon on your
              provided number to confirm the cancellation process.
              <br /> You will also receive a cancellation message
              on your WhatsApp.
            </>
          }
        />
        <InfoBox
          title=" Will you confirm when I have successfully placed an order?"
          description={
            <>
              As soon as you place an order on urbanfitlb.com, an email will be
              sent to you confirming the details of the order. <br />
              Once your order is ready to be shipped, the delivery driver will
              contact you through WhatsApp to arrange a specific delivery
              location. <br /> We strive to keep you informed at every step of
              the process to ensure a smooth shopping experience.
            </>
          }
        />
        <InfoBox
          title="What details do you need for me to place an order with you?"
          description={
            <>
              When registering with urbanfitlb.com, you will need to provide
              your name, e-mail, phone number and address.
            </>
          }
        />
      </section>
      <section id="order-payment">
        <h2>2. PAYMENT</h2>
        <InfoBox
          title="What are my payment options when I place an order online?"
          description="You can  pay only with cash on delivery ."
        />
        <InfoBox
          title="What currency do I pay in?"
          description="You can  pay only in USD ."
        />
      </section>
      <section id="order-delivery">
        <h2>3. DELIVERY & SHIPPING</h2>
        <InfoBox title="Where do you deliver to?" description={<></>} />
        <InfoBox
          title="What is the cost of delivering to my home?"
          description={<></>}
        />
        <InfoBox
          title="How long will it take to receive my order?"
          description={
            <>
              We do our best to ship your orders as fast as we can, and you can
              expect to receive your order within a maximum of 10 working days.
              Once shipped, you will receive an email to know your order is on
              its way to you.
            </>
          }
        />
        <InfoBox
          title="What do I do if my order does not arrive?"
          description={
            <>
              We will do our utmost to ensure that you receive your order. In
              the rare or unfortunate case of an order not arriving, please
              contact our Customer Service team.
            </>
          }
        />
        <InfoBox
          title="Can I get it delivered to another house or location that is not my home?"
          description={
            <>Yes, you can have your order delivered to a delivery address.</>
          }
        />
        <InfoBox
          title="What happens if I am not at home when my delivery arrives?"
          description={
            <>
              Our accredited shipping provider will call you in advance of
              delivery to agree on a date and time.
            </>
          }
        />
        <InfoBox
          title="Is my delivery package safe?"
          description={
            <>
              Because safety comes first, Urbanfit deliveries are dispatched
              with maximum precautions and hygiene measures. Our accredited
              shipping provider’s packages are sanitized and treated in line
              with World Health Organization standards
            </>
          }
        />
      </section>
      <section id="refund-policy">
        <h2>4. RETURNS & REFUNDS</h2>
        <InfoBox
          title="What is your policy on returning items?"
          description=""
        />
        <InfoBox
          title="Can I return my order if I change my mind?"
          description=""
        />
      </section>
    </main>
  );
};

export default FAQS;
