import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Clock, ArrowLeft, FileText, Droplets, User } from "lucide-react";
import "../styles/DoctorSchedule.css";

const BASE_URL = "http://localhost:3000";

export default function PatientHistory() {
  const { doctorId } = useParams();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOptions, setSortOptions] = useState({ date: "", month: "", name: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/doctor/history/${doctorId}`);
        if (!res.ok) throw new Error("Failed to fetch history");
        const data = await res.json();
        setHistory(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (doctorId) fetchHistory();
  }, [doctorId]);

  const sortHistory = (list) => {
    let sorted = [...list];

    // Sort by patient name
    if (sortOptions.name) {
      sorted.sort((a, b) =>
        a.PATIENT_NAME.toLowerCase().localeCompare(b.PATIENT_NAME.toLowerCase())
      );
    }

    // Sort by month
    if (sortOptions.month) {
      sorted.sort((a, b) => {
        const monthA = new Date(a.APPOINTMENT_DATE).getMonth();
        const monthB = new Date(b.APPOINTMENT_DATE).getMonth();
        return monthA - monthB;
      });
    }

    // Sort by date
    if (sortOptions.date) {
      sorted.sort((a, b) => new Date(a.APPOINTMENT_DATE) - new Date(b.APPOINTMENT_DATE));
    }

    return sorted;
  };

  if (loading) return <div className="ds-loading"><div className="ds-loading-spinner" /><p>Loading history...</p></div>;

  return (
    <div className="ds-root">
      {/* Header */}
      <header className="ds-header">
        <button onClick={() => navigate("/doctor/dashboard")} className="ds-back-btn">
          <ArrowLeft size={14} /> Dashboard
        </button>
        <div className="ds-header-title">
          <h1>Patient History</h1>
          <p>Previous Appointments Overview</p>
        </div>
        {history.length > 0 && (
          <div className="ds-header-count">
            {history.length} {history.length === 1 ? "Patient" : "Patients"}
          </div>
        )}
      </header>

      {/* Sorting Controls */}
      <div className="ds-sort-controls">
        <label>
          Name:
          <input type="checkbox" checked={!!sortOptions.name} onChange={() => setSortOptions(prev => ({ ...prev, name: !prev.name }))} />
        </label>
        <label>
          Month:
          <input type="checkbox" checked={!!sortOptions.month} onChange={() => setSortOptions(prev => ({ ...prev, month: !prev.month }))} />
        </label>
        <label>
          Date:
          <input type="checkbox" checked={!!sortOptions.date} onChange={() => setSortOptions(prev => ({ ...prev, date: !prev.date }))} />
        </label>
      </div>

      {/* Content */}
      <div className="ds-content">
        {history.length === 0 ? (
          <div className="ds-empty">
            <div className="ds-empty-icon"><Clock size={28} color="var(--gold)" strokeWidth={1.5} /></div>
            <h3>No History Found</h3>
            <p>No previous appointments available.</p>
          </div>
        ) : (
          <>
            <div className="ds-section-label"><span>History</span></div>
            {sortHistory(history).map((app) => {
              const date = new Date(app.APPOINTMENT_DATE);
              const month = date.toLocaleString("default", { month: "short" });
              const day = date.getDate();

              return (
                <div key={app.APPOINTMENT_ID} className="ds-card">
                  <div className="ds-date-badge">
                    <span className="month">{month}</span>
                    <span className="day">{day}</span>
                  </div>
                  <div className="ds-card-body">
                    <div className="ds-patient-name">{app.PATIENT_NAME}</div>
                    <div className="ds-badges">
                      <span className="ds-badge ds-badge-gender"><User size={10} />{app.GENDER}</span>
                      <span className="ds-badge ds-badge-blood"><Droplets size={10} />{app.BLOOD_TYPE}</span>
                    </div>
                    <div className="ds-time-row">
                      <Clock size={13} /><span>{app.START_TIME} — {app.END_TIME}</span>
                    </div>
                  </div>
                  <div className="ds-actions">
                    <span className="ds-label-done">Done</span>
                    <button
                      className="ds-btn ds-btn-prescription"
                      onClick={() => navigate(`/doctor/prescription-view/${app.APPOINTMENT_ID}`)}
                    >
                      <FileText size={13} /> Prescription
                    </button>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}