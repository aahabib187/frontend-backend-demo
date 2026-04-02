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

<<<<<<< HEAD
// GET doctor profile by email (placeholder)
// GET doctor profile by email
const { getDoctorProfile } = require("../controllers/doctorProfileGet"); // new controller
router.get("/profile/:email", getDoctorProfile);
=======
// GET doctor profile by email
router.get("/profile/:email", doctorProfileController.getDoctorProfile);
>>>>>>> 2100aeea9bb9c021da50e141acf7f6cfdba25c24

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

module.exports = router;