import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

import { ChakraProvider, Container } from "@chakra-ui/react";
import App from "./pages/App/App";

export let serviceWorkerRegistration: ServiceWorkerRegistration;

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register(import.meta.env.MODE === "production" ? "/sw.js" : "/dev-sw.js?dev-sw", {
      type: import.meta.env.MODE === "production" ? "classic" : "module",
    })
    .then((registration) => {
      serviceWorkerRegistration = registration;
      console.log("Service Worker registered with scope:", registration.scope);
    })
    .catch((error) => {
      console.error("Service Worker registration failed:", error);
    });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider>
      <Container padding="0" maxW="768px" minHeight="100vh">
        <BrowserRouter basename="/">
          <App />
        </BrowserRouter>
      </Container>
    </ChakraProvider>
  </React.StrictMode>
);
