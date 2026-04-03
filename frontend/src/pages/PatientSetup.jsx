import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import "../styles/PatientSetup.css";

export default function PatientSetup() {
  const navigate  = useNavigate();
  const location  = useLocation();

  // State for user details
  const [userId,    setUserId]    = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [message,   setMessage]   = useState("");

  // Form state
  const [patientData, setPatientData] = useState({
    dateOfBirth:   "",
    gender:        "",
    occupation:    "",
    bloodType:     "",
    maritalStatus: "",
    address:       "",
  });

  // Load user data on mount
  useEffect(() => {
    const storedId    = localStorage.getItem("userId");
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

  // helper: classify message type for styling
  const messageType = () => {
    if (!message) return "";
    if (message.includes("✅")) return "ps-message--success";
    if (message.includes("❌") || message.toLowerCase().includes("error") || message.toLowerCase().includes("please fill"))
      return "ps-message--error";
    return "ps-message--info";
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
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId:        Number(userId), // Ensure it's a number for the database
          dateOfBirth:   patientData.dateOfBirth,
          gender:        patientData.gender,
          occupation:    patientData.occupation,
          bloodType:     patientData.bloodType,
          maritalStatus: patientData.maritalStatus,
          address:       patientData.address,
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
    <AuthLayout>
      <div className="ps-page">
        <div className="ps-card">

          {/* ── Header ── */}
          <div className="ps-card-header">
            <span className="ps-eyebrow">Patient Portal</span>
            <h2 className="ps-title">Patient <em>Setup</em></h2>
            <p className="ps-subtitle">{userEmail || "Complete your health profile"}</p>
          </div>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} className="ps-form">

            {/* Date of Birth */}
            <div className="ps-field">
              <label className="ps-label">Date of Birth *</label>
              <input
                type="date"
                name="dateOfBirth"
                value={patientData.dateOfBirth}
                onChange={handleInputChange}
                className="ps-input"
                required
              />
            </div>

            {/* Gender + Occupation side by side */}
            <div className="ps-row">
              <div className="ps-field">
                <label className="ps-label">Gender *</label>
                <div className="ps-select-wrap">
                  <select
                    name="gender"
                    value={patientData.gender}
                    onChange={handleInputChange}
                    className="ps-select"
                    required
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="ps-field">
                <label className="ps-label">Occupation *</label>
                <input
                  type="text"
                  name="occupation"
                  placeholder="e.g. Engineer"
                  value={patientData.occupation}
                  onChange={handleInputChange}
                  className="ps-input"
                  required
                />
              </div>
            </div>

            {/* Blood Type + Marital Status side by side */}
            <div className="ps-row">
              <div className="ps-field">
                <label className="ps-label">Blood Type</label>
                <input
                  type="text"
                  name="bloodType"
                  placeholder="e.g. O+"
                  value={patientData.bloodType}
                  onChange={handleInputChange}
                  className="ps-input"
                />
              </div>

              <div className="ps-field">
                <label className="ps-label">Marital Status</label>
                <div className="ps-select-wrap">
                  <select
                    name="maritalStatus"
                    value={patientData.maritalStatus}
                    onChange={handleInputChange}
                    className="ps-select"
                  >
                    <option value="">Select</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="ps-field">
              <label className="ps-label">Address</label>
              <textarea
                name="address"
                placeholder="Current Address"
                value={patientData.address}
                onChange={handleInputChange}
                className="ps-textarea"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="ps-submit"
              disabled={!userId}
            >
              <span>Save Patient Info</span>
            </button>

            {/* Feedback message */}
            {message && (
              <p className={`ps-message ${messageType()}`}>{message}</p>
            )}

          </form>
        </div>
      </div>
    </AuthLayout>
  );
}