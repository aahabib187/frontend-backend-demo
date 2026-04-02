import { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import "../index.css";

export default function DoctorTimeSlots() {
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
    setCurrentSlot({
      ...currentSlot,
      [e.target.name]: e.target.value,
    });
  };

  const addSlot = () => {
    const { dayOfWeek, startTime, endTime, interval } = currentSlot;
    if (!dayOfWeek || !startTime || !endTime || !interval) {
      setMessage("❌ Fill all fields before adding a slot");
      return;
    }
    setTimeSlots([...timeSlots, currentSlot]);
    setCurrentSlot({ dayOfWeek: "", startTime: "", endTime: "", interval: "15" });
    setMessage("");
  };

  // ✅ Remove slot by index
  const removeSlot = (index) => {
    const newSlots = timeSlots.filter((_, idx) => idx !== index);
    setTimeSlots(newSlots);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (timeSlots.length === 0) {
      setMessage("❌ Add at least one time slot before saving");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/doctor/timeslots/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, timeSlots }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ All time slots saved successfully");
        setTimeSlots([]);
      } else {
        setMessage(data.error || "❌ Failed to save");
      }
    } catch {
      setMessage("❌ Server error");
    }
  };

  return (
    <AuthLayout title="Set Your Availability">
      <form onSubmit={handleSubmit} className="timeslot-form">

        {/* DAY */}
        <label className="form-label">Day</label>
        <select
          name="dayOfWeek"
          className="input-field"
          value={currentSlot.dayOfWeek}
          onChange={handleChange}
          required
        >
          <option value="">Select working day</option>
          <option>Sunday</option>
          <option>Monday</option>
          <option>Tuesday</option>
          <option>Wednesday</option>
          <option>Thursday</option>
          <option>Friday</option>
          <option>Saturday</option>
        </select>

        {/* TIME ROW */}
        <div className="time-row">
          <div>
            <label className="form-label">Start Time</label>
            <input
              type="time"
              name="startTime"
              className="input-field"
              value={currentSlot.startTime}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="form-label">End Time</label>
            <input
              type="time"
              name="endTime"
              className="input-field"
              value={currentSlot.endTime}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* INTERVAL */}
        <label className="form-label">Appointment Interval (minutes)</label>
        <input
          type="number"
          name="interval"
          className="input-field"
          value={currentSlot.interval}
          onChange={handleChange}
          min="5"
          step="5"
          required
        />

        {/* Add Slot Button */}
        <button type="button" onClick={addSlot} className="add-slot-btn">
          ➕ Add Slot
        </button>

        {/* Show Added Slots */}
        {timeSlots.length > 0 && (
          <div className="added-slots">
            <h4>Added Slots:</h4>
            <ul>
              {timeSlots.map((slot, idx) => (
                <li key={idx}>
                  {slot.dayOfWeek}: {slot.startTime} - {slot.endTime} ({slot.interval} min)
                  <button
                    type="button"
                    onClick={() => removeSlot(idx)}
                    className="remove-slot-btn"
                    style={{ marginLeft: "10px", color: "red" }}
                  >
                    ❌ Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Submit all slots */}
        <button type="submit" className="submit-btn">
          Save All Slots
        </button>

        {message && <p className="message">{message}</p>}
      </form>
    </AuthLayout>
  );
}