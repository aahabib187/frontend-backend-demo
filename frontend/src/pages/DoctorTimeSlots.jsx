import { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import { useNavigate } from "react-router-dom";
import "../styles/TimeSlots.css";

export default function DoctorTimeSlots() {
  const navigate = useNavigate();
  const email = localStorage.getItem("userEmail");

  const [currentSlot, setCurrentSlot] = useState({
    dayOfWeek: "",
    startTime: "",
    endTime: "",
    interval: "15",
  });

  const [timeSlots, setTimeSlots] = useState([]);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setCurrentSlot({ ...currentSlot, [e.target.name]: e.target.value });
  };

  const addSlot = () => {
    const { dayOfWeek, startTime, endTime, interval } = currentSlot;
    if (!dayOfWeek || !startTime || !endTime || !interval) {
      setMessage("Fill all fields before adding a slot.");
      return;
    }
    setTimeSlots([...timeSlots, currentSlot]);
    setCurrentSlot({ dayOfWeek: "", startTime: "", endTime: "", interval: "15" });
    setMessage("");
  };

  const removeSlot = (index) => {
    setTimeSlots(timeSlots.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (timeSlots.length === 0) {
      setMessage("Add at least one time slot before saving.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/doctor/timeslots/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, timeSlots }),
      });

      if (res.ok) {
        setMessage("Availability saved successfully.");
        setTimeout(() => navigate("/doctor/dashboard"), 1500);
      } else {
        const data = await res.json();
        setMessage(data.error || "Failed to save. Please try again.");
      }
    } catch {
      setMessage("Server error. Please try again later.");
    }
  };

  return (
    <AuthLayout title="Schedule Manager">
      <div className="exclusive-container">
        <p className="exclusive-subtitle">Define your professional consulting hours</p>

        <div className="scheduler-grid">

          {/* ── Left: Input Form ── */}
          <div className="glass-form-card">
            <div className="input-group">
              <label className="premium-label">Working Day</label>
              <select
                name="dayOfWeek"
                className="premium-select"
                value={currentSlot.dayOfWeek}
                onChange={handleChange}
              >
                <option value="">Select a day</option>
                {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map(day => (
                  <option key={day}>{day}</option>
                ))}
              </select>
            </div>

            <div className="time-range-row">
              <div className="input-group">
                <label className="premium-label">Start</label>
                <input
                  type="time"
                  name="startTime"
                  className="premium-input-time"
                  value={currentSlot.startTime}
                  onChange={handleChange}
                />
              </div>
              <div className="input-group">
                <label className="premium-label">End</label>
                <input
                  type="time"
                  name="endTime"
                  className="premium-input-time"
                  value={currentSlot.endTime}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="input-group">
              <label className="premium-label">Session Duration (min)</label>
              <input
                type="number"
                name="interval"
                className="premium-input-time"
                value={currentSlot.interval}
                onChange={handleChange}
                min="5"
                step="5"
              />
            </div>

            <button type="button" onClick={addSlot} className="add-entry-btn">
              <span>+</span> Add to Schedule
            </button>
          </div>

          {/* ── Right: Live Slot Preview ── */}
          <div className="slots-preview-area">
            <h4 className="preview-title">
              Current Itinerary
              <span className="slot-count">{timeSlots.length} slots</span>
            </h4>

            <div className="slots-scroll-container">
              {timeSlots.length === 0 ? (
                <div className="empty-state">No slots added yet</div>
              ) : (
                timeSlots.map((slot, idx) => (
                  <div className="slot-pill" key={idx}>
                    <div className="slot-info">
                      <span className="slot-day">{slot.dayOfWeek}</span>
                      <span className="slot-time">{slot.startTime} — {slot.endTime}</span>
                      <span className="slot-duration">{slot.interval}m</span>
                    </div>
                    <button onClick={() => removeSlot(idx)} className="delete-pill">✕</button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* ── Footer ── */}
        <div className="action-footer">
          {message && <p className="status-msg-popup">{message}</p>}
          <button onClick={handleSubmit} className="save-all-btn">
            <span>Finalize Availability</span>
          </button>
        </div>

      </div>
    </AuthLayout>
  );
}
