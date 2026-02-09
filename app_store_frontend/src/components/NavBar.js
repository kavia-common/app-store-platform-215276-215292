import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/** PUBLIC_INTERFACE */
export function NavBar() {
  /** Top navigation bar for main routes and auth actions. */
  const { user, isAuthed, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div className="container">
        <div className="navbar-inner">
          <NavLink to="/" className="brand" aria-label="Go to home">
            <div className="brand-badge" aria-hidden="true" />
            <div>
              <div className="brand-title">Neon App Arcade</div>
              <span className="brand-subtitle">Retro store for modern builds</span>
            </div>
          </NavLink>

          <nav className="nav-links" aria-label="Primary navigation">
            <NavLink className="nav-link" to="/apps">
              Apps
            </NavLink>
            <NavLink className="nav-link" to="/search">
              Search
            </NavLink>
            <NavLink className="nav-link" to="/admin">
              Admin
            </NavLink>

            {isAuthed ? (
              <>
                <span className="nav-link" style={{ cursor: "default" }} aria-label="Signed in user">
                  {user?.display_name || user?.email || "Signed in"}
                </span>
                <button
                  className="btn btn-ghost"
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink className="btn btn-ghost" to="/login">
                  Login
                </NavLink>
                <NavLink className="btn btn-primary" to="/register">
                  Register
                </NavLink>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
