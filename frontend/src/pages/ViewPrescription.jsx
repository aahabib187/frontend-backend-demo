import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:3000";

export default function ViewPrescription() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [prescription, setPrescription] = useState(null);
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/doctor/prescription/${appointmentId}`);
        if (!res.ok) throw new Error("Failed to fetch prescription");
        const data = await res.json();

        // Assuming backend sends multiple rows if multiple medicines
        const mainData = data[0]; // basic prescription info
        setPrescription(mainData);

        const meds = data.map(row => ({
          name: row.MED_NAME,
          dosage: row.DOSAGE,
          days: row.DAYS
        }));
        setMedicines(meds);

      } catch (err) {
        console.error(err);
        alert("❌ Error loading prescription");
      }
    };

    fetchPrescription();
  }, [appointmentId]);

  if (!prescription) return <div>Loading...</div>;

  return (
    <div className="prescription-container">
      <h2>Prescription Details</h2>
      <p><b>Chief Complaints:</b> {prescription.CHIEF_COMPLAINTS}</p>
      <p><b>Investigations:</b> {prescription.INVESTIGATIONS}</p>
      <p><b>Required Tests:</b> {prescription.REQUIRED_TESTS}</p>
      <p><b>Diagnosis:</b> {prescription.DIAGNOSIS}</p>
      <p><b>History:</b> {prescription.HISTORY}</p>
      <p><b>Instructions:</b> {prescription.INSTRUCTIONS}</p>
      <p><b>Next Visit:</b> {prescription.VISIT_AGAIN_AT}</p>

      <h3>Medicines</h3>
      <ul>
        {medicines.map((med, idx) => (
          <li key={idx}>{med.name} - {med.dosage} - {med.days} days</li>
        ))}
      </ul>

      <button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );
}