import { useEffect, useState } from "react";
import defaultImg from "../assets/default.png";

export default function DoctorDashboard() {
  const [doctor, setDoctor] = useState({
    specialization: "",
    license: "",
    photo: null,
  });

  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  // handle text change
  const handleChange = (e) => {
    setDoctor({ ...doctor, [e.target.name]: e.target.value });
  };

  // handle image upload
  const handleImage = (e) => {
    const file = e.target.files[0];
    setDoctor({ ...doctor, photo: file });

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setMessage("Saving...");

    const formData = new FormData();
    formData.append("email", loggedInUser.email);
    formData.append("specialization", doctor.specialization);
    formData.append("license", doctor.license);
    formData.append("photo", doctor.photo);

    try {
      const res = await fetch(
        "http://localhost:3000/api/doctor/profile",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Save failed");
        return;
      }

      setMessage("Profile saved ✅");
    } catch (err) {
      console.error(err);
      setMessage("Server error ❌");
    }
  };

  return (
    <div className="dashboard-container">
      <div className="profile-card">
        <h2>Doctor Profile</h2>

        {/* PHOTO */}
        <div className="photo-section">
         <img
  src={doctor.photo || defaultImg}
  alt="Doctor"
  className="doctor-photo"
/>

          <input type="file" onChange={handleImage} />
        </div>

        {/* SPECIALIZATION */}
        <input
          name="specialization"
          placeholder="Specialization (Cardiology, Neurology...)"
          value={doctor.specialization}
          onChange={handleChange}
          className="input-field"
        />

        {/* LICENSE */}
        <input
          name="license"
          placeholder="Medical License Number"
          value={doctor.license}
          onChange={handleChange}
          className="input-field"
        />

        <button className="submit-btn" onClick={handleSave}>
          Save Profile
        </button>

        <p className="message">{message}</p>
      </div>
    </div>
  );
}