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

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage("Backend not connected yet");
    }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h2>Signup Page</h2>

      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
      />
      <br /><br />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
      />
      <br /><br />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
      />
      <br /><br />

      <button onClick={handleSubmit}>Signup</button>

      <p>{message}</p>
    </div>
  );
}

export default App;
