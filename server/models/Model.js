const mongoose = require("mongoose");

const ModelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a model name"],
      trim: true,
      unique: true,
    },
    version: {
      type: String,
      required: [true, "Please provide a model version"],
      trim: true,
    },
    type: {
      type: String,
      enum: [
        "sentiment",
        "keywords",
        "entities",
        "summary",
        "readability",
        "combined",
      ],
      required: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a model description"],
    },
    languages: {
      type: [String],
      enum: ["en", "es", "fr", "de"],
      required: true,
    },
    parameters: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    performance: {
      accuracy: Number,
      f1Score: Number,
      precision: Number,
      recall: Number,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    source: {
      type: String,
      enum: ["internal", "external", "community"],
      default: "internal",
    },
    config: {
      path: String,
      requiresGPU: {
        type: Boolean,
        default: false,
      },
      memoryRequirement: Number, // in MB
      averageProcessingTime: Number, // in ms
    },
  },
  {
    timestamps: true,
  }
);

// Methods to get model configuration
ModelSchema.methods.getConfig = function () {
  return {
    ...this.config,
    parameters: this.parameters,
  };
};

// Find active models of a specific type
ModelSchema.statics.findActiveByType = function (type) {
  return this.find({ type, isActive: true }).sort("-createdAt");
};

// Find default model for a language and type
ModelSchema.statics.findDefaultForLanguage = function (type, language) {
  return this.findOne({
    type,
    languages: language,
    isActive: true,
  }).sort("-performance.accuracy");
};

module.exports = mongoose.model("Model", ModelSchema);
