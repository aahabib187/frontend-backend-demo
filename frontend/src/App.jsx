import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PatientDashboard from "./pages/Profile";
import DoctorDashboard from "./pages/DoctorDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        {/* You can add admin dashboard later */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;