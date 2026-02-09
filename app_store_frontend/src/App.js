import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";

import { NavBar } from "./components/NavBar";
import { RequireAuth } from "./components/RequireAuth";

import HomePage from "./pages/HomePage";
import AppsListPage from "./pages/AppsListPage";
import AppDetailPage from "./pages/AppDetailPage";
import SearchPage from "./pages/SearchPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminHomePage from "./pages/AdminHomePage";
import AdminAppsPage from "./pages/AdminAppsPage";
import NotFoundPage from "./pages/NotFoundPage";

/** PUBLIC_INTERFACE */
function App() {
  /** Root SPA component (routes + layout). */
  return (
    <div className="App">
      <NavBar />
      <main className="main">
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/apps" element={<AppsListPage />} />
          <Route path="/apps/:id" element={<AppDetailPage />} />
          <Route path="/search" element={<SearchPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/admin"
            element={
              <RequireAuth>
                <AdminHomePage />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/apps"
            element={
              <RequireAuth>
                <AdminAppsPage />
              </RequireAuth>
            }
          />

          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-row">
            <span>Neon App Arcade · SPA Demo</span>
            <span style={{ opacity: 0.85 }}>
              API: {process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL || "(same-origin)"}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
