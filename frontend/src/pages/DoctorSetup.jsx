import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import hospitalImg from "../assets/hospital.jpeg";

export default function DoctorSetup() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [doctorData, setDoctorData] = useState({
    licenseNumber: "",
    degrees: "",
    experienceYears: "",
    deptId: "",
    branchId: "",
  });

  const [schedule, setSchedule] = useState({
    Monday: { selected: false, startTime: "", endTime: "" },
    Tuesday: { selected: false, startTime: "", endTime: "" },
    Wednesday: { selected: false, startTime: "", endTime: "" },
    Thursday: { selected: false, startTime: "", endTime: "" },
    Friday: { selected: false, startTime: "", endTime: "" },
    Saturday: { selected: false, startTime: "", endTime: "" },
    Sunday: { selected: false, startTime: "", endTime: "" },
  });

  const [message, setMessage] = useState("");

  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = 10 + i;
    if (hour > 22) return null;
    const h = hour < 10 ? `0${hour}` : hour;
    return `${h}:00`;
  }).filter(Boolean);

  const handleDoctorChange = (e) => {
    setDoctorData({ ...doctorData, [e.target.name]: e.target.value });
  };

  const handleScheduleChange = (day, field, value) => {
    setSchedule({
      ...schedule,
      [day]: { ...schedule[day], [field]: value },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate doctor info
    if (
      !doctorData.licenseNumber ||
      !doctorData.degrees ||
      !doctorData.experienceYears ||
      !doctorData.deptId ||
      doctorData.deptId < 1 ||
      doctorData.deptId > 10
    ) {
      setMessage("Please fill all doctor fields correctly.");
      return;
    }

    // Validate at least one day selected
    const selectedDays = Object.values(schedule).filter((s) => s.selected);
    if (selectedDays.length === 0) {
      setMessage("Please select at least one available day.");
      return;
    }

    // Validate time ranges
    for (const [day, slot] of Object.entries(schedule)) {
      if (slot.selected && slot.startTime >= slot.endTime) {
        setMessage(`Start time must be before end time for ${day}.`);
        return;
      }
    }

    setMessage("Profile saved successfully! Redirecting...");

    localStorage.setItem("doctorProfile", JSON.stringify(doctorData));
    localStorage.setItem("doctorSchedule", JSON.stringify(schedule));

    setTimeout(() => {
      navigate("/doctor/dashboard");
    }, 1000);
  };

  return (
    <div className="container">
      <div className="card fade-in" style={{ maxWidth: "700px" }}>
        <div className="accent-stripe"></div>
        <div className="logo">⚡ DOC APPOINTER</div>
        <h2>Doctor Profile Setup</h2>
        <p>
          Welcome <strong>{user?.name}</strong>, please fill your profile and
          availability schedule.
        </p>
        <img
          src={hospitalImg}
          alt="Hospital"
          style={{
            width: "100%",
            borderRadius: "10px",
            marginBottom: "20px",
            objectFit: "cover",
            maxHeight: "180px",
          }}
        />

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="licenseNumber"
            placeholder="License Number"
            value={doctorData.licenseNumber}
            onChange={handleDoctorChange}
            className="input-field"
          />
          <input
            type="text"
            name="degrees"
            placeholder="Degrees (e.g. MBBS, MD)"
            value={doctorData.degrees}
            onChange={handleDoctorChange}
            className="input-field"
          />
          <input
            type="number"
            name="experienceYears"
            placeholder="Years of Experience"
            value={doctorData.experienceYears}
            onChange={handleDoctorChange}
            className="input-field"
          />
          <input
            type="number"
            name="deptId"
            placeholder="Department ID (1-10)"
            value={doctorData.deptId}
            onChange={handleDoctorChange}
            className="input-field"
          />
          <input
            type="number"
            name="branchId"
            placeholder="Branch ID"
            value={doctorData.branchId}
            onChange={handleDoctorChange}
            className="input-field"
          />

          <h3 style={{ marginTop: "20px" }}>Available Days & Time</h3>
          <table style={{ width: "100%", marginTop: "10px", textAlign: "left" }}>
            <thead>
              <tr>
                <th>Day</th>
                <th>Start Time</th>
                <th>End Time</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(schedule).map(([day, slot]) => (
                <tr key={day}>
                  <td>
                    <input
                      type="checkbox"
                      checked={slot.selected}
                      onChange={(e) =>
                        handleScheduleChange(day, "selected", e.target.checked)
                      }
                    />{" "}
                    {day}
                  </td>
                  <td>
                    <select
                      disabled={!slot.selected}
                      value={slot.startTime}
                      onChange={(e) =>
                        handleScheduleChange(day, "startTime", e.target.value)
                      }
                      className="input-field"
                    >
                      <option value="">Start Time</option>
                      {timeOptions.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      disabled={!slot.selected}
                      value={slot.endTime}
                      onChange={(e) =>
                        handleScheduleChange(day, "endTime", e.target.value)
                      }
                      className="input-field"
                    >
                      <option value="">End Time</option>
                      {timeOptions.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button className="submit-btn" type="submit" style={{ marginTop: "20px" }}>
            Save Profile
          </button>
        </form>

        {message && (
          <p
            className={`message ${
              message.includes("success") ? "success" : "error"
            }`}
            style={{ marginTop: "15px" }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}