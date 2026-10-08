import { useEffect, useState } from "react";
import { authLogout, authMe } from "../services/auth.services.js";

const API = "http://localhost:3000/api"

export default function Header() {
  const [loggedIn, setLoggedIn] = useState(false);

  console.log('logged in:', loggedIn);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await fetch(`${API}/auth/me`, { credentials: "include" });
        setLoggedIn(true);
      } catch {
        setLoggedIn(false);
      }
    };

    checkAuth();
    window.addEventListener("auth-change", checkAuth);
    return () => window.removeEventListener("auth-change", checkAuth);
  }, []);

  const handleLogout = async () => {
    try {
      console.log("logged out");
      await authLogout();
    } finally {
      window.location.assign("/auth");
    }
  };

  return (
    <header className="header">
      <a href="/" className="brand">
        <span className="brand-mark">✓</span>
        <span>To-Do List</span>
      </a>

      {loggedIn && (
        <nav className="header-nav">
          <a href="/tasks">My tasks</a>
          <button type="button" className="logout-button" onClick={handleLogout}>
            Log out
          </button>
        </nav>
      )}
    </header>
  );
}