import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import defaultImg from "../assets/default.png";
import "../styles/AppointmentDoctorDetail.css";

const BASE_URL = "http://localhost:3000";

/* ── ICONS ───────────────────────────────────── */
const CalendarIcon = () => (
  <svg className="add-nav-icon" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="3" width="14" height="12" rx="1" stroke="currentColor" strokeWidth="1" />
    <path d="M1 6h14" stroke="currentColor" strokeWidth="1" />
    <path d="M5 1v3M11 1v3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    <rect x="4" y="9" width="2" height="2" fill="currentColor" opacity="0.6" />
    <rect x="7" y="9" width="2" height="2" fill="currentColor" opacity="0.6" />
    <rect x="10" y="9" width="2" height="2" fill="currentColor" opacity="0.6" />
  </svg>
);

const BookIcon = () => (
  <svg className="add-nav-icon" viewBox="0 0 16 16" fill="none">
    <path d="M3 2h8a1 1 0 011 1v10a1 1 0 01-1 1H3" stroke="currentColor" strokeWidth="1" />
    <path d="M3 2a1 1 0 00-1 1v10a1 1 0 001 1" stroke="currentColor" strokeWidth="1" />
    <path d="M6 6h4M6 9h3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

const RxIcon = () => (
  <svg className="add-nav-icon" viewBox="0 0 16 16" fill="none">
    <path d="M4 2h8l2 2v10H2V4l2-2z" stroke="currentColor" strokeWidth="1" />
    <path d="M5 8h6M8 5v6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path
      d="M5 2H2v10h3M9 10l3-3-3-3M5 7h7"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ── COMPONENT ───────────────────────────────── */
export default function AppointmentDoctorDetail() {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingMsg, setBookingMsg] = useState(null); // { type: 'success'|'error', text }

  // Fetch doctor details
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/doctor/${doctorId}/details`);
        if (!res.ok) throw new Error("Failed to fetch doctor details");
        const data = await res.json();
        setDoctor(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [doctorId]);

  // Fetch available slots on date change
  useEffect(() => {
    if (!selectedDate) return;
    const fetchSlots = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/api/doctor/${doctorId}/available-slots?date=${selectedDate}`
        );
        if (!res.ok) throw new Error("Failed to fetch slots");
        const data = await res.json();
        setSlots(data.slots || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSlots();
  }, [doctorId, selectedDate]);

  const handleBooking = async (slotId) => {
    setBookingMsg(null);
    try {
      const patientEmail = localStorage.getItem("userEmail");
      const res = await fetch(`${BASE_URL}/api/appointments/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientEmail,
          doctorId,
          appointmentDate: selectedDate,
          timeSlotId: slotId,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed");
      setBookingMsg({ type: "success", text: "Appointment confirmed successfully." });
      setSlots(slots.filter((s) => s.timeSlotId !== slotId));
    } catch (err) {
      console.error(err);
      setBookingMsg({ type: "error", text: err.message });
    }
  };

  if (loading) {
    return <div className="add-loading">Retrieving physician profile…</div>;
  }

  return (
    <div className="add-root">

      {/* SIDEBAR */}
      <aside className="add-sidebar">
        <div className="add-logo">
          <div className="add-logo-symbol">Est. 2019 · Private Medicine</div>
          <div className="add-logo-name">DOC<span>APPOINTER</span></div>
        </div>

        <nav className="add-nav">
          <div className="add-nav-label">Patient Portal</div>
          <button className="add-nav-btn" onClick={() => navigate("/patient/upcoming")}>
            <CalendarIcon /> Upcoming Appointments
          </button>
          <button className="add-nav-btn active" onClick={() => navigate("/patient/book")}>
            <BookIcon /> Book Appointment
          </button>
          <button className="add-nav-btn">
            <RxIcon /> Prescriptions
          </button>
        </nav>

        <div className="add-sidebar-footer">
          <button
            className="add-logout-btn"
            onClick={() => { localStorage.clear(); window.location.href = "/login"; }}
          >
            <LogoutIcon /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="add-main">
        <header className="add-header">
          <button className="add-back-btn" onClick={() => navigate("/patient/book")}>
            ← Back
          </button>
          <div>
            <div className="add-header-label">Physician Profile &amp; Scheduling</div>
            <h1 className="add-header-title">{doctor.NAME}</h1>
          </div>
        </header>

        <div className="add-content-grid">

          {/* Left — Doctor Profile */}
          <div className="add-doctor-panel">
            <div className="add-doctor-hero">
              <div className="add-doctor-avatar-wrap">
                <img
                  src={doctor.photo || defaultImg}
                  alt={doctor.NAME}
                  className="add-doctor-avatar"
                />
                <div className="add-doctor-avatar-ring" />
              </div>
              <div className="add-doctor-name">{doctor.NAME}</div>
              <div className="add-doctor-tag">Attending Physician</div>
            </div>

            <div className="add-doctor-info">
              <div className="add-info-row">
                <span className="add-info-key">Email</span>
                <span className="add-info-val" style={{ fontSize: '13px', fontFamily: 'Jost, sans-serif', fontWeight: 300 }}>
                  {doctor.EMAIL}
                </span>
              </div>
              <div className="add-info-row">
                <span className="add-info-key">Qualifications</span>
                <span className="add-info-val">{doctor.DEGREES}</span>
              </div>
              <div className="add-info-row">
                <span className="add-info-key">Experience</span>
                <span className="add-info-val">{doctor.EXPERIENCE_YEARS} yrs</span>
              </div>
              <div className="add-info-row">
                <span className="add-info-key">Specialization</span>
                <span className="add-info-val">{doctor.SPECIALIZATION}</span>
              </div>
            </div>

            {doctor.specialties?.length > 0 && (
              <div className="add-specialties-row">
                {doctor.specialties.map((s, i) => (
                  <span key={i} className="add-badge">{s}</span>
                ))}
              </div>
            )}
          </div>

          {/* Right — Booking */}
          <div className="add-booking-panel">

            {/* Date Picker */}
            <div className="add-section-card">
              <div className="add-section-header">
                <span className="add-section-title">Appointment Date</span>
                <div className="add-section-line" />
              </div>
              <div className="add-section-body">
                <input
                  type="date"
                  className="add-date-input"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
            </div>

            {/* Available Slots */}
            <div className="add-section-card">
              <div className="add-section-header">
                <span className="add-section-title">Available Time Slots</span>
                <div className="add-section-line" />
                <span style={{ fontSize: '10px', letterSpacing: '0.1em', color: 'rgba(196,163,100,0.4)' }}>
                  {slots.length} open
                </span>
              </div>
              <div className="add-section-body">
                {slots.length === 0 ? (
                  <div className="add-slots-empty">No slots available for this date.</div>
                ) : (
                  <div className="add-slots-grid">
                    {slots.map((slot) => (
                      <button
                        key={slot.timeSlotId}
                        className="add-slot-btn"
                        onClick={() => handleBooking(slot.timeSlotId)}
                      >
                        {slot.startTime} – {slot.endTime}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Booking Status */}
            {bookingMsg && (
              <div className={`add-booking-msg ${bookingMsg.type}`}>
                {bookingMsg.text}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
