import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../services/apiClient";
import { ErrorBlock } from "../components/ErrorBlock";
import { LoadingBlock } from "../components/LoadingBlock";

/** PUBLIC_INTERFACE */
export default function AppDetailPage() {
  /** Displays details for a single app. */
  const { id } = useParams();
  const [state, setState] = useState({ loading: true, app: null, error: null });

  const load = async () => {
    setState({ loading: true, app: null, error: null });
    try {
      const app = await api.getApp(id);
      setState({ loading: false, app, error: null });
    } catch (e) {
      setState({ loading: false, app: null, error: e?.message || "Failed to load app" });
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (state.loading) return <div className="container"><LoadingBlock /></div>;
  if (state.error) return <div className="container"><ErrorBlock message={state.error} onRetry={load} /></div>;

  const app = state.app || {};
  const name = app?.name ?? app?.title ?? "Untitled App";
  const description = app?.description ?? app?.summary ?? "No description provided.";
  const category = app?.category ?? app?.genre;
  const version = app?.version;
  const author = app?.author ?? app?.publisher ?? app?.developer;
  const downloadUrl = app?.download_url ?? app?.downloadUrl ?? app?.url;

  return (
    <div className="container">
      <Link className="btn btn-ghost" to="/apps">
        ← Back to Apps
      </Link>

      <div style={{ height: 14 }} />

      <div className="panel crt">
        <div className="panel-inner">
          <h1 className="page-title" style={{ marginBottom: 8 }}>{name}</h1>
          <p className="page-subtitle" style={{ marginTop: 0 }}>
            {category ? <span><strong>{category}</strong> · </span> : null}
            {version ? <span>v{version} · </span> : null}
            {author ? <span>by {author}</span> : <span>by Unknown</span>}
          </p>

          <div className="card" style={{ marginTop: 12 }}>
            <div className="card-inner">
              <h2 className="card-title" style={{ marginTop: 0 }}>About</h2>
              <p className="card-meta" style={{ fontSize: 14 }}>{description}</p>

              <div style={{ height: 14 }} />

              {downloadUrl ? (
                <a className="btn btn-primary" href={downloadUrl} target="_blank" rel="noreferrer">
                  Download
                </a>
              ) : (
                <div className="error">
                  No download URL present for this app.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
