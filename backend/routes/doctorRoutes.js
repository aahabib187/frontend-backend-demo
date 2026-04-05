// routes/doctorRoutes.js
const express = require("express");
const router = express.Router();
console.log("DOCTOR ROUTES LOADED");
// Controllers
const doctorProfileController = require("../controllers/doctorProfileUpdate");
const {
  createDoctorProfile,
  saveDoctorSpecialization,
  getAllSpecializations,
  createTimeSlots,
} = require("../controllers/doctorSpecialization"); // ✅ singular, matches your file

/**
 * ===============================
 * DOCTOR PROFILE ROUTES
 * ===============================
 */

// GET doctor profile by email (placeholder)
// GET doctor profile by email
const { getDoctorProfile } = require("../controllers/doctorProfileGet"); // new controller
router.get("/profile/:email", getDoctorProfile);

// POST — Create new doctor profile
router.post("/profile/create", createDoctorProfile);

// PUT — Update existing doctor profile
router.put("/profile/update", doctorProfileController.updateDoctorProfile);

// POST — Save doctor availability
router.post("/availability/:email", doctorProfileController.saveDoctorAvailability);

/**
 * ===============================
 * DOCTOR SPECIALIZATION ROUTES
 * ===============================
 */

// POST — Save or update doctor's specialization
router.post("/specialization", saveDoctorSpecialization);

// GET — Fetch all specializations
router.get("/specializations", getAllSpecializations);

// POST — Create doctor time slots
router.post("/timeslots", createTimeSlots);

const { saveDoctorTimeSlots } = require("../controllers/doctorTimeSlots"); // make sure file name matches

// POST — Save doctor time slots
router.post("/timeslots/save", saveDoctorTimeSlots);

const doctorUpcoming = require("../controllers/doctorUpcoming"); 
// GET — Fetch appointments for a doctor by email
router.get("/schedule/:doctorId", doctorUpcoming.getDoctorSchedule);
router.patch("/appointment/:appointmentId/done",doctorUpcoming.markAppointmentDone);

console.log("Is controller defined?", doctorUpcoming.getDoctorSchedule);

//prescription routes
const doctorPrescription =require("../controllers/doctorPrescription");

// EDIT prescription
router.post("/prescription/:appointmentId",doctorPrescription.createPrescription);
// VIEW prescription (read-only)
router.get("/prescription/:appointmentId", doctorPrescription.getPrescription);

// Patient history (all past appointments)
const {getPatientHistory, getDoctorHistory } = require("../controllers/doctorPrescription");
router.get("/history/:doctorId", getDoctorHistory);

router.get("/patient/history/:patientId", getPatientHistory);
module.exports = router;