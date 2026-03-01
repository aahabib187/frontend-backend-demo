import { useEffect, useState } from "react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!loggedInUser) {
      setMessage("No user logged in!");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/profile/${loggedInUser.email}`);
        const data = await res.json();

        if (!res.ok) {
          setMessage(data.message || "Failed to fetch profile");
          return;
        }

        setUser(data);
      } catch (err) {
        console.error(err);
        setMessage("Server error ❌");
      }
    };

    fetchProfile();
  }, []);

  if (message) {
    return <p style={{ textAlign: "center", marginTop: "50px" }}>{message}</p>;
  }

  if (!user) {
    return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading profile...</p>;
  }

  return (
    <div style={{ padding: "50px", maxWidth: "400px", margin: "auto", border: "1px solid #ccc", borderRadius: "8px", textAlign: "center" }}>
      <h1>Profile</h1>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
    </div>
  );
}