import * as Sentry from "@sentry/react";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider, Container } from "@chakra-ui/react";
import App from "./pages/App/App";

Sentry.init({
  dsn: "https://8c2cced3dccc63c53235b042667506bc@o4507900307963904.ingest.de.sentry.io/4507900310519888",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.browserProfilingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
  // Set profilesSampleRate to 1.0 to profile every transaction.
  // Since profilesSampleRate is relative to tracesSampleRate,
  // the final profiling rate can be computed as tracesSampleRate * profilesSampleRate
  // For example, a tracesSampleRate of 0.5 and profilesSampleRate of 0.5 would
  // results in 25% of transactions being profiled (0.5*0.5=0.25)
  profilesSampleRate: 1.0,
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

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
      <Container padding="0" maxW="768px">
        <BrowserRouter basename="/">
          <App />
        </BrowserRouter>
      </Container>
    </ChakraProvider>
  </React.StrictMode>
);
