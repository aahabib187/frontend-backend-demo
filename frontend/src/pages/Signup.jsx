import { useState, useEffect } from "react";
import "../index.css";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "", // <-- added role
  });

  const [message, setMessage] = useState("");
  const [fade, setFade] = useState(false);

  useEffect(() => {
    setFade(true);
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    // Basic validation
    if (
      !formData.name ||
      !formData.email.includes("@") ||
      !formData.password ||
      formData.password.length < 6 ||
      !formData.role // <-- validate role selection
    ) {
      setMessage("Please fill all fields correctly!");
      return;
    }

    setMessage("Signing up...");

    try {
      const response = await fetch("http://localhost:3000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          pass: formData.password,
          phone: "01700000000",
          role: formData.role, // <-- send selected role
        }),
      });

      const data = await response.json();
      console.log("Server response:", data);

      if (response.ok) {
        setMessage("Signup successful! ✅");
      } else {
        setMessage(data.message || "Signup failed ❌");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Server not working ❌");
    }
  };

  return (
    <div className="container">
      <div className={`card ${fade ? "fade-in" : ""}`}>
        <div className="accent-stripe"></div>
        <div className="logo">⚡ MACHO</div>
        <h2>SIGN UP</h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="input-field"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="input-field"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="input-field"
        />

        {/* NEW: Role Dropdown */}
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="input-field"
        >
          <option value="">Select Role</option>
          <option value="PATIENT">Patient</option>
          <option value="DOCTOR">Doctor</option>
          <option value="ADMIN">Admin</option>
        </select>

        <button className="submit-btn" onClick={handleSubmit}>
          SIGN UP
        </button>

        <p
          className={`message ${
            message.includes("successful") ? "success" : "error"
          }`}
        >
          {message}
        </p>
      </div>
    </div>
  );
}

export default Signup;