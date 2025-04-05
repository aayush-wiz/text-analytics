const express = require("express");
const {
  createTextDocument,
  getTextDocuments,
  getTextDocument,
  updateTextDocument,
  deleteTextDocument,
  analyzeTextDocument,
  getAnalysisResults,
} = require("../controllers/textController");

const { protect } = require("../middleware/auth");

const router = express.Router();

// Protect all routes
router.use(protect);

// Main routes
router.route("/").get(getTextDocuments).post(createTextDocument);

router
  .route("/:id")
  .get(getTextDocument)
  .put(updateTextDocument)
  .delete(deleteTextDocument);

// Analysis routes
router.route("/:id/analyze").post(analyzeTextDocument);

router.route("/:id/results").get(getAnalysisResults);

module.exports = router;
