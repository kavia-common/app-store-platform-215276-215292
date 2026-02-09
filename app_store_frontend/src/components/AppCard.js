import React from "react";
import { Link } from "react-router-dom";

/** PUBLIC_INTERFACE */
export function AppCard({ app }) {
  /** Display a single app summary card. */
  const id = app?.id ?? app?.app_id ?? app?.slug ?? "";
  const name = app?.name ?? app?.title ?? "Untitled App";
  const summary = app?.summary ?? app?.description ?? "No description provided.";
  const category = app?.category ?? app?.genre;
  const version = app?.version;

  return (
    <article className="card crt">
      <div className="card-inner">
        <h3 className="card-title">{name}</h3>
        <p className="card-meta">{summary}</p>

        <div className="badges" aria-label="App metadata">
          {category ? <span className="badge">{category}</span> : null}
          {version ? <span className="badge alt">v{version}</span> : null}
        </div>

        <div style={{ height: 12 }} />

        <Link className="btn btn-primary" to={`/apps/${encodeURIComponent(String(id))}`}>
          View details
        </Link>
      </div>
    </article>
  );
}
