import { useEffect, useState } from "react";
import defaultImg from "../assets/default.png";
import "../index.css"; // keep your global styles

export default function DoctorDashboard() {
  const loggedInUser = JSON.parse(localStorage.getItem("user")); // doctor info
  const savedAvailability = JSON.parse(localStorage.getItem("doctorAvailability")) || {};

  const [doctor, setDoctor] = useState({
    name: loggedInUser?.name || "",
    license: loggedInUser?.license || "Not provided",
    specialization: loggedInUser?.specialization || "Not provided",
    photo: loggedInUser?.photo || null,
  });

  const [availability, setAvailability] = useState({
    Sunday: savedAvailability.Sunday || { active: false, start: "10:00", end: "18:00" },
    Monday: savedAvailability.Monday || { active: false, start: "10:00", end: "18:00" },
    Tuesday: savedAvailability.Tuesday || { active: false, start: "10:00", end: "18:00" },
    Wednesday: savedAvailability.Wednesday || { active: false, start: "10:00", end: "18:00" },
    Thursday: savedAvailability.Thursday || { active: false, start: "10:00", end: "18:00" },
    Friday: savedAvailability.Friday || { active: false, start: "10:00", end: "18:00" },
    Saturday: savedAvailability.Saturday || { active: false, start: "10:00", end: "18:00" },
  });

  const [appointments, setAppointments] = useState([
    // placeholder, later fetch from backend
    { id: 1, patientName: "John Doe", date: "2026-04-01", startTime: "10:00", endTime: "10:30", status: "Booked" },
    { id: 2, patientName: "Jane Smith", date: "2026-04-01", startTime: "11:00", endTime: "11:30", status: "Booked" },
  ]);

  const [message, setMessage] = useState("");

  // handle checkbox / dropdown change
  const handleAvailabilityChange = (day, field, value) => {
    setAvailability({
      ...availability,
      [day]: { ...availability[day], [field]: field === "active" ? value : value },
    });
  };

  const handleSaveAvailability = () => {
    localStorage.setItem("doctorAvailability", JSON.stringify(availability));
    setMessage("Availability updated ✅");
    setTimeout(() => setMessage(""), 3000);
  };

  // generate time options for dropdown
  const timeOptions = [];
  for (let h = 10; h <= 22; h++) {
    timeOptions.push(h.toString().padStart(2, "0") + ":00");
    timeOptions.push(h.toString().padStart(2, "0") + ":30");
  }

  return (
    <div className="container" style={{ padding: "20px" }}>
      {/* PROFILE CARD */}
      <div className="card fade-in" style={{ maxWidth: "500px", margin: "0 auto 30px auto", padding: "20px" }}>
        <div className="accent-stripe"></div>
        <div className="logo">⚡ DOC APPOINTER</div>
        <h2>Doctor Profile</h2>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <img
            src={doctor.photo || defaultImg}
            alt="Doctor"
            style={{ width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover", marginBottom: "10px" }}
          />
        </div>
        <p><strong>Name:</strong> {doctor.name}</p>
        <p><strong>License:</strong> {doctor.license}</p>
        <p><strong>Specialization:</strong> {doctor.specialization}</p>
      </div>

      {/* AVAILABILITY */}
      <div className="card fade-in" style={{ maxWidth: "700px", margin: "0 auto 30px auto", padding: "20px" }}>
        <div className="accent-stripe"></div>
        <h2>Edit Availability</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "15px" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>Day</th>
              <th>Active</th>
              <th>Start Time</th>
              <th>End Time</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(availability).map((day) => (
              <tr key={day}>
                <td>{day}</td>
                <td style={{ textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={availability[day].active}
                    onChange={(e) => handleAvailabilityChange(day, "active", e.target.checked)}
                  />
                </td>
                <td style={{ textAlign: "center" }}>
                  <select
                    value={availability[day].start}
                    onChange={(e) => handleAvailabilityChange(day, "start", e.target.value)}
                  >
                    {timeOptions.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </td>
                <td style={{ textAlign: "center" }}>
                  <select
                    value={availability[day].end}
                    onChange={(e) => handleAvailabilityChange(day, "end", e.target.value)}
                  >
                    {timeOptions.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="submit-btn" style={{ marginTop: "15px" }} onClick={handleSaveAvailability}>
          Save Availability
        </button>
        {message && <p className="message">{message}</p>}
      </div>

      {/* APPOINTMENTS */}
      <div className="card fade-in" style={{ maxWidth: "800px", margin: "0 auto 50px auto", padding: "20px" }}>
        <div className="accent-stripe"></div>
        <h2>Booked Appointments</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "15px" }}>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Date</th>
              <th>Start</th>
              <th>End</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt.id}>
                <td>{appt.patientName}</td>
                <td>{appt.date}</td>
                <td>{appt.startTime}</td>
                <td>{appt.endTime}</td>
                <td>{appt.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}