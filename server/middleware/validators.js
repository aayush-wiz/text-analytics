const { body, param, query, validationResult } = require("express-validator");
const { ApiError } = require("./errorHandler");

/**
 * Process validation results and return errors if any
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorDetails = errors.array().map((error) => ({
      param: error.param,
      msg: error.msg,
      value: error.value,
    }));
    return next(new ApiError("Validation failed", 400, errorDetails));
  }
  next();
};

// User validators
exports.validateUserCreate = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 50 })
    .withMessage("Name cannot be more than 50 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("Role must be either user or admin"),
  validate,
];

exports.validateUserUpdate = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty")
    .isLength({ max: 50 })
    .withMessage("Name cannot be more than 50 characters"),
  body("email")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Email cannot be empty")
    .isEmail()
    .withMessage("Please provide a valid email"),
  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("Role must be either user or admin"),
  validate,
];

// Auth validators
exports.validateRegister = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 50 })
    .withMessage("Name cannot be more than 50 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  validate,
];

exports.validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email"),
  body("password").trim().notEmpty().withMessage("Password is required"),
  validate,
];

exports.validateUpdatePassword = [
  body("currentPassword")
    .trim()
    .notEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .trim()
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters"),
  validate,
];

// Text document validators
exports.validateTextDocumentCreate = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 200 })
    .withMessage("Title cannot be more than 200 characters"),
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ max: 50000 })
    .withMessage("Content cannot exceed 50,000 characters"),
  body("language")
    .optional()
    .isIn(["en", "es", "fr", "de"])
    .withMessage("Supported languages are: en, es, fr, de"),
  body("contentType")
    .optional()
    .isIn(["article", "blog", "essay", "report", "other"])
    .withMessage(
      "Content type must be one of: article, blog, essay, report, other"
    ),
  validate,
];

exports.validateTextDocumentUpdate = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ max: 200 })
    .withMessage("Title cannot be more than 200 characters"),
  body("content")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Content cannot be empty")
    .isLength({ max: 50000 })
    .withMessage("Content cannot exceed 50,000 characters"),
  body("language")
    .optional()
    .isIn(["en", "es", "fr", "de"])
    .withMessage("Supported languages are: en, es, fr, de"),
  body("contentType")
    .optional()
    .isIn(["article", "blog", "essay", "report", "other"])
    .withMessage(
      "Content type must be one of: article, blog, essay, report, other"
    ),
  validate,
];

exports.validateAnalysis = [
  body("options")
    .optional()
    .isObject()
    .withMessage("Options must be an object"),
  body("options.sentiment")
    .optional()
    .isBoolean()
    .withMessage("Sentiment option must be a boolean"),
  body("options.keywords")
    .optional()
    .isBoolean()
    .withMessage("Keywords option must be a boolean"),
  body("options.entities")
    .optional()
    .isBoolean()
    .withMessage("Entities option must be a boolean"),
  body("options.summary")
    .optional()
    .isBoolean()
    .withMessage("Summary option must be a boolean"),
  body("options.readability")
    .optional()
    .isBoolean()
    .withMessage("Readability option must be a boolean"),
  validate,
];

// Model validators
exports.validateModelCreate = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("version").trim().notEmpty().withMessage("Version is required"),
  body("type")
    .notEmpty()
    .withMessage("Type is required")
    .isIn([
      "sentiment",
      "keywords",
      "entities",
      "summary",
      "readability",
      "combined",
    ])
    .withMessage(
      "Type must be one of: sentiment, keywords, entities, summary, readability, combined"
    ),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("languages")
    .isArray()
    .withMessage("Languages must be an array")
    .custom((languages) => {
      const validLanguages = ["en", "es", "fr", "de"];
      return languages.every((lang) => validLanguages.includes(lang));
    })
    .withMessage("Languages must be among: en, es, fr, de"),
  validate,
];

exports.validateModelUpdate = [
  body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),
  body("version")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Version cannot be empty"),
  body("type")
    .optional()
    .isIn([
      "sentiment",
      "keywords",
      "entities",
      "summary",
      "readability",
      "combined",
    ])
    .withMessage(
      "Type must be one of: sentiment, keywords, entities, summary, readability, combined"
    ),
  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty"),
  body("languages")
    .optional()
    .isArray()
    .withMessage("Languages must be an array")
    .custom((languages) => {
      const validLanguages = ["en", "es", "fr", "de"];
      return languages.every((lang) => validLanguages.includes(lang));
    })
    .withMessage("Languages must be among: en, es, fr, de"),
  validate,
];

exports.validatePerformanceUpdate = [
  body("accuracy")
    .optional()
    .isFloat({ min: 0, max: 1 })
    .withMessage("Accuracy must be a number between 0 and 1"),
  body("f1Score")
    .optional()
    .isFloat({ min: 0, max: 1 })
    .withMessage("F1 Score must be a number between 0 and 1"),
  body("precision")
    .optional()
    .isFloat({ min: 0, max: 1 })
    .withMessage("Precision must be a number between 0 and 1"),
  body("recall")
    .optional()
    .isFloat({ min: 0, max: 1 })
    .withMessage("Recall must be a number between 0 and 1"),
  validate,
];

// ID parameter validator
exports.validateId = [
  param("id")
    .notEmpty()
    .withMessage("ID is required")
    .isMongoId()
    .withMessage("Invalid ID format"),
  validate,
];
