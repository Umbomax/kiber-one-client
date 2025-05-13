import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import ReactModal from "react-modal";
import { CartProvider } from "./context/CartContext";
import { HelmetProvider } from "react-helmet-async";
ReactModal.setAppElement("#root");
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <HelmetProvider>
        <React.StrictMode>
            <CartProvider>
                <App />
            </CartProvider>
        </React.StrictMode>
    </HelmetProvider>
);
