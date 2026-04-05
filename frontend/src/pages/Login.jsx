import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import "../styles/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage("Please enter email and password");
      return;
    }
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, pass: password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Login failed");
        setLoading(false);
        return;
      }

      const { role } = data.user;
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("userEmail", data.user.email);
      localStorage.setItem("userRole", role);

      const userRole = role.toUpperCase();

      if (userRole === "DOCTOR") navigate("/doctor/dashboard");
      else if (userRole === "PATIENT") navigate("/patient/dashboard");
      else if (userRole === "ADMIN") navigate("/admin/dashboard");
      else setMessage("Unknown role: " + role);
    } catch (err) {
      console.error(err);
      setMessage("Server error ❌");
    } finally {
      setLoading(false);
    }
  };

  const isError = message && (message.includes("❌") || message.toLowerCase().includes("failed") || message.toLowerCase().includes("error") || message.toLowerCase().includes("please"));

  return (
    <div className="login-root">
      {/* Left Decorative Panel */}
      <div className="login-left">
        <div className="login-left-brand">
          <span className="login-left-tag">Est. 2019</span>
          <span className="login-left-name">DOC<em>APPOINTER</em></span>
        </div>
        <div className="login-left-deco">Noir</div>
        <div className="login-left-vline"></div>
        <div className="login-left-quote">
          <blockquote>"Healing is a matter of time, but it is sometimes also a matter of opportunity."</blockquote>
          <cite>Hippocrates</cite>
        </div>
      </div>

      <div className="login-panel">

        {/* Brand mark */}
        <div className="login-brand">
          <div className="login-brand-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
              <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="login-brand-name">DOC<em>APPOINTER</em></span>
        </div>

        {/* Heading */}
        <div className="login-heading">
          <h1 className="login-title">Welcome back</h1>
          <p className="login-subtitle">Sign in to access your portal</p>
        </div>

        {/* Fields */}
        <div className="login-fields">
          <div className="login-field">
            <label className="login-label">Email Address</label>
            <div className="login-input-wrap">
              <span className="login-input-icon">
                <svg viewBox="0 0 16 16" fill="none">
                  <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.1"/>
                  <path d="M1 5l7 5 7-5" stroke="currentColor" strokeWidth="1.1"/>
                </svg>
              </span>
              <input
                type="email"
                placeholder="name@healthcare.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setMessage(""); }}
                className="login-input"
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
          </div>

          <div className="login-field">
            <label className="login-label">Password</label>
            <div className="login-input-wrap">
              <span className="login-input-icon">
                <svg viewBox="0 0 16 16" fill="none">
                  <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.1"/>
                  <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.1"/>
                  <circle cx="8" cy="10.5" r="1" fill="currentColor"/>
                </svg>
              </span>
              <input
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setMessage(""); }}
                className="login-input"
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              <button
                className="login-toggle-pass"
                onClick={() => setShowPass(p => !p)}
                tabIndex={-1}
                type="button"
              >
                {showPass ? (
                  <svg viewBox="0 0 16 16" fill="none">
                    <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.1"/>
                    <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.1"/>
                    <path d="M2 2l12 12" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 16 16" fill="none">
                    <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.1"/>
                    <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.1"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`login-message ${isError ? "login-message-error" : "login-message-success"}`}>
            <span>{isError ? "⚠" : "✓"}</span>
            {message}
          </div>
        )}

        {/* Submit */}
        <button
          className={`login-btn ${loading ? "login-btn-loading" : ""}`}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <span className="login-spinner" />
          ) : (
            <>
              <span>Sign In</span>
              <span className="login-btn-arrow">→</span>
            </>
          )}
        </button>

        {/* Footer */}
        <p className="login-footer">
          Don't have an account?{" "}
          <a href="/signup" className="login-link">Create one</a>
        </p>
      </div>
    </div>
  );
}