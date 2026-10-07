import { useState } from "react";
import "../CSS/LoginForm.css";

export default function LoginForm({ onSubmit }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.({ email, password });
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>Login Forum</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
        <div className="last">
            <p>Vous n'avez pas de compte ? <a href="/register">Inscrivez-vous</a></p>
            <button type="submit">Sign in</button>
        </div>
    </form>
  );
}