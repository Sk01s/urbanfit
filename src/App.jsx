/* eslint-disable react/forbid-prop-types */
import { Preloader } from "@/components/common";
import PropType from "prop-types";
import React, { StrictMode } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import AppRouter from "@/routers/AppRouter";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect } from "react";
import { SiteImagesProvider, LandingSlidesProvider, SiteTextsProvider } from "@/hooks";

const STORAGE_VERSION = "v1";

const App = ({ store, persistor }) => {
  useEffect(() => {
    const currentVersion = localStorage.getItem("storageVersion");
    if (currentVersion !== STORAGE_VERSION) {
      localStorage.clear();
      localStorage.setItem("storageVersion", STORAGE_VERSION);
    }
  }, []);
  return (
    <StrictMode>
      <Provider store={store}>
        <PersistGate loading={<Preloader />} persistor={persistor}>
          <SiteImagesProvider>
            <LandingSlidesProvider>
              <SiteTextsProvider>
                <AppRouter />
              </SiteTextsProvider>
            </LandingSlidesProvider>
          </SiteImagesProvider>
        </PersistGate>
      </Provider>
    </StrictMode>
  );
};

App.propTypes = {
  store: PropType.any.isRequired,
  persistor: PropType.any.isRequired,
};

export default App;
