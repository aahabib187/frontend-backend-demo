import { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import "../styles/DoctorSetup.css";
import { useNavigate } from "react-router-dom";

export default function DoctorSetup() {
  const navigate = useNavigate();
  const userId   = localStorage.getItem("userId");
  const userEmail = localStorage.getItem("userEmail"); // optional, just for display

  const [doctorData, setDoctorData] = useState({
    licenseNumber:   "",
    degrees:         "",
    experienceYears: "",
    deptId:          "",
    branchId:        "",
  });

  const [message, setMessage] = useState("");

  // handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDoctorData((prev) => ({ ...prev, [name]: value }));
  };

  // helper: classify message type for styling
  const messageType = () => {
    if (!message) return "";
    if (message.toLowerCase().includes("error") || message.toLowerCase().includes("please fill"))
      return "ds-message--error";
    if (message.toLowerCase().includes("success"))
      return "ds-message--success";
    return "ds-message--info";
  };

  // submit profile only (Step 1)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId || !userEmail) {
      setMessage("Error: No login info found. Please log in first.");
      return;
    }

    if (
      !doctorData.licenseNumber ||
      !doctorData.degrees        ||
      !doctorData.experienceYears ||
      !doctorData.deptId         ||
      !doctorData.branchId
    ) {
      setMessage("Please fill all required fields!");
      return;
    }

    setMessage("Saving profile...");

    try {
      const res = await fetch("http://localhost:3000/api/doctor/profile/create", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          email:           userEmail,
          licenseNumber:   doctorData.licenseNumber,
          degrees:         doctorData.degrees,
          experienceYears: Number(doctorData.experienceYears),
          deptId:          Number(doctorData.deptId),
          branchId:        Number(doctorData.branchId),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save doctor profile");

      setMessage("Profile saved successfully!");

      // redirect to next step: specialization setup
      navigate("/doctor/specialization/setup");
    } catch (err) {
      console.error(err);
      setMessage("Error: " + err.message);
    }
  };

  return (
    <AuthLayout>
      <div className="ds-page">
        <div className="ds-card">

          {/* ── Header ── */}
          <div className="ds-card-header">
            <span className="ds-eyebrow">Physician Portal</span>
            <h2 className="ds-title">Doctor <em>Setup</em></h2>
            <p className="ds-subtitle">{userEmail || "Complete your professional profile"}</p>
          </div>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} className="ds-form">

            {/* License Number */}
            <div className="ds-field">
              <label className="ds-label">License Number</label>
              <input
                type="text"
                name="licenseNumber"
                value={doctorData.licenseNumber}
                onChange={handleInputChange}
                className="ds-input"
                required
              />
            </div>

            {/* Degrees */}
            <div className="ds-field">
              <label className="ds-label">Degrees</label>
              <input
                type="text"
                name="degrees"
                placeholder="e.g. MBBS, MD"
                value={doctorData.degrees}
                onChange={handleInputChange}
                className="ds-input"
                required
              />
            </div>

            {/* Experience */}
            <div className="ds-field">
              <label className="ds-label">Years of Experience</label>
              <input
                type="number"
                name="experienceYears"
                min="0"
                value={doctorData.experienceYears}
                onChange={handleInputChange}
                className="ds-input"
                required
              />
            </div>

            {/* Dept + Branch side by side */}
            <div className="ds-row">
              <div className="ds-field">
                <label className="ds-label">Department ID</label>
                <input
                  type="number"
                  name="deptId"
                  value={doctorData.deptId}
                  onChange={handleInputChange}
                  className="ds-input"
                  required
                />
              </div>

              <div className="ds-field">
                <label className="ds-label">Branch ID</label>
                <input
                  type="number"
                  name="branchId"
                  value={doctorData.branchId}
                  onChange={handleInputChange}
                  className="ds-input"
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="ds-submit">
              <span>Save Profile</span>
            </button>

            {/* Feedback message */}
            {message && (
              <p className={`ds-message ${messageType()}`}>{message}</p>
            )}

          </form>
        </div>
      </div>
    </AuthLayout>
  );
}