import React, { useState } from "react";
import "../CSS/AuthCard.css";

const INITIAL_LOGIN = {
  identifier: "",
  password: "",
  rememberMe: false,
};

const INITIAL_REGISTER = {
  email: "",
  password: "",
  confirmPassword: "",
  terms: false,
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function AuthCard() {
  const [mode, setMode] = useState("login");

  // Form state
  const [loginForm, setLoginForm] = useState(INITIAL_LOGIN);
  const [registerForm, setRegisterForm] = useState(INITIAL_REGISTER);

  // Password visibility
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation and submission state
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const updateLoginField = (field, value) => {
    setLoginForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    // Remove the field error as the user corrects it.
    setErrors((previous) => ({
      ...previous,
      [field]: "",
    }));
  };

  const updateRegisterField = (field, value) => {
    setRegisterForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: "",
    }));
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setErrors({});
    setFeedback(null);
  };

  // Validate login form
  const validateLogin = () => {
    const newErrors = {};

    if (!loginForm.identifier.trim()) {
      newErrors.identifier = "Email is required.";
    } else if (
      loginForm.identifier.includes("@") &&
      !EMAIL_REGEX.test(loginForm.identifier)
    ) {
      newErrors.identifier = "Please enter a valid email address.";
    }

    if (!loginForm.password) {
      newErrors.password = "Password is required.";
    } else if (loginForm.password.length < 8) {
      newErrors.password = "Password must contain at least 8 characters.";
    }

    return newErrors;
  };

  // Validate registration form
  const validateRegister = () => {
    const newErrors = {};

    if (!registerForm.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    }

    if (!registerForm.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!EMAIL_REGEX.test(registerForm.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!registerForm.password) {
      newErrors.password = "Password is required.";
    } else if (registerForm.password.length < 8) {
      newErrors.password = "Password must contain at least 8 characters.";
    }

    if (!registerForm.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (registerForm.password !== registerForm.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (!registerForm.terms) {
      newErrors.terms = "You must accept the Terms & Conditions.";
    }

    return newErrors;
  };

  // Simulate an API request
  const handleSubmit = async (event) => {
    event.preventDefault();

    setFeedback(null);

    const validationErrors =
      mode === "login" ? validateLogin() : validateRegister();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      // Replace this timeout with your real API request.
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setFeedback({
        type: "success",
        message:
          mode === "login"
            ? "Login successful. Welcome back!"
            : "Account created successfully. Welcome!",
      });

      if (mode === "register") {
        setRegisterForm(INITIAL_REGISTER);
      } else {
        setLoginForm(INITIAL_LOGIN);
      }
    } catch (error) {
      setFeedback({
        type: "error",
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (event) => {
    event.preventDefault();

    if (!loginForm.identifier.trim()) {
      setErrors({
        identifier: "Enter your email address first.",
      });
      return;
    }

    if (!EMAIL_REGEX.test(loginForm.identifier)) {
      setErrors({
        identifier: "Enter a valid email address to reset your password.",
      });
      return;
    }

    setFeedback({
      type: "success",
      message: "If an account exists, a password reset link will be sent.",
    });
  };

  return (
    <main className="auth-page">
      <section className="auth-card" aria-label="Authentication">
        {/* Header */}
        <div className="auth-header">

          <h1>{mode === "login" ? "Welcome back" : "Create an account"}</h1>

          <p>
            {mode === "login"
              ? "Sign in to continue to your account."
              : "Create your account to get started."}
          </p>
        </div>

        {/* Login / Register toggle */}
        <div className="auth-tabs" role="tablist" aria-label="Authentication mode">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "login"}
            className={`auth-tab ${mode === "login" ? "active" : ""}`}
            onClick={() => switchMode("login")}
          >
            Login
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={mode === "register"}
            className={`auth-tab ${mode === "register" ? "active" : ""}`}
            onClick={() => switchMode("register")}
          >
            Register
          </button>

          <span
            className={`tab-indicator ${
              mode === "register" ? "register-position" : ""
            }`}
            aria-hidden="true"
          />
        </div>

        {/* Feedback banner */}
        {feedback && (
          <div
            className={`feedback feedback-${feedback.type}`}
            role="alert"
          >
            <span aria-hidden="true">
              {feedback.type === "success" ? "✓" : "!"}
            </span>
            {feedback.message}
          </div>
        )}

        {/* Login */}
        {mode === "login" && (
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="login-identifier">Email</label>

              <input
                id="login-identifier"
                type="text"
                value={loginForm.identifier}
                onChange={(event) =>
                  updateLoginField("identifier", event.target.value)
                }
                placeholder="you@example.com"
                autoComplete="username"
                aria-invalid={Boolean(errors.identifier)}
                aria-describedby={
                  errors.identifier ? "identifier-error" : undefined
                }
                className={errors.identifier ? "input-error" : ""}
              />

              {errors.identifier && (
                <span id="identifier-error" className="field-error">
                  {errors.identifier}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="login-password">Password</label>

              <div className="password-wrapper">
                <input
                  id="login-password"
                  type={showLoginPassword ? "text" : "password"}
                  value={loginForm.password}
                  onChange={(event) =>
                    updateLoginField("password", event.target.value)
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={
                    errors.password ? "login-password-error" : undefined
                  }
                  className={errors.password ? "input-error" : ""}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowLoginPassword((value) => !value)}
                  aria-label={
                    showLoginPassword ? "Hide password" : "Show password"
                  }
                >
                  {showLoginPassword ? "Hide" : "Show"}
                </button>
              </div>

              {errors.password && (
                <span id="login-password-error" className="field-error">
                  {errors.password}
                </span>
              )}
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={loginForm.rememberMe}
                  onChange={(event) =>
                    updateLoginField("rememberMe", event.target.checked)
                  }
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                className="text-button"
                onClick={handleForgotPassword}
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner" aria-hidden="true" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        )}

        {/* Register */}
        {mode === "register" && (
          <form className="auth-form" onSubmit={handleSubmit} noValidate>

            <div className="form-group">
              <label htmlFor="register-email">Email</label>

              <input
                id="register-email"
                type="email"
                value={registerForm.email}
                onChange={(event) =>
                  updateRegisterField("email", event.target.value)
                }
                placeholder="you@example.com"
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                className={errors.email ? "input-error" : ""}
              />

              {errors.email && (
                <span className="field-error">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="register-password">Password</label>

              <div className="password-wrapper">
                <input
                  id="register-password"
                  type={showRegisterPassword ? "text" : "password"}
                  value={registerForm.password}
                  onChange={(event) =>
                    updateRegisterField("password", event.target.value)
                  }
                  placeholder="Minimum 8 characters"
                  autoComplete="new-password"
                  aria-invalid={Boolean(errors.password)}
                  className={errors.password ? "input-error" : ""}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowRegisterPassword((value) => !value)
                  }
                  aria-label={
                    showRegisterPassword ? "Hide password" : "Show password"
                  }
                >
                  {showRegisterPassword ? "Hide" : "Show"}
                </button>
              </div>

              {errors.password && (
                <span className="field-error">{errors.password}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirm-password">Confirm password</label>

              <div className="password-wrapper">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={registerForm.confirmPassword}
                  onChange={(event) =>
                    updateRegisterField(
                      "confirmPassword",
                      event.target.value
                    )
                  }
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  aria-invalid={Boolean(errors.confirmPassword)}
                  className={errors.confirmPassword ? "input-error" : ""}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword((value) => !value)
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>

              {errors.confirmPassword && (
                <span className="field-error">{errors.confirmPassword}</span>
              )}
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner" aria-hidden="true" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        )}

        <p className="auth-footer">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button type="button" onClick={() => switchMode("register")}>
                Create one
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button type="button" onClick={() => switchMode("login")}>
                Sign in
              </button>
            </>
          )}
        </p>
      </section>
    </main>
  );
}

export default AuthCard;