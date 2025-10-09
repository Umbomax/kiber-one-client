import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "../pages/Main/Main";
import Cart from "../pages/Cart/Cart";
import Checkout from "../pages/Checkout/Checkout";
import Orders from "../pages/Orders/Orders";
import FeedbackForm from "../pages/FeedbackForm/FeedbackForm";
import PcBuilderPage from "../pages/PcBuilder/PcBuilder";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/feedback" element={<FeedbackForm />} />
              <Route path="/pc-builder" element={<PcBuilderPage />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
