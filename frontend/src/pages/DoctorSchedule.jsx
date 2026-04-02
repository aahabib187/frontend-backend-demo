import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Clock, User, ArrowLeft, CheckCircle } from "lucide-react";
import "../index.css";

const BASE_URL = "http://localhost:3000";

export default function DoctorSchedule() {
  const { doctorId } = useParams(); // Or get from localStorage if stored there
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

useEffect(() => {
  const fetchSchedule = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/doctor/schedule/${doctorId}`
      );

      // ✅ IMPORTANT SAFETY CHECK
      if (!res.ok) {
        const text = await res.text();
        console.error("API Error:", text);
        throw new Error("Failed to fetch schedule");
      }

      const data = await res.json();

      // Sorting by date
      const sorted = data.sort(
        (a, b) =>
          new Date(a.APPOINTMENT_DATE) -
          new Date(b.APPOINTMENT_DATE)
      );

      setAppointments(sorted);
    } catch (err) {
      console.error("Schedule fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (doctorId) fetchSchedule();
}, [doctorId]);

  if (loading) return <div className="loading-state">Loading your patients...</div>;

  return (
    <div className="dashboard-simple-wrapper">
      <header className="dashboard-header">
        <button onClick={() => navigate("/doctor/dashboard")} className="back-link">
          <ArrowLeft size={18} /> Dashboard
        </button>
        <h1>My Appointments</h1>
      </header>

      <div className="appointments-list-simple">
        {appointments.length === 0 ? (
          <div className="empty-notice">
            <p>Your schedule is clear for now.</p>
          </div>
        ) : (
          appointments.map((app) => (
            <div key={app.APPOINTMENT_ID} className="simple-card doctor-variant">
              <div className="card-date-badge">
                <span className="month">{new Date(app.APPOINTMENT_DATE).toLocaleString('default', { month: 'short' })}</span>
                <span className="day">{new Date(app.APPOINTMENT_DATE).getDate()}</span>
              </div>

              <div className="card-details-main">
                <h3>Patient: {app.PATIENT_NAME}</h3>
                <div className="patient-meta">
                  <span className="badge">{app.GENDER}</span>
                  <span className="badge blood">{app.BLOOD_TYPE}</span>
                </div>
                
                <div className="meta-row">
                  <span><Clock size={14} /> {app.START_TIME} - {app.END_TIME}</span>
                </div>
              </div>

              <div className="action-area">
                <button className="complete-btn"><CheckCircle size={16} /> Mark Done</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
