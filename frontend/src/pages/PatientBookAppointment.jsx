// PatientBookAppointment.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import defaultImg from "../assets/default.png";
import "../index.css";

export default function PatientBookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch doctors and specialties
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

  // Filter doctors when specialty changes
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

  // Navigate to doctor appointment detail
  const handleDoctorClick = (doctorId) => {
    navigate(`/patient/appointment/doctor/${doctorId}`);
  };

  if (loading) return <div className="loading-screen">Loading doctors...</div>;

  return (
    <AuthLayout title="Book an Appointment">
      {/* Specialty filter */}
      <div className="filter-bar">
        <label htmlFor="specialty">Filter by Specialty:</label>
        <select
          id="specialty"
          value={selectedSpecialty}
          onChange={(e) => setSelectedSpecialty(e.target.value)}
        >
          <option value="">All Specialties</option>
          {specialties.map((spec) => (
            <option key={spec.id} value={spec.name}>
              {spec.name}
            </option>
          ))}
        </select>
      </div>

      {/* Doctors grid */}
      <div className="doctor-cards-grid">
        {filteredDoctors.length === 0 && (
          <p>No doctors found for this specialty.</p>
        )}
        {filteredDoctors.map((doc) => (
          <div
            key={doc.id}
            className="doctor-card"
            onClick={() => handleDoctorClick(doc.id)}
          >
            <img
              src={doc.photo || defaultImg}
              alt={doc.name}
              className="avatar-small"
            />
            <h3>{doc.name}</h3>
            <p>{doc.degrees}</p>
            {doc.experienceYears && (
              <p>{doc.experienceYears} years experience</p>
            )}
            <div className="doctor-specialties">
              {doc.specialties.map((s, idx) => (
                <span key={idx} className="badge-specialty">
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AuthLayout>
  );
}