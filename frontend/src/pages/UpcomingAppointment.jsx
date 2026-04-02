import { useEffect, useState } from "react";
import "../index.css";

const BASE_URL = "http://localhost:3000";

export default function UpcomingAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const email = localStorage.getItem("userEmail");
        const res = await fetch(`${BASE_URL}/api/appointments/upcoming?patientEmail=${email}`);
        const data = await res.json();

        // Sort appointments by nearest date
        const sorted = data.sort((a, b) => new Date(a.APPOINTMENT_DATE) - new Date(b.APPOINTMENT_DATE));
        setAppointments(sorted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) return <div>Loading upcoming appointments...</div>;

  if (appointments.length === 0) return <p>No upcoming appointments.</p>;

  return (
    <div className="appointments-container">
      <h2>Upcoming Appointments</h2>
      <ul>
        {appointments.map(app => (
          <li key={app.APPOINTMENT_ID} className="appointment-card">
            <p><strong>Date:</strong> {new Date(app.APPOINTMENT_DATE).toLocaleDateString("en-GB")}</p>
            <p><strong>Time:</strong> {app.START_TIME} - {app.END_TIME}</p>
            <p><strong>Doctor:</strong> {app.DOCTOR_NAME}</p>
            <p><strong>Degrees:</strong> {app.DEGREES}</p>
            <p><strong>Specialization:</strong> {app.SPECIALIZATION || "General"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}