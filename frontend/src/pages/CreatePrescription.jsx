import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/DoctorSchedule.css";


const BASE_URL = "http://localhost:3000";

export default function CreatePrescription() {
  const { appointmentId } = useParams();
  const [form, setForm] = useState({
    chiefComplaints: "",
    investigations: "",
    requiredTests: "",
    diagnosis: "",
    history: "",
    instructions: "",
    visitAgainAt: ""
  });

  const [medicines, setMedicines] = useState([
    { name: "", dosage: "", days: "" }
  ]);

  // handle text fields
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // medicine change
  const handleMedicineChange = (index, e) => {
    const updated = [...medicines];
    updated[index][e.target.name] = e.target.value;
    setMedicines(updated);
  };

  // add medicine row
  const addMedicine = () => {
    setMedicines([...medicines, { name: "", dosage: "", days: "" }]);
  };

  // submit
const handleSubmit = async () => {
  try {
    const res = await fetch(
      `http://localhost:3000/api/doctor/prescription/${appointmentId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, medicines }) // dateIssued can be skipped if using SYSDATE
      }
    );

    if (!res.ok) throw new Error("Error saving prescription");

    alert("✅ Prescription Saved");
  } catch (err) {
    console.error(err);
    alert("❌ Error saving prescription");
  }
};

  return (
    <div className="prescription-container">
      <h2>Create Prescription</h2>

      <input name="chiefComplaints" placeholder="Chief Complaints" onChange={handleChange}/>
      <input name="investigations" placeholder="Investigations" onChange={handleChange}/>
      <input name="requiredTests" placeholder="Required Tests" onChange={handleChange}/>
      <input name="diagnosis" placeholder="Diagnosis" onChange={handleChange}/>
      <input name="history" placeholder="History" onChange={handleChange}/>
      <input name="instructions" placeholder="Instructions" onChange={handleChange}/>
      <input type="date" name="visitAgainAt" onChange={handleChange}/>

      <h3>Medicines</h3>

      {medicines.map((med, index) => (
        <div key={index}>
          <input
            name="name"
            placeholder="Medicine Name"
            onChange={(e) => handleMedicineChange(index, e)}
          />
          <input
            name="dosage"
            placeholder="Dosage (1+0+1)"
            onChange={(e) => handleMedicineChange(index, e)}
          />
          <input
            name="days"
            placeholder="Days"
            onChange={(e) => handleMedicineChange(index, e)}
          />
        </div>
      ))}

      <button onClick={addMedicine}>+ Add Medicine</button>
      <br /><br />
      <button onClick={handleSubmit}>Save Prescription</button>
    </div>
  );
}