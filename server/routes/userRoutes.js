const express = require("express");
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserStats,
  resetUserPassword,
} = require("../controllers/userController");

const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// Protect all routes
router.use(protect);
// Restrict all routes to admin role
router.use(authorize("admin"));

router.route("/").get(getUsers).post(createUser);

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

router.route("/:id/stats").get(getUserStats);

router.route("/:id/resetpassword").put(resetUserPassword);

module.exports = router;
