import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import "../index.css";

export default function PatientSetup() {
  const navigate = useNavigate();
  const location = useLocation();

  // State for user details
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [message, setMessage] = useState("");

  // Form state
  const [patientData, setPatientData] = useState({
    dateOfBirth: "",
    gender: "",
    occupation: "",
    bloodType: "",
    maritalStatus: "",
    address: "",
  });

  // Load user data on mount
  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    const storedEmail = localStorage.getItem("userEmail");
    
    // Check localStorage OR the state passed through navigate() from Signup
    const idToUse = storedId || location.state?.userId;
    
    if (!idToUse) {
      console.warn("No userId found. User might need to log in.");
      setMessage("Error: Login session not found. Please sign up or log in.");
    } else {
      setUserId(idToUse);
      setUserEmail(storedEmail || "Patient");
      console.log("PatientSetup active for userId:", idToUse);
    }
  }, [location.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatientData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Critical userId check
    if (!userId) {
      return setMessage("Error: Cannot save without a valid User ID.");
    }

    // 2. Client-side validation
    if (!patientData.dateOfBirth || !patientData.gender || !patientData.occupation) {
      return setMessage("Please fill all required fields!");
    }

    setMessage("Saving patient info...");

    try {
      const res = await fetch("http://localhost:3000/api/patient-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: Number(userId), // Ensure it's a number for the database
          dateOfBirth: patientData.dateOfBirth,
          gender: patientData.gender,
          occupation: patientData.occupation,
          bloodType: patientData.bloodType,
          maritalStatus: patientData.maritalStatus,
          address: patientData.address,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save patient info");
      }

      setMessage("✅ Patient info saved successfully!");
      
      // Redirect after a short delay
      setTimeout(() => navigate("/patient/dashboard"), 1500);
    } catch (err) {
      console.error("Submission Error:", err);
      setMessage("❌ Error: " + err.message);
    }
  };

  return (
    <AuthLayout title={`Patient Setup (${userEmail})`}>
      <form onSubmit={handleSubmit} className="setup-form">
        <div className="form-group">
          <label>Date of Birth *</label>
          <input
            type="date"
            name="dateOfBirth"
            value={patientData.dateOfBirth}
            onChange={handleInputChange}
            className="input-field"
            required
          />
        </div>

        <div className="form-group">
          <label>Gender *</label>
          <select
            name="gender"
            value={patientData.gender}
            onChange={handleInputChange}
            className="input-field"
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Occupation *</label>
          <input
            type="text"
            name="occupation"
            placeholder="e.g. Engineer"
            value={patientData.occupation}
            onChange={handleInputChange}
            className="input-field"
            required
          />
        </div>

        <div className="form-group">
          <label>Blood Type</label>
          <input
            type="text"
            name="bloodType"
            placeholder="e.g. O+"
            value={patientData.bloodType}
            onChange={handleInputChange}
            className="input-field"
          />
        </div>

        <div className="form-group">
          <label>Marital Status</label>
          <input
            type="text"
            name="maritalStatus"
            placeholder="Single/Married"
            value={patientData.maritalStatus}
            onChange={handleInputChange}
            className="input-field"
          />
        </div>

        <div className="form-group">
          <label>Address</label>
          <textarea
            name="address"
            placeholder="Current Address"
            value={patientData.address}
            onChange={handleInputChange}
            className="input-field"
          />
        </div>

        <button 
          type="submit" 
          className="submit-btn" 
          disabled={!userId}
        >
          Save Patient Info
        </button>

        {message && (
          <p className={`message ${message.includes("✅") ? "success" : "error"}`}>
            {message}
          </p>
        )}
      </form>
    </AuthLayout>
  );
}
