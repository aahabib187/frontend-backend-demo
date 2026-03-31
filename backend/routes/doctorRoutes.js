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
} = require("../controllers/doctorSpecialization"); // ✅ singular, matches your file

/**
 * ===============================
 * DOCTOR PROFILE ROUTES
 * ===============================
 */

// GET doctor profile by email (placeholder)
router.get("/profile/:email", (req, res) => {
  res.status(501).json({ error: "GET doctor profile not implemented yet" });
});

// POST — Create new doctor profile
router.post("/profile/create", createDoctorProfile);

// PUT — Update existing doctor profile
router.put("/profile/update", doctorProfileController.updateDoctorProfile);

/**
 * ===============================
 * DOCTOR SPECIALIZATION ROUTES
 * ===============================
 */

// POST — Save or update doctor's specialization
router.post("/specialization", saveDoctorSpecialization);

// GET — Fetch all specializations
router.get("/specializations", getAllSpecializations);

module.exports = router;