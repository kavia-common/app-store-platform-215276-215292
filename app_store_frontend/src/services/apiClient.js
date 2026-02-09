import { getAuthToken } from "./authStorage";

/**
 * NOTE: Backend OpenAPI in this repo currently only exposes "/" health check.
 * This client is written to support additional endpoints as they are added.
 */

function resolveBaseUrl() {
  // Prefer the most explicit var first.
  const fromEnv =
    process.env.REACT_APP_API_BASE ||
    process.env.REACT_APP_BACKEND_URL ||
    "";

  // If nothing is configured, fall back to same-origin (useful in some deployments).
  return fromEnv.replace(/\/+$/, "");
}

const API_BASE = resolveBaseUrl();

function buildUrl(path, query) {
  const base = API_BASE ? `${API_BASE}` : "";
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${base}${normalizedPath}`, window.location.origin);

  if (query && typeof query === "object") {
    Object.entries(query).forEach(([k, v]) => {
      if (v === undefined || v === null || v === "") return;
      url.searchParams.set(k, String(v));
    });
  }

  return API_BASE ? url.toString().replace(url.origin, "") : url.toString();
}

async function parseJsonSafe(resp) {
  const text = await resp.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

function normalizeError(status, payload) {
  const message =
    (payload && (payload.detail || payload.message)) ||
    (typeof payload === "string" ? payload : null) ||
    `Request failed (${status})`;

  return new Error(message);
}

/** PUBLIC_INTERFACE */
export async function apiRequest(path, { method = "GET", body, query, auth = true, headers } = {}) {
  /**
   * Perform an API request against the backend.
   * - Automatically attaches Authorization header if a token is stored
   * - Sends/receives JSON by default
   */
  const token = auth ? getAuthToken() : null;

  const reqHeaders = {
    ...(body ? { "Content-Type": "application/json" } : {}),
    ...(headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const resp = await fetch(buildUrl(path, query), {
    method,
    headers: reqHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  const payload = await parseJsonSafe(resp);

  if (!resp.ok) {
    throw normalizeError(resp.status, payload);
  }

  return payload;
}

/** PUBLIC_INTERFACE */
export const api = {
  /** Health check based on available OpenAPI in this repo. */
  health: () => apiRequest("/", { method: "GET", auth: false }),

  /**
   * Apps (expected backend endpoints; update if backend differs):
   * - GET /apps?query=&page=&page_size=
   * - GET /apps/{id}
   */
  listApps: (params) => apiRequest("/apps", { method: "GET", query: params, auth: false }),
  getApp: (id) => apiRequest(`/apps/${encodeURIComponent(id)}`, { method: "GET", auth: false }),

  /**
   * Auth (expected backend endpoints; update if backend differs):
   * - POST /auth/login  { email, password } -> { token }
   * - POST /auth/register { email, password, display_name } -> { token }
   * - GET /me -> user
   */
  login: (body) => apiRequest("/auth/login", { method: "POST", body, auth: false }),
  register: (body) => apiRequest("/auth/register", { method: "POST", body, auth: false }),
  me: () => apiRequest("/me", { method: "GET", auth: true }),

  /**
   * Admin (expected backend endpoints; update if backend differs):
   * - GET /admin/apps
   * - POST /admin/apps
   * - PUT /admin/apps/{id}
   * - DELETE /admin/apps/{id}
   */
  adminListApps: () => apiRequest("/admin/apps", { method: "GET", auth: true }),
  adminCreateApp: (body) => apiRequest("/admin/apps", { method: "POST", body, auth: true }),
  adminUpdateApp: (id, body) => apiRequest(`/admin/apps/${encodeURIComponent(id)}`, { method: "PUT", body, auth: true }),
  adminDeleteApp: (id) => apiRequest(`/admin/apps/${encodeURIComponent(id)}`, { method: "DELETE", auth: true }),
};
