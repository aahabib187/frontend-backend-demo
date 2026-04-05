import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Clock, ArrowLeft, FileText, User } from "lucide-react";
import "../styles/DoctorSchedule.css";

const BASE_URL = "http://localhost:3000";

export default function PatientHistory() {
  const params = useParams();
console.log("ALL PARAMS:", params);
 const { patientId, doctorId } = useParams();
const id = patientId || doctorId;
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOptions, setSortOptions] = useState({
    date: false,
    month: false,
    name: false
  });

  const navigate = useNavigate();

useEffect(() => {
  if (!id || id === "undefined") {
    console.warn("ID is not valid yet.");
    setLoading(false);
    return;
  }
  const fetchHistory = async () => {
    try {
      const url = patientId
        ? `${BASE_URL}/api/patient/history/${id}`
        : `${BASE_URL}/api/doctor/history/${id}`;
      const res = await fetch(url);
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  fetchHistory();
}, [id]);

  const sortHistory = (list) => {
    let sorted = [...list];

    if (sortOptions.name) {
      sorted.sort((a, b) =>
        a.DOCTOR_NAME.localeCompare(b.DOCTOR_NAME)
      );
    }

    if (sortOptions.month) {
      sorted.sort(
        (a, b) =>
          new Date(a.APPOINTMENT_DATE).getMonth() -
          new Date(b.APPOINTMENT_DATE).getMonth()
      );
    }

    if (sortOptions.date) {
      sorted.sort(
        (a, b) =>
          new Date(a.APPOINTMENT_DATE) -
          new Date(b.APPOINTMENT_DATE)
      );
    }

    return sorted;
  };

  if (loading)
    return (
      <div className="ds-loading">
        <div className="ds-loading-spinner" />
        <p>Loading history...</p>
      </div>
    );

  return (
    <div className="ds-root">

      {/* Header */}
      <header className="ds-header">
        <button
         onClick={() => navigate(doctorId ? "/doctor/dashboard" : "/patient/dashboard")}
          className="ds-back-btn"
        >
          <ArrowLeft size={14}/> Dashboard
        </button>

        <div className="ds-header-title">
          <h1>My Medical History</h1>
          <p>Completed Appointments</p>
        </div>
      </header>

      {/* Sort */}
      <div className="ds-sort-controls">
        <label>
          Doctor
          <input type="checkbox"
            checked={sortOptions.name}
            onChange={() =>
              setSortOptions(p => ({ ...p, name: !p.name }))
            }
          />
        </label>

        <label>
          Month
          <input type="checkbox"
            checked={sortOptions.month}
            onChange={() =>
              setSortOptions(p => ({ ...p, month: !p.month }))
            }
          />
        </label>

        <label>
          Date
          <input type="checkbox"
            checked={sortOptions.date}
            onChange={() =>
              setSortOptions(p => ({ ...p, date: !p.date }))
            }
          />
        </label>
      </div>

      {/* Cards */}
      <div className="ds-content">
        {sortHistory(history).map(app => {
          const date = new Date(app.APPOINTMENT_DATE);
          const month = date.toLocaleString("default",{month:"short"});
          const day = date.getDate();

          return (
            <div key={app.APPOINTMENT_ID} className="ds-card">

              <div className="ds-date-badge">
                <span className="month">{month}</span>
                <span className="day">{day}</span>
              </div>

              <div className="ds-card-body">
                <div className="ds-patient-name">
                  Dr. {app.DOCTOR_NAME}
                </div>

                <div className="ds-time-row">
                  <Clock size={13}/>
                  <span>{app.START_TIME} — {app.END_TIME}</span>
                </div>
              </div>

              <div className="ds-actions">
                <span className="ds-label-done">Done</span>

                <button
                  className="ds-btn ds-btn-prescription"
                  onClick={() =>
                    navigate(
                      `/patient/prescription/${app.APPOINTMENT_ID}`
                    )
                  }
                >
                  <FileText size={13}/> Prescription
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}