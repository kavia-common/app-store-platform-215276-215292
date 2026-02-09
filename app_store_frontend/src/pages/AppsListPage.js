import React, { useEffect, useState } from "react";
import { api } from "../services/apiClient";
import { AppCard } from "../components/AppCard";
import { ErrorBlock } from "../components/ErrorBlock";
import { LoadingBlock } from "../components/LoadingBlock";

/** PUBLIC_INTERFACE */
export default function AppsListPage() {
  /** Displays a grid of apps returned by the backend. */
  const [state, setState] = useState({ loading: true, items: [], error: null });

  const load = async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const res = await api.listApps({});
      const items = Array.isArray(res) ? res : res?.items || res?.apps || [];
      setState({ loading: false, items, error: null });
    } catch (e) {
      setState({ loading: false, items: [], error: e?.message || "Failed to load apps" });
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container">
      <h1 className="page-title">Apps</h1>
      <p className="page-subtitle">The latest neon drops from the arcade shelf.</p>

      {state.loading ? (
        <LoadingBlock />
      ) : state.error ? (
        <ErrorBlock message={state.error} onRetry={load} />
      ) : state.items.length === 0 ? (
        <div className="panel crt">
          <div className="panel-inner">
            <p className="page-subtitle" style={{ margin: 0 }}>
              No apps found. (This can also happen if the backend doesn’t expose /apps yet.)
            </p>
          </div>
        </div>
      ) : (
        <div className="grid" role="list">
          {state.items.map((app, idx) => (
            <div key={app?.id ?? app?.app_id ?? app?.slug ?? idx} role="listitem">
              <AppCard app={app} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
