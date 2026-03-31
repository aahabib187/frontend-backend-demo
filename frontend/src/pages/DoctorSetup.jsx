import { useState, useEffect } from "react";
import AuthLayout from "../components/AuthLayout";
import "../index.css";
import { useNavigate } from "react-router-dom";

export default function DoctorSetup() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId"); // ✅ use userId for DB
  const userEmail = localStorage.getItem("userEmail"); // optional, just for display

  const [doctorData, setDoctorData] = useState({
    licenseNumber: "",
    degrees: "",
    experienceYears: "",
    deptId: "",
    branchId: "",
    specializations: [],
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

  const [specializationOptions, setSpecializationOptions] = useState([]);
  const [message, setMessage] = useState("");

  // fetch specializations
  useEffect(() => {
    async function fetchSpecializations() {
      try {
        const res = await fetch("http://localhost:3000/api/doctor/specializations");
        const data = await res.json();
        setSpecializationOptions(data);
      } catch (err) {
        console.error("Failed to fetch specializations", err);
      }
    }
    fetchSpecializations();
  }, []);

  // handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDoctorData((prev) => ({ ...prev, [name]: value }));
  };

  // handle specialization select
  const handleSpecializationChange = (e) => {
    setDoctorData({ ...doctorData, specializations: [e.target.value] });
  };

  // handle schedule changes
  const handleScheduleChange = (day, field, value) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  // submit profile
const handleSubmit = async (e) => {
  e.preventDefault();

  const userId = localStorage.getItem("userId");
  const userEmail = localStorage.getItem("userEmail");

  if (!userId || !userEmail) {
    setMessage("Error: No login info found. Please log in first.");
    return;
  }

  if (!doctorData.licenseNumber || !doctorData.degrees || !doctorData.experienceYears || !doctorData.deptId || !doctorData.branchId || doctorData.specializations.length === 0) {
    setMessage("Please fill all required fields!");
    return;
  }

  setMessage("Saving...");

  try {
    // 1️⃣ Create or update doctor profile
    const profileRes = await fetch("http://localhost:3000/api/doctor/profile/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        email: userEmail,
        licenseNumber: doctorData.licenseNumber,
        degrees: doctorData.degrees,
        experienceYears: Number(doctorData.experienceYears),
        deptId: Number(doctorData.deptId),
        branchId: Number(doctorData.branchId),
      }),
    });
    const profileResult = await profileRes.json();
    if (!profileRes.ok) throw new Error(profileResult.error || "Failed to save doctor profile");

    // 2️⃣ Save specialization
    const specRes = await fetch("http://localhost:3000/api/doctor/specialization/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        specializationId: doctorData.specializations[0], // single specialization
      }),
    });
    const specResult = await specRes.json();
    if (!specRes.ok) throw new Error(specResult.error || "Failed to save specialization");

    // 3️⃣ Save weekly schedule
    const timeSlots = [];
    for (const day in schedule) {
      if (schedule[day].selected) {
        timeSlots.push({
          dayOfWeek: day,
          startTime: schedule[day].startTime,
          endTime: schedule[day].endTime,
        });
      }
    }

    if (timeSlots.length > 0) {
      const scheduleRes = await fetch("http://localhost:3000/api/doctor/timeslots/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          timeSlots,
        }),
      });
      const scheduleResult = await scheduleRes.json();
      if (!scheduleRes.ok) throw new Error(scheduleResult.error || "Failed to save time slots");
    }

    setMessage("Profile, specialization, and schedule saved successfully!");
    navigate("/dashboard"); // redirect after complete setup

  } catch (err) {
    console.error(err);
    setMessage("Error: " + err.message);
  }
};

  return (
    <AuthLayout title={`Doctor Setup (${userEmail || "Doctor"})`}>
      <form onSubmit={handleSubmit} className="setup-form">
        {/* License Number */}
        <div className="form-group">
          <label>License Number</label>
          <input
            type="text"
            name="licenseNumber"
            value={doctorData.licenseNumber}
            onChange={handleInputChange}
            className="input-field"
            required
          />
        </div>

        {/* Degrees */}
        <div className="form-group">
          <label>Degrees</label>
          <input
            type="text"
            name="degrees"
            value={doctorData.degrees}
            onChange={handleInputChange}
            className="input-field"
            required
          />
        </div>

        {/* Experience */}
        <div className="form-group">
          <label>Years of Experience</label>
          <input
            type="number"
            name="experienceYears"
            value={doctorData.experienceYears}
            onChange={handleInputChange}
            className="input-field"
            required
          />
        </div>

        {/* Department ID */}
        <div className="form-group">
          <label>Department ID</label>
          <input
            type="number"
            name="deptId"
            value={doctorData.deptId}
            onChange={handleInputChange}
            className="input-field"
            required
          />
        </div>

        {/* Branch ID */}
        <div className="form-group">
          <label>Branch ID</label>
          <input
            type="number"
            name="branchId"
            value={doctorData.branchId}
            onChange={handleInputChange}
            className="input-field"
            required
          />
        </div>

        {/* Specialization */}
        <div className="form-group">
          <label>Specialization</label>
          <select
            value={doctorData.specializations[0] || ""}
            onChange={handleSpecializationChange}
            className="input-field"
            required
          >
            <option value="">-- Select --</option>
            {specializationOptions.map((spec) => (
              <option key={spec.ID} value={spec.ID}>
                {spec.NAME}
              </option>
            ))}
          </select>
        </div>

        {/* Weekly Schedule */}
        <div className="form-group">
          <label>Weekly Schedule</label>
          {Object.keys(schedule).map((day) => (
            <div key={day} className="schedule-day">
              <label>
                <input
                  type="checkbox"
                  checked={schedule[day].selected}
                  onChange={(e) => handleScheduleChange(day, "selected", e.target.checked)}
                />{" "}
                {day}
              </label>
              {schedule[day].selected && (
                <div className="time-inputs">
                  <input
                    type="time"
                    value={schedule[day].startTime}
                    onChange={(e) => handleScheduleChange(day, "startTime", e.target.value)}
                    required
                  />
                  <input
                    type="time"
                    value={schedule[day].endTime}
                    onChange={(e) => handleScheduleChange(day, "endTime", e.target.value)}
                    required
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <button type="submit" className="submit-btn">
          Save Profile & Schedule
        </button>
        {message && <p className="message">{message}</p>}
      </form>
    </AuthLayout>
  );
}