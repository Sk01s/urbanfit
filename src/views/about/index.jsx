import { useScrollTop } from "@/hooks";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

const about = () => {
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
    <>
      <section
        style={{
          marginTop: "12rem",
          width: "100%",
          textAlign: "center",
        }}
      >
        <h2>Our Story</h2>
        <p
          style={{
            fontSize: "1.3rem",
            lineHeight: "3rem",
            color: "#333",
            textAlign: "left",
            fontWeight: "400",
            marginInline: "auto",
            width: "85vw",
          }}
        >
          We are a group of people based in Lebanon. Faced with the challenges,
          we've chosen to break away from the conventional path, aspiring to
          make a positive impact. As a Lebanese brand, our mission is
          encapsulated in the slogan 'Made by society.' We strive to redefine
          the norms in Lebanon, Nevertheless, our unwavering commitment is to
          maintain our primary goal . We represent authenticity in design and
          expression. Each UrbanFit piece is a genuine reflection of our
          dedication to originality, setting us apart in the fashion landscape.
          We want to convey a powerful message to the youth — the potential to
          effect change and contribute to their own success lies within them.
          UrbanFit stands as a beacon for all Lebanese youth. Now is the time to
          excel, not just for personal success but also for the betterment of
          society. Branded as 'Made by society,' our success is intertwined with
          yours, creating a positive cycle. We are confident that this
          generation will usher in a different era, contributing collectively to
          a better societyWe are a group of people based in Lebanon. Faced with
          the challenges, we've chosen to break away from the conventional path,
          aspiring to make a positive impact. As a Lebanese brand, our mission
          is encapsulated in the slogan 'Made by society.' We strive to redefine
          the norms in Lebanon, Nevertheless, our unwavering commitment is to
          maintain our primary goal . We represent authenticity in design and
          expression. Each UrbanFit piece is a genuine reflection of our
          dedication to originality, setting us apart in the fashion landscape.
          We want to convey a powerful message to the youth — the potential to
          effect change and contribute to their own success lies within them.
          UrbanFit stands as a beacon for all Lebanese youth. Now is the time to
          excel, not just for personal success but also for the betterment of
          society. Branded as 'Made by society,' our success is intertwined with
          yours, creating a positive cycle. We are confident that this
          generation will usher in a different era, contributing collectively to
          a better society
        </p>
      </section>
      {/* <div className="about-banner" /> */}
      <section
        id="core"
        style={{
          marginTop: "5rem",
          width: "100%",
          marginInline: "auto",
          textAlign: "center",
        }}
      >
        <h2>Core Values</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
            gap: "4rem",
            marginBottom: "15rem",
            backgroundColor: "#f8f9fa",
            padding: "5rem 6rem",
            borderRadius: "5rem",
          }}
        >
          <div>
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 512 512"
              height="5rem"
              width="5rem"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M48 256C48 141.1 141.1 48 256 48c63.1 0 119.6 28.1 157.8 72.5c8.6 10.1 23.8 11.2 33.8 2.6s11.2-23.8 2.6-33.8C403.3 34.6 333.7 0 256 0C114.6 0 0 114.6 0 256v40c0 13.3 10.7 24 24 24s24-10.7 24-24V256zm458.5-52.9c-2.7-13-15.5-21.3-28.4-18.5s-21.3 15.5-18.5 28.4c2.9 13.9 4.5 28.3 4.5 43.1v40c0 13.3 10.7 24 24 24s24-10.7 24-24V256c0-18.1-1.9-35.8-5.5-52.9zM256 80c-19 0-37.4 3-54.5 8.6c-15.2 5-18.7 23.7-8.3 35.9c7.1 8.3 18.8 10.8 29.4 7.9c10.6-2.9 21.8-4.4 33.4-4.4c70.7 0 128 57.3 128 128v24.9c0 25.2-1.5 50.3-4.4 75.3c-1.7 14.6 9.4 27.8 24.2 27.8c11.8 0 21.9-8.6 23.3-20.3c3.3-27.4 5-55 5-82.7V256c0-97.2-78.8-176-176-176zM150.7 148.7c-9.1-10.6-25.3-11.4-33.9-.4C93.7 178 80 215.4 80 256v24.9c0 24.2-2.6 48.4-7.8 71.9C68.8 368.4 80.1 384 96.1 384c10.5 0 19.9-7 22.2-17.3c6.4-28.1 9.7-56.8 9.7-85.8V256c0-27.2 8.5-52.4 22.9-73.1c7.2-10.4 8-24.6-.2-34.2zM256 160c-53 0-96 43-96 96v24.9c0 35.9-4.6 71.5-13.8 106.1c-3.8 14.3 6.7 29 21.5 29c9.5 0 17.9-6.2 20.4-15.4c10.5-39 15.9-79.2 15.9-119.7V256c0-28.7 23.3-52 52-52s52 23.3 52 52v24.9c0 36.3-3.5 72.4-10.4 107.9c-2.7 13.9 7.7 27.2 21.8 27.2c10.2 0 19-7 21-17c7.7-38.8 11.6-78.3 11.6-118.1V256c0-53-43-96-96-96zm24 96c0-13.3-10.7-24-24-24s-24 10.7-24 24v24.9c0 59.9-11 119.3-32.5 175.2l-5.9 15.3c-4.8 12.4 1.4 26.3 13.8 31s26.3-1.4 31-13.8l5.9-15.3C267.9 411.9 280 346.7 280 280.9V256z"></path>
            </svg>
            <h3>Authentic</h3>
            <p>
              We always ensure our values and deeds are in harmony we embodies
              authentic design and expression.
            </p>
          </div>
          <div>
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 24 24"
              height="5rem"
              width="5rem"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M5 3V19H21V21H3V3H5ZM20.2929 6.29289L21.7071 7.70711L16 13.4142L13 10.415L8.70711 14.7071L7.29289 13.2929L13 7.58579L16 10.585L20.2929 6.29289Z"></path>
            </svg>
            <h3>Impact</h3>
            <p>
              We strive to inspire creativity and uniqueness within today's
              youth, making a lasting impact on individuals and contributing to
              the betterment of society.
            </p>
          </div>
          <div>
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 512 512"
              height="5rem"
              width="5rem"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M128 298l64 64v118h128V362l64-64V176l-255.2.4L128 298zM234.8 32h42.4v64h-42.4V32zM80 110.4L109.9 80l44.9 45.6-29.9 30.4L80 110.4zm277.1 15.2l45-45.5 29.9 30.4-44.9 45.5-30-30.4z"></path>
            </svg>
            <h3>Innovative</h3>
            <p>
              We aspire to be trendsetters, evolving to meet the dynamic needs
              to the region
            </p>
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
            gap: "4rem",
            backgroundColor: "#f8f9fa",
            padding: "5rem 6rem",
            borderRadius: "5rem",
          }}
        >
          <div>
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 512 512"
              height="5rem"
              width="5rem"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M85.688 17L71.406 52.03 44 25.188 28.594 40.594l27.062 26.5L21.78 80.906 60 119.126l42.594-6.095 49.812 48.782c3.39-3.362 7-6.418 10.813-9.156 2.124-1.525 4.318-2.937 6.56-4.25l-51.905-50.844 6.03-42.343L85.688 17zm185.75 76.22c-8.536-.003-24.483 3.607-27.094 20 13.8 22.026 20.71 40.802 20.75 64.06-8.927-7.693-18.882-13.6-29.5-17.343-8.623-3.036-17.01-4.424-25.03-4.312-13.37.187-25.71 4.517-36.44 12.22-17.164 12.322-30.14 33.692-33.968 61.905-7.802 57.496 15.476 115.295 61.22 131.406 4.76 1.677 14.684 3.154 23.186 2.5 8.503-.654 14.683-3.687 16.063-5.906l8.28-13.344 7.782 13.656c2.828 4.977 9.346 9.443 17.25 12.188 7.905 2.745 16.925 3.687 22.22 3.28 9.136-.694 17.988-3.023 26.406-6.717l-38.438-37.407v-.03c-6.18-6.054-8.756-14.46-7.688-21.75 1.07-7.29 4.987-13.366 10-18 5.014-4.636 11.31-7.995 18.407-8.907 1.774-.23 3.61-.252 5.47-.095 5.564.47 11.285 2.704 15.748 7.063l.032.03 41.687 40.563c13.06-18.516 22.175-41.198 25.44-65.25 6.63-48.853-22.3-86.08-60.5-92.124l-.44-.062c-5.175-.77-10.93-.875-17-.406-11.28.858-22.543 3.982-33.25 9.125 2.932-28.897-.828-55.604-10.592-86.344zm37.375 205.905c-.228-.004-.474.016-.72.03-.28.02-.564.055-.874.095-2.48.318-5.677 1.86-8.095 4.094-2.418 2.235-3.896 5.01-4.188 7-.29 1.984-.184 3.264 2.25 5.656l81.844 79.688 6.314 6.156-5.75 6.656s-3.9 4.28-12.563 10.313c-6.464 4.5-15.94 10.39-29.56 17.406 43.76 25.907 104.59 48.83 156.655 54.124-1.08-51.14-26.906-108.247-55.563-151.563-12.888 25.173-30.687 42.064-30.687 42.064l-6.53 6.22-6.44-6.283-81.874-79.686H313v-.03c-1.407-1.38-2.593-1.914-4.188-1.94z"></path>
            </svg>
            <h3>Integrity</h3>
            <p>
              We believe in open communication with our customers, providing
              them with the information they need to make informed choices about
              our products and practices.
            </p>
          </div>

          <div>
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 640 512"
              height="5rem"
              width="5rem"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M128 96c26.5 0 48-21.5 48-48S154.5 0 128 0 80 21.5 80 48s21.5 48 48 48zm384 0c26.5 0 48-21.5 48-48S538.5 0 512 0s-48 21.5-48 48 21.5 48 48 48zm125.7 372.1l-44-110-41.1 46.4-2 18.2 27.7 69.2c5 12.5 17 20.1 29.7 20.1 4 0 8-.7 11.9-2.3 16.4-6.6 24.4-25.2 17.8-41.6zm-34.2-209.8L585 178.1c-4.6-20-18.6-36.8-37.5-44.9-18.5-8-39-6.7-56.1 3.3-22.7 13.4-39.7 34.5-48.1 59.4L432 229.8 416 240v-96c0-8.8-7.2-16-16-16H240c-8.8 0-16 7.2-16 16v96l-16.1-10.2-11.3-33.9c-8.3-25-25.4-46-48.1-59.4-17.2-10-37.6-11.3-56.1-3.3-18.9 8.1-32.9 24.9-37.5 44.9l-18.4 80.2c-4.6 20 .7 41.2 14.4 56.7l67.2 75.9 10.1 92.6C130 499.8 143.8 512 160 512c1.2 0 2.3-.1 3.5-.2 17.6-1.9 30.2-17.7 28.3-35.3l-10.1-92.8c-1.5-13-6.9-25.1-15.6-35l-43.3-49 17.6-70.3 6.8 20.4c4.1 12.5 11.9 23.4 24.5 32.6l51.1 32.5c4.6 2.9 12.1 4.6 17.2 5h160c5.1-.4 12.6-2.1 17.2-5l51.1-32.5c12.6-9.2 20.4-20 24.5-32.6l6.8-20.4 17.6 70.3-43.3 49c-8.7 9.9-14.1 22-15.6 35l-10.1 92.8c-1.9 17.6 10.8 33.4 28.3 35.3 1.2.1 2.3.2 3.5.2 16.1 0 30-12.1 31.8-28.5l10.1-92.6 67.2-75.9c13.6-15.5 19-36.7 14.4-56.7zM46.3 358.1l-44 110c-6.6 16.4 1.4 35 17.8 41.6 16.8 6.6 35.1-1.7 41.6-17.8l27.7-69.2-2-18.2-41.1-46.4z"></path>
            </svg>
            <h3>Diversion & inclusion</h3>
            <p>
              We value equity, inclusion, and dignity for all. Our team,
              designs, and messaging reflect a commitment to inclusivity.
            </p>
          </div>
          <div>
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 640 512"
              height="5rem"
              width="5rem"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M144 0c-13.3 0-24 10.7-24 24V142.1L97 119c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0l64-64c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-23 23V24c0-13.3-10.7-24-24-24zM360 200a40 40 0 1 0 -80 0 40 40 0 1 0 80 0zM184 296a40 40 0 1 0 -80 0 40 40 0 1 0 80 0zm312 40a40 40 0 1 0 0-80 40 40 0 1 0 0 80zM200 441.5l26.9 49.9c6.3 11.7 20.8 16 32.5 9.8s16-20.8 9.8-32.5l-36.3-67.5c1.7-1.7 3.2-3.6 4.3-5.8L264 345.5V400c0 17.7 14.3 32 32 32h48c17.7 0 32-14.3 32-32V345.5l26.9 49.9c1.2 2.2 2.6 4.1 4.3 5.8l-36.3 67.5c-6.3 11.7-1.9 26.2 9.8 32.5s26.2 1.9 32.5-9.8L440 441.5V480c0 17.7 14.3 32 32 32h48c17.7 0 32-14.3 32-32V441.5l26.9 49.9c6.3 11.7 20.8 16 32.5 9.8s16-20.8 9.8-32.5l-37.9-70.3c-15.3-28.5-45.1-46.3-77.5-46.3H486.2c-16.3 0-31.9 4.5-45.4 12.6l-33.6-62.3c-15.3-28.5-45.1-46.3-77.5-46.3H310.2c-32.4 0-62.1 17.8-77.5 46.3l-33.6 62.3c-13.5-8.1-29.1-12.6-45.4-12.6H134.2c-32.4 0-62.1 17.8-77.5 46.3L18.9 468.6c-6.3 11.7-1.9 26.2 9.8 32.5s26.2 1.9 32.5-9.8L88 441.5V480c0 17.7 14.3 32 32 32h48c17.7 0 32-14.3 32-32V441.5zM415 153l64 64c9.4 9.4 24.6 9.4 33.9 0l64-64c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-23 23V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V142.1l-23-23c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9z"></path>
            </svg>
            <h3>OUR PEOPLE</h3>
            <p>
              We always ensure our values and deeds are in harmony we embodies
              authentic design and expression.
            </p>
          </div>
          {/* <div>
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 512 512"
                height="5rem"
                width="5rem"
              >
                <path
                  fill="none"
                  stroke-miterlimit="10"
                  stroke-width="32"
                  d="M464 256c0-114.87-93.13-208-208-208S48 141.13 48 256s93.13 208 208 208 208-93.13 208-208z"
                />
                <path d="M445.57 172.14c-16.06.1-14.48 29.73-34.49 15.75-7.43-5.18-12-12.71-21.33-15-8.15-2-16.5.08-24.55 1.47-9.15 1.58-20 2.29-26.94 9.22-6.71 6.67-10.26 15.62-17.4 22.33-13.81 13-19.64 27.19-10.7 45.57 8.6 17.67 26.59 27.26 46 26 19.07-1.27 38.88-12.33 38.33 15.38-.2 9.8 1.85 16.6 4.86 25.71 2.79 8.4 2.6 16.54 3.24 25.21 1.18 16.2 4.16 34.36 12.2 48.67l15-21.16c1.85-2.62 5.72-6.29 6.64-9.38 1.63-5.47-1.58-14.87-1.95-21s-.19-12.34-1.13-18.47c-1.32-8.59-6.4-16.64-7.1-25.13-1.29-15.81 1.6-28.43-10.58-41.65-11.76-12.75-29-15.81-45.47-13.22-8.3 1.3-41.71 6.64-28.3-12.33 2.65-3.73 7.28-6.79 10.26-10.34 2.59-3.09 4.84-8.77 7.88-11.18s17-5.18 21-3.95 8.17 7 11.64 9.56a49.89 49.89 0 0021.81 9.36c13.66 2 42.22-5.94 42-23.46-.04-8.4-7.84-20.1-10.92-27.96zM287.45 316.3c-5.33-22.44-35.82-29.94-52.26-42.11-9.45-7-17.86-17.81-30.27-18.69-5.72-.41-10.51.83-16.18-.64-5.2-1.34-9.28-4.14-14.82-3.41-10.35 1.36-16.88 12.42-28 10.92-10.55-1.42-21.42-13.76-23.82-23.81-3.08-12.92 7.14-17.11 18.09-18.26 4.57-.48 9.7-1 14.09.67 5.78 2.15 8.51 7.81 13.7 10.67 9.73 5.33 11.7-3.19 10.21-11.83-2.23-12.94-4.83-18.22 6.71-27.12 8-6.14 14.84-10.58 13.56-21.61-.76-6.48-4.31-9.41-1-15.86 2.51-4.91 9.4-9.34 13.89-12.27 11.59-7.56 49.65-7 34.1-28.16-4.57-6.21-13-17.31-21-18.83-10-1.89-14.44 9.27-21.41 14.19-7.2 5.09-21.22 10.87-28.43 3-9.7-10.59 6.43-14.07 10-21.46s-8.27-21.36-14.61-24.9l-29.81 33.43a41.52 41.52 0 008.34 31.86c5.93 7.63 15.37 10.08 15.8 20.5.42 10-1.14 15.12-7.68 22.15-2.83 3-4.83 7.26-7.71 10.07-3.53 3.43-2.22 2.38-7.73 3.32-10.36 1.75-19.18 4.45-29.19 7.21C95.34 199.94 93.8 172.69 86.2 162l-25 20.19c-.27 3.31 4.1 9.4 5.29 13 6.83 20.57 20.61 36.48 29.51 56.16 9.37 20.84 34.53 15.06 45.64 33.32 9.86 16.2-.67 36.71 6.71 53.67 5.36 12.31 18 15 26.72 24 8.91 9.09 8.72 21.53 10.08 33.36a305.22 305.22 0 007.45 41.28c1.21 4.69 2.32 10.89 5.53 14.76 2.2 2.66 9.75 4.95 6.7 5.83 4.26.7 11.85 4.68 15.4 1.76 4.68-3.84 3.43-15.66 4.24-21 2.43-15.9 10.39-31.45 21.13-43.35 10.61-11.74 25.15-19.69 34.11-33 8.73-12.98 11.36-30.49 7.74-45.68zm-33.39 26.32c-6 10.71-19.36 17.88-27.95 26.39-2.33 2.31-7.29 10.31-10.21 8.58-2.09-1.24-2.8-11.62-3.57-14a61.17 61.17 0 00-21.71-29.95c-3.13-2.37-10.89-5.45-12.68-8.7-2-3.53-.2-11.86-.13-15.7.11-5.6-2.44-14.91-1.06-20 1.6-5.87-1.48-2.33 3.77-3.49 2.77-.62 14.21 1.39 17.66 2.11 5.48 1.14 8.5 4.55 12.82 8 11.36 9.11 23.87 16.16 36.6 23.14 9.86 5.46 12.76 12.37 6.46 23.62zm-69.6-275.53c4.74 4.63 9.2 10.11 16.27 10.57 6.69.45 13-3.17 18.84 1.38 6.48 5 11.15 11.33 19.75 12.89 8.32 1.51 17.13-3.35 19.19-11.86 2-8.11-2.31-16.93-2.57-25.07 0-1.13.61-6.15-.17-7-.58-.64-5.42.08-6.16.1q-8.13.24-16.22 1.12a207.1 207.1 0 00-57.18 14.65c2.43 1.68 5.48 2.35 8.25 3.22zm171.94 56.18c8.49 0 17.11-3.8 14.37-13.62-2.3-8.23-6.22-17.16-15.76-12.72-6.07 2.82-14.67 10-15.38 17.12-.81 8.08 11.11 9.22 16.77 9.22zm-6.78 42.97c8.67 5.19 21.53 2.75 28.07-4.66 5.11-5.8 8.12-15.87 17.31-15.86a15.4 15.4 0 0110.82 4.41c3.8 3.93 3.05 7.62 3.86 12.54 1.81 11.05 13.66.63 16.75-3.65 2-2.79 4.71-6.93 3.8-10.56-.84-3.39-4.8-7-6.56-10.11-5.14-9-9.37-19.47-17.07-26.74-7.41-7-16.52-6.19-23.55 1.08-5.76 6-12.45 10.75-16.39 18.05-2.78 5.13-5.91 7.58-11.54 8.91-3.1.73-6.64 1-9.24 3.08-7.24 5.7-3.12 19.39 3.74 23.51z"></path>
              </svg>
              <h3>Industry</h3>
              <p>
                UrbanFit is not just a clothing brand, it's a force within the
                fashion industry. By prioritizing sustainability, authenticity,
                and inclusivity, we aim to influence the industry positively,
                setting a new standard for responsible and forward-thinking
                practices. Together, we can shape a more dynamic and creative
                future for fashion on a global scale.
              </p>
            </div> */}
        </div>
      </section>
    </>
  );
};

export default about;
