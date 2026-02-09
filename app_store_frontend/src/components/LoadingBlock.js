import React from "react";

/** PUBLIC_INTERFACE */
export function LoadingBlock({ label = "Loading…" }) {
  /** Displays a retro-styled skeleton block. */
  return (
    <div className="panel crt" aria-busy="true" aria-live="polite">
      <div className="panel-inner">
        <p className="page-subtitle" style={{ margin: 0 }}>
          {label}
        </p>
        <div style={{ height: 12 }} />
        <div className="skeleton" />
        <div style={{ height: 12 }} />
        <div className="skeleton" />
      </div>
    </div>
  );
}
