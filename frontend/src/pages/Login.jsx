import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

const handleLogin = async () => {
  if (!email || !password) {
    setMessage("Please enter email and password");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, pass: password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.message || "Login failed");
      return;
    }

    localStorage.setItem("loggedInUser", JSON.stringify(data.user));
   localStorage.setItem("loggedInUser", JSON.stringify(data.user));

if (data.user.role === "PATIENT") {
  navigate("/patient/dashboard");
} else if (data.user.role === "DOCTOR") {
  navigate("/doctor/dashboard");
} else if (data.user.role === "ADMIN") {
  navigate("/admin/dashboard");
}

  } catch (err) {
    console.error(err);
    setMessage("Server error ❌");
  }
};

 

return (
  <AuthLayout title="LOGIN">
    <input
      type="email"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="input-field"
    />

    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="input-field"
    />

    <button className="submit-btn" onClick={handleLogin}>
      LOGIN
    </button>

    <p className="message">{message}</p>
  </AuthLayout>
);
}