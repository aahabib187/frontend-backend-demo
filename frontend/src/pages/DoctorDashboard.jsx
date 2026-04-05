import { useEffect, useState } from "react";
import defaultImg from "../assets/default.png";
import { useNavigate,useParams } from "react-router-dom";
import "../styles/DoctorDashboard.css";

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function getCurrentDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });
}

const IconGrid = () => (
  <svg className="dd-nav-icon" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.9"/>
    <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.5"/>
    <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.5"/>
    <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.5"/>
  </svg>
);
const IconCal = () => (
  <svg className="dd-nav-icon" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="2" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M5 1v2M11 1v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M1 6h14" stroke="currentColor" strokeWidth="1.2"/>
    <circle cx="5.5" cy="10" r="1" fill="currentColor"/>
    <circle cx="8" cy="10" r="1" fill="currentColor"/>
    <circle cx="10.5" cy="10" r="1" fill="currentColor"/>
  </svg>
);
const IconClock = () => (
  <svg className="dd-nav-icon" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M8 4.5v4l2.5 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);
const IconFile = () => (
  <svg className="dd-nav-icon" viewBox="0 0 16 16" fill="none">
    <path d="M3 2h7l3 3v9a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M10 2v4h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M5 8h6M5 11h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);
const IconLogout = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M11 11l3-3-3-3M14 8H6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconBuilding = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M9 2L2 7v9h4v-5h6v5h4V7L9 2z" stroke="#C9A96E" strokeWidth="1.3" strokeLinejoin="round"/>
  </svg>
);
const IconArrow = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M3 7h8M8 4l3 3-3 3" stroke="#C9A96E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function DoctorDashboard() {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
const { doctorId } = useParams();

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const email = localStorage.getItem("userEmail");
           const role = localStorage.getItem("userRole");
             if (!email || role?.toUpperCase() !== "DOCTOR") {
        navigate("/login");
        return;
      }
        const res = await fetch(`http://localhost:3000/api/doctor/profile/${encodeURIComponent(email)}`);
        const data = await res.json();

        if (res.ok) {
          setDoctor({
            id: data.id,
            name: data.name || "N/A",
            email: data.email || "N/A",
            licenseNumber: data.licenseNumber || "N/A",
            degrees: data.degrees || "N/A",
            experienceYears: data.experienceYears || "0",
            deptId: data.deptId || "N/A",
            branchId: data.branchId || "N/A",
            specialization: data.specialization || "General",
            photo: data.photo || null,
          });
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userId");
    window.location.href = "/login";
  };

  const handleAppointments = () => {
    const id = doctor?.id;
    if (!id) { alert("Doctor ID not found."); return; }
    navigate(`/doctor/schedule/${id}`);
  };

  if (loading) {
    return (
      <div className="dd-root dd-loading">
        <div style={{ textAlign: "center" }}>
          <div className="dd-loading-cross" />
          <p className="dd-loading-text">Loading Medical Profile</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="dd-root dd-error">
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", color: "#6B7280" }}>
          No profile found. Please log in again.
        </p>
      </div>
    );
  }

  const firstName = doctor.name.split(" ")[0];
  const initials = getInitials(doctor.name);

  return (
    <div className="dd-root">

      {/* SIDEBAR */}
      <aside className="dd-sidebar">
        <div className="dd-brand">
          <div className="dd-brand-cross" />
          <div className="dd-brand-name">DOC<span>APPOINTER</span></div>
          <div className="dd-brand-sub">Medical Excellence Platform</div>
        </div>

        <div className="dd-nav-section">Main</div>
        <nav className="dd-nav">
          <button className="dd-nav-btn active">
            <IconGrid /> Dashboard
          </button>

          <div className="dd-nav-section" style={{ padding: "1.25rem 0.75rem 0.4rem" }}>Schedule</div>

          <button className="dd-nav-btn" onClick={handleAppointments}>
            <IconCal /> Booked Appointments
          </button>

          <button className="dd-nav-btn" onClick={() => navigate("/doctor/timeslots")}>
            <IconClock /> Edit Time Slots
          </button>

          <div className="dd-nav-section" style={{ padding: "1.25rem 0.75rem 0.4rem" }}>Records</div>

          <button className="dd-nav-btn"  onClick={() =>{ console.log("Navigating..."); navigate(`/doctor/history/${doctor.id}`)}}>
            <IconFile /> Patient Records
          </button>
        </nav>

        <div className="dd-sidebar-footer">
          <button className="dd-logout" onClick={handleLogout}>
            <IconLogout /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="dd-main">

        <div className="dd-topbar">
          <div className="dd-greeting">
            Good morning, <strong>Dr. {firstName}</strong> — {getCurrentDate()}
          </div>
          <div className="dd-status-pill">
            <div className="dd-status-dot" />
            <span className="dd-status-text">System Active</span>
          </div>
        </div>

        <div className="dd-content">

          <div className="dd-hero">
            <div className="dd-hero-inner">
              <div className="dd-avatar">
                {doctor.photo
                  ? <img src={doctor.photo} alt={doctor.name} />
                  : initials}
              </div>

              <div className="dd-profile-text">
                <div className="dd-doctor-title">Attending Physician</div>
                <div className="dd-doctor-name">Dr. {doctor.name}</div>
                <span className="dd-specialty-badge">{doctor.specialization}</span>
              </div>

              <div className="dd-hero-stats">
                <div className="dd-stat">
                  <div className="dd-stat-num">{doctor.experienceYears}</div>
                  <div className="dd-stat-label">Years Exp.</div>
                </div>
                <div className="dd-stat-divider" />
                <div className="dd-stat">
                  <div className="dd-stat-num">Dept</div>
                  <div className="dd-stat-label">{doctor.deptId}</div>
                </div>
                <div className="dd-stat-divider" />
                <div className="dd-stat">
                  <div className="dd-stat-num">Branch</div>
                  <div className="dd-stat-label">{doctor.branchId}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="dd-gold-rule" />

          <div className="dd-info-row">
            <div className="dd-info-card">
              <div className="dd-info-label">Credentials</div>
              <div className="dd-info-value">{doctor.degrees}</div>
            </div>
            <div className="dd-info-card">
              <div className="dd-info-label">License Number</div>
              <div className="dd-info-value mono">{doctor.licenseNumber}</div>
            </div>
            <div className="dd-info-card">
              <div className="dd-info-label">Email Address</div>
              <div className="dd-info-value email">{doctor.email}</div>
            </div>
          </div>

          <div className="dd-bottom-row">
            <div className="dd-dept-card">
              <div className="dd-dept-icon">
                <IconBuilding />
              </div>
              <div>
                <div className="dd-dept-label">Department &amp; Branch</div>
                <div className="dd-dept-value">
                  Dept ID: {doctor.deptId} &nbsp;·&nbsp; Branch: {doctor.branchId}
                </div>
              </div>
            </div>

            <div className="dd-action-card" onClick={handleAppointments}>
              <div>
                <div className="dd-action-label">View Schedule</div>
                <div className="dd-action-value">Booked Appointments →</div>
              </div>
              <div className="dd-action-arrow">
                <IconArrow />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
