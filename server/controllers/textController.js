const TextDocument = require("../models/TextDocument");
const AnalysisResult = require("../models/AnalysisResult");
const Model = require("../models/Model");
const { ApiError } = require("../middleware/errorHandler");
const { success, paginate, error } = require("../utils/responseFormatter");
const textAnalysisService = require("../services/textAnalysis");
const logger = require("../utils/logger");

/**
 * @desc    Create a new text document
 * @route   POST /api/texts
 * @access  Private
 */
exports.createTextDocument = async (req, res, next) => {
  try {
    // Add user to request body
    req.body.user = req.user.id;

    // Create document
    const textDocument = await TextDocument.create(req.body);

    success(res, 201, "Text document created", textDocument);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all text documents for current user
 * @route   GET /api/texts
 * @access  Private
 */
exports.getTextDocuments = async (req, res, next) => {
  try {
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Filtering
    let query = { user: req.user.id };

    // If status filter provided
    if (req.query.status) {
      query.status = req.query.status;
    }

    // If search term provided
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Execute query with pagination
    const totalDocs = await TextDocument.countDocuments(query);
    const textDocuments = await TextDocument.find(query)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    paginate(res, 200, "Text documents retrieved", textDocuments, {
      page,
      limit,
      totalDocs,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get single text document
 * @route   GET /api/texts/:id
 * @access  Private
 */
exports.getTextDocument = async (req, res, next) => {
  try {
    const textDocument = await TextDocument.findById(req.params.id);

    if (!textDocument) {
      return next(
        new ApiError(`Text document not found with id ${req.params.id}`, 404)
      );
    }

    // Make sure user owns the document or is admin
    if (
      textDocument.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return next(new ApiError("Not authorized to access this document", 403));
    }

    success(res, 200, "Text document retrieved", textDocument);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update text document
 * @route   PUT /api/texts/:id
 * @access  Private
 */
exports.updateTextDocument = async (req, res, next) => {
  try {
    let textDocument = await TextDocument.findById(req.params.id);

    if (!textDocument) {
      return next(
        new ApiError(`Text document not found with id ${req.params.id}`, 404)
      );
    }

    // Make sure user owns the document
    if (
      textDocument.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return next(new ApiError("Not authorized to update this document", 403));
    }

    // Update document
    textDocument = await TextDocument.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    success(res, 200, "Text document updated", textDocument);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete text document
 * @route   DELETE /api/texts/:id
 * @access  Private
 */
exports.deleteTextDocument = async (req, res, next) => {
  try {
    const textDocument = await TextDocument.findById(req.params.id);

    if (!textDocument) {
      return next(
        new ApiError(`Text document not found with id ${req.params.id}`, 404)
      );
    }

    // Make sure user owns the document
    if (
      textDocument.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return next(new ApiError("Not authorized to delete this document", 403));
    }

    // Delete all associated analysis results
    await AnalysisResult.deleteMany({ textDocument: req.params.id });

    // Delete the document
    await textDocument.remove();

    success(res, 200, "Text document deleted");
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Analyze text document
 * @route   POST /api/texts/:id/analyze
 * @access  Private
 */
exports.analyzeTextDocument = async (req, res, next) => {
  try {
    const textDocument = await TextDocument.findById(req.params.id);

    if (!textDocument) {
      return next(
        new ApiError(`Text document not found with id ${req.params.id}`, 404)
      );
    }

    // Make sure user owns the document
    if (
      textDocument.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return next(new ApiError("Not authorized to analyze this document", 403));
    }

    // Get analysis options
    const options =
      req.body.options || req.user.preferences.analysisOptions || {};

    // Find appropriate models for analysis
    const models = {};

    if (options.sentiment) {
      models.sentiment = await Model.findDefaultForLanguage(
        "sentiment",
        textDocument.language
      );
    }

    if (options.keywords) {
      models.keywords = await Model.findDefaultForLanguage(
        "keywords",
        textDocument.language
      );
    }

    if (options.entities) {
      models.entities = await Model.findDefaultForLanguage(
        "entities",
        textDocument.language
      );
    }

    if (options.summary) {
      models.summary = await Model.findDefaultForLanguage(
        "summary",
        textDocument.language
      );
    }

    if (options.readability) {
      models.readability = await Model.findDefaultForLanguage(
        "readability",
        textDocument.language
      );
    }

    // Check if we have models for all requested analyses
    const missingModels = Object.entries(options)
      .filter(([key, value]) => value === true && !models[key])
      .map(([key]) => key);

    if (missingModels.length > 0) {
      return next(
        new ApiError(
          `No available models for: ${missingModels.join(", ")}`,
          400
        )
      );
    }

    // Perform analysis asynchronously
    const analysisPromises = [];

    // Process each analysis type
    for (const [analysisType, model] of Object.entries(models)) {
      if (!model) continue;

      // Create or update analysis result
      let analysisResult = await AnalysisResult.findOne({
        textDocument: textDocument._id,
        analysisType,
        user: req.user.id,
      });

      if (!analysisResult) {
        analysisResult = new AnalysisResult({
          textDocument: textDocument._id,
          user: req.user.id,
          analysisType,
          model: model._id,
          status: "processing",
        });
        await analysisResult.save();
      } else {
        analysisResult.status = "processing";
        analysisResult.model = model._id;
        await analysisResult.save();
      }

      // Queue analysis job
      const analysisPromise = textAnalysisService
        .analyzeText(textDocument, analysisType, model, analysisResult._id)
        .catch((err) => {
          logger.error(`Analysis error for ${analysisType}:`, err);
        });

      analysisPromises.push(analysisPromise);
    }

    // Update document status
    textDocument.status = "analyzed";
    await textDocument.save();

    // Fire and forget - don't wait for analysis to complete
    Promise.all(analysisPromises).catch((err) => {
      logger.error("Error in analysis job:", err);
    });

    success(res, 202, "Analysis jobs queued", {
      message: "Analysis started in the background",
      analysisTypes: Object.keys(models),
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get analysis results for a text document
 * @route   GET /api/texts/:id/results
 * @access  Private
 */
exports.getAnalysisResults = async (req, res, next) => {
  try {
    const textDocument = await TextDocument.findById(req.params.id);

    if (!textDocument) {
      return next(
        new ApiError(`Text document not found with id ${req.params.id}`, 404)
      );
    }

    // Make sure user owns the document
    if (
      textDocument.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return next(new ApiError("Not authorized to access this document", 403));
    }

    // Get analysis results
    const results = await AnalysisResult.find({
      textDocument: req.params.id,
      user: req.user.id,
    }).populate("model", "name version type");

    success(res, 200, "Analysis results retrieved", results);
  } catch (err) {
    next(err);
  }
};
