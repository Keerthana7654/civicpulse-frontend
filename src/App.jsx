import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ReportIssue from "./pages/ReportIssue";
import MyReports from "./pages/MyReports";
import IssueDetail from "./pages/IssueDetail";
import LiveMap from "./pages/LiveMap";
import OfficerDashboard from "./pages/OfficerDashboard";
import OfficerAnalytics from "./pages/OfficerAnalytics";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-paper">
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/map" element={<LiveMap />} />
            <Route path="/issues/:id" element={<IssueDetail />} />

            <Route path="/report" element={
              <ProtectedRoute roles={["CITIZEN"]}><ReportIssue /></ProtectedRoute>
            } />
            <Route path="/my-reports" element={
              <ProtectedRoute roles={["CITIZEN"]}><MyReports /></ProtectedRoute>
            } />

            <Route path="/officer" element={
              <ProtectedRoute roles={["OFFICER", "ADMIN"]}><OfficerDashboard /></ProtectedRoute>
            } />
            <Route path="/officer/analytics" element={
              <ProtectedRoute roles={["OFFICER", "ADMIN"]}><OfficerAnalytics /></ProtectedRoute>
            } />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
