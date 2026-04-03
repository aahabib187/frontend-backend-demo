import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Clock, ArrowLeft, CheckCircle, FileText, Droplets, User } from "lucide-react";
import "../styles/DoctorSchedule.css";

const BASE_URL = "http://localhost:3000";

export default function DoctorSchedule() {
  const { doctorId } = useParams();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/doctor/schedule/${doctorId}`);
        if (!res.ok) {
          const text = await res.text();
          console.error("API Error:", text);
          throw new Error("Failed to fetch schedule");
        }
        const data = await res.json();
        const sorted = data.sort(
          (a, b) => new Date(a.APPOINTMENT_DATE) - new Date(b.APPOINTMENT_DATE)
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

  if (loading) {
    return (
      <div className="ds-loading">
        <div className="ds-loading-spinner" />
        <p>Loading your schedule</p>
      </div>
    );
  }

  return (
    <div className="ds-root">

      {/* Header */}
      <header className="ds-header">
        <button onClick={() => navigate("/doctor/dashboard")} className="ds-back-btn">
          <ArrowLeft size={14} /> Dashboard
        </button>
        <div className="ds-header-title">
          <h1>My Appointments</h1>
          <p>Patient Schedule Overview</p>
        </div>
        {appointments.length > 0 && (
          <div className="ds-header-count">
            {appointments.length} {appointments.length === 1 ? "Patient" : "Patients"}
          </div>
        )}
      </header>

      {/* Content */}
      <div className="ds-content">
        {appointments.length === 0 ? (
          <div className="ds-empty">
            <div className="ds-empty-icon">
              <Clock size={28} color="var(--gold)" strokeWidth={1.5} />
            </div>
            <h3>Schedule is clear</h3>
            <p>No appointments have been booked yet.</p>
          </div>
        ) : (
          <>
            <div className="ds-section-label">
              <span>Upcoming Appointments</span>
            </div>

            {appointments.map((app) => {
              const date = new Date(app.APPOINTMENT_DATE);
              const month = date.toLocaleString("default", { month: "short" });
              const day = date.getDate();

              return (
                <div key={app.APPOINTMENT_ID} className="ds-card">

                  {/* Date Badge */}
                  <div className="ds-date-badge">
                    <span className="month">{month}</span>
                    <span className="day">{day}</span>
                  </div>

                  {/* Details */}
                  <div className="ds-card-body">
                    <div className="ds-patient-name">{app.PATIENT_NAME}</div>

                    <div className="ds-badges">
                      <span className="ds-badge ds-badge-gender">
                        <User size={10} />
                        {app.GENDER}
                      </span>
                      <span className="ds-badge ds-badge-blood">
                        <Droplets size={10} />
                        {app.BLOOD_TYPE}
                      </span>
                    </div>

                    <div className="ds-time-row">
                      <Clock size={13} />
                      <span>{app.START_TIME} — {app.END_TIME}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="ds-actions">
                    <button
                      className="ds-btn ds-btn-prescription"
                      onClick={() => navigate(`/doctor/prescription/${app.APPOINTMENT_ID}`)}
                    >
                      <FileText size={13} />
                      Prescription
                    </button>
                    <button className="ds-btn ds-btn-done">
                      <CheckCircle size={13} />
                      Mark Done
                    </button>
                  </div>

                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
