import { useEffect, useState } from "react";
import defaultImg from "../assets/default.png";
import "../index.css"; 

export default function PatientDashboard() {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatient = async () => {
      const email = localStorage.getItem("userEmail");
      const userId = localStorage.getItem("userId");

      if (!email && !userId) {
        setLoading(false);
        return;
      }

      try {
        // Try fetching by userId first as it's more reliable after setup
        const identifier = userId || email;
        const res = await fetch(`http://localhost:3000/api/patient/profile/${email}`);
        
        if (!res.ok) {
          throw new Error("Profile not found");
        }

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

  if (loading) return <div className="loading-screen">Loading Patient Profile...</div>;
  
  if (!patient) return (
    <div className="error-screen">
      <h2>No patient profile found.</h2>
      <p>Please complete your setup or log in again.</p>
      <button onClick={() => window.location.href = "/patient/setup"}>Go to Setup</button>
    </div>
  );

  return (
    <div className="dashboard-wrapper">
      <aside className="sidebar-new">
        <div className="sidebar-logo">⚕ DOC<span>APPOINTER</span></div>
        <nav className="nav-links">
          <button className="nav-item active">Upcoming Appointments</button>
          <button className="nav-item">Book New Appointment</button>
          <button className="nav-item">Prescription</button>
        </nav>
        <button
          className="nav-item logout-btn"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </aside>

      <main className="main-content">
        <header className="content-header">
          <h1>Welcome back, {patient.name.split(" ")[0]}</h1>
          <div className="status-badge">System Active</div>
        </header>

        <div className="dashboard-grid">
          <section className="glass-card profile-section">
            <div className="profile-header">
              <img src={patient.photo || defaultImg} alt="Patient" className="avatar-large" />
              <div className="profile-titles">
                <h2>{patient.name}</h2>
                <span className="badge-specialty">Patient Profile</span>
              </div>
            </div>

            <div className="info-grid">
              <div className="info-item"><label>Email</label><p>{patient.email}</p></div>
              <div className="info-item"><label>Date of Birth</label><p>{patient.dateOfBirth}</p></div>
              <div className="info-item"><label>Gender</label><p>{patient.gender}</p></div>
              <div className="info-item"><label>Occupation</label><p>{patient.occupation}</p></div>
              <div className="info-item"><label>Blood Type</label><p>{patient.bloodType}</p></div>
              <div className="info-item"><label>Marital Status</label><p>{patient.maritalStatus}</p></div>
              <div className="info-item"><label>Address</label><p>{patient.address}</p></div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
