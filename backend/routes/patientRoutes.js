const express = require("express");
const router = express.Router();

const patientProfileController = require("../controllers/patientProfileUpdate"); // ← fixed
const { getPatientHistory } = require("../controllers/doctorPrescription");

// Existing patient routes
router.post("/profile/create", patientProfileController.createPatientProfile);
router.get("/profile/:email", patientProfileController.getPatientProfile);

// Patient history / prescriptions
router.get("/history/:patientId", getPatientHistory);

module.exports = router;