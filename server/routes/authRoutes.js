const express = require("express");
const {
  register,
  login,
  getMe,
  updateDetails,
  updatePassword,
  logout,
  updatePreferences,
} = require("../controllers/authController");

const { protect } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/me", protect, getMe);
router.put("/updatedetails", protect, updateDetails);
router.put("/updatepassword", protect, updatePassword);
router.get("/logout", protect, logout);
router.put("/preferences", protect, updatePreferences);

module.exports = router;
