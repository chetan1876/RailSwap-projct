import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import App from "./App";
import { AuthProvider } from "./context/AuthContext";

import "./index.css";
import "./styles/navbar.css";
import "./styles/sidebar.css";
import "./styles/landing.css";
import "./styles/auth.css";
import "./styles/dashboard.css";

// Register Firebase Messaging Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const registration =
        await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js"
        );

      console.log(
        "Firebase Service Worker Registered:",
        registration
      );
    } catch (error) {
      console.error(
        "Firebase Service Worker Registration Failed:",
        error
      );
    }
  });
}

console.log(
  "Frontend Client ID:",
  import.meta.env.VITE_GOOGLE_CLIENT_ID
);

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <GoogleOAuthProvider
      clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
    >
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

