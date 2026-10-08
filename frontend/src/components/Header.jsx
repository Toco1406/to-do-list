import { useEffect, useState } from "react";
import { authLogout, authMe } from "../services/auth.services.js";

export default function Header() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = () =>
      authMe()
        .then((res) => setLoggedIn(res.ok))
        .catch(() => setLoggedIn(false));

    checkAuth();
    window.addEventListener("auth-change", checkAuth);
    return () => window.removeEventListener("auth-change", checkAuth);
  }, []);

  const handleLogout = async () => {
    try {
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