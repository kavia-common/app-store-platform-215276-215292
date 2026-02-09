import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/** PUBLIC_INTERFACE */
export default function LoginPage() {
  /** Login screen (email + password). */
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location?.state?.from || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [state, setState] = useState({ loading: false, error: null });

  const canSubmit = useMemo(() => email.trim() && password.length >= 6, [email, password]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setState({ loading: true, error: null });
    try {
      await login({ email: email.trim(), password });
      navigate(from, { replace: true });
    } catch (err) {
      setState({ loading: false, error: err?.message || "Login failed" });
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">Login</h1>
      <p className="page-subtitle">Authenticate to access admin controls and personalized features.</p>

      <div className="panel crt">
        <div className="panel-inner">
          <form onSubmit={onSubmit} aria-label="Login form">
            <div className="field-row two">
              <div>
                <label className="label" htmlFor="email">Email</label>
                <input
                  id="email"
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  inputMode="email"
                  placeholder="you@domain.com"
                />
              </div>
              <div>
                <label className="label" htmlFor="password">Password</label>
                <input
                  id="password"
                  className="input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  type="password"
                  placeholder="••••••••"
                />
                <p className="help">Password must be at least 6 characters (client-side check).</p>
              </div>
            </div>

            {state.error ? <div className="error">{state.error}</div> : null}

            <div style={{ height: 12 }} />

            <button className="btn btn-primary" type="submit" disabled={!canSubmit || state.loading}>
              {state.loading ? "Logging in…" : "Login"}
            </button>

            <div style={{ height: 10 }} />
            <p className="page-subtitle" style={{ margin: 0 }}>
              No account? <Link to="/register">Register</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
