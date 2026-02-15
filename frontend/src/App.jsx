import { useState, useEffect } from "react";
import "./index.css"; // we'll add some classes here

function App() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [fade, setFade] = useState(false);

  useEffect(() => {
    setFade(true); // triggers fade-in animation
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (!formData.name || !formData.email.includes("@") || formData.password.length < 6) {
      setMessage("Please fill all fields correctly!");
      return;
    }
    setMessage("Signing up...");
    setTimeout(() => setMessage("Signup successful! ✅"), 1000);
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

        <button className="submit-btn" onClick={handleSubmit}>
          SIGN UP
        </button>

        <p className={`message ${message.includes("successful") ? "success" : "error"}`}>
          {message}
        </p>
      </div>
    </div>
  );
}

export default App;
