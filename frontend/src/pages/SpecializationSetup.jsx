import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import "../styles/SpecializationSetup.css";

export default function SpecializationSetup() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const userEmail = localStorage.getItem("userEmail");
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpec, setSelectedSpec] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle"); // idle | saving | success | error

  useEffect(() => {
    async function fetchSpecializations() {
      try {
        const res = await fetch("http://localhost:3000/api/doctor/specializations");
        const data = await res.json();
        setSpecializations(data);
      } catch (err) {
        console.error("Failed to fetch specializations", err);
      }
    }
    fetchSpecializations();
  }, []);

  const handleSave = async () => {
    if (!selectedSpec) {
      setMessage("Please select a specialization");
      setStatus("error");
      return;
    }

    setMessage("Saving...");
    setStatus("saving");

    try {
      const res = await fetch("http://localhost:3000/api/doctor/specialization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          specializationId: selectedSpec,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Specialization saved successfully!");
        setStatus("success");
        setTimeout(() => navigate("/doctor/timeslots"), 1000);
      } else {
        setMessage(data.error || "Failed to save specialization");
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error saving specialization");
      setStatus("error");
    }
  };

  const selectedName = specializations.find(s => String(s.ID) === String(selectedSpec))?.NAME;

  return (
    <div className="spec-root">
      {/* Ambient background orbs */}
      <div className="spec-orb spec-orb-1" />
      <div className="spec-orb spec-orb-2" />
      <div className="spec-orb spec-orb-3" />

      <div className="spec-card">
        {/* Header */}
        <div className="spec-header">
          <div className="spec-badge">Step 2 of 3</div>
          <h1 className="spec-title">Your Specialization</h1>
          <p className="spec-subtitle">
            Define your area of expertise to help patients find the right care.
          </p>
        </div>

        {/* Divider */}
        <div className="spec-divider">
          <span className="spec-divider-line" />
          <span className="spec-divider-icon">✦</span>
          <span className="spec-divider-line" />
        </div>

        {/* Dropdown */}
        <div className="spec-field">
          <label className="spec-label">Medical Specialization</label>
          <div className="spec-select-wrap">
            <select
              value={selectedSpec || ""}
              onChange={(e) => {
                setSelectedSpec(e.target.value);
                setMessage("");
                setStatus("idle");
              }}
              className="spec-select"
            >
              <option value="">— Choose your field —</option>
              {specializations.map((spec) => (
                <option key={spec.ID} value={spec.ID}>
                  {spec.NAME}
                </option>
              ))}
            </select>
            <div className="spec-select-arrow">
              <svg viewBox="0 0 12 8" fill="none">
                <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
          </div>

          {/* Selected preview */}
          {selectedName && (
            <div className="spec-preview">
              <span className="spec-preview-dot" />
              {selectedName}
            </div>
          )}
        </div>

        {/* Message */}
        {message && (
          <div className={`spec-message spec-message-${status}`}>
            {status === "success" && <span className="spec-msg-icon">✓</span>}
            {status === "error" && <span className="spec-msg-icon">!</span>}
            {status === "saving" && <span className="spec-msg-icon spec-spin">◌</span>}
            {message}
          </div>
        )}

        {/* Button */}
        <button
          className={`spec-btn ${status === "saving" ? "spec-btn-loading" : ""}`}
          onClick={handleSave}
          disabled={status === "saving"}
        >
          <span className="spec-btn-text">
            {status === "saving" ? "Saving…" : "Confirm & Continue"}
          </span>
          <span className="spec-btn-arrow">→</span>
        </button>

        {/* Footer note */}
        <p className="spec-footnote">
          You can update your specialization later from your profile settings.
        </p>
      </div>
    </div>
  );
}