const express = require("express");
const router = express.Router();
const { signup } = require("../controllers/authController");
const {login}=require("../controllers/login");
const { getProfile } = require("../controllers/profile");

console.log("🚀 auth routes loaded");

router.post("/signup", signup);
router.post("/login",login);
router.get("/profile/:email", getProfile);
module.exports = router;
