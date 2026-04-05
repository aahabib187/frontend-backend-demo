import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ClipboardList, FlaskConical, Pill, CalendarDays, Printer } from "lucide-react";
import "../styles/ViewPrescription.css";

const BASE_URL = "http://localhost:3000";

function InfoCell({ label, value, full = false, gold = false }) {
  const isEmpty = !value || value === "N/A" || value === "null" || value === "undefined";
  return (
    <div className={`vp-cell${full ? " full" : ""}`}>
      <div className="vp-cell-label">{label}</div>
      <div className={`vp-cell-value${isEmpty ? " empty" : ""}${gold ? " gold" : ""}`}>
        {isEmpty ? "Not specified" : value}
      </div>
    </div>
  );
}

export default function ViewPrescription() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [prescription, setPrescription] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/doctor/prescription/${appointmentId}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();

        if (!data || data.length === 0) {
          setError(true);
          return;
        }

        setPrescription(data[0]);

        const meds = data.map(row => ({
          name:   row.MEDICINE_NAME  || row.MED_NAME || "—",
          dosage: row.DOSAGE         || "—",
          days:   row.CONTINUE_DAYS  || row.DAYS || "—",
        })).filter(m => m.name !== "—");

        setMedicines(meds);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescription();
  }, [appointmentId]);

  if (loading) return (
    <div className="vp-loading vp-root">
      <div className="vp-spinner" />
      <span>Loading prescription</span>
    </div>
  );

  if (error || !prescription) return (
    <div className="vp-error vp-root">
      Prescription not found or not yet issued.
    </div>
  );

  const formatDate = (val) => {
    if (!val) return null;
    try { return new Date(val).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }); }
    catch { return val; }
  };

  const issueDate = formatDate(prescription.DATE_ISSUED);
  const visitDate = formatDate(prescription.VISIT_AGAIN_AT);

  return (
    <div className="vp-root">

      {/* ── Header ── */}
      <header className="vp-header">
        <button className="vp-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={13} /> Back
        </button>

        <div className="vp-header-icon">
          <ClipboardList size={17} />
        </div>

        <div className="vp-header-text">
          <h1>Prescription</h1>
          <p>Appointment #{appointmentId}</p>
        </div>

        <div className="vp-header-stamp">
          <span className="vp-stamp-dot" />
          Issued {issueDate || "—"}
        </div>

        <button className="vp-print-btn" onClick={() => window.print()}>
          <Printer size={13} /> Print
        </button>
      </header>

      {/* ── Body ── */}
      <div className="vp-body">

        {/* Clinical Notes */}
        <div className="vp-section">
          <div className="vp-section-header">
            <ClipboardList size={13} className="vp-section-icon" />
            <span>Clinical Notes</span>
          </div>
          <div className="vp-grid">
            <InfoCell label="Chief Complaints" value={prescription.CHIEF_COMPLAINTS} full />
            <InfoCell label="Diagnosis"         value={prescription.DIAGNOSIS} />
            <InfoCell label="History"           value={prescription.HISTORY} />
            <InfoCell label="Instructions"      value={prescription.INSTRUCTIONS} full />
          </div>
        </div>

        {/* Investigations */}
        <div className="vp-section">
          <div className="vp-section-header">
            <FlaskConical size={13} className="vp-section-icon" />
            <span>Investigations</span>
          </div>
          <div className="vp-grid">
            <InfoCell label="Investigations"  value={prescription.INVESTIGATIONS} />
            <InfoCell label="Required Tests"  value={prescription.REQUIRED_TESTS} />
          </div>
        </div>

        {/* Medicines */}
        <div className="vp-section">
          <div className="vp-section-header">
            <Pill size={13} className="vp-section-icon" />
            <span>Medicines</span>
          </div>

          {medicines.length === 0 ? (
            <div className="vp-med-empty">No medicines prescribed</div>
          ) : (
            <table className="vp-med-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Medicine</th>
                  <th>Dosage</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map((med, idx) => (
                  <tr key={idx}>
                    <td className="vp-med-idx">{idx + 1}</td>
                    <td className="vp-med-name">{med.name}</td>
                    <td><span className="vp-med-dosage">{med.dosage}</span></td>
                    <td className="vp-med-days">{med.days} days</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Follow-up */}
        {visitDate && (
          <div className="vp-section">
            <div className="vp-section-header">
              <CalendarDays size={13} className="vp-section-icon" />
              <span>Follow-up</span>
            </div>
            <div style={{ padding: "18px 22px" }}>
              <div className="vp-cell-label" style={{ marginBottom: 10 }}>Next Visit</div>
              <div className="vp-visit-badge">
                <CalendarDays size={12} />
                {visitDate}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}