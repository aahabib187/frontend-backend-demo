// routes/appointmentRoutes.js
const express = require("express");
const router = express.Router();

// Import doctor-related functions from viewDoctors
const { 
  getAllDoctors, 
  getAllSpecializations, 
  getDoctorDetailsById 
} = require("../controllers/viewDoctors");

// Import appointment-related functions
const appointmentController = require("../controllers/appointmentController");

// ------------------------
// Doctor listing for patient booking
// ------------------------
router.get("/doctors", getAllDoctors);
router.get("/specializations", getAllSpecializations);

// ------------------------
// Appointment-specific routes
// ------------------------
router.get("/doctor/:doctorId/available-slots", appointmentController.getAvailableSlots);
router.post("/appointments/book", appointmentController.bookAppointment);
router.get("/appointments/upcoming", appointmentController.getUpcomingAppointments);
// ------------------------
// Doctor details page for a specific doctor
// ------------------------
router.get("/doctor/:doctorId/details", getDoctorDetailsById);

module.exports = router;