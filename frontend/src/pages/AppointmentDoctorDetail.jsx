// src/pages/AppointmentDoctorDetail.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns"; // optional for date formatting
import "../index.css";
import { useNavigate } from "react-router-dom"; 


const BASE_URL = "http://localhost:3000";

export default function DoctorDetail() {
  const { doctorId } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingMsg, setBookingMsg] = useState("");
    const navigate = useNavigate();

  useEffect(() => {
    // Fetch doctor details
    const fetchDoctor = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/doctor/${doctorId}/details`);
        if (!res.ok) throw new Error("Failed to fetch doctor details");
        const data = await res.json();
        setDoctor(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDoctor();
  }, [doctorId]);

  useEffect(() => {
    // Fetch available slots whenever date changes
    const fetchSlots = async () => {
      if (!selectedDate) return;
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
    setBookingMsg("");
    try {
      const patientEmail = localStorage.getItem("userEmail"); // or your logged-in patient email
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
      setBookingMsg("✅ Appointment booked successfully!");
      // refresh available slots
      setSlots(slots.filter((s) => s.timeSlotId !== slotId));
    } catch (err) {
      console.error(err);
      setBookingMsg(`❌ ${err.message}`);
    }
  };

  if (loading) return <div>Loading doctor info...</div>;

  return (
    <div className="doctor-detail-container">
      <h2>{doctor.NAME}</h2>
      <p><strong>Email:</strong> {doctor.EMAIL}</p>
      <p><strong>Degrees:</strong> {doctor.DEGREES}</p>
      <p><strong>Experience:</strong> {doctor.EXPERIENCE_YEARS} years</p>
      <p><strong>Specialization:</strong> {doctor.SPECIALIZATION}</p>

      <hr />
      <h3>Select Appointment Date</h3>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />

      <h3>Available Slots</h3>
      {slots.length === 0 && <p>No slots available for this date.</p>}
      <div className="slots-container">
        {slots.map((slot) => (
          <button
            key={slot.timeSlotId}
            className="slot-btn"
            onClick={() => handleBooking(slot.timeSlotId)}
          >
            {slot.startTime} - {slot.endTime}
          </button>
        ))}
              <button 
        className="back-btn" 
        onClick={() => navigate("/patient/dashboard")}
        style={{ marginTop: '20px', cursor: 'pointer' }}
      >
        ← Back to Dashboard
      </button>
      </div>

      {bookingMsg && <p className="booking-msg">{bookingMsg}</p>}
    </div>
  );
}