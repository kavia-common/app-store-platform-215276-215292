import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LoadingBlock } from "./LoadingBlock";

/** PUBLIC_INTERFACE */
export function RequireAuth({ children }) {
  /** Guards a route, requiring an authenticated session. */
  const { booting, isAuthed } = useAuth();
  const location = useLocation();

  if (booting) return <LoadingBlock label="Restoring session…" />;

  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
