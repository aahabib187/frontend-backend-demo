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

    const { role, id: userId } = data.user;

    // ✅ Save email (and optional role/id) to localStorage
    localStorage.setItem("userEmail", data.user.email);
    localStorage.setItem("userRole", role);
    localStorage.setItem("userId", data.user.id);

    if (role === "DOCTOR") {
      const profileRes = await fetch(
        `http://localhost:3000/api/profile/${data.user.email}`
      );
      const profileData = await profileRes.json();

      if (!profileRes.ok) {
        setMessage(profileData.error || "Failed to check doctor profile");
        return;
      }

      if (profileData.exists) {
        navigate("/doctor/dashboard");
      } else {
        navigate("/doctor/setup");
      }

    } else if (role === "PATIENT") {
      navigate("/patient/dashboard");
    } else if (role === "ADMIN") {
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