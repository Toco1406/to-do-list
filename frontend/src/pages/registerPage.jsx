import { useState } from "react";
import "../CSS/registerForm.css";

export default function RegisterForm({ onSubmit }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.({ email, password });
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>Register Forum</h2>

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
            <button type="submit">Sign up</button>
            <p>Vous avez déjà un compte ? <a href="/login">Connectez-vous</a></p>
        </div>
    </form>
  );
}