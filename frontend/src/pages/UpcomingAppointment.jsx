import { useEffect, useState } from "react";
import "../styles/UpcomingAppointment.css";

const BASE_URL = "http://localhost:3000";

/* ── Helpers ── */
function parseDateParts(dateStr) {
  const d = new Date(dateStr);
  return {
    day:   d.toLocaleDateString("en-GB", { day:   "2-digit" }),
    month: d.toLocaleDateString("en-GB", { month: "short"   }).toUpperCase(),
    year:  d.toLocaleDateString("en-GB", { year:  "numeric" }),
  };
}

/* ── Skeleton ── */
function SkeletonCard() {
  return (
    <li className="ua-skeleton-card">
      <div className="ua-skeleton-block ua-skeleton-badge" />
      <div className="ua-skeleton-lines">
        <div className="ua-skeleton-block" style={{ height: 22, width: "55%" }} />
        <div className="ua-skeleton-block" style={{ height: 14, width: "35%" }} />
        <div className="ua-skeleton-block" style={{ height: 14, width: "45%" }} />
        <div className="ua-skeleton-block" style={{ height: 28, width: "40%", marginTop: 4 }} />
      </div>
    </li>
  );
}

/* ── Single Appointment Card ── */
function AppointmentCard({ app }) {
  const { day, month, year } = parseDateParts(app.APPOINTMENT_DATE);

  return (
    <li className="ua-card">
      {/* Date badge */}
      <div className="ua-date-badge">
        <span className="ua-date-day">{day}</span>
        <span className="ua-date-month">{month}</span>
        <span className="ua-date-year">{year}</span>
      </div>

      {/* Body */}
      <div className="ua-card-body">
        {/* Doctor */}
        <div className="ua-doctor-row">
          <span className="ua-doctor-name">{app.DOCTOR_NAME}</span>
          {app.DEGREES && (
            <span className="ua-doctor-degrees">{app.DEGREES}</span>
          )}
        </div>

        {/* Specialization + Time */}
        <div className="ua-meta-row">
          <div className="ua-meta-item">
            <span className="ua-meta-label">Specialization</span>
            <span className="ua-meta-value">{app.SPECIALIZATION || "General Practice"}</span>
          </div>
        </div>

        {/* Time chip */}
        <div className="ua-time-chip">
          <span className="ua-time-dot" />
          {app.START_TIME} — {app.END_TIME}
        </div>
      </div>
    </li>
  );
}

/* ── Main Export ── */
export default function UpcomingAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const email = localStorage.getItem("userEmail");
        const res   = await fetch(
          `${BASE_URL}/api/appointments/upcoming?patientEmail=${email}`
        );
        const data = await res.json();

        const sorted = [...data].sort(
          (a, b) => new Date(a.APPOINTMENT_DATE) - new Date(b.APPOINTMENT_DATE)
        );
        setAppointments(sorted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="ua-container">
      {/* Header */}
      <header className="ua-header">
        <span className="ua-eyebrow">Patient Portal</span>
        <h2 className="ua-title">
          Upcoming <em>Appointments</em>
        </h2>
        <div className="ua-divider" />
      </header>

      {/* Loading */}
      {loading && (
        <ul className="ua-skeleton-list">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </ul>
      )}

      {/* Empty */}
      {!loading && appointments.length === 0 && (
        <div className="ua-state">
          <div className="ua-state-icon">🗓</div>
          <h3 className="ua-state-title">No Appointments Scheduled</h3>
          <p className="ua-state-sub">
            You have no upcoming appointments at this time.
          </p>
        </div>
      )}

      {/* List */}
      {!loading && appointments.length > 0 && (
        <ul className="ua-list">
          {appointments.map(app => (
            <AppointmentCard key={app.APPOINTMENT_ID} app={app} />
          ))}
        </ul>
      )}
    </div>
  );
}
