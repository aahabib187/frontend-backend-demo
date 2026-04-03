import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import defaultImg from "../assets/default.png";
import "../styles/PatientBookAppointment.css";

/* ── ICONS ───────────────────────────────────── */
const CalendarIcon = () => (
  <svg className="pba-nav-icon" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="3" width="14" height="12" rx="1" stroke="currentColor" strokeWidth="1" />
    <path d="M1 6h14" stroke="currentColor" strokeWidth="1" />
    <path d="M5 1v3M11 1v3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    <rect x="4" y="9" width="2" height="2" fill="currentColor" opacity="0.6" />
    <rect x="7" y="9" width="2" height="2" fill="currentColor" opacity="0.6" />
    <rect x="10" y="9" width="2" height="2" fill="currentColor" opacity="0.6" />
  </svg>
);

const BookIcon = () => (
  <svg className="pba-nav-icon" viewBox="0 0 16 16" fill="none">
    <path d="M3 2h8a1 1 0 011 1v10a1 1 0 01-1 1H3" stroke="currentColor" strokeWidth="1" />
    <path d="M3 2a1 1 0 00-1 1v10a1 1 0 001 1" stroke="currentColor" strokeWidth="1" />
    <path d="M6 6h4M6 9h3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

const RxIcon = () => (
  <svg className="pba-nav-icon" viewBox="0 0 16 16" fill="none">
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
export default function PatientBookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorsRes, specRes] = await Promise.all([
          fetch("http://localhost:3000/api/doctors"),
          fetch("http://localhost:3000/api/specializations"),
        ]);
        const doctorsData = await doctorsRes.json();
        const specData = await specRes.json();
        setDoctors(doctorsData);
        setFilteredDoctors(doctorsData);
        setSpecialties(specData);
      } catch (err) {
        console.error("Error fetching doctors or specialties:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedSpecialty) {
      setFilteredDoctors(doctors);
    } else {
      setFilteredDoctors(
        doctors.filter((doc) =>
          doc.specialties.some((s) => s === selectedSpecialty)
        )
      );
    }
  }, [selectedSpecialty, doctors]);

  const handleDoctorClick = (doctorId) => {
    navigate(`/patient/appointment/doctor/${doctorId}`);
  };

  if (loading) {
    return <div className="pba-loading">Retrieving physicians…</div>;
  }

  return (
    <div className="pba-root">

      {/* SIDEBAR */}
      <aside className="pba-sidebar">
        <div className="pba-logo">
          <div className="pba-logo-symbol">Est. 2019 · Private Medicine</div>
          <div className="pba-logo-name">DOC<span>APPOINTER</span></div>
        </div>

        <nav className="pba-nav">
          <div className="pba-nav-label">Patient Portal</div>
          <button className="pba-nav-btn" onClick={() => navigate("/patient/upcoming")}>
            <CalendarIcon /> Upcoming Appointments
          </button>
          <button className="pba-nav-btn active" onClick={() => navigate("/patient/book")}>
            <BookIcon /> Book Appointment
          </button>
          <button className="pba-nav-btn">
            <RxIcon /> Prescriptions
          </button>
        </nav>

        <div className="pba-sidebar-footer">
          <button
            className="pba-logout-btn"
            onClick={() => { localStorage.clear(); window.location.href = "/login"; }}
          >
            <LogoutIcon /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="pba-main">
        <header className="pba-header">
          <div className="pba-header-left">
            <div className="pba-header-label">Select a Physician</div>
            <h1 className="pba-header-title">Book Appointment</h1>
          </div>
        </header>

        {/* Filter */}
        <div className="pba-filter-bar">
          <span className="pba-filter-label">Specialty</span>
          <select
            className="pba-filter-select"
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
          >
            <option value="">All Specialties</option>
            {specialties.map((spec) => (
              <option key={spec.id} value={spec.name}>{spec.name}</option>
            ))}
          </select>
          <div className="pba-filter-divider" />
          <span className="pba-results-count">
            {filteredDoctors.length} physician{filteredDoctors.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Doctor Grid */}
        <div className="pba-doctor-grid">
          {filteredDoctors.length === 0 && (
            <div className="pba-empty">No physicians found for this specialty.</div>
          )}
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="pba-doctor-card"
              onClick={() => handleDoctorClick(doc.id)}
            >
              <div className="pba-card-top">
                <div className="pba-avatar-wrap">
                  <img
                    src={doc.photo || defaultImg}
                    alt={doc.name}
                    className="pba-avatar"
                  />
                  <div className="pba-avatar-ring" />
                </div>
                <div>
                  <div className="pba-doctor-name">{doc.name}</div>
                  <div className="pba-doctor-degrees">{doc.degrees}</div>
                </div>
              </div>

              <div className="pba-card-divider" />

              {doc.experienceYears && (
                <div className="pba-doctor-exp">
                  {doc.experienceYears} years experience
                </div>
              )}

              <div className="pba-specialties">
                {doc.specialties.map((s, idx) => (
                  <span key={idx} className="pba-badge">{s}</span>
                ))}
              </div>

              <span className="pba-card-arrow">→</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
