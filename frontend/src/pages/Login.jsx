import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

      // Save logged-in user info for profile page
      localStorage.setItem("loggedInUser", JSON.stringify(data.user));
      navigate("/profile");

    } catch (err) {
      console.error(err);
      setMessage("Server error ❌");
    }
  };

  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h1>LOGIN PAGE</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", margin: "10px auto", padding: "5px", width: "250px" }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: "block", margin: "10px auto", padding: "5px", width: "250px" }}
      />

      <button
        onClick={handleLogin}
        style={{ padding: "10px 20px", marginTop: "10px", cursor: "pointer" }}
      >
        LOGIN
      </button>

      <p>{message}</p>
    </div>
  );
}