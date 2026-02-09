import React, { useMemo, useState } from "react";
import { api } from "../services/apiClient";
import { AppCard } from "../components/AppCard";
import { ErrorBlock } from "../components/ErrorBlock";
import { LoadingBlock } from "../components/LoadingBlock";

/** PUBLIC_INTERFACE */
export default function SearchPage() {
  /** Search apps by query (delegated to backend). */
  const [query, setQuery] = useState("");
  const [state, setState] = useState({ loading: false, items: [], error: null, searched: false });

  const canSearch = useMemo(() => query.trim().length >= 2, [query]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const q = query.trim();
    if (q.length < 2) {
      setState({ loading: false, items: [], error: "Enter at least 2 characters.", searched: true });
      return;
    }

    setState({ loading: true, items: [], error: null, searched: true });
    try {
      const res = await api.listApps({ query: q });
      const items = Array.isArray(res) ? res : res?.items || res?.apps || [];
      setState({ loading: false, items, error: null, searched: true });
    } catch (err) {
      setState({ loading: false, items: [], error: err?.message || "Search failed", searched: true });
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">Search</h1>
      <p className="page-subtitle">Type a signal. We’ll scan the neon shelves.</p>

      <div className="panel crt">
        <div className="panel-inner">
          <form onSubmit={onSubmit} aria-label="Search apps">
            <label className="label" htmlFor="q">Search query</label>
            <div className="field-row two">
              <input
                id="q"
                className="input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. notes, arcade, ai…"
                autoComplete="off"
              />
              <button className="btn btn-primary" type="submit" disabled={!canSearch || state.loading}>
                Search
              </button>
            </div>
            <p className="help">Tip: search is implemented via <code>/apps?query=</code> (backend must support it).</p>
          </form>
        </div>
      </div>

      <div style={{ height: 16 }} />

      {state.loading ? (
        <LoadingBlock label="Searching…" />
      ) : state.error ? (
        <ErrorBlock message={state.error} />
      ) : state.searched && state.items.length === 0 ? (
        <div className="panel crt">
          <div className="panel-inner">
            <p className="page-subtitle" style={{ margin: 0 }}>No matches. Try a different query.</p>
          </div>
        </div>
      ) : state.items.length > 0 ? (
        <div className="grid" role="list">
          {state.items.map((app, idx) => (
            <div key={app?.id ?? app?.app_id ?? app?.slug ?? idx} role="listitem">
              <AppCard app={app} />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
