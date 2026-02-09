import React from "react";
import { Link } from "react-router-dom";

/** PUBLIC_INTERFACE */
export default function NotFoundPage() {
  /** Catch-all 404 for unknown routes. */
  return (
    <div className="container">
      <h1 className="page-title">404: Signal Lost</h1>
      <p className="page-subtitle">
        That route doesn’t exist in this arcade cabinet.
      </p>
      <Link className="btn btn-primary" to="/">
        Back to Home
      </Link>
    </div>
  );
}
