import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import { BrowserRouter } from "react-router-dom";
import { StoreContextProvider } from "./context/StoreContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <StoreContextProvider>
      {/* Client ID  */}
      <GoogleOAuthProvider clientId="84710312573-omurd96ctpm7js8ltv7t66akra6jgnqd.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
    </StoreContextProvider>
  </BrowserRouter>,
);
