// src/pages/DoctorDashboard.jsx
import { useEffect, useState } from "react";
import AuthLayout from "../components/AuthLayout";

export default function DoctorDashboard() {
  const [user, setUser] = useState(null);
  const [slots, setSlots] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!loggedInUser) {
      setMessage("No user logged in!");
      return;
    }

    setUser(loggedInUser);

    // For now, placeholder slots
    const placeholderSlots = [
      { id: 1, startTime: "10:00 AM", endTime: "10:30 AM", status: "AVAILABLE" },
      { id: 2, startTime: "10:30 AM", endTime: "11:00 AM", status: "BOOKED" },
      { id: 3, startTime: "11:00 AM", endTime: "11:30 AM", status: "AVAILABLE" },
    ];
    setSlots(placeholderSlots);

    // TODO: replace above with backend fetch when table is ready
    /*
    const fetchSlots = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/doctor/${loggedInUser.email}/slots`
        );
        const data = await res.json();

        if (!res.ok) {
          setMessage(data.message || "Failed to fetch slots");
          return;
        }

        setSlots(data);
      } catch (err) {
        console.error(err);
        setMessage("Server error ❌");
      }
    };

    fetchSlots();
    */
  }, []);

  if (message) {
    return <p style={{ textAlign: "center", marginTop: "50px" }}>{message}</p>;
  }

  if (!user) {
    return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading...</p>;
  }

  return (
    <AuthLayout title={`Doctor Dashboard`}>
      <div className="profile-section">
        <h2>My Info</h2>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>

        <button
          className="submit-btn"
          onClick={() => {
            localStorage.removeItem("loggedInUser");
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </div>

      <div className="slots-section">
        <h2>My Time Slots</h2>
        {slots.length === 0 ? (
          <p style={{ fontStyle: "italic" }}>No time slots assigned yet.</p>
        ) : (
          <ul className="slot-list">
            {slots.map((slot) => (
              <li
                key={slot.id}
                className={`slot-item ${slot.status === "BOOKED" ? "booked" : "available"}`}
              >
                {slot.startTime} - {slot.endTime} | {slot.status}
              </li>
            ))}
          </ul>
        )}
      </div>
    </AuthLayout>
  );
}