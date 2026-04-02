import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css"; 

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "",
  });

  const [message, setMessage] = useState("");
  const [passwordStatus, setPasswordStatus] = useState({
    length: false,
    capital: false,
    number: false,
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const checkPassword = (password) => {
    setPasswordStatus({
      length: password.length >= 8,
      capital: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
    });
  };

  const handleSubmit = async () => {
    // ... keep your existing validation logic here ...
    if (!formData.name || !formData.email.includes("@") || !passwordStatus.length) {
       return setMessage("Please check all fields.");
    }

    setMessage("Creating your exclusive account...");

    try {
      const response = await fetch("http://localhost:3000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          pass: formData.password,
          phone: formData.phone,
          role: formData.role,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("🎉 Welcome to Doc Appointer!");
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("userEmail", data.user.email);
        
        setTimeout(() => {
          if (formData.role === "DOCTOR") navigate("/doctor/setup");
          else if (formData.role === "PATIENT") navigate("/patient/setup");
          else navigate("/admin/dashboard");
        }, 1500);
      } else {
        setMessage(data.error || "Signup failed ❌");
      }
    } catch (error) {
      setMessage("Server not responding ❌");
    }
  };

  return (
    <div className="premium-auth-container">
      {/* Abstract Background Shapes */}
      <div className="bg-blur-circle circle-1"></div>
      <div className="bg-blur-circle circle-2"></div>

      <div className="premium-glass-card">
        <div className="brand-header">
          <span className="premium-logo">⚕ DOC APPOINTER</span>
          <p className="subtitle">Join the elite network of healthcare</p>
        </div>

        <h2 className="auth-title">Create Account</h2>

        <div className="form-sections">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="premium-input"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="premium-input"
          />

          <input
            type="password"
            name="password"
            placeholder="Secure Password"
            value={formData.password}
            onChange={(e) => {
              handleChange(e);
              checkPassword(e.target.value);
            }}
            className="premium-input"
          />

          <div className="hint-wrapper">
            <span className={passwordStatus.length ? "hint-ok" : "hint-no"}>8+ Chars</span>
            <span className={passwordStatus.capital ? "hint-ok" : "hint-no"}>Capital</span>
            <span className={passwordStatus.number ? "hint-ok" : "hint-no"}>Number</span>
          </div>

          <input
            type="text"
            name="phone"
            placeholder="Phone Number (11 digits)"
            value={formData.phone}
            onChange={handleChange}
            className="premium-input"
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="premium-input select-styled"
          >
            <option value="">Select Professional Role</option>
            <option value="PATIENT">Patient</option>
            <option value="DOCTOR">Doctor</option>
            <option value="ADMIN">Administrator</option>
          </select>
        </div>

        <button className="premium-btn" onClick={handleSubmit}>
          SIGN UP
        </button>

        {message && <p className="status-msg">{message}</p>}

        <div className="footer-link">
          <p>Already a member? <span onClick={() => navigate("/login")}>Login instead</span></p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
