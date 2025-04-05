const express = require("express");
const {
  getModels,
  getModel,
  createModel,
  updateModel,
  deleteModel,
  toggleModelStatus,
  getModelsByType,
  getSupportedLanguages,
  updateModelPerformance,
} = require("../controllers/modelController");

const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// Protect all routes
router.use(protect);

// Public routes (for authenticated users)
router.get("/languages", getSupportedLanguages);
router.get("/type/:type", getModelsByType);
router.get("/", getModels);
router.get("/:id", getModel);

// Admin-only routes
router.post("/", authorize("admin"), createModel);
router.put("/:id", authorize("admin"), updateModel);
router.delete("/:id", authorize("admin"), deleteModel);
router.put("/:id/toggle-status", authorize("admin"), toggleModelStatus);
router.put("/:id/performance", authorize("admin"), updateModelPerformance);

module.exports = router;
