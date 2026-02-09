import React, { useEffect, useMemo, useState } from "react";
import { api } from "../services/apiClient";
import { ErrorBlock } from "../components/ErrorBlock";
import { LoadingBlock } from "../components/LoadingBlock";

/** PUBLIC_INTERFACE */
export default function AdminAppsPage() {
  /** Admin panel: manage apps via CRUD operations. */
  const [listState, setListState] = useState({ loading: true, items: [], error: null });
  const [form, setForm] = useState({
    id: "",
    name: "",
    summary: "",
    description: "",
    category: "",
    version: "",
    download_url: "",
  });
  const [saveState, setSaveState] = useState({ loading: false, error: null, ok: null });

  const isEditing = useMemo(() => Boolean(form.id), [form.id]);

  const load = async () => {
    setListState({ loading: true, items: [], error: null });
    try {
      const res = await api.adminListApps();
      const items = Array.isArray(res) ? res : res?.items || res?.apps || [];
      setListState({ loading: false, items, error: null });
    } catch (e) {
      setListState({ loading: false, items: [], error: e?.message || "Failed to load admin apps" });
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setForm({
      id: "",
      name: "",
      summary: "",
      description: "",
      category: "",
      version: "",
      download_url: "",
    });
    setSaveState({ loading: false, error: null, ok: null });
  };

  const selectForEdit = (app) => {
    setForm({
      id: String(app?.id ?? app?.app_id ?? ""),
      name: app?.name ?? app?.title ?? "",
      summary: app?.summary ?? "",
      description: app?.description ?? "",
      category: app?.category ?? "",
      version: app?.version ?? "",
      download_url: app?.download_url ?? app?.downloadUrl ?? "",
    });
    setSaveState({ loading: false, error: null, ok: null });
  };

  const onChange = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const validate = () => {
    if (!form.name.trim()) return "Name is required.";
    if (!form.summary.trim() && !form.description.trim()) return "Provide a summary or description.";
    return null;
  };

  const onSave = async (e) => {
    e.preventDefault();
    setSaveState({ loading: true, error: null, ok: null });

    const msg = validate();
    if (msg) {
      setSaveState({ loading: false, error: msg, ok: null });
      return;
    }

    const payload = {
      name: form.name.trim(),
      summary: form.summary.trim() || undefined,
      description: form.description.trim() || undefined,
      category: form.category.trim() || undefined,
      version: form.version.trim() || undefined,
      download_url: form.download_url.trim() || undefined,
    };

    try {
      if (isEditing) {
        await api.adminUpdateApp(form.id, payload);
        setSaveState({ loading: false, error: null, ok: "Updated!" });
      } else {
        await api.adminCreateApp(payload);
        setSaveState({ loading: false, error: null, ok: "Created!" });
      }
      resetForm();
      await load();
    } catch (err) {
      setSaveState({ loading: false, error: err?.message || "Save failed", ok: null });
    }
  };

  const onDelete = async (id) => {
    const ok = window.confirm("Delete this app? This cannot be undone.");
    if (!ok) return;

    try {
      await api.adminDeleteApp(id);
      await load();
      if (String(id) === String(form.id)) resetForm();
    } catch (err) {
      setListState((s) => ({ ...s, error: err?.message || "Delete failed" }));
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">Admin: Apps</h1>
      <p className="page-subtitle">
        Create, update, and delete apps. Requires authenticated session and admin-capable backend.
      </p>

      <div className="grid">
        <section className="card crt" style={{ gridColumn: "span 12" }}>
          <div className="card-inner">
            <h2 className="card-title" style={{ marginTop: 0 }}>
              {isEditing ? "Edit app" : "Create app"}
            </h2>

            <form onSubmit={onSave} aria-label="Admin app form">
              <div className="field-row two">
                <div>
                  <label className="label" htmlFor="name">Name</label>
                  <input
                    id="name"
                    className="input"
                    value={form.name}
                    onChange={(e) => onChange("name", e.target.value)}
                    placeholder="App name"
                  />
                </div>
                <div>
                  <label className="label" htmlFor="category">Category</label>
                  <input
                    id="category"
                    className="input"
                    value={form.category}
                    onChange={(e) => onChange("category", e.target.value)}
                    placeholder="Utility, Games, AI…"
                  />
                </div>
              </div>

              <div className="field-row two">
                <div>
                  <label className="label" htmlFor="version">Version</label>
                  <input
                    id="version"
                    className="input"
                    value={form.version}
                    onChange={(e) => onChange("version", e.target.value)}
                    placeholder="1.0.0"
                  />
                </div>
                <div>
                  <label className="label" htmlFor="download_url">Download URL</label>
                  <input
                    id="download_url"
                    className="input"
                    value={form.download_url}
                    onChange={(e) => onChange("download_url", e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="field-row">
                <div>
                  <label className="label" htmlFor="summary">Summary</label>
                  <input
                    id="summary"
                    className="input"
                    value={form.summary}
                    onChange={(e) => onChange("summary", e.target.value)}
                    placeholder="One-liner summary"
                  />
                </div>
              </div>

              <div className="field-row">
                <div>
                  <label className="label" htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    className="textarea"
                    value={form.description}
                    onChange={(e) => onChange("description", e.target.value)}
                    placeholder="Longer description"
                  />
                </div>
              </div>

              {saveState.error ? <div className="error">{saveState.error}</div> : null}
              {saveState.ok ? (
                <div className="error" style={{ borderColor: "rgba(91,255,114,0.35)", background: "rgba(91,255,114,0.10)", color: "rgba(210,255,222,0.95)" }}>
                  {saveState.ok}
                </div>
              ) : null}

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
                <button className="btn btn-primary" type="submit" disabled={saveState.loading}>
                  {saveState.loading ? "Saving…" : isEditing ? "Update" : "Create"}
                </button>
                <button className="btn btn-ghost" type="button" onClick={resetForm} disabled={saveState.loading}>
                  Clear
                </button>
              </div>
            </form>
          </div>
        </section>

        <section className="card crt" style={{ gridColumn: "span 12" }}>
          <div className="card-inner">
            <h2 className="card-title" style={{ marginTop: 0 }}>Existing apps</h2>

            {listState.loading ? (
              <LoadingBlock label="Loading admin apps…" />
            ) : listState.error ? (
              <ErrorBlock message={listState.error} onRetry={load} />
            ) : listState.items.length === 0 ? (
              <p className="page-subtitle" style={{ margin: 0 }}>No apps in catalog.</p>
            ) : (
              <div style={{ display: "grid", gap: 10 }}>
                {listState.items.map((app, idx) => {
                  const id = app?.id ?? app?.app_id ?? idx;
                  const name = app?.name ?? app?.title ?? "Untitled";
                  return (
                    <div key={id} className="panel" style={{ background: "rgba(0,0,0,0.18)" }}>
                      <div className="panel-inner" style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                        <div>
                          <div className="card-title" style={{ margin: 0 }}>{name}</div>
                          <div className="card-meta">
                            {(app?.category ? `${app.category} · ` : "")}
                            {(app?.version ? `v${app.version}` : "no version")}
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                          <button className="btn btn-ghost" onClick={() => selectForEdit(app)}>
                            Edit
                          </button>
                          <button className="btn btn-danger" onClick={() => onDelete(id)}>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
