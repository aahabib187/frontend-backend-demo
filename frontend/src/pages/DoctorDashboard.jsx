import { useEffect, useState } from "react";
import defaultImg from "../assets/default.png";
import "../index.css"; // Ensure your new CSS is here
import { useNavigate } from "react-router-dom";

export default function DoctorDashboard() {
  const [doctor, setDoctor] = useState(null); // Start as null to show loading
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const email = localStorage.getItem("userEmail");
        if (!email) {
          setLoading(false);
          return;
        }

        const res = await fetch(`http://localhost:3000/api/doctor/profile/${email}`);
        const data = await res.json();

        if (res.ok) {
          // IMPORTANT: Mapping the API data to our state
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

  if (loading) {
    return <div className="loading-screen">Loading Medical Profile...</div>;
  }

  if (!doctor) {
    return <div className="error-screen">No doctor profile found. Please log in again.</div>;
  }

  return (
    <div className="dashboard-wrapper">
      {/* PERSISTENT SIDEBAR */}
      <aside className="sidebar-new">
        <div className="sidebar-logo">⚕ DOC<span>APPOINTER</span></div>
        <nav className="nav-links">
          <button className="nav-item active">Dashboard</button>
         <button 
  className="nav-item" 
  onClick={() => {
    // Your backend sends 'id' lowercase in the getDoctorProfile response
    const id = doctor?.id; 

    if (!id) {
      alert("Doctor ID not found in profile! Check console.");
      console.log("Current doctor state:", doctor);
      return;
    }

    navigate(`/doctor/schedule/${id}`);
  }}
>
  Booked Appointments
</button>
          <button
            className="nav-item"
            onClick={() => navigate("/doctor/timeslots")}
          >Edit Time Slots</button>

        </nav>
      </aside>
      <button
        className="nav-item logout-btn"
        onClick={() => {
          localStorage.removeItem("userEmail");
          localStorage.removeItem("userId");
          window.location.href = "/login"; // redirect to login page
        }}
      >
        Logout
      </button>
      {/* MAIN CONTENT AREA */}
      <main className="main-content">
        <header className="content-header">
          <h1>Welcome back, Dr. {doctor.name.split(' ')[0]}</h1>
          <div className="status-badge">System Active</div>
        </header>

        <div className="dashboard-grid">
          {/* PROFILE CARD */}
          <section className="glass-card profile-section">
            <div className="profile-header">
              <img src={doctor.photo || defaultImg} alt="Doctor" className="avatar-large" />
              <div className="profile-titles">
                <h2>{doctor.name}</h2>
                <span className="badge-specialty">{doctor.specialization}</span>
              </div>
            </div>

            <div className="info-grid">
              <div className="info-item">
                <label>Credentials</label>
                <p>{doctor.degrees}</p>
              </div>
              <div className="info-item">
                <label>Experience</label>
                <p>{doctor.experienceYears} Years Practice</p>
              </div>
              <div className="info-item">
                <label>License No.</label>
                <p className="mono">{doctor.licenseNumber}</p>
              </div>
              <div className="info-item">
                <label>Email Address</label>
                <p>{doctor.email}</p>
              </div>
            </div>
          </section>

          {/* QUICK STATS SECTION */}
          <section className="stats-sidebar">
            <div className="stat-box">
              <label>  <p>Department ID : {doctor.deptId}</p></label>

            </div>
            <div className="stat-box">
              <label>Branch Office</label>
              <p>Branch Code: {doctor.branchId}</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}