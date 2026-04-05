import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ClipboardList, Plus, Trash2, Save, ArrowLeft,
  FlaskConical, Stethoscope, Pill, CalendarDays, CheckCircle2, XCircle
} from "lucide-react";
import "../styles/CreatePrescription.css";

const BASE_URL = "http://localhost:3000";

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`cp-toast ${type}`}>
      {type === "success" ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
      {message}
    </div>
  );
}

export default function CreatePrescription() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    chiefComplaints: "",
    investigations: "",
    requiredTests: "",
    diagnosis: "",
    history: "",
    instructions: "",
    visitAgainAt: "",
  });

  const [medicines, setMedicines] = useState([
    { name: "", dosage: "", days: "" },
  ]);

  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleMedicineChange = (index, e) => {
    const updated = [...medicines];
    updated[index][e.target.name] = e.target.value;
    setMedicines(updated);
  };

  const addMedicine = () =>
    setMedicines([...medicines, { name: "", dosage: "", days: "" }]);

  const removeMedicine = (index) =>
    setMedicines(medicines.filter((_, i) => i !== index));

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const res = await fetch(
        `${BASE_URL}/api/doctor/prescription/${appointmentId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, medicines }),
        }
      );
      if (!res.ok) throw new Error();
      setToast({ message: "Prescription saved successfully", type: "success" });
    } catch {
      setToast({ message: "Failed to save prescription", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="cp-root pm-root">
      {/* ── Header ── */}
      <header className="cp-header pm-header">
        <button onClick={() => navigate(-1)} className="pm-back-btn">
          <ArrowLeft size={13} /> Back
        </button>

        <div className="cp-header-icon">
          <ClipboardList size={17} />
        </div>

        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 400 }}>
            New Prescription
          </h1>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold)", marginTop: 2 }}>
            Appointment #{appointmentId}
          </p>
        </div>
      </header>

      <div className="cp-body">

        {/* ── Clinical Notes ── */}
        <div className="cp-section">
          <div className="cp-section-header">
            <Stethoscope size={14} className="cp-section-icon" />
            <span>Clinical Notes</span>
          </div>

          <div className="cp-section-body">
            <div className="cp-field">
              <label>Chief Complaints</label>
              <textarea
                name="chiefComplaints"
                placeholder="Primary symptoms reported by patient…"
                rows={3}
                value={form.chiefComplaints}
                onChange={handleChange}
              />
            </div>

            <div className="cp-field">
              <label>History</label>
              <textarea
                name="history"
                placeholder="Relevant medical history…"
                rows={3}
                value={form.history}
                onChange={handleChange}
              />
            </div>

            <div className="cp-field">
              <label>Diagnosis</label>
              <input
                name="diagnosis"
                placeholder="Primary diagnosis"
                value={form.diagnosis}
                onChange={handleChange}
              />
            </div>

            <div className="cp-field">
              <label>Instructions</label>
              <input
                name="instructions"
                placeholder="Patient instructions & precautions"
                value={form.instructions}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* ── Investigations ── */}
        <div className="cp-section">
          <div className="cp-section-header">
            <FlaskConical size={14} className="cp-section-icon" />
            <span>Investigations</span>
          </div>

          <div className="cp-section-body">
            <div className="cp-field">
              <label>Investigations</label>
              <input
                name="investigations"
                placeholder="Examinations performed"
                value={form.investigations}
                onChange={handleChange}
              />
            </div>

            <div className="cp-field">
              <label>Required Tests</label>
              <input
                name="requiredTests"
                placeholder="Lab tests, imaging, etc."
                value={form.requiredTests}
                onChange={handleChange}
              />
            </div>

            <div className="cp-field">
              <label>Follow-up Date</label>
              <input
                type="date"
                name="visitAgainAt"
                value={form.visitAgainAt}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* ── Medicines ── */}
        <div className="cp-section">
          <div className="cp-section-header">
            <Pill size={14} className="cp-section-icon" />
            <span>Medicines</span>
          </div>

          <table className="cp-medicine-table">
            <thead>
              <tr>
                <th style={{ width: "40%" }}>Medicine Name</th>
                <th style={{ width: "30%" }}>Dosage</th>
                <th style={{ width: "20%" }}>Days</th>
                <th style={{ width: "10%" }} />
              </tr>
            </thead>
            <tbody>
              {medicines.map((med, idx) => (
                <tr key={idx}>
                  <td>
                    <input
                      name="name"
                      placeholder="e.g. Amoxicillin 500mg"
                      value={med.name}
                      onChange={(e) => handleMedicineChange(idx, e)}
                    />
                  </td>
                  <td>
                    <input
                      name="dosage"
                      placeholder="1+0+1"
                      value={med.dosage}
                      onChange={(e) => handleMedicineChange(idx, e)}
                    />
                  </td>
                  <td>
                    <input
                      name="days"
                      placeholder="7"
                      value={med.days}
                      onChange={(e) => handleMedicineChange(idx, e)}
                    />
                  </td>
                  <td>
                    {medicines.length > 1 && (
                      <button
                        className="cp-remove-btn"
                        onClick={() => removeMedicine(idx)}
                        title="Remove"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button className="cp-add-medicine" onClick={addMedicine}>
            <Plus size={13} /> Add Medicine
          </button>
        </div>

        {/* ── Actions ── */}
        <div className="cp-actions">
          <button className="cp-btn-cancel" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button className="cp-btn-save" onClick={handleSubmit} disabled={saving}>
            <Save size={15} />
            {saving ? "Saving…" : "Save Prescription"}
          </button>
        </div>
      </div>

      {/* ── Toast ── */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}