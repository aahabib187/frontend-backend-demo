import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorSetup from "./pages/DoctorSetup";
import PatientSetup from "./pages/PatientSetup";
import PatientBookAppointment from "./pages/PatientBookAppointment";
import AppointmentDoctorDetail from "./pages/AppointmentDoctorDetail";
import AdminDashboard from "./pages/AdminDashboard";
import SpecializationSetup from "./pages/SpecializationSetup";
import DoctorTimeSlots from "./pages/DoctorTimeSlots";
import MedicineManagement from "./pages/MedicineManagement";
import LabTestManagement from "./pages/LabTestManagement";
import BedManagement from "./pages/BedManagement";
import UpcomingAppointments from "./pages/UpcomingAppointment";
import DoctorSchedule from "./pages/DoctorSchedule";
import CreatePrescription from "./pages/CreatePrescription";
import ViewPrescription from "./pages/ViewPrescription";
import PatientHistory from "./pages/PatientHistory";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* DASHBOARDS */}
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/patient/upcoming" element={<UpcomingAppointments />} />
        <Route path="/doctor/setup" element={<DoctorSetup />} />
        <Route path="/patient/setup" element={<PatientSetup />} />
        <Route path="/patient/book" element={<PatientBookAppointment />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/doctor/specialization/setup" element={<SpecializationSetup />} />
        <Route path="/doctor/timeslots" element={<DoctorTimeSlots />} />
        <Route path="/patient/appointment/doctor/:doctorId" element={<AppointmentDoctorDetail />} />
        <Route path="/doctor/schedule" element={<DoctorSchedule />} />
        <Route path="/doctor/schedule/:doctorId" element={<DoctorSchedule />} />
        <Route path="/doctor/prescription/:appointmentId" element={<CreatePrescription />} />
        <Route path="/doctor/prescription-view/:appointmentId" element={<ViewPrescription />} />
        <Route path="/doctor/patient-history/:doctorId" element={<PatientHistory />} />

        {/* Admin Management Routes */}
        <Route path="/admin/medicines" element={<MedicineManagement />} />
        <Route path="/admin/lab-tests" element={<LabTestManagement />} />
        <Route path="/admin/beds" element={<BedManagement />} />

        {/* HISTORY & PRESCRIPTIONS */}
        <Route path="/patient/history/:patientId" element={<PatientHistory />} />
        <Route path="/doctor/history/:doctorId" element={<PatientHistory />} />
        <Route path="/patient/prescription/:appointmentId" element={<ViewPrescription />} />

        {/* DEFAULT */}
        <Route path="*" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;