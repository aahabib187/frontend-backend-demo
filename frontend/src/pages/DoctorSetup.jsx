// DoctorSetup.jsx
import { useState, useEffect } from "react";

function DoctorSetup() {
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

  const userEmail = localStorage.getItem("userEmail"); // assuming login saves email

  // Fetch specialization options on mount
  useEffect(() => {
    async function fetchSpecializations() {
      try {
        const res = await fetch("/api/specializations"); // backend endpoint to get all specializations
        const data = await res.json();
        setSpecializationOptions(data);
      } catch (err) {
        console.error("Failed to fetch specializations", err);
      }
    }
    fetchSpecializations();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDoctorData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSpecializationChange = (e) => {
    const options = Array.from(e.target.selectedOptions, (option) => option.value);
    setDoctorData((prev) => ({ ...prev, specializations: options }));
  };

  const handleScheduleChange = (day, field, value) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: field === "selected" ? value : value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload
    setMessage("Saving...");

    try {
      const res = await fetch("/api/doctor/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          doctorData,
          schedule,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to save");

      setMessage("Profile saved successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Error: " + err.message);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      <h2>Doctor Setup</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>License Number</label>
          <input
            type="text"
            name="licenseNumber"
            value={doctorData.licenseNumber}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Degrees</label>
          <input
            type="text"
            name="degrees"
            value={doctorData.degrees}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Years of Experience</label>
          <input
            type="number"
            name="experienceYears"
            value={doctorData.experienceYears}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Department ID</label>
          <input
            type="number"
            name="deptId"
            value={doctorData.deptId}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Branch ID</label>
          <input
            type="number"
            name="branchId"
            value={doctorData.branchId}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <h3>Specializations</h3>
          <select
            multiple
            value={doctorData.specializations}
            onChange={handleSpecializationChange}
          >
            {specializationOptions.map((spec) => (
              <option key={spec.ID} value={spec.ID}>
                {spec.NAME || spec.ID}
              </option>
            ))}
          </select>
        </div>

        <div>
          <h3>Weekly Schedule</h3>
          {Object.keys(schedule).map((day) => (
            <div key={day}>
              <label>
                <input
                  type="checkbox"
                  checked={schedule[day].selected}
                  onChange={(e) =>
                    handleScheduleChange(day, "selected", e.target.checked)
                  }
                />{" "}
                {day}
              </label>
              {schedule[day].selected && (
                <>
                  <input
                    type="time"
                    value={schedule[day].startTime}
                    onChange={(e) =>
                      handleScheduleChange(day, "startTime", e.target.value)
                    }
                    required
                  />
                  <input
                    type="time"
                    value={schedule[day].endTime}
                    onChange={(e) =>
                      handleScheduleChange(day, "endTime", e.target.value)
                    }
                    required
                  />
                </>
              )}
            </div>
          ))}
        </div>

        <button type="submit">Save Profile</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default DoctorSetup;