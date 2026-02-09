import React from "react";

/** PUBLIC_INTERFACE */
export function ErrorBlock({ title = "Something glitched", message, onRetry }) {
  /** Displays a consistent error UI for network/page errors. */
  return (
    <div className="panel crt" role="alert">
      <div className="panel-inner">
        <h2 className="card-title" style={{ marginTop: 0 }}>
          {title}
        </h2>
        <div className="error">{message || "Unexpected error."}</div>
        {onRetry ? (
          <>
            <div style={{ height: 12 }} />
            <button className="btn btn-ghost" onClick={onRetry}>
              Retry
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
