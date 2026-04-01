
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorSetup from "./pages/DoctorSetup";
import PatientSetup from "./pages/PatientSetup";
import AdminDashboard from "./pages/AdminDashboard";
import SpecializationSetup from "./pages/SpecializationSetup"; // import the component
import DoctorTimeSlots from "./pages/DoctorTimeSlots"; // adjust path


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* DASHBOARDS */}
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />

        {/* ✅ ADD THESE (YOU MISSED THEM) */}
        <Route path="/doctor/setup" element={<DoctorSetup />} />
        <Route path="/patient/setup" element={<PatientSetup />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/doctor/specialization/setup" element={<SpecializationSetup />} />
        <Route path="/doctor/timeslots" element={<DoctorTimeSlots />} />
        {/* DEFAULT */}
        <Route path="*" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
