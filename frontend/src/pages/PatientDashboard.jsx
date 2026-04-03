import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import defaultImg from "../assets/default.png";
import "../styles/PatientDashboard.css";

/* ── ICONS ───────────────────────────────────── */
const CalendarIcon = () => (
  <svg className="pd-nav-icon" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="3" width="14" height="12" rx="1" stroke="currentColor" strokeWidth="1" />
    <path d="M1 6h14" stroke="currentColor" strokeWidth="1" />
    <path d="M5 1v3M11 1v3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    <rect x="4" y="9" width="2" height="2" fill="currentColor" opacity="0.6" />
    <rect x="7" y="9" width="2" height="2" fill="currentColor" opacity="0.6" />
    <rect x="10" y="9" width="2" height="2" fill="currentColor" opacity="0.6" />
  </svg>
);

const BookIcon = () => (
  <svg className="pd-nav-icon" viewBox="0 0 16 16" fill="none">
    <path d="M3 2h8a1 1 0 011 1v10a1 1 0 01-1 1H3" stroke="currentColor" strokeWidth="1" />
    <path d="M3 2a1 1 0 00-1 1v10a1 1 0 001 1" stroke="currentColor" strokeWidth="1" />
    <path d="M6 6h4M6 9h3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

const RxIcon = () => (
  <svg className="pd-nav-icon" viewBox="0 0 16 16" fill="none">
    <path d="M4 2h8l2 2v10H2V4l2-2z" stroke="currentColor" strokeWidth="1" />
    <path d="M5 8h6M8 5v6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path
      d="M5 2H2v10h3M9 10l3-3-3-3M5 7h7"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ── COMPONENT ───────────────────────────────── */
export default function PatientDashboard() {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatient = async () => {
      const email = localStorage.getItem("userEmail");
      const userId = localStorage.getItem("userId");

      if (!email && !userId) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`http://localhost:3000/api/patient/profile/${email}`);
        if (!res.ok) throw new Error("Profile not found");

        const data = await res.json();
        setPatient({
          name: data.name || "N/A",
          email: data.email || email || "N/A",
          dateOfBirth: data.dateOfBirth || "N/A",
          gender: data.gender || "N/A",
          occupation: data.occupation || "N/A",
          bloodType: data.bloodType || "N/A",
          maritalStatus: data.maritalStatus || "N/A",
          address: data.address || "N/A",
          photo: data.photo || null,
        });
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
        setPatient(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, []);

  /* ── STATES ── */
  if (loading) {
    return <div className="pd-loading">Retrieving patient profile…</div>;
  }

  if (!patient) {
    return (
      <div className="pd-error">
        <h2>No profile found</h2>
        <p>Please complete your registration or sign in again.</p>
        <button
          className="pd-error-btn"
          onClick={() => (window.location.href = "/patient/setup")}
        >
          Complete Setup
        </button>
      </div>
    );
  }

  const firstName = patient.name.split(" ")[0];

  /* ── RENDER ── */
  return (
    <div className="pd-root">

      {/* SIDEBAR */}
      <aside className="pd-sidebar">
        <div className="pd-logo">
          <div className="pd-logo-symbol">Est. 2019 · Private Medicine</div>
          <div className="pd-logo-name">
            DOC<span>APPOINTER</span>
          </div>
        </div>

        <nav className="pd-nav">
          <div className="pd-nav-label">Patient Portal</div>
          <button
            className="pd-nav-btn active"
            onClick={() => navigate("/patient/upcoming")}
          >
            <CalendarIcon />
            Upcoming Appointments
          </button>
          <button
            className="pd-nav-btn"
            onClick={() => navigate("/patient/book")}
          >
            <BookIcon />
            Book Appointment
          </button>
          <button className="pd-nav-btn">
            <RxIcon />
            Prescriptions
          </button>
        </nav>

        <div className="pd-sidebar-footer">
          <button
            className="pd-logout-btn"
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
          >
            <LogoutIcon />
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="pd-main">
        <header className="pd-header">
          <div>
            <div className="pd-greeting-label">Patient Overview</div>
            <h1 className="pd-greeting-name">Welcome, {firstName}</h1>
          </div>
          <div className="pd-status-pill">
            <span className="pd-status-dot" />
            System Active
          </div>
        </header>

        {/* Quick Stats */}
        <div className="pd-stats-row">
          <div className="pd-stat-card">
            <div className="pd-stat-label">Blood Type</div>
            <div className="pd-stat-value gold">{patient.bloodType}</div>
          </div>
          <div className="pd-stat-card">
            <div className="pd-stat-label">Gender</div>
            <div className="pd-stat-value">{patient.gender}</div>
          </div>
          <div className="pd-stat-card">
            <div className="pd-stat-label">Marital Status</div>
            <div className="pd-stat-value">{patient.maritalStatus}</div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="pd-profile-card">
          <div className="pd-profile-hero">
            <div className="pd-avatar-wrap">
              <img
                src={patient.photo || defaultImg}
                alt={patient.name}
                className="pd-avatar"
              />
              <div className="pd-avatar-ring" />
            </div>
            <div>
              <div className="pd-patient-name">{patient.name}</div>
              <div className="pd-patient-tag">Patient Record</div>
            </div>
          </div>

          <div className="pd-info-grid">
            <div className="pd-info-cell">
              <div className="pd-info-label">Email Address</div>
              <div className="pd-info-value small">{patient.email}</div>
            </div>
            <div className="pd-info-cell">
              <div className="pd-info-label">Date of Birth</div>
              <div className="pd-info-value">{patient.dateOfBirth}</div>
            </div>
            <div className="pd-info-cell">
              <div className="pd-info-label">Occupation</div>
              <div className="pd-info-value">{patient.occupation}</div>
            </div>
            <div className="pd-info-cell">
              <div className="pd-info-label">Residential Address</div>
              <div className="pd-info-value small">{patient.address}</div>
            </div>
            <div className="pd-info-cell">
              <div className="pd-info-label">Blood Group</div>
              <div className="pd-info-value gold">{patient.bloodType}</div>
            </div>
            <div className="pd-info-cell">
              <div className="pd-info-label">Gender</div>
              <div className="pd-info-value">{patient.gender}</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
