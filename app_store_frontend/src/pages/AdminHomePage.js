import React from "react";
import { Link } from "react-router-dom";

/** PUBLIC_INTERFACE */
export default function AdminHomePage() {
  /** Admin landing route. */
  return (
    <div className="container">
      <h1 className="page-title">Admin</h1>
      <p className="page-subtitle">Manage the catalog. Proceed with caution; neon burns bright.</p>

      <div className="panel crt">
        <div className="panel-inner">
          <h2 className="card-title" style={{ marginTop: 0 }}>Catalog tools</h2>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link className="btn btn-primary" to="/admin/apps">
              Manage apps (CRUD)
            </Link>
          </div>
          <p className="help">Admin routes require auth. Backend must enforce admin permissions.</p>
        </div>
      </div>
    </div>
  );
}
