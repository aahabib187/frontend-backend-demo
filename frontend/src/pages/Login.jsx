import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import "../styles/Login.css"; // See the CSS below

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
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

  return (
    <AuthLayout title="Welcome Back">
      <div className="login-container">
        <p className="login-subtitle">Enter your credentials to access your portal</p>
        
        <div className="input-group">
          <label className="input-label">Email Address</label>
          <input
            type="email"
            placeholder="name@healthcare.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="premium-input"
          />
        </div>

        <div className="input-group">
          <label className="input-label">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="premium-input"
          />
        </div>

        <button
          className={`premium-button ${loading ? "loading" : ""}`}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? <span className="spinner"></span> : "Sign In"}
        </button>

        {message && (
          <div className={`status-message ${message.includes('❌') || !message.includes('success') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
