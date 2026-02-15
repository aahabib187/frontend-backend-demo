import { useState } from "react";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email.includes("@") || formData.password.length < 6) {
      setMessage("Please fill all fields correctly!");
      return;
    }
    setMessage("Signing up...");
    setTimeout(() => setMessage("Signup successful! ✅"), 1000);
  };

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    width: "100vw",
    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  const cardStyle = {
    backgroundColor: "#1c1c1c",
    padding: "50px",
    borderRadius: "20px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.5)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "350px",
    color: "#fff",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  };

  const cardHover = {
    transform: "translateY(-5px)",
    boxShadow: "0 25px 50px rgba(0,0,0,0.7)",
  };

  const titleStyle = {
    marginBottom: "30px",
    fontSize: "28px",
    fontWeight: "bold",
    letterSpacing: "1px",
  };

  const inputStyle = {
    padding: "12px",
    width: "100%",
    marginBottom: "20px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#2c2c2c",
    color: "#fff",
    fontSize: "16px",
    outline: "none",
    boxShadow: "inset 0 0 5px rgba(0,0,0,0.2)",
    transition: "all 0.3s ease",
  };

  const buttonStyle = {
    padding: "12px",
    width: "100%",
    border: "none",
    borderRadius: "10px",
    background: "linear-gradient(90deg, #1E90FF, #4B79A1)",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s ease",
  };

  const messageStyle = {
    marginTop: "20px",
    color: message.includes("successful") ? "#00ff99" : "#ff4c4c",
    fontWeight: "bold",
  };

  // Handlers for hover effects
  const handleCardMouseEnter = (e) => {
    Object.assign(e.currentTarget.style, cardHover);
  };

  const handleCardMouseLeave = (e) => {
    Object.assign(e.currentTarget.style, { transform: "translateY(0)", boxShadow: "0 15px 40px rgba(0,0,0,0.5)" });
  };

  const handleInputFocus = (e) => {
    e.target.style.backgroundColor = "#3a3a3a";
    e.target.style.boxShadow = "0 0 8px #1E90FF";
  };

  const handleInputBlur = (e) => {
    e.target.style.backgroundColor = "#2c2c2c";
    e.target.style.boxShadow = "inset 0 0 5px rgba(0,0,0,0.2)";
  };

  const handleButtonHover = (e, enter = true) => {
    e.target.style.background = enter
      ? "linear-gradient(90deg, #4B79A1, #1E90FF)"
      : "linear-gradient(90deg, #1E90FF, #4B79A1)";
  };

  return (
    <div style={containerStyle}>
      <div
        style={cardStyle}
        onMouseEnter={handleCardMouseEnter}
        onMouseLeave={handleCardMouseLeave}
      >
        <h2 style={titleStyle}>SIGN UP</h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          style={inputStyle}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          style={inputStyle}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          style={inputStyle}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />

        <button
          onClick={handleSubmit}
          style={buttonStyle}
          onMouseEnter={(e) => handleButtonHover(e, true)}
          onMouseLeave={(e) => handleButtonHover(e, false)}
        >
          SIGN UP
        </button>

        <p style={messageStyle}>{message}</p>
      </div>
    </div>
  );
}

export default App;
