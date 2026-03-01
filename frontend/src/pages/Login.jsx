import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      setMessage("No user found. Please signup first.");
      return;
    }

    if (storedUser.email === email && storedUser.password === password) {
      localStorage.setItem("loggedInUser", JSON.stringify(storedUser));
      navigate("/profile");
    } else {
      setMessage("Invalid email or password");
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
