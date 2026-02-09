import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/** PUBLIC_INTERFACE */
export default function RegisterPage() {
  /** Registration screen. */
  const { register } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [state, setState] = useState({ loading: false, error: null });

  const canSubmit = useMemo(() => {
    return email.trim().length > 3 && password.length >= 6 && displayName.trim().length >= 2;
  }, [displayName, email, password]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setState({ loading: true, error: null });
    try {
      await register({ email: email.trim(), password, displayName: displayName.trim() });
      navigate("/", { replace: true });
    } catch (err) {
      setState({ loading: false, error: err?.message || "Registration failed" });
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">Register</h1>
      <p className="page-subtitle">Create a new account to join the arcade.</p>

      <div className="panel crt">
        <div className="panel-inner">
          <form onSubmit={onSubmit} aria-label="Registration form">
            <div className="field-row two">
              <div>
                <label className="label" htmlFor="displayName">Display name</label>
                <input
                  id="displayName"
                  className="input"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Neon Ranger"
                  autoComplete="nickname"
                />
              </div>

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
            </div>

            <div className="field-row">
              <div>
                <label className="label" htmlFor="password">Password</label>
                <input
                  id="password"
                  className="input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  type="password"
                  placeholder="At least 6 characters"
                />
                <p className="help">Keep it strong. The arcade remembers.</p>
              </div>
            </div>

            {state.error ? <div className="error">{state.error}</div> : null}

            <button className="btn btn-primary" type="submit" disabled={!canSubmit || state.loading}>
              {state.loading ? "Creating account…" : "Register"}
            </button>

            <div style={{ height: 10 }} />
            <p className="page-subtitle" style={{ margin: 0 }}>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
