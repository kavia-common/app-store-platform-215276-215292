import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/apiClient";
import { ErrorBlock } from "../components/ErrorBlock";
import { LoadingBlock } from "../components/LoadingBlock";

/** PUBLIC_INTERFACE */
export default function HomePage() {
  /** Landing page with store intro and backend health indicator. */
  const [health, setHealth] = useState({ loading: true, ok: false, error: null });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await api.health();
        if (!mounted) return;
        setHealth({ loading: false, ok: true, error: null });
      } catch (e) {
        if (!mounted) return;
        setHealth({ loading: false, ok: false, error: e?.message || "Health check failed" });
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="container">
      <h1 className="page-title">Welcome to Neon App Arcade</h1>
      <p className="page-subtitle">
        Browse apps, search the catalog, and (if you have the keys) beam new releases into the vault from the admin panel.
      </p>

      <div className="panel crt">
        <div className="panel-inner">
          <h2 className="card-title" style={{ marginTop: 0 }}>
            Quick actions
          </h2>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link className="btn btn-primary" to="/apps">
              Browse apps
            </Link>
            <Link className="btn btn-ghost" to="/search">
              Search
            </Link>
          </div>

          <div style={{ height: 16 }} />

          <h3 className="card-title">Backend link</h3>
          {health.loading ? (
            <LoadingBlock label="Pinging backend…" />
          ) : health.ok ? (
            <p className="page-subtitle" style={{ margin: 0 }}>
              Status: <strong style={{ color: "rgba(91, 255, 114, 0.95)" }}>ONLINE</strong>
            </p>
          ) : (
            <ErrorBlock
              title="Backend is offline (or endpoint not configured)"
              message={`${health.error}. Configure REACT_APP_API_BASE or REACT_APP_BACKEND_URL to point to your backend.`}
            />
          )}
        </div>
      </div>
    </div>
  );
}
