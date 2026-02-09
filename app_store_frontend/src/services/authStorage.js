/**
 * Simple token storage for the SPA.
 * We keep it intentionally minimal: one access token string.
 */

const TOKEN_KEY = "appstore_token";

/** PUBLIC_INTERFACE */
export function getAuthToken() {
  /** Returns the stored auth token, or null if none is present. */
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

/** PUBLIC_INTERFACE */
export function setAuthToken(token) {
  /** Persists the auth token (string). Passing a falsy value clears it. */
  try {
    if (!token) {
      window.localStorage.removeItem(TOKEN_KEY);
      return;
    }
    window.localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // If storage is unavailable, do nothing (app will behave as logged-out).
  }
}

/** PUBLIC_INTERFACE */
export function clearAuthToken() {
  /** Clears any stored auth token. */
  setAuthToken(null);
}
