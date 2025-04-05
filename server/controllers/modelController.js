const Model = require("../models/Model");
const { ApiError } = require("../middleware/errorHandler");
const { success, paginate, error } = require("../utils/responseFormatter");

/**
 * @desc    Get all models
 * @route   GET /api/models
 * @access  Private
 */
exports.getModels = async (req, res, next) => {
  try {
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Filtering
    let query = {};

    // Filter by type
    if (req.query.type) {
      query.type = req.query.type;
    }

    // Filter by language
    if (req.query.language) {
      query.languages = req.query.language;
    }

    // Filter by active status
    if (req.query.active === "true") {
      query.isActive = true;
    } else if (req.query.active === "false") {
      query.isActive = false;
    }

    // Search by name
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
      ];
    }

    // Count total documents
    const totalDocs = await Model.countDocuments(query);

    // Execute query with pagination
    const models = await Model.find(query)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit)
      .populate("creator", "name email");

    paginate(res, 200, "Models retrieved successfully", models, {
      page,
      limit,
      totalDocs,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get single model
 * @route   GET /api/models/:id
 * @access  Private
 */
exports.getModel = async (req, res, next) => {
  try {
    const model = await Model.findById(req.params.id).populate(
      "creator",
      "name email"
    );

    if (!model) {
      return next(
        new ApiError(`Model not found with id ${req.params.id}`, 404)
      );
    }

    success(res, 200, "Model retrieved successfully", model);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create model
 * @route   POST /api/models
 * @access  Private/Admin
 */
exports.createModel = async (req, res, next) => {
  try {
    // Add creator to request body
    req.body.creator = req.user.id;

    // Create model
    const model = await Model.create(req.body);

    success(res, 201, "Model created successfully", model);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update model
 * @route   PUT /api/models/:id
 * @access  Private/Admin
 */
exports.updateModel = async (req, res, next) => {
  try {
    let model = await Model.findById(req.params.id);

    if (!model) {
      return next(
        new ApiError(`Model not found with id ${req.params.id}`, 404)
      );
    }

    // Update model
    model = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    success(res, 200, "Model updated successfully", model);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete model
 * @route   DELETE /api/models/:id
 * @access  Private/Admin
 */
exports.deleteModel = async (req, res, next) => {
  try {
    const model = await Model.findById(req.params.id);

    if (!model) {
      return next(
        new ApiError(`Model not found with id ${req.params.id}`, 404)
      );
    }

    // Check if model is in use before deleting
    // In a real application, you would check references in the AnalysisResult collection

    // Delete model
    await model.remove();

    success(res, 200, "Model deleted successfully");
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Toggle model active status
 * @route   PUT /api/models/:id/toggle-status
 * @access  Private/Admin
 */
exports.toggleModelStatus = async (req, res, next) => {
  try {
    const model = await Model.findById(req.params.id);

    if (!model) {
      return next(
        new ApiError(`Model not found with id ${req.params.id}`, 404)
      );
    }

    // Toggle active status
    model.isActive = !model.isActive;
    await model.save();

    success(
      res,
      200,
      `Model ${model.isActive ? "activated" : "deactivated"} successfully`,
      model
    );
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get models by type
 * @route   GET /api/models/type/:type
 * @access  Private
 */
exports.getModelsByType = async (req, res, next) => {
  try {
    const { type } = req.params;

    // Validate type
    if (
      ![
        "sentiment",
        "keywords",
        "entities",
        "summary",
        "readability",
        "combined",
      ].includes(type)
    ) {
      return next(new ApiError(`Invalid model type: ${type}`, 400));
    }

    // Get active models of this type
    const models = await Model.find({
      type,
      isActive: true,
    }).sort("-performance.accuracy");

    success(res, 200, `${type} models retrieved successfully`, models);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get supported languages
 * @route   GET /api/models/languages
 * @access  Private
 */
exports.getSupportedLanguages = async (req, res, next) => {
  try {
    // Aggregate to get all unique languages across all models
    const languages = await Model.aggregate([
      { $unwind: "$languages" },
      { $group: { _id: "$languages" } },
      { $sort: { _id: 1 } },
    ]);

    const languageList = languages.map((lang) => lang._id);

    success(res, 200, "Supported languages retrieved", languageList);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update model performance metrics
 * @route   PUT /api/models/:id/performance
 * @access  Private/Admin
 */
exports.updateModelPerformance = async (req, res, next) => {
  try {
    const { accuracy, f1Score, precision, recall } = req.body;

    const model = await Model.findById(req.params.id);

    if (!model) {
      return next(
        new ApiError(`Model not found with id ${req.params.id}`, 404)
      );
    }

    // Update performance metrics
    model.performance = {
      accuracy: accuracy || model.performance?.accuracy,
      f1Score: f1Score || model.performance?.f1Score,
      precision: precision || model.performance?.precision,
      recall: recall || model.performance?.recall,
    };

    await model.save();

    success(res, 200, "Model performance updated successfully", model);
  } catch (err) {
    next(err);
  }
};
