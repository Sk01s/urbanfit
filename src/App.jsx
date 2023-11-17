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

const App = ({ store, persistor }) => {
  useEffect(() => {
    localStorage.setItem("products", JSON.stringify([]));
    localStorage.setItem("essentials", JSON.stringify([]));
    localStorage.setItem("seasonals", JSON.stringify([]));
  }, []);
  return (
    <StrictMode>
      <Provider store={store}>
        <PersistGate loading={<Preloader />} persistor={persistor}>
          <AppRouter />
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
