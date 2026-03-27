import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Main from "../pages/Main/Main";
import Cart from "../pages/Cart/Cart";
import Checkout from "../pages/Checkout/Checkout";
import Orders from "../pages/Orders/Orders";
import FeedbackForm from "../pages/FeedbackForm/FeedbackForm";
import PcBuilderPage from "../pages/PcBuilder/PcBuilder";
import Access from "../pages/Access/Access";
import { SiteAccessProvider, useSiteAccess } from "./SiteAccessContext";

function ProtectedRoute({ element }) {
    const { loading, authorized } = useSiteAccess();
    if (loading) return null;
    if (!authorized) return <Navigate to="/" replace />;
    return element;
}

function FallbackRoute() {
    const { loading, authorized } = useSiteAccess();
    if (loading) return null;
    return <Navigate to={authorized ? "/main" : "/"} replace />;
}

function AppRoutes() {
    return (
        <SiteAccessProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Access />} />
                    <Route path="/main" element={<ProtectedRoute element={<Main />} />} />
                    <Route path="/cart" element={<ProtectedRoute element={<Cart />} />} />
                    <Route path="/orders" element={<ProtectedRoute element={<Orders />} />} />
                    <Route path="/checkout" element={<ProtectedRoute element={<Checkout />} />} />
                    <Route path="/feedback" element={<ProtectedRoute element={<FeedbackForm />} />} />
                    <Route path="/pc-builder" element={<ProtectedRoute element={<PcBuilderPage />} />} />
                    <Route path="*" element={<FallbackRoute />} />
                </Routes>
            </Router>
        </SiteAccessProvider>
    );
}

export default AppRoutes;
